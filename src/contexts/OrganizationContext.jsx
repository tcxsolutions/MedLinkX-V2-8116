import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock organizations data
  const mockOrganizations = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'City General Hospital',
      code: 'CGH-001',
      description: 'Main city hospital providing comprehensive healthcare services',
      type: 'hospital',
      address: {
        street: '123 Main Street',
        city: 'Metropolis',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      contactInfo: {
        phone: '+1 (555) 123-4567',
        email: 'info@citygeneralhospital.com',
        website: 'https://citygeneralhospital.com'
      },
      isDefault: true,
      isAdmin: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Metro Health Center',
      code: 'MHC-002',
      description: 'Community health center focused on primary care',
      type: 'clinic',
      address: {
        street: '456 Oak Avenue',
        city: 'Metropolis',
        state: 'NY',
        zip: '10002',
        country: 'USA'
      },
      contactInfo: {
        phone: '+1 (555) 987-6543',
        email: 'info@metrohealthcenter.com',
        website: 'https://metrohealthcenter.com'
      },
      isDefault: false,
      isAdmin: true
    }
  ];

  useEffect(() => {
    if (user) {
      setLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        setOrganizations(mockOrganizations);
        const defaultOrg = mockOrganizations.find(org => org.isDefault) || mockOrganizations[0];
        setSelectedOrganization(defaultOrg);
        setLoading(false);
      }, 500);
    } else {
      setOrganizations([]);
      setSelectedOrganization(null);
      setDepartments([]);
      setTeams([]);
      setRoles([]);
    }
  }, [user]);

  const switchOrganization = async (organizationId) => {
    const newOrg = organizations.find(org => org.id === organizationId);
    if (newOrg) {
      setSelectedOrganization(newOrg);
      return { success: true };
    }
    return { success: false, error: 'Organization not found' };
  };

  const setDefaultOrganization = async (organizationId) => {
    const updatedOrgs = organizations.map(org => ({
      ...org,
      isDefault: org.id === organizationId
    }));
    setOrganizations(updatedOrgs);
    return { success: true };
  };

  const hasPermission = (permission) => {
    if (!selectedOrganization) return false;
    return selectedOrganization.isAdmin;
  };

  const value = {
    organizations,
    selectedOrganization,
    departments,
    teams,
    roles,
    loading,
    switchOrganization,
    setDefaultOrganization,
    hasPermission
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};