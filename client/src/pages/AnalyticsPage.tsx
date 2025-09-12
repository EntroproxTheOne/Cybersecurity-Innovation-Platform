import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBarChart3, FiTrendingUp, FiShield, FiClock } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { analyticsService } from '../services/analyticsService';
import LoadingSpinner from '../components/LoadingSpinner';

const AnalyticsContainer = styled.div`
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
`;

const AnalyticsHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Title = styled.h1`
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const MetricCard = styled(motion.div)`
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  text-align: center;
`;

const MetricIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
  font-size: 1.25rem;
  color: white;
`;

const MetricValue = styled.h3`
  color: var(--color-text);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-xs) 0;
`;

const MetricLabel = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
`;

const ChartTitle = styled.h3`
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: var(--color-background);
  border-radius: var(--radius-md);
  border: 2px dashed var(--color-border);
`;

const ChartIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
`;

const ChartDescription = styled.p`
  text-align: center;
  margin: 0;
`;

const FullWidthChart = styled(motion.div)`
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xl);
`;

const AnalyticsPage: React.FC = () => {
  const { data: dashboardStats, isLoading: statsLoading } = useQuery(
    'dashboardStats',
    () => analyticsService.getDashboardStats(),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  const { data: performanceMetrics, isLoading: performanceLoading } = useQuery(
    'performanceMetrics',
    () => analyticsService.getPerformanceMetrics(),
    {
      refetchInterval: 60000,
    }
  );

  if (statsLoading || performanceLoading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  const stats = dashboardStats?.overview || {
    totalThreats: 0,
    activeThreats: 0,
    resolvedThreats: 0,
    falsePositives: 0,
    totalUsers: 0,
    monthlyChange: 0,
  };

  const performance = performanceMetrics?.responseTime || {
    avgResponseTime: 0,
    minResponseTime: 0,
    maxResponseTime: 0,
  };

  const metrics = [
    {
      icon: FiShield,
      color: 'linear-gradient(135deg, #00d4ff, #0099cc)',
      value: stats.totalThreats,
      label: 'Total Threats',
    },
    {
      icon: FiTrendingUp,
      color: 'linear-gradient(135deg, #28a745, #20c997)',
      value: stats.resolvedThreats,
      label: 'Resolved',
    },
    {
      icon: FiBarChart3,
      color: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      value: stats.activeThreats,
      label: 'Active',
    },
    {
      icon: FiClock,
      color: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
      value: `${performance.avgResponseTime.toFixed(1)}h`,
      label: 'Avg Response Time',
    },
  ];

  return (
    <AnalyticsContainer>
      <AnalyticsHeader>
        <Title>Analytics Dashboard</Title>
        <Subtitle>Comprehensive insights into your security posture and threat landscape.</Subtitle>
      </AnalyticsHeader>

      <MetricsGrid>
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MetricIcon color={metric.color}>
              <metric.icon />
            </MetricIcon>
            <MetricValue>{metric.value}</MetricValue>
            <MetricLabel>{metric.label}</MetricLabel>
          </MetricCard>
        ))}
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ChartTitle>Threat Trends Over Time</ChartTitle>
          <ChartPlaceholder>
            <ChartIcon>
              <FiBarChart3 />
            </ChartIcon>
            <ChartDescription>
              Interactive line chart showing threat detection trends over the selected time period
            </ChartDescription>
          </ChartPlaceholder>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ChartTitle>Severity Distribution</ChartTitle>
          <ChartPlaceholder>
            <ChartIcon>
              <FiShield />
            </ChartIcon>
            <ChartDescription>
              Pie chart displaying the distribution of threats by severity level
            </ChartDescription>
          </ChartPlaceholder>
        </ChartCard>
      </ChartsGrid>

      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ChartTitle>Threat Types</ChartTitle>
          <ChartPlaceholder>
            <ChartIcon>
              <FiTrendingUp />
            </ChartIcon>
            <ChartDescription>
              Bar chart showing the frequency of different threat types
            </ChartDescription>
          </ChartPlaceholder>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <ChartTitle>Response Time Analysis</ChartTitle>
          <ChartPlaceholder>
            <ChartIcon>
              <FiClock />
            </ChartIcon>
            <ChartDescription>
              Histogram showing threat response time distribution
            </ChartDescription>
          </ChartPlaceholder>
        </ChartCard>
      </ChartsGrid>

      <FullWidthChart
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <ChartTitle>Geographic Threat Distribution</ChartTitle>
        <ChartPlaceholder>
          <ChartIcon>
            <FiShield />
          </ChartIcon>
          <ChartDescription>
            World map visualization showing threat origins and geographic distribution
          </ChartDescription>
        </ChartPlaceholder>
      </FullWidthChart>
    </AnalyticsContainer>
  );
};

export default AnalyticsPage;
