import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, BarChart3, MapPin,
  Brain, Download, Users, LogOut, Menu, X, ShieldAlert
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Crime Records', path: '/crimes', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Crime Map', path: '/map', icon: MapPin },
    { name: 'Prediction', path: '/prediction', icon: Brain },
    { name: 'Reports', path: '/reports', icon: Download },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Users', path: '/admin/users', icon: Users });
  }

  const NavItemContent = ({ item, isMobile }) => {
    return (
      <NavLink
        to={item.path}
        onClick={() => isMobile && setSidebarOpen(false)}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1 transition-colors ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
          }`
        }
      >
        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
        {item.name}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-slate-800 border-r border-slate-700 z-30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:static`}
      >
        <div className="flex items-center justify-center h-16 bg-slate-900 px-4">
          <ShieldAlert className="h-8 w-8 text-blue-500 mr-2" />
          <span className="text-white font-bold text-lg truncate">Crime Predict</span>
        </div>
        
        <div className="flex-1 overflow-y-auto pt-5 pb-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItemContent key={item.name} item={item} isMobile={false} />
            ))}
          </nav>
        </div>
        
        <div className="flex-shrink-0 p-4 bg-slate-900 border-t border-slate-700 text-white">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs font-medium text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 flex justify-end items-center">
            <div className="flex items-center ml-4 space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
