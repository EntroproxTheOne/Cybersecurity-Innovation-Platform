import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUsers, FiShield, FiBarChart3, FiSettings, FiMail, FiCpu } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const AdminContainer = styled.div`
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
`;

const AdminHeader = styled.div`
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

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const AdminCard = styled(motion.div)`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: var(--spacing-xl);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 212, 255, 0.1);
  }
`;

const CardIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  font-size: 1.5rem;
  color: white;
`;

const CardTitle = styled.h3`
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
`;

const CardDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 var(--spacing-lg) 0;
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatValue = styled.span`
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 700;
`;

const StatLabel = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const QuickActions = styled(motion.div)`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: var(--spacing-xl);
  margin-top: var(--spacing-xl);
`;

const QuickActionsTitle = styled.h3`
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-lg) 0;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const AdminPage: React.FC = () => {
  const { user } = useAuth();

  const adminFeatures = [
    {
      icon: FiUsers,
      color: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions across the platform.',
      stats: { value: '1,234', label: 'Total Users' },
    },
    {
      icon: FiShield,
      color: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      title: 'Threat Management',
      description: 'Monitor and manage security threats, incidents, and responses.',
      stats: { value: '89', label: 'Active Threats' },
    },
    {
      icon: FiBarChart3,
      color: 'linear-gradient(135deg, #28a745, #20c997)',
      title: 'Analytics & Reports',
      description: 'View comprehensive analytics and generate detailed security reports.',
      stats: { value: '15', label: 'Reports Generated' },
    },
    {
      icon: FiSettings,
      color: 'linear-gradient(135deg, #ffc107, #fd7e14)',
      title: 'System Settings',
      description: 'Configure system-wide settings, integrations, and security policies.',
      stats: { value: '42', label: 'Active Policies' },
    },
    {
      icon: FiMail,
      color: 'linear-gradient(135deg, #17a2b8, #6f42c1)',
      title: 'Communication',
      description: 'Manage notifications, alerts, and communication templates.',
      stats: { value: '2,456', label: 'Messages Sent' },
    },
    {
      icon: FiCpu,
      color: 'linear-gradient(135deg, #00d4ff, #0099cc)',
      title: 'System Health',
      description: 'Monitor system performance, uptime, and resource utilization.',
      stats: { value: '99.9%', label: 'Uptime' },
    },
  ];

  const quickActions = [
    { icon: FiUsers, label: 'Add New User', action: () => console.log('Add user') },
    { icon: FiShield, label: 'Create Threat Rule', action: () => console.log('Create rule') },
    { icon: FiBarChart3, label: 'Generate Report', action: () => console.log('Generate report') },
    { icon: FiSettings, label: 'System Backup', action: () => console.log('Backup system') },
  ];

  return (
    <AdminContainer>
      <AdminHeader>
        <Title>Admin Dashboard</Title>
        <Subtitle>
          Welcome back, {user?.name}! Manage your cybersecurity platform from here.
        </Subtitle>
      </AdminHeader>

      <AdminGrid>
        {adminFeatures.map((feature, index) => (
          <AdminCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <CardIcon color={feature.color}>
              <feature.icon />
            </CardIcon>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
            <CardStats>
              <StatValue>{feature.stats.value}</StatValue>
              <StatLabel>{feature.stats.label}</StatLabel>
            </CardStats>
          </AdminCard>
        ))}
      </AdminGrid>

      <QuickActions
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <QuickActionsTitle>Quick Actions</QuickActionsTitle>
        <ActionButtons>
          {quickActions.map((action, index) => (
            <ActionButton key={index} onClick={action.action}>
              <action.icon />
              {action.label}
            </ActionButton>
          ))}
        </ActionButtons>
      </QuickActions>
    </AdminContainer>
  );
};

export default AdminPage;
