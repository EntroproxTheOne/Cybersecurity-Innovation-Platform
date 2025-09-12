import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { FiMenu, FiSun, FiMoon, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Logo = styled.h1`
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.25rem;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--color-border);
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: var(--color-text);
`;

const UserRole = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-transform: capitalize;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: scale(1.05);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: var(--z-dropdown);
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  background: none;
  border: none;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--color-border);
  }
`;

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setShowUserMenu(false);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>
          <FiMenu />
        </MenuButton>
        <Logo>THINK AI 3.0</Logo>
      </LeftSection>

      <RightSection>
        <ThemeToggle onClick={toggleTheme}>
          {theme.mode === 'light' ? <FiMoon /> : <FiSun />}
        </ThemeToggle>

        <UserMenu>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserRole>{user?.role}</UserRole>
          </UserInfo>
          <UserAvatar onClick={() => setShowUserMenu(!showUserMenu)}>
            {user?.name?.charAt(0).toUpperCase()}
          </UserAvatar>
          
          {showUserMenu && (
            <DropdownMenu>
              <DropdownItem onClick={handleProfileClick}>
                <FiUser />
                Profile
              </DropdownItem>
              <DropdownItem onClick={handleSettingsClick}>
                <FiSettings />
                Settings
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <FiLogOut />
                Logout
              </DropdownItem>
            </DropdownMenu>
          )}
        </UserMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
