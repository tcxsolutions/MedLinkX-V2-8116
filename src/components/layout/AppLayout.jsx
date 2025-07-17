import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { usePractice } from '../../contexts/PracticeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PracticeSetupForm from '../settings/PracticeSetupForm';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { practiceSettings, loading } = usePractice();
  const navigate = useNavigate();

  // Show loading state if we're still loading practice settings
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // For admin testing, skip practice setup and use default settings
  const defaultPracticeSettings = practiceSettings || {
    id: 'default-practice',
    practice_name: 'Demo Medical Practice',
    practice_type: 'hospital',
    address: '123 Healthcare Blvd, Medical City, CA 90210',
    phone: '+1 (555) 123-4567',
    email: 'admin@demomedical.com'
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Desktop Sidebar - Always visible */}
      <div className="hidden lg:block">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile Sidebar - Overlay */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;