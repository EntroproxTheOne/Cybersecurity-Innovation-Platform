import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ThreatsPage from './pages/ThreatsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
      />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/threats" element={
        <ProtectedRoute>
          <Layout>
            <ThreatsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Layout>
            <AnalyticsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
