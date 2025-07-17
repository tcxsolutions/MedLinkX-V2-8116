import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useTenant } from '../../contexts/TenantContext';

const {
  FiHome,
  FiUsers,
  FiCalendar,
  FiActivity,
  FiDollarSign,
  FiPackage,
  FiFileText,
  FiSettings,
  FiX,
  FiPill,
  FiChevronDown,
  FiHeart,
  FiShield,
  FiTrendingUp,
  FiClock
} = FiIcons;

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { tenant } = useTenant();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard', color: 'text-blue-600' },
    { icon: FiUsers, label: 'Patients', path: '/patients', color: 'text-green-600' },
    { icon: FiCalendar, label: 'Appointments', path: '/appointments', color: 'text-purple-600' },
    { icon: FiPill, label: 'Pharmacy', path: '/pharmacy', color: 'text-orange-600' },
    { icon: FiDollarSign, label: 'Billing', path: '/billing', color: 'text-emerald-600' },
    { icon: FiPackage, label: 'Inventory', path: '/inventory', color: 'text-indigo-600' },
    { icon: FiFileText, label: 'Reports', path: '/reports', color: 'text-pink-600' },
    { icon: FiSettings, label: 'Users', path: '/users', color: 'text-gray-600' }
  ];

  const quickStats = [
    { icon: FiUsers, value: '1,234', label: 'Patients', color: 'bg-blue-100 text-blue-600' },
    { icon: FiCalendar, value: '45', label: 'Today', color: 'bg-green-100 text-green-600' },
    { icon: FiTrendingUp, value: '94%', label: 'Efficiency', color: 'bg-purple-100 text-purple-600' }
  ];

  const isActive = (path) => location.pathname === path;

  // Modified sidebar animation to ensure it's always visible on desktop
  const sidebarVariants = {
    hidden: { x: -320 },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:relative lg:shadow-none border-r border-gray-200"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiActivity} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MedLinkX
                </h1>
                <p className="text-xs text-gray-500 font-medium">{tenant?.name || 'Healthcare Platform'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="grid grid-cols-3 gap-3">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-3 text-center shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <SafeIcon icon={stat.icon} className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 px-3">
              Navigation
            </div>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  onClick={window.innerWidth < 1024 ? onClose : undefined}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      isActive(item.path)
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}
                  >
                    <SafeIcon
                      icon={item.icon}
                      className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : item.color}`}
                    />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiShield} className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">HIPAA Compliant</p>
                  <p className="text-xs text-gray-500">Enterprise Security</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Version 2.1.0</span>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiHeart} className="w-3 h-3 text-red-500" />
                  <span>Healthcare</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;