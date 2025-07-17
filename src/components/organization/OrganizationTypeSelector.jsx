import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const OrganizationTypeSelector = ({ onTypeSelect }) => {
  const organizationTypes = [
    {
      id: 'individual',
      name: 'Individual Practice',
      icon: FiIcons.FiUser,
      description: 'Solo practitioner with simplified patient management',
      color: 'blue',
      features: [
        'Basic patient records',
        'Simple appointment scheduling',
        'Basic prescription management',
        'Minimal reporting'
      ]
    },
    {
      id: 'family_practice',
      name: 'Family Practice',
      icon: FiIcons.FiUsers,
      description: 'Multi-provider clinic with family-focused care',
      color: 'green',
      features: [
        'Family linkage & relationships',
        'Multiple provider management',
        'Advanced appointment scheduling',
        'Enhanced lab integrations',
        'Billing & insurance claims'
      ]
    },
    {
      id: 'hospital',
      name: 'Hospital System',
      icon: FiIcons.FiActivity,
      description: 'Full-featured system for hospital departments',
      color: 'purple',
      features: [
        'Department management',
        'Complex team structures',
        'Advanced pharmacy integration',
        'Comprehensive inventory management',
        'Advanced analytics & reporting',
        'Emergency response system'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Select Organization Type</h2>
      <p className="text-gray-600">
        Choose the type of organization that best fits your healthcare practice.
        Different types enable different features.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {organizationTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => onTypeSelect(type.id)}
          >
            <div className={`h-full p-6 border-2 rounded-xl transition-all hover:border-${type.color}-300 hover:shadow-lg`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg bg-${type.color}-100`}>
                  <SafeIcon icon={type.icon} className={`w-6 h-6 text-${type.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{type.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Key Features:</h4>
                <ul className="space-y-1">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <SafeIcon
                        icon={FiIcons.FiCheck}
                        className={`w-4 h-4 mt-0.5 text-${type.color}-500`}
                      />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationTypeSelector;