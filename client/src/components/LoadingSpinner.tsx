import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: var(--color-text-secondary);
  font-size: 1rem;
`;

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => {
  return (
    <SpinnerContainer>
      <div>
        <Spinner />
        <LoadingText>{text}</LoadingText>
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
