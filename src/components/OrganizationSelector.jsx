import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './common/SafeIcon';
import { useOrganization } from '../contexts/OrganizationContext';
import * as FiIcons from 'react-icons/fi';

const OrganizationSelector = () => {
  const { 
    organizations, 
    selectedOrganization, 
    switchOrganization, 
    setDefaultOrganization,
    loading 
  } = useOrganization();
  
  const [showSetDefault, setShowSetDefault] = useState(false);
  
  if (loading) {
    return (
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!organizations || organizations.length === 0) {
    return (
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-800">No Organizations Available</h3>
            <p className="text-sm text-yellow-700 mt-2">
              No organizations found for your account. Please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleOrganizationSelect = async (org) => {
    await switchOrganization(org.id);
  };
  
  const handleSetDefault = async (orgId, e) => {
    e.stopPropagation();
    await setDefaultOrganization(orgId);
    setShowSetDefault(false);
  };

  return (
    <div className="p-6 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Select Organization</h2>
          <button 
            className="text-sm text-blue-600 flex items-center space-x-1"
            onClick={() => setShowSetDefault(!showSetDefault)}
          >
            <SafeIcon icon={FiIcons.FiStar} className="w-4 h-4" />
            <span>{showSetDefault ? 'Cancel' : 'Set Default'}</span>
          </button>
        </div>
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                  {org.logoUrl ? (
                    <img 
                      src={org.logoUrl} 
                      alt={org.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-primary-100 flex items-center justify-center`}>
                      <SafeIcon
                        icon={org.type === 'hospital' ? FiIcons.FiActivity : FiIcons.FiHeart}
                        className="w-6 h-6 text-primary-600"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900">{org.name}</h3>
                    {org.isDefault && (
                      <span className="ml-2">
                        <SafeIcon icon={FiIcons.FiStar} className="w-4 h-4 text-yellow-500 fill-current" />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">{org.type}</p>
                  <p className="text-xs text-gray-400">{org.code}</p>
                  
                  {showSetDefault && !org.isDefault && (
                    <button
                      onClick={(e) => handleSetDefault(org.id, e)}
                      className="mt-2 flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                    >
                      <SafeIcon icon={FiIcons.FiStar} className="w-3 h-3" />
                      <span>Set as default</span>
                    </button>
                  )}
                </div>
                {selectedOrganization?.id === org.id && (
                  <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-primary-600" />
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