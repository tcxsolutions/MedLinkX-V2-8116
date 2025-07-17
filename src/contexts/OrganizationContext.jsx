import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

const OrganizationContext = createContext();

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider = ({ children }) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState({
    // Default features - will be overridden by database
    patientManagement: true,
    appointments: true,
    prescriptions: true,
    familyManagement: true,
    departmentManagement: true,
    advancedLabIntegration: true,
    billing: true,
    inventory: true,
    pharmacy: true,
    userManagement: true,
    advancedReporting: true,
    dataManagement: true,
    basicReporting: true
  });

  // Load organizations for the current user
  useEffect(() => {
    if (user) {
      loadOrganizations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrganizations = async () => {
    if (!user) return;
    try {
      setLoading(true);
      console.log("Loading organizations for user:", user.id);
      
      // For demo purposes, use a mock organization instead of fetching from Supabase
      const mockOrg = {
        id: 'mock-org-' + Date.now(),
        name: 'Demo Hospital',
        type: 'hospital',
        description: 'Demo hospital for testing',
        phone_main: '+1 (555) 123-4567',
        email_main: 'info@demohospital.com',
        address_street: '123 Medical Way',
        address_city: 'Healthcare City',
        address_state: 'CA',
        address_zip: '90210',
        address_country: 'USA',
        features: {
          patientManagement: true,
          appointments: true,
          prescriptions: true,
          familyManagement: true,
          departmentManagement: true,
          advancedLabIntegration: true,
          billing: true,
          inventory: true,
          pharmacy: true,
          userManagement: true,
          advancedReporting: true,
          dataManagement: true,
          basicReporting: true
        }
      };

      setOrganizations([mockOrg]);
      setSelectedOrganization(mockOrg);
      setFeatures(mockOrg.features);

    } catch (error) {
      console.error('Error loading organizations:', error);
      setError(error.message);
      // Fallback to default organization with mock data
      useMockOrganizationData();
    } finally {
      setLoading(false);
    }
  };

  const useMockOrganizationData = () => {
    // Create mock data if everything fails
    const mockOrg = {
      id: 'mock-org-id',
      name: 'Demo Hospital',
      type: 'hospital',
      description: 'Demo hospital for testing',
      phone_main: '+1 (555) 123-4567',
      email_main: 'info@demohospital.com',
      features: {
        patientManagement: true,
        appointments: true,
        prescriptions: true,
        familyManagement: true,
        departmentManagement: true,
        advancedLabIntegration: true,
        billing: true,
        inventory: true,
        pharmacy: true,
        userManagement: true,
        advancedReporting: true,
        dataManagement: true,
        basicReporting: true
      }
    };
    
    setOrganizations([mockOrg]);
    setSelectedOrganization(mockOrg);
    setFeatures(mockOrg.features);
  };

  const createOrganization = async (orgData) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      setLoading(true);
      
      // For demo purposes, create a mock organization instead of using Supabase
      const newOrg = {
        id: 'org-' + Date.now(),
        ...orgData,
        created_at: new Date().toISOString(),
        features: getDefaultFeatures(orgData.type)
      };

      // Add to organizations list and select it
      setOrganizations(prev => [...prev, newOrg]);
      setSelectedOrganization(newOrg);
      
      // Set features based on organization type
      const featureMap = {};
      Object.keys(newOrg.features).forEach(key => {
        featureMap[key] = newOrg.features[key];
      });
      setFeatures(featureMap);
      
      return { success: true, data: newOrg };
    } catch (error) {
      console.error('Error creating organization:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getDefaultFeatures = (type) => {
    const features = {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      billing: true,
      basicReporting: true
    };
    
    switch (type) {
      case 'family_practice':
        return {
          ...features,
          familyManagement: true,
          advancedLabIntegration: true,
          userManagement: true
        };
      case 'hospital':
        return {
          ...features,
          familyManagement: true,
          departmentManagement: true,
          advancedLabIntegration: true,
          inventory: true,
          pharmacy: true,
          userManagement: true,
          advancedReporting: true,
          dataManagement: true
        };
      default: // individual
        return features;
    }
  };

  const switchOrganization = async (organizationId) => {
    try {
      const org = organizations.find(o => o.id === organizationId);
      if (org) {
        setSelectedOrganization(org);
        setFeatures(org.features || getDefaultFeatures(org.type));
        return { success: true };
      }
      return { success: false, error: 'Organization not found' };
    } catch (error) {
      console.error('Error switching organization:', error);
      return { success: false, error: error.message };
    }
  };

  const updateOrganization = async (orgId, orgData) => {
    try {
      setLoading(true);
      
      // For demo purposes, update the organization in memory
      const updatedOrg = { 
        ...orgData, 
        id: orgId, 
        updated_at: new Date().toISOString(),
        features: selectedOrganization?.features || {}
      };
      
      setOrganizations(prev => prev.map(org => org.id === orgId ? updatedOrg : org));
      
      if (selectedOrganization?.id === orgId) {
        setSelectedOrganization(updatedOrg);
      }
      
      return { success: true, data: updatedOrg };
    } catch (error) {
      console.error('Error updating organization:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateFeatures = async (organizationId, updatedFeatures) => {
    try {
      // Update features in memory
      setFeatures(updatedFeatures);
      
      // Also update the organization's features
      if (selectedOrganization) {
        const updatedOrg = {
          ...selectedOrganization,
          features: updatedFeatures
        };
        
        setSelectedOrganization(updatedOrg);
        setOrganizations(prev => 
          prev.map(org => org.id === organizationId ? updatedOrg : org)
        );
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating features:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    organizations,
    selectedOrganization,
    features,
    loading,
    error,
    createOrganization,
    updateOrganization,
    switchOrganization,
    updateFeatures,
    loadOrganizations
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};