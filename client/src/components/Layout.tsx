import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainContent>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
