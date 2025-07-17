import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useOrganization } from '../../contexts/OrganizationContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { features, selectedOrganization } = useOrganization();

  // Define menu items based on features and permissions
  const menuItems = useMemo(() => {
    const items = [
      {
        id: 'dashboard',
        icon: FiIcons.FiHome,
        label: 'Dashboard',
        path: '/dashboard',
        color: 'text-blue-600'
      }
    ];

    // Core Features - Always enabled for demo
    items.push({
      id: 'patients',
      icon: FiIcons.FiUsers,
      label: 'Patients',
      path: '/patients',
      color: 'text-green-600'
    });
    items.push({
      id: 'appointments',
      icon: FiIcons.FiCalendar,
      label: 'Appointments',
      path: '/appointments',
      color: 'text-purple-600'
    });
    items.push({
      id: 'billing',
      icon: FiIcons.FiDollarSign,
      label: 'Billing',
      path: '/billing',
      color: 'text-yellow-600'
    });
    items.push({
      id: 'inventory',
      icon: FiIcons.FiPackage,
      label: 'Inventory',
      path: '/inventory',
      color: 'text-blue-600'
    });
    items.push({
      id: 'pharmacy',
      icon: FiIcons.FiActivity,
      label: 'Pharmacy',
      path: '/pharmacy',
      color: 'text-green-600'
    });

    // Reports
    items.push({
      id: 'reports',
      icon: FiIcons.FiBarChart2,
      label: 'Reports',
      path: '/reports',
      color: 'text-purple-600'
    });

    // Admin Features
    items.push({
      id: 'users',
      icon: FiIcons.FiUserCheck,
      label: 'User Management',
      path: '/users',
      color: 'text-indigo-600'
    });

    // Add divider before admin section
    items.push({ divider: true });

    // Organization Management
    items.push({
      id: 'organizations',
      icon: FiIcons.FiBriefcase,
      label: 'Organization',
      path: '/organizations',
      color: 'text-gray-600'
    });

    // Data Management
    items.push({
      id: 'data',
      icon: FiIcons.FiDatabase,
      label: 'Data Management',
      path: '/data-management',
      color: 'text-gray-600'
    });

    return items;
  }, [features]);

  const getOrganizationColor = () => {
    switch (selectedOrganization?.type) {
      case 'individual':
        return 'from-blue-600 to-blue-800';
      case 'family_practice':
        return 'from-green-600 to-green-800';
      case 'hospital':
        return 'from-purple-600 to-purple-800';
      default:
        return 'from-blue-600 to-purple-600';
    }
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
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          transition: { type: "spring", damping: 25, stiffness: 200 }
        }}
        className="fixed left-0 top-0 h-full w-70 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getOrganizationColor()} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <SafeIcon icon={FiIcons.FiActivity} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">MedLink EHR</h2>
                  <p className="text-sm opacity-90">Healthcare Platform</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiX} className="w-5 h-5 text-white" />
              </button>
            </div>
            {selectedOrganization && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-sm opacity-90">Current Organization</p>
                <p className="font-medium">{selectedOrganization.name}</p>
                <p className="text-xs opacity-75 capitalize">{selectedOrganization.type}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                if (item.divider) {
                  return (
                    <div key={`divider-${index}`} className="my-6">
                      <div className="border-t border-gray-200"></div>
                      <p className="text-xs font-medium text-gray-500 mt-4 px-3">
                        ADMINISTRATION
                      </p>
                    </div>
                  );
                }

                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <SafeIcon
                      icon={item.icon}
                      className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : item.color}`}
                    />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-2 h-2 bg-primary-600 rounded-full ml-auto"
                        initial={false}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                MedLink EHR v1.0.0
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Healthcare Management Platform
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;