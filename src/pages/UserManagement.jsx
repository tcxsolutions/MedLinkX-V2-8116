import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUsers, FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, 
  FiLock, FiUnlock, FiMail, FiPhone, FiBriefcase, FiShield
} = FiIcons;

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    permissions: []
  });

  const users = [
    {
      id: 1,
      name: 'Dr. John Smith',
      email: 'john.smith@hospital.com',
      phone: '+1 (555) 123-4567',
      role: 'Doctor',
      department: 'Cardiology',
      status: 'Active',
      lastLogin: '2024-01-19 14:30',
      permissions: ['patients:read', 'patients:write', 'prescriptions:write']
    },
    {
      id: 2,
      name: 'Nurse Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+1 (555) 987-6543',
      role: 'Nurse',
      department: 'Pediatrics',
      status: 'Active',
      lastLogin: '2024-01-20 09:15',
      permissions: ['patients:read', 'vitals:write', 'notes:write']
    },
    {
      id: 3,
      name: 'Admin Robert Davis',
      email: 'robert.davis@hospital.com',
      phone: '+1 (555) 456-7890',
      role: 'Administrator',
      department: 'Administration',
      status: 'Active',
      lastLogin: '2024-01-20 10:45',
      permissions: ['users:read', 'users:write', 'billing:read', 'billing:write', 'reports:read']
    },
    {
      id: 4,
      name: 'Dr. Emily Wilson',
      email: 'emily.wilson@hospital.com',
      phone: '+1 (555) 234-5678',
      role: 'Doctor',
      department: 'Neurology',
      status: 'Inactive',
      lastLogin: '2024-01-15 16:20',
      permissions: ['patients:read', 'patients:write', 'prescriptions:write']
    },
    {
      id: 5,
      name: 'James Rodriguez',
      email: 'james.rodriguez@hospital.com',
      phone: '+1 (555) 345-6789',
      role: 'Pharmacist',
      department: 'Pharmacy',
      status: 'Active',
      lastLogin: '2024-01-20 08:30',
      permissions: ['pharmacy:read', 'pharmacy:write', 'prescriptions:read']
    }
  ];

  const roles = ['Doctor', 'Nurse', 'Administrator', 'Pharmacist', 'Technician', 'Receptionist'];
  
  const departments = ['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Pharmacy', 'Radiology', 'Laboratory', 'Administration'];
  
  const permissionGroups = [
    {
      name: 'Patients',
      permissions: [
        { id: 'patients:read', label: 'View Patients' },
        { id: 'patients:write', label: 'Manage Patients' },
        { id: 'patients:delete', label: 'Delete Patients' }
      ]
    },
    {
      name: 'Medical Records',
      permissions: [
        { id: 'records:read', label: 'View Records' },
        { id: 'records:write', label: 'Create/Edit Records' },
        { id: 'vitals:write', label: 'Record Vitals' },
        { id: 'notes:write', label: 'Add Clinical Notes' }
      ]
    },
    {
      name: 'Prescriptions',
      permissions: [
        { id: 'prescriptions:read', label: 'View Prescriptions' },
        { id: 'prescriptions:write', label: 'Write Prescriptions' }
      ]
    },
    {
      name: 'Pharmacy',
      permissions: [
        { id: 'pharmacy:read', label: 'View Inventory' },
        { id: 'pharmacy:write', label: 'Manage Inventory' },
        { id: 'pharmacy:dispense', label: 'Dispense Medication' }
      ]
    },
    {
      name: 'Billing',
      permissions: [
        { id: 'billing:read', label: 'View Invoices' },
        { id: 'billing:write', label: 'Create/Edit Invoices' },
        { id: 'claims:manage', label: 'Manage Insurance Claims' }
      ]
    },
    {
      name: 'Administration',
      permissions: [
        { id: 'users:read', label: 'View Users' },
        { id: 'users:write', label: 'Manage Users' },
        { id: 'reports:read', label: 'View Reports' },
        { id: 'settings:manage', label: 'Manage Settings' }
      ]
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    console.log('Adding user:', newUser);
    setShowAddModal(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      permissions: []
    });
  };

  const handlePermissionChange = (permissionId) => {
    setNewUser(prev => {
      if (prev.permissions.includes(permissionId)) {
        return {
          ...prev,
          permissions: prev.permissions.filter(id => id !== permissionId)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionId]
        };
      }
    });
  };

  const getRoleBasedPermissions = (role) => {
    switch (role) {
      case 'Doctor':
        return ['patients:read', 'patients:write', 'records:read', 'records:write', 'vitals:write', 'notes:write', 'prescriptions:read', 'prescriptions:write'];
      case 'Nurse':
        return ['patients:read', 'records:read', 'vitals:write', 'notes:write'];
      case 'Administrator':
        return ['users:read', 'users:write', 'billing:read', 'billing:write', 'reports:read', 'settings:manage'];
      case 'Pharmacist':
        return ['pharmacy:read', 'pharmacy:write', 'pharmacy:dispense', 'prescriptions:read'];
      default:
        return [];
    }
  };

  const handleRoleChange = (role) => {
    const rolePermissions = getRoleBasedPermissions(role);
    setNewUser(prev => ({
      ...prev,
      role,
      permissions: rolePermissions
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {filteredUsers.length} users
            </span>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card title="System Users">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Department</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Last Login</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <SafeIcon icon={FiMail} className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <SafeIcon icon={FiPhone} className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700">{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiBriefcase} className="w-4 h-4 text-gray-400" />
                      <span>{user.role}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.department}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-primary-600" title="Edit User">
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                      {user.status === 'Active' ? (
                        <button className="p-1 text-gray-400 hover:text-warning-600" title="Deactivate User">
                          <SafeIcon icon={FiLock} className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-1 text-gray-400 hover:text-success-600" title="Activate User">
                          <SafeIcon icon={FiUnlock} className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-gray-400 hover:text-danger-600" title="Delete User">
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        size="xl"
      >
        <form onSubmit={handleAddUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={newUser.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiShield} className="w-4 h-4" />
                  <span>Permissions</span>
                </div>
              </label>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 space-y-4">
              {permissionGroups.map((group) => (
                <div key={group.name}>
                  <h4 className="font-medium text-gray-900 mb-2">{group.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {group.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={newUser.permissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={permission.id} className="text-sm text-gray-700">
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add User
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default UserManagement;