import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    // Simulate authentication check
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    const lastOrg = localStorage.getItem('selected_organization');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Load user's organizations
        fetchUserOrganizations(parsedUser.id);
        // Restore last selected organization if valid
        if (lastOrg) {
          const org = JSON.parse(lastOrg);
          setSelectedOrganization(org);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('selected_organization');
      }
    }
    
    setLoading(false);
  }, []);

  const fetchUserOrganizations = async (userId) => {
    // Simulate API call to fetch user's organizations
    const mockOrganizations = [
      {
        id: 'org1',
        name: 'City General Hospital',
        tenantId: 'tenant1',
        type: 'hospital',
        departments: ['Cardiology', 'Neurology', 'Emergency'],
        roles: [
          { id: 'doctor', name: 'Doctor', permissions: ['patients:read', 'patients:write'] },
          { id: 'nurse', name: 'Nurse', permissions: ['patients:read', 'vitals:write'] }
        ],
        teams: [
          { id: 'cardio-team', name: 'Cardiology Team', department: 'Cardiology' },
          { id: 'neuro-team', name: 'Neurology Team', department: 'Neurology' }
        ]
      },
      {
        id: 'org2',
        name: 'Metro Health Center',
        tenantId: 'tenant1',
        type: 'clinic',
        departments: ['Primary Care', 'Pediatrics'],
        roles: [
          { id: 'doctor', name: 'Doctor', permissions: ['patients:read', 'patients:write'] },
          { id: 'nurse', name: 'Nurse', permissions: ['patients:read', 'vitals:write'] }
        ],
        teams: [
          { id: 'primary-team', name: 'Primary Care Team', department: 'Primary Care' },
          { id: 'peds-team', name: 'Pediatrics Team', department: 'Pediatrics' }
        ]
      }
    ];

    setOrganizations(mockOrganizations);
    
    // If no organization is selected and user has organizations, select the first one
    if (!selectedOrganization && mockOrganizations.length > 0) {
      handleOrganizationSelect(mockOrganizations[0]);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Simulate API call for authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock admin user with full access
      const mockUser = {
        id: '1',
        name: 'System Administrator',
        email: credentials.email,
        isAdmin: true,
        globalPermissions: ['admin:full'],
        organizationRoles: {
          'org1': {
            roles: ['admin'],
            departments: ['all'],
            teams: ['all']
          },
          'org2': {
            roles: ['admin'],
            departments: ['all'],
            teams: ['all']
          }
        }
      };

      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Fetch organizations after successful login
      await fetchUserOrganizations(mockUser.id);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationSelect = (organization) => {
    setSelectedOrganization(organization);
    localStorage.setItem('selected_organization', JSON.stringify(organization));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('selected_organization');
    setUser(null);
    setSelectedOrganization(null);
    setOrganizations([]);
  };

  const hasPermission = (permission) => {
    if (!user || !selectedOrganization) return false;

    // Admin has all permissions
    if (user.isAdmin || user.globalPermissions?.includes('admin:full')) {
      return true;
    }

    // Check organization-specific roles and permissions
    const orgRoles = user.organizationRoles[selectedOrganization.id];
    if (!orgRoles) return false;

    // Get permissions for all roles in current organization
    const rolePermissions = orgRoles.roles.flatMap(roleId => {
      const role = selectedOrganization.roles.find(r => r.id === roleId);
      return role?.permissions || [];
    });

    return rolePermissions.includes(permission);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    hasPermission,
    organizations,
    selectedOrganization,
    handleOrganizationSelect
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};