import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CrimesPage from './pages/CrimesPage';
import AddCrimePage from './pages/AddCrimePage';
import CrimeDetailPage from './pages/CrimeDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapPage from './pages/MapPage';
import PredictionPage from './pages/PredictionPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/crimes" element={<CrimesPage />} />
          
          <Route path="/crimes/:id" element={<CrimeDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/crimes/new" element={<AddCrimePage />} />
            <Route path="/admin/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
