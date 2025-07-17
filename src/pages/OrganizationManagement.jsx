import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useOrganization } from '../contexts/OrganizationContext';
import OrganizationSelector from '../components/OrganizationSelector';
import OrganizationForm from '../components/organization/OrganizationForm';
import OrganizationSettings from '../components/organization/OrganizationSettings';
import FeaturesConfiguration from '../components/organization/FeaturesConfiguration';
import DataImportExport from '../components/dataManagement/DataImportExport';

const OrganizationManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedOrganization, createOrganization } = useOrganization();

  // Get current tab from URL
  const currentPath = location.pathname.split('/organizations/')[1] || 'overview';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiIcons.FiBriefcase, path: '/organizations' },
    { id: 'settings', label: 'Settings', icon: FiIcons.FiSettings, path: '/organizations/settings' },
    { id: 'features', label: 'Features', icon: FiIcons.FiLayers, path: '/organizations/features' },
    { id: 'data', label: 'Data Management', icon: FiIcons.FiDatabase, path: '/organizations/data' },
    { id: 'integrations', label: 'Integrations', icon: FiIcons.FiLink, path: '/organizations/integrations' }
  ];

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  const handleCreateOrganizationSuccess = (org) => {
    // Reload organizations and navigate to the new organization's settings
    navigate('/organizations/settings');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600">Configure your healthcare organization settings and features</p>
        </div>
        {selectedOrganization && (
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiIcons.FiActivity} className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedOrganization.name}</p>
              <p className="text-xs text-gray-500 capitalize">{selectedOrganization.type?.replace('_', ' ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Organization Selector */}
      <OrganizationSelector />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                currentPath === tab.id || (tab.id === 'overview' && currentPath === '')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <Routes>
        <Route path="/" element={<OrganizationOverview onCreateSuccess={handleCreateOrganizationSuccess} />} />
        <Route path="/settings" element={<OrganizationSettings />} />
        <Route path="/features" element={<FeaturesConfiguration />} />
        <Route path="/data" element={<DataImportExport />} />
        <Route path="/integrations" element={<IntegrationsManagement />} />
      </Routes>
    </div>
  );
};

// Organization Overview Component
const OrganizationOverview = ({ onCreateSuccess }) => {
  const { selectedOrganization, organizations, createOrganization } = useOrganization();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const handleQuickAction = (action) => {
    switch (action) {
      case 'settings':
        navigate('/organizations/settings');
        break;
      case 'users':
        navigate('/users');
        break;
      case 'data':
        navigate('/organizations/data');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleCreateOrganizationSuccess = (org) => {
    setShowCreateForm(false);
    if (onCreateSuccess) {
      onCreateSuccess(org);
    }
  };

  if (!selectedOrganization) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiIcons.FiBriefcase} className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Organization Selected</h3>
        <p className="text-gray-600 mb-6">Select an organization above or create a new one to get started.</p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create Organization
        </button>
        {showCreateForm && (
          <div className="mt-8">
            <OrganizationForm 
              onSuccess={handleCreateOrganizationSuccess} 
              onCancel={() => setShowCreateForm(false)} 
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Organizations</p>
              <p className="text-2xl font-bold text-gray-900">{organizations.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiBriefcase} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Features</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(selectedOrganization.features || {}).filter(Boolean).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiLayers} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <p className="text-2xl font-bold text-green-600">Online</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiActivity} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Configuration</p>
              <p className="text-2xl font-bold text-blue-600">Complete</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiCheckCircle} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleQuickAction('settings')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <SafeIcon icon={FiIcons.FiSettings} className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Organization Settings</p>
              <p className="text-sm text-gray-600">Configure basic information</p>
            </div>
          </button>
          <button
            onClick={() => handleQuickAction('users')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <SafeIcon icon={FiIcons.FiUsers} className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">Add and configure user access</p>
            </div>
          </button>
          <button
            onClick={() => handleQuickAction('data')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <SafeIcon icon={FiIcons.FiDatabase} className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Import Data</p>
              <p className="text-sm text-gray-600">Upload existing records</p>
            </div>
          </button>
        </div>
      </div>

      {/* Create New Organization */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Organization</h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={showCreateForm ? FiIcons.FiX : FiIcons.FiPlus} className="w-4 h-4" />
            <span>{showCreateForm ? 'Cancel' : 'Create Organization'}</span>
          </button>
        </div>
        {showCreateForm && (
          <OrganizationForm 
            onSuccess={handleCreateOrganizationSuccess} 
            onCancel={() => setShowCreateForm(false)} 
          />
        )}
      </div>
    </div>
  );
};

// Integrations Management Component
const IntegrationsManagement = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'lab',
      name: 'Lab Integration',
      description: 'Connect with external laboratory systems',
      status: 'Connected',
      icon: FiIcons.FiActivity,
      config: { endpoint: 'https://api.labcorp.com', apiKey: '***' }
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy Integration',
      description: 'Connect with pharmacy management systems',
      status: 'Available',
      icon: FiIcons.FiPackage,
      config: null
    },
    {
      id: 'insurance',
      name: 'Insurance Integration',
      description: 'Connect with insurance providers for claims',
      status: 'Available',
      icon: FiIcons.FiShield,
      config: null
    },
    {
      id: 'imaging',
      name: 'Imaging Integration',
      description: 'Connect with medical imaging systems',
      status: 'Available',
      icon: FiIcons.FiImage,
      config: null
    }
  ]);

  const handleIntegrationAction = (integrationId, action) => {
    setIntegrations(prev =>
      prev.map(integration => {
        if (integration.id === integrationId) {
          if (action === 'connect') {
            return { ...integration, status: 'Connected' };
          } else if (action === 'disconnect') {
            return { ...integration, status: 'Available' };
          }
        }
        return integration;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <SafeIcon icon={integration.icon} className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                    {integration.config && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Endpoint: {integration.config.endpoint}</p>
                        <p>API Key: {integration.config.apiKey}</p>
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    integration.status === 'Connected'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {integration.status}
                </span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                {integration.status === 'Connected' ? (
                  <>
                    <button
                      onClick={() => handleIntegrationAction(integration.id, 'configure')}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => handleIntegrationAction(integration.id, 'disconnect')}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleIntegrationAction(integration.id, 'connect')}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationManagement;