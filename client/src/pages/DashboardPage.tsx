import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiUsers, FiClock } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { analyticsService } from '../services/analyticsService';
import { threatService } from '../services/threatService';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardContainer = styled.div`
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const StatCard = styled(motion.div)`
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.h3`
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-xs) 0;
`;

const StatLabel = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0;
`;

const StatChange = styled.span<{ positive?: boolean }>`
  color: ${props => props.positive ? 'var(--color-success)' : 'var(--color-error)'};
  font-size: 0.875rem;
  font-weight: 500;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
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

const RecentThreats = styled.div`
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
`;

const ThreatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ThreatIcon = styled.div<{ severity: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    switch (props.severity) {
      case 'critical': return 'var(--color-error)';
      case 'high': return '#ff6b6b';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

const ThreatContent = styled.div`
  flex: 1;
`;

const ThreatTitle = styled.h4`
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
`;

const ThreatMeta = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  margin: 0;
`;

const DashboardPage: React.FC = () => {
  const { data: dashboardStats, isLoading: statsLoading } = useQuery(
    'dashboardStats',
    () => analyticsService.getDashboardStats(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const { data: recentThreats, isLoading: threatsLoading } = useQuery(
    'recentThreats',
    () => threatService.getThreats({ limit: 5 }),
    {
      refetchInterval: 30000,
    }
  );

  if (statsLoading || threatsLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const stats = dashboardStats?.overview || {
    totalThreats: 0,
    activeThreats: 0,
    resolvedThreats: 0,
    falsePositives: 0,
    totalUsers: 0,
    monthlyChange: 0,
  };

  const threats = recentThreats?.threats || [];

  const statCards = [
    {
      icon: FiShield,
      color: 'linear-gradient(135deg, #00d4ff, #0099cc)',
      value: stats.totalThreats,
      label: 'Total Threats',
      change: stats.monthlyChange,
    },
    {
      icon: FiAlertTriangle,
      color: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      value: stats.activeThreats,
      label: 'Active Threats',
    },
    {
      icon: FiCheckCircle,
      color: 'linear-gradient(135deg, #28a745, #20c997)',
      value: stats.resolvedThreats,
      label: 'Resolved',
    },
    {
      icon: FiUsers,
      color: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
      value: stats.totalUsers,
      label: 'Total Users',
    },
  ];

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Dashboard</Title>
        <Subtitle>Welcome back! Here's what's happening with your security.</Subtitle>
      </DashboardHeader>

      <StatsGrid>
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatIcon color={stat.color}>
              <stat.icon />
            </StatIcon>
            <StatContent>
              <StatValue>{stat.value.toLocaleString()}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
              {stat.change !== undefined && (
                <StatChange positive={stat.change >= 0}>
                  {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}% from last month
                </StatChange>
              )}
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>

      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ChartTitle>Threat Trends</ChartTitle>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
            Chart visualization would go here
          </div>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ChartTitle>Severity Distribution</ChartTitle>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
            Pie chart would go here
          </div>
        </ChartCard>
      </ChartsGrid>

      <RecentThreats
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ChartTitle>Recent Threats</ChartTitle>
        {threats.length > 0 ? (
          threats.map((threat, index) => (
            <ThreatItem key={threat._id}>
              <ThreatIcon severity={threat.severity}>
                <FiShield />
              </ThreatIcon>
              <ThreatContent>
                <ThreatTitle>{threat.title}</ThreatTitle>
                <ThreatMeta>
                  {threat.type} • {threat.severity} • {new Date(threat.detectedAt).toLocaleDateString()}
                </ThreatMeta>
              </ThreatContent>
            </ThreatItem>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
            <FiClock style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }} />
            <p>No recent threats detected</p>
          </div>
        )}
      </RecentThreats>
    </DashboardContainer>
  );
};

export default DashboardPage;
