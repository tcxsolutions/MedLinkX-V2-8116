import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrganization } from '../contexts/OrganizationContext';
import { toast } from 'react-toastify';
import SafeIcon from './common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Card from './common/Card';

const OrganizationSelector = () => {
  const { organizations, selectedOrganization, switchOrganization } = useOrganization();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOrganizationSelect = async (org) => {
    try {
      const result = await switchOrganization(org.id);
      if (!result.success) {
        toast.error(result.error || 'Failed to switch organization');
        return;
      }
      toast.success(`Switched to ${org.name}`);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error switching organization:', error);
      toast.error('Failed to switch organization');
    }
  };

  // If no organizations, don't render the selector
  if (!organizations || organizations.length === 0) {
    return null;
  }

  // If only one organization and it's selected, don't render the selector
  if (organizations.length === 1 && organizations[0].id === selectedOrganization?.id) {
    return null;
  }

  return (
    <Card className="relative">
      <div 
        className="flex items-center justify-between cursor-pointer p-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <SafeIcon 
              icon={
                selectedOrganization?.type === 'individual' 
                  ? FiIcons.FiUser 
                  : selectedOrganization?.type === 'family_practice'
                    ? FiIcons.FiUsers
                    : FiIcons.FiActivity
              }
              className="w-5 h-5 text-primary-600"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Organization</p>
            <p className="font-medium text-gray-900">{selectedOrganization?.name || 'Select Organization'}</p>
          </div>
        </div>
        <SafeIcon 
          icon={isDropdownOpen ? FiIcons.FiChevronUp : FiIcons.FiChevronDown} 
          className="w-5 h-5 text-gray-400"
        />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
        >
          <ul>
            {organizations.map(org => (
              <li key={org.id}>
                <button
                  onClick={() => handleOrganizationSelect(org)}
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 ${
                    selectedOrganization?.id === org.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <SafeIcon 
                      icon={
                        org.type === 'individual' 
                          ? FiIcons.FiUser 
                          : org.type === 'family_practice'
                            ? FiIcons.FiUsers
                            : FiIcons.FiActivity
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{org.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{org.type?.replace('_', ' ')}</p>
                  </div>
                  {selectedOrganization?.id === org.id && (
                    <div className="ml-auto">
                      <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </Card>
  );
};

export default OrganizationSelector;