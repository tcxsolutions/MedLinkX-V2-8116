import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';

const OrganizationSelector = () => {
  const { organizations, selectedOrganization, handleOrganizationSelect } = useAuth();

  if (!organizations.length) return null;

  return (
    <div className="p-6 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Organization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <motion.button
              key={org.id}
              onClick={() => handleOrganizationSelect(org)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedOrganization?.id === org.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <SafeIcon
                    icon={org.type === 'hospital' ? FiIcons.FiActivity : FiIcons.FiHeart}
                    className="w-5 h-5 text-primary-600"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{org.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{org.type}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {org.departments.slice(0, 2).map((dept, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
                      >
                        {dept}
                      </span>
                    ))}
                    {org.departments.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        +{org.departments.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                {selectedOrganization?.id === org.id && (
                  <SafeIcon
                    icon={FiIcons.FiCheck}
                    className="w-5 h-5 text-primary-600"
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelector;