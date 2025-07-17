import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setTenant({
        id: 'city-general',
        name: 'City General Hospital',
        type: 'hospital',
        color: 'blue',
        settings: {
          theme: 'blue',
          logo: '/api/tenant/logo',
          timezone: 'America/New_York',
          currency: 'USD',
          features: {
            pharmacy: true,
            billing: true,
            inventory: true,
            telemedicine: true
          }
        },
        subscription: {
          plan: 'enterprise',
          status: 'active',
          users: 150,
          maxUsers: 200
        }
      });
    } else {
      setTenant(null);
    }
  }, [user]);

  const updateTenantSettings = async (settings) => {
    try {
      setTenant(prev => ({
        ...prev,
        settings: { ...prev.settings, ...settings }
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    tenant,
    loading,
    updateTenantSettings
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};