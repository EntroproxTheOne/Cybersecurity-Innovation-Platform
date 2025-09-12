const express = require('express');
const Threat = require('../models/Threat');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.detectedAt = {};
      if (startDate) dateFilter.detectedAt.$gte = new Date(startDate);
      if (endDate) dateFilter.detectedAt.$lte = new Date(endDate);
    }

    // Get basic statistics
    const [
      totalThreats,
      activeThreats,
      resolvedThreats,
      falsePositives,
      totalUsers
    ] = await Promise.all([
      Threat.countDocuments(dateFilter),
      Threat.countDocuments({ ...dateFilter, status: 'active' }),
      Threat.countDocuments({ ...dateFilter, status: 'resolved' }),
      Threat.countDocuments({ ...dateFilter, status: 'false_positive' }),
      User.countDocuments({ isActive: true })
    ]);

    // Get threat trends over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const threatTrends = await Threat.aggregate([
      {
        $match: {
          detectedAt: { $gte: thirtyDaysAgo },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$detectedAt' },
            month: { $month: '$detectedAt' },
            day: { $dayOfMonth: '$detectedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get severity distribution
    const severityDistribution = await Threat.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
          percentage: { $sum: 1 }
        }
      }
    ]);

    // Calculate percentages for severity
    const totalForPercentage = severityDistribution.reduce((sum, item) => sum + item.count, 0);
    severityDistribution.forEach(item => {
      item.percentage = totalForPercentage > 0 ? (item.count / totalForPercentage * 100).toFixed(1) : 0;
    });

    // Get threat types distribution
    const typeDistribution = await Threat.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get top threat sources
    const topSources = await Threat.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get response time analytics
    const responseTimeStats = await Threat.aggregate([
      {
        $match: {
          ...dateFilter,
          resolvedAt: { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$resolvedAt', '$detectedAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' }
        }
      }
    ]);

    // Get monthly comparison
    const currentMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const currentMonthThreats = await Threat.countDocuments({
      detectedAt: {
        $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      },
      ...dateFilter
    });

    const lastMonthThreats = await Threat.countDocuments({
      detectedAt: {
        $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        $lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1)
      },
      ...dateFilter
    });

    const monthlyChange = lastMonthThreats > 0 
      ? ((currentMonthThreats - lastMonthThreats) / lastMonthThreats * 100).toFixed(1)
      : 0;

    res.json({
      overview: {
        totalThreats,
        activeThreats,
        resolvedThreats,
        falsePositives,
        totalUsers,
        monthlyChange: parseFloat(monthlyChange)
      },
      trends: {
        threatTrends,
        severityDistribution,
        typeDistribution,
        topSources
      },
      performance: {
        responseTime: responseTimeStats[0] || {
          avgResponseTime: 0,
          minResponseTime: 0,
          maxResponseTime: 0
        }
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard analytics' });
  }
});

// @route   GET /api/analytics/threats/timeline
// @desc    Get threat timeline data
// @access  Private
router.get('/threats/timeline', auth, async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'day' } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.detectedAt = {};
      if (startDate) dateFilter.detectedAt.$gte = new Date(startDate);
      if (endDate) dateFilter.detectedAt.$lte = new Date(endDate);
    }

    let groupBy;
    switch (granularity) {
      case 'hour':
        groupBy = {
          year: { $year: '$detectedAt' },
          month: { $month: '$detectedAt' },
          day: { $dayOfMonth: '$detectedAt' },
          hour: { $hour: '$detectedAt' }
        };
        break;
      case 'day':
        groupBy = {
          year: { $year: '$detectedAt' },
          month: { $month: '$detectedAt' },
          day: { $dayOfMonth: '$detectedAt' }
        };
        break;
      case 'week':
        groupBy = {
          year: { $year: '$detectedAt' },
          week: { $week: '$detectedAt' }
        };
        break;
      case 'month':
        groupBy = {
          year: { $year: '$detectedAt' },
          month: { $month: '$detectedAt' }
        };
        break;
      default:
        groupBy = {
          year: { $year: '$detectedAt' },
          month: { $month: '$detectedAt' },
          day: { $dayOfMonth: '$detectedAt' }
        };
    }

    const timeline = await Threat.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
          },
          high: {
            $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
          },
          medium: {
            $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] }
          },
          low: {
            $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({ timeline });
  } catch (error) {
    console.error('Threat timeline error:', error);
    res.status(500).json({ message: 'Server error while fetching threat timeline' });
  }
});

// @route   GET /api/analytics/geographic
// @desc    Get geographic threat distribution
// @access  Private
router.get('/geographic', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.detectedAt = {};
      if (startDate) dateFilter.detectedAt.$gte = new Date(startDate);
      if (endDate) dateFilter.detectedAt.$lte = new Date(endDate);
    }

    const geographicData = await Threat.aggregate([
      { $match: { ...dateFilter, location: { $ne: '' } } },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          severity: { $push: '$severity' }
        }
      },
      {
        $project: {
          location: '$_id',
          count: 1,
          criticalCount: {
            $size: {
              $filter: {
                input: '$severity',
                cond: { $eq: ['$$this', 'critical'] }
              }
            }
          },
          highCount: {
            $size: {
              $filter: {
                input: '$severity',
                cond: { $eq: ['$$this', 'high'] }
              }
            }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    res.json({ geographicData });
  } catch (error) {
    console.error('Geographic analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching geographic data' });
  }
});

// @route   GET /api/analytics/performance
// @desc    Get system performance metrics
// @access  Private
router.get('/performance', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.detectedAt = {};
      if (startDate) dateFilter.detectedAt.$gte = new Date(startDate);
      if (endDate) dateFilter.detectedAt.$lte = new Date(endDate);
    }

    // Response time analysis
    const responseTimeAnalysis = await Threat.aggregate([
      {
        $match: {
          ...dateFilter,
          resolvedAt: { $exists: true }
        }
      },
      {
        $project: {
          responseTimeHours: {
            $divide: [
              { $subtract: ['$resolvedAt', '$detectedAt'] },
              1000 * 60 * 60
            ]
          },
          severity: 1,
          type: 1
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTimeHours' },
          medianResponseTime: { $percentile: { input: '$responseTimeHours', p: [0.5] } },
          p95ResponseTime: { $percentile: { input: '$responseTimeHours', p: [0.95] } },
          p99ResponseTime: { $percentile: { input: '$responseTimeHours', p: [0.99] } }
        }
      }
    ]);

    // Resolution rate by severity
    const resolutionRates = await Threat.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$severity',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          severity: '$_id',
          total: 1,
          resolved: 1,
          resolutionRate: {
            $multiply: [
              { $divide: ['$resolved', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    // False positive rate
    const falsePositiveRate = await Threat.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          falsePositives: {
            $sum: { $cond: [{ $eq: ['$status', 'false_positive'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          falsePositiveRate: {
            $multiply: [
              { $divide: ['$falsePositives', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    res.json({
      responseTime: responseTimeAnalysis[0] || {},
      resolutionRates,
      falsePositiveRate: falsePositiveRate[0]?.falsePositiveRate || 0
    });
  } catch (error) {
    console.error('Performance analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching performance metrics' });
  }
});

module.exports = router;
