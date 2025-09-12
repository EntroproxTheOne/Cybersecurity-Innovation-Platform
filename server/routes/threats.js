const express = require('express');
const { body, validationResult } = require('express-validator');
const Threat = require('../models/Threat');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/threats
// @desc    Get all threats with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      severity,
      status,
      type,
      startDate,
      endDate,
      search
    } = req.query;

    const filter = {};

    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.detectedAt = {};
      if (startDate) filter.detectedAt.$gte = new Date(startDate);
      if (endDate) filter.detectedAt.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } }
      ];
    }

    const threats = await Threat.find(filter)
      .sort({ detectedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('detectedBy', 'name email');

    const total = await Threat.countDocuments(filter);

    res.json({
      threats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get threats error:', error);
    res.status(500).json({ message: 'Server error while fetching threats' });
  }
});

// @route   GET /api/threats/:id
// @desc    Get threat by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const threat = await Threat.findById(req.params.id)
      .populate('detectedBy', 'name email')
      .populate('resolvedBy', 'name email');

    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }

    res.json(threat);
  } catch (error) {
    console.error('Get threat error:', error);
    res.status(500).json({ message: 'Server error while fetching threat' });
  }
});

// @route   POST /api/threats
// @desc    Create a new threat
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level'),
  body('type').isIn(['malware', 'phishing', 'ddos', 'data_breach', 'insider_threat', 'other']).withMessage('Invalid threat type'),
  body('source').trim().isLength({ min: 2 }).withMessage('Source must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      severity,
      type,
      source,
      ipAddress,
      location,
      additionalData
    } = req.body;

    const threat = new Threat({
      title,
      description,
      severity,
      type,
      source,
      ipAddress: ipAddress || '',
      location: location || '',
      additionalData: additionalData || {},
      detectedBy: req.user.id,
      status: 'active',
      detectedAt: new Date()
    });

    await threat.save();
    await threat.populate('detectedBy', 'name email');

    res.status(201).json({
      message: 'Threat created successfully',
      threat
    });
  } catch (error) {
    console.error('Create threat error:', error);
    res.status(500).json({ message: 'Server error while creating threat' });
  }
});

// @route   PUT /api/threats/:id
// @desc    Update threat
// @access  Private
router.put('/:id', [
  auth,
  body('status').optional().isIn(['active', 'investigating', 'resolved', 'false_positive']).withMessage('Invalid status'),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, severity, resolution, notes } = req.body;

    const threat = await Threat.findById(req.params.id);
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'resolved') {
        updateData.resolvedBy = req.user.id;
        updateData.resolvedAt = new Date();
        updateData.resolution = resolution || '';
      }
    }
    if (severity) updateData.severity = severity;
    if (notes) updateData.notes = notes;

    const updatedThreat = await Threat.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('detectedBy', 'name email').populate('resolvedBy', 'name email');

    res.json({
      message: 'Threat updated successfully',
      threat: updatedThreat
    });
  } catch (error) {
    console.error('Update threat error:', error);
    res.status(500).json({ message: 'Server error while updating threat' });
  }
});

// @route   DELETE /api/threats/:id
// @desc    Delete threat
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const threat = await Threat.findById(req.params.id);
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }

    await Threat.findByIdAndDelete(req.params.id);

    res.json({ message: 'Threat deleted successfully' });
  } catch (error) {
    console.error('Delete threat error:', error);
    res.status(500).json({ message: 'Server error while deleting threat' });
  }
});

// @route   GET /api/threats/stats/overview
// @desc    Get threat statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.detectedAt = {};
      if (startDate) dateFilter.detectedAt.$gte = new Date(startDate);
      if (endDate) dateFilter.detectedAt.$lte = new Date(endDate);
    }

    const [
      totalThreats,
      activeThreats,
      resolvedThreats,
      severityStats,
      typeStats,
      recentThreats
    ] = await Promise.all([
      Threat.countDocuments(dateFilter),
      Threat.countDocuments({ ...dateFilter, status: 'active' }),
      Threat.countDocuments({ ...dateFilter, status: 'resolved' }),
      Threat.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      Threat.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Threat.find(dateFilter)
        .sort({ detectedAt: -1 })
        .limit(5)
        .select('title severity type detectedAt status')
    ]);

    res.json({
      totalThreats,
      activeThreats,
      resolvedThreats,
      severityStats,
      typeStats,
      recentThreats
    });
  } catch (error) {
    console.error('Get threat stats error:', error);
    res.status(500).json({ message: 'Server error while fetching threat statistics' });
  }
});

module.exports = router;
