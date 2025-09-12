import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiShield, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { threatService } from '../services/threatService';
import LoadingSpinner from '../components/LoadingSpinner';

const ThreatsContainer = styled.div`
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
`;

const ThreatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const Title = styled.h1`
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`;

const SearchInput = styled.div`
  position: relative;
  min-width: 300px;
`;

const SearchField = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 2.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
  
  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 1.25rem;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--color-primary);
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
  }
`;

const ThreatsGrid = styled.div`
  display: grid;
  gap: var(--spacing-lg);
`;

const ThreatCard = styled(motion.div)`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 212, 255, 0.1);
  }
`;

const ThreatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const ThreatTitle = styled.h3`
  color: var(--color-text);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const SeverityBadge = styled.span<{ severity: string }>`
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.severity) {
      case 'critical': return 'var(--color-error)';
      case 'high': return '#ff6b6b';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  }};
  color: white;
`;

const ThreatDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 var(--spacing-md) 0;
`;

const ThreatMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const ThreatType = styled.span`
  text-transform: capitalize;
`;

const ThreatDate = styled.span`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'active': return 'rgba(255, 107, 107, 0.2)';
      case 'investigating': return 'rgba(255, 193, 7, 0.2)';
      case 'resolved': return 'rgba(40, 167, 69, 0.2)';
      case 'false_positive': return 'rgba(108, 117, 125, 0.2)';
      default: return 'rgba(108, 117, 125, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#ff6b6b';
      case 'investigating': return '#ffc107';
      case 'resolved': return '#28a745';
      case 'false_positive': return '#6c757d';
      default: return '#6c757d';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-secondary);
`;

const ThreatsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    type: '',
  });

  const { data: threatsData, isLoading } = useQuery(
    ['threats', searchQuery, filters],
    () => threatService.getThreats({
      search: searchQuery || undefined,
      ...filters,
    }),
    {
      refetchInterval: 30000,
    }
  );

  const threats = threatsData?.threats || [];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <FiAlertTriangle />;
      case 'medium':
        return <FiShield />;
      case 'low':
        return <FiCheckCircle />;
      default:
        return <FiShield />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading threats..." />;
  }

  return (
    <ThreatsContainer>
      <ThreatsHeader>
        <Title>Threat Management</Title>
        <HeaderActions>
          <SearchInput>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchField
              type="text"
              placeholder="Search threats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInput>
          <FilterButton>
            <FiFilter />
            Filters
          </FilterButton>
          <AddButton>
            <FiPlus />
            New Threat
          </AddButton>
        </HeaderActions>
      </ThreatsHeader>

      {threats.length > 0 ? (
        <ThreatsGrid>
          {threats.map((threat, index) => (
            <ThreatCard
              key={threat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ThreatHeader>
                <ThreatTitle>{threat.title}</ThreatTitle>
                <SeverityBadge severity={threat.severity}>
                  {threat.severity}
                </SeverityBadge>
              </ThreatHeader>
              
              <ThreatDescription>
                {threat.description}
              </ThreatDescription>
              
              <ThreatMeta>
                <div>
                  <ThreatType>{threat.type.replace('_', ' ')}</ThreatType>
                  <StatusBadge status={threat.status}>
                    {threat.status.replace('_', ' ')}
                  </StatusBadge>
                </div>
                <ThreatDate>
                  <FiClock />
                  {new Date(threat.detectedAt).toLocaleDateString()}
                </ThreatDate>
              </ThreatMeta>
            </ThreatCard>
          ))}
        </ThreatsGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <FiShield />
          </EmptyIcon>
          <h3>No threats found</h3>
          <p>No threats match your current search criteria.</p>
        </EmptyState>
      )}
    </ThreatsContainer>
  );
};

export default ThreatsPage;
