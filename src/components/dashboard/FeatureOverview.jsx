import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useOrganization } from '../../contexts/OrganizationContext';

const FeatureOverview = () => {
  const { features, selectedOrganization } = useOrganization();

  // Feature cards based on organization type and enabled features
  const getFeatureCards = () => {
    const baseFeatures = [
      {
        id: 'patients',
        title: 'Patients',
        description: 'Manage patient records and information',
        icon: FiIcons.FiUsers,
        color: 'blue',
        path: '/patients',
        enabled: features.patientManagement
      },
      {
        id: 'appointments',
        title: 'Appointments',
        description: 'Schedule and manage appointments',
        icon: FiIcons.FiCalendar,
        color: 'green',
        path: '/appointments',
        enabled: features.appointments
      },
      {
        id: 'prescriptions',
        title: 'Prescriptions',
        description: 'Create and manage prescriptions',
        icon: FiIcons.FiFileText,
        color: 'purple',
        path: '/prescriptions',
        enabled: features.prescriptions
      },
      {
        id: 'notes',
        title: 'Clinical Notes',
        description: 'Document patient encounters',
        icon: FiIcons.FiEdit3,
        color: 'orange',
        path: '/clinical-notes',
        enabled: features.patientManagement
      }
    ];

    // Add family management for family practice and hospital
    if (features.familyManagement) {
      baseFeatures.push({
        id: 'family',
        title: 'Family Management',
        description: 'Link and manage family relationships',
        icon: FiIcons.FiUsers,
        color: 'pink',
        path: '/family-management',
        enabled: features.familyManagement
      });
    }

    // Add billing for all organization types
    if (features.billing) {
      baseFeatures.push({
        id: 'billing',
        title: 'Billing & Claims',
        description: 'Manage invoices and insurance claims',
        icon: FiIcons.FiDollarSign,
        color: 'yellow',
        path: '/billing',
        enabled: features.billing
      });
    }

    // Add lab results for family practice and hospital
    if (features.advancedLabIntegration) {
      baseFeatures.push({
        id: 'labs',
        title: 'Lab Results',
        description: 'Track and manage lab orders and results',
        icon: FiIcons.FiActivity,
        color: 'indigo',
        path: '/lab-results',
        enabled: features.advancedLabIntegration
      });
    }

    // Add inventory for family practice and hospital
    if (features.inventory) {
      baseFeatures.push({
        id: 'inventory',
        title: 'Inventory',
        description: 'Manage medical supplies and equipment',
        icon: FiIcons.FiPackage,
        color: 'blue',
        path: '/inventory',
        enabled: features.inventory
      });
    }

    // Add pharmacy for hospital
    if (features.pharmacy) {
      baseFeatures.push({
        id: 'pharmacy',
        title: 'Pharmacy',
        description: 'Medication dispensing and management',
        icon: FiIcons.FiList,
        color: 'green',
        path: '/pharmacy',
        enabled: features.pharmacy
      });
    }

    // Add departments for hospital
    if (features.departmentManagement) {
      baseFeatures.push({
        id: 'departments',
        title: 'Departments',
        description: 'Organize by hospital departments',
        icon: FiIcons.FiGrid,
        color: 'purple',
        path: '/departments',
        enabled: features.departmentManagement
      });
    }

    // Add reports for all organization types
    baseFeatures.push({
      id: 'reports',
      title: 'Reports & Analytics',
      description: features.advancedReporting ? 'Comprehensive analytics and insights' : 'Basic reports and statistics',
      icon: FiIcons.FiBarChart2,
      color: 'red',
      path: '/reports',
      enabled: features.basicReporting || features.advancedReporting
    });

    // Add user management for multi-provider setups
    if (features.userManagement) {
      baseFeatures.push({
        id: 'users',
        title: 'User Management',
        description: 'Manage staff access and permissions',
        icon: FiIcons.FiUserCheck,
        color: 'gray',
        path: '/users',
        enabled: features.userManagement
      });
    }

    return baseFeatures.filter(feature => feature.enabled);
  };

  const featureCards = getFeatureCards();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Features & Modules</h2>
        <Link
          to="/organizations"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
        >
          <span>Manage Features</span>
          <SafeIcon icon={FiIcons.FiArrowRight} className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {featureCards.map((feature, index) => (
          <Link to={feature.path} key={feature.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all h-full"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 bg-${feature.color}-100 rounded-lg`}>
                  <SafeIcon icon={feature.icon} className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeatureOverview;