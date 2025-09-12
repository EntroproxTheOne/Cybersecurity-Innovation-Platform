import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiShield, 
  FiBarChart3, 
  FiUsers, 
  FiSettings, 
  FiX,
  FiMail,
  FiCpu
} from 'react-icons/fi';

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  z-index: var(--z-fixed);
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform var(--transition-normal);
  
  @media (min-width: 769px) {
    transform: translateX(0);
    position: static;
    height: auto;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
`;

const Logo = styled.h2`
  color: var(--color-primary);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  display: block;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  padding: var(--spacing-md) 0;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
  
  &:hover {
    color: var(--color-text);
    background-color: var(--color-border);
  }
  
  &.active {
    color: var(--color-primary);
    background-color: rgba(0, 212, 255, 0.1);
    border-left-color: var(--color-primary);
  }
`;

const NavIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
`;

const NavText = styled.span`
  font-weight: 500;
`;

const NavSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--spacing-sm) var(--spacing-lg);
`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { to: '/dashboard', icon: FiHome, text: 'Dashboard' },
        { to: '/threats', icon: FiShield, text: 'Threats' },
        { to: '/analytics', icon: FiBarChart3, text: 'Analytics' },
      ]
    },
    {
      section: 'Management',
      items: [
        { to: '/users', icon: FiUsers, text: 'Users' },
        { to: '/admin', icon: FiCpu, text: 'Admin' },
      ]
    },
    {
      section: 'Support',
      items: [
        { to: '/contact', icon: FiMail, text: 'Contact' },
        { to: '/settings', icon: FiSettings, text: 'Settings' },
      ]
    }
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <Logo>THINK AI 3.0</Logo>
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>
      </SidebarHeader>

      <Navigation>
        <NavList>
          {navigationItems.map((section) => (
            <NavSection key={section.section}>
              <SectionTitle>{section.section}</SectionTitle>
              {section.items.map((item) => (
                <NavItem key={item.to}>
                  <NavLinkStyled
                    to={item.to}
                    onClick={onClose}
                    className={location.pathname === item.to ? 'active' : ''}
                  >
                    <NavIcon>
                      <item.icon />
                    </NavIcon>
                    <NavText>{item.text}</NavText>
                  </NavLinkStyled>
                </NavItem>
              ))}
            </NavSection>
          ))}
        </NavList>
      </Navigation>
    </SidebarContainer>
  );
};

export default Sidebar;
