import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useOrganization } from '../../contexts/OrganizationContext';
import { getOrganizationType } from '../../data/organizationTypes';
import { toast } from 'react-toastify';

const FeaturesConfiguration = () => {
  const { selectedOrganization, updateFeatures } = useOrganization();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localFeatures, setLocalFeatures] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const organizationType = getOrganizationType(selectedOrganization?.type);

  useEffect(() => {
    if (selectedOrganization?.features) {
      setLocalFeatures(selectedOrganization.features);
    }
  }, [selectedOrganization]);

  // Feature categories with descriptions and icons
  const featureCategories = [
    {
      name: 'Core Patient Management',
      icon: FiIcons.FiUsers,
      color: 'blue',
      features: [
        {
          key: 'patientManagement',
          name: 'Patient Records',
          description: 'Comprehensive patient information management'
        },
        {
          key: 'appointments',
          name: 'Appointment Scheduling',
          description: 'Schedule and manage patient appointments'
        },
        {
          key: 'prescriptions',
          name: 'Prescription Management',
          description: 'Create and manage prescriptions'
        },
        {
          key: 'familyManagement',
          name: 'Family Management',
          description: 'Link and manage family relationships'
        }
      ]
    },
    {
      name: 'Clinical Services',
      icon: FiIcons.FiActivity,
      color: 'green',
      features: [
        {
          key: 'advancedLabIntegration',
          name: 'Advanced Lab Integration',
          description: 'Third-party lab system integration'
        }
      ]
    },
    {
      name: 'Pharmacy & Medications',
      icon: FiIcons.FiPackage,
      color: 'purple',
      features: [
        {
          key: 'pharmacy',
          name: 'Pharmacy Management',
          description: 'Complete pharmacy operations'
        }
      ]
    },
    {
      name: 'Administrative & Operations',
      icon: FiIcons.FiBriefcase,
      color: 'indigo',
      features: [
        {
          key: 'departmentManagement',
          name: 'Department Management',
          description: 'Organize by hospital departments'
        },
        {
          key: 'userManagement',
          name: 'User Management',
          description: 'Staff access and permissions'
        },
        {
          key: 'inventory',
          name: 'Inventory Management',
          description: 'Medical supplies and equipment'
        }
      ]
    },
    {
      name: 'Financial & Billing',
      icon: FiIcons.FiDollarSign,
      color: 'yellow',
      features: [
        {
          key: 'billing',
          name: 'Billing & Claims',
          description: 'Invoice and insurance claims management'
        },
        {
          key: 'basicReporting',
          name: 'Basic Reporting',
          description: 'Standard reports and analytics'
        },
        {
          key: 'advancedReporting',
          name: 'Advanced Reporting',
          description: 'Comprehensive analytics and insights'
        }
      ]
    },
    {
      name: 'Technology & Integration',
      icon: FiIcons.FiMonitor,
      color: 'cyan',
      features: [
        {
          key: 'dataManagement',
          name: 'Data Management',
          description: 'Import, export, and manage data'
        }
      ]
    }
  ];

  const handleFeatureToggle = (featureKey) => {
    const isRequired = organizationType?.requiredFeatures?.includes(featureKey);
    if (isRequired) {
      toast.warning(`${featureKey} is required for ${organizationType.name} and cannot be disabled.`);
      return;
    }

    setLocalFeatures(prev => {
      const newFeatures = {
        ...prev,
        [featureKey]: !prev[featureKey]
      };
      setHasChanges(true);
      return newFeatures;
    });
  };

  const handleSaveFeatures = async () => {
    if (!selectedOrganization) return;

    setIsUpdating(true);
    try {
      const result = await updateFeatures(selectedOrganization.id, localFeatures);
      if (result.success) {
        toast.success('Features updated successfully!');
        setHasChanges(false);
      } else {
        toast.error('Failed to update features');
      }
    } catch (error) {
      console.error('Error updating features:', error);
      toast.error('An error occurred while updating features');
    } finally {
      setIsUpdating(false);
    }
  };

  const resetFeatures = () => {
    if (selectedOrganization?.features) {
      setLocalFeatures(selectedOrganization.features);
      setHasChanges(false);
    }
  };

  const enableAllOptional = () => {
    if (!organizationType) return;

    const allFeatures = { ...localFeatures };
    organizationType.optionalFeatures?.forEach(feature => {
      allFeatures[feature] = true;
    });
    setLocalFeatures(allFeatures);
    setHasChanges(true);
  };

  const getFeatureStatus = (featureKey) => {
    const isEnabled = localFeatures[featureKey];
    const isRequired = organizationType?.requiredFeatures?.includes(featureKey);
    const isOptional = organizationType?.optionalFeatures?.includes(featureKey);

    if (isRequired) return { status: 'required', color: 'red' };
    if (isOptional) return { status: 'optional', color: 'blue' };
    return { status: 'available', color: 'gray' };
  };

  if (!selectedOrganization) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiIcons.FiSettings} className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Organization Selected</h3>
          <p className="text-gray-600">Select an organization to configure its features.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Features Configuration</h2>
          <p className="text-gray-600">
            Configure features for {selectedOrganization.name} ({organizationType?.name})
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <button
              onClick={resetFeatures}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Changes
            </button>
          )}
          <button
            onClick={enableAllOptional}
            className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Enable All Optional
          </button>
          <button
            onClick={handleSaveFeatures}
            disabled={isUpdating || !hasChanges}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiIcons.FiSave} className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="space-y-6">
        {featureCategories.map((category, categoryIndex) => {
          const categoryFeatures = category.features.filter(feature =>
            Object.prototype.hasOwnProperty.call(localFeatures, feature.key) ||
            organizationType?.requiredFeatures?.includes(feature.key) ||
            organizationType?.optionalFeatures?.includes(feature.key)
          );

          if (categoryFeatures.length === 0) return null;

          return (
            <Card key={categoryIndex}>
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                    <SafeIcon icon={category.icon} className={`w-5 h-5 text-${category.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryFeatures.map((feature) => {
                  const isEnabled = localFeatures[feature.key];
                  const { status, color } = getFeatureStatus(feature.key);
                  const isRequired = status === 'required';

                  return (
                    <motion.div
                      key={feature.key}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                        isEnabled
                          ? `border-${color}-500 bg-${color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => !isRequired && handleFeatureToggle(feature.key)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{feature.name}</h4>
                            <span
                              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                status === 'required'
                                  ? 'bg-red-100 text-red-800'
                                  : status === 'optional'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {status === 'required'
                                ? 'Required'
                                : status === 'optional'
                                ? 'Optional'
                                : 'Available'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                        <div className="ml-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={isEnabled}
                              onChange={() => !isRequired && handleFeatureToggle(feature.key)}
                              disabled={isRequired}
                            />
                            <div
                              className={`w-11 h-6 rounded-full transition-colors ${
                                isEnabled ? `bg-${color}-600` : 'bg-gray-200'
                              } ${isRequired ? 'opacity-75' : ''}`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                  isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                                } mt-0.5`}
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card>
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Required Features</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Optional Features</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-700">Available Features</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FeaturesConfiguration;