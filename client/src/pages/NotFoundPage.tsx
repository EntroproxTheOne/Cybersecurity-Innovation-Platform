import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiShield } from 'react-icons/fi';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  padding: var(--spacing-lg);
`;

const NotFoundContent = styled(motion.div)`
  text-align: center;
  max-width: 600px;
`;

const NotFoundIcon = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-xl);
  font-size: 3rem;
  color: white;
`;

const NotFoundTitle = styled.h1`
  color: var(--color-text);
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-lg) 0;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const NotFoundSubtitle = styled.h2`
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-lg) 0;
`;

const NotFoundDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 var(--spacing-xl) 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-full);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-normal);
  
  &.primary {
    background: linear-gradient(135deg, #00d4ff, #0099cc);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    
    &:hover {
      background: var(--color-primary);
      color: var(--color-background);
      transform: translateY(-2px);
    }
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <NotFoundIcon>
          <FiShield />
        </NotFoundIcon>
        
        <NotFoundTitle>404</NotFoundTitle>
        
        <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
        
        <NotFoundDescription>
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, our security systems are still protecting you!
        </NotFoundDescription>
        
        <ButtonGroup>
          <Button to="/" className="primary">
            <FiHome />
            Go Home
          </Button>
          <Button to="javascript:history.back()" className="secondary">
            <FiArrowLeft />
            Go Back
          </Button>
        </ButtonGroup>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
