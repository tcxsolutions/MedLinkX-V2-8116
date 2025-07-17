import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { toast } from 'react-toastify';
import TeamManagement from '../components/user/TeamManagement';
import DepartmentManagement from '../components/user/DepartmentManagement';
import { useOrganization } from '../contexts/OrganizationContext';

const { FiUsers, FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiLock, FiUnlock, FiMail, FiPhone, FiBriefcase, FiShield, FiEye, FiUserPlus } = FiIcons;

const UserManagement = () => {
  const { selectedOrganization } = useOrganization();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Dr. John Smith',
      email: 'john.smith@hospital.com',
      phone: '+1 (555) 123-4567',
      role: 'Doctor',
      department: 'Cardiology',
      status: 'Active',
      lastLogin: '2024-01-19 14:30',
      permissions: ['patients:read', 'patients:write', 'prescriptions:write'],
      teams: ['Emergency Response Team', 'Surgery Team'],
      createdAt: '2024-01-01'
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
      permissions: ['patients:read', 'vitals:write', 'notes:write'],
      teams: ['Emergency Response Team'],
      createdAt: '2024-01-02'
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
      permissions: ['users:read', 'users:write', 'billing:read', 'billing:write', 'reports:read'],
      teams: [],
      createdAt: '2024-01-03'
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
      permissions: ['patients:read', 'patients:write', 'prescriptions:write'],
      teams: ['Surgery Team'],
      createdAt: '2024-01-04'
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
      permissions: ['pharmacy:read', 'pharmacy:write', 'prescriptions:read'],
      teams: [],
      createdAt: '2024-01-05'
    }
  ]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    teams: [],
    permissions: []
  });

  const roles = ['Doctor', 'Nurse', 'Administrator', 'Pharmacist', 'Technician', 'Receptionist'];

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

  // Fetch departments and teams when component mounts
  useEffect(() => {
    if (selectedOrganization) {
      fetchDepartmentsAndTeams();
    }
  }, [selectedOrganization]);

  // Fetch departments and teams (mock data)
  const fetchDepartmentsAndTeams = () => {
    setIsLoading(true);
    try {
      // Mock departments
      const mockDepartments = [
        { id: 'dept-1', name: 'Cardiology' },
        { id: 'dept-2', name: 'Neurology' },
        { id: 'dept-3', name: 'Pediatrics' },
        { id: 'dept-4', name: 'Pharmacy' },
        { id: 'dept-5', name: 'Administration' }
      ];
      setDepartments(mockDepartments);

      // Mock teams
      const mockTeams = [
        { id: 'team-1', name: 'Emergency Response Team' },
        { id: 'team-2', name: 'Surgery Team' },
        { id: 'team-3', name: 'Administration Team' }
      ];
      setTeams(mockTeams);
    } catch (error) {
      console.error('Error fetching departments and teams:', error);
      toast.error('Failed to load departments and teams');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
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

  const resetForm = () => {
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      teams: [],
      permissions: []
    });
    setSelectedUser(null);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const userId = Math.max(...users.map(u => u.id)) + 1;
    const newUserData = {
      ...newUser,
      id: userId,
      status: 'Active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUserData]);
    setShowAddModal(false);
    resetForm();
    toast.success('User added successfully!');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      teams: user.teams || [],
      permissions: user.permissions || []
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(user => user.id === selectedUser.id ? { ...user, ...newUser } : user));
    setShowEditModal(false);
    resetForm();
    toast.success('User updated successfully!');
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully!');
    }
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
    toast.success('User status updated!');
  };

  const handlePermissionChange = (permissionId) => {
    setNewUser(prev => {
      if (prev.permissions.includes(permissionId)) {
        return { ...prev, permissions: prev.permissions.filter(id => id !== permissionId) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permissionId] };
      }
    });
  };

  const handleTeamChange = (teamName) => {
    setNewUser(prev => {
      if (prev.teams.includes(teamName)) {
        return { ...prev, teams: prev.teams.filter(t => t !== teamName) };
      } else {
        return { ...prev, teams: [...prev.teams, teamName] };
      }
    });
  };

  const getRoleBasedPermissions = (role) => {
    switch (role) {
      case 'Doctor':
        return [
          'patients:read', 'patients:write', 'records:read', 'records:write',
          'vitals:write', 'notes:write', 'prescriptions:read', 'prescriptions:write'
        ];
      case 'Nurse':
        return ['patients:read', 'records:read', 'vitals:write', 'notes:write'];
      case 'Administrator':
        return [
          'users:read', 'users:write', 'billing:read', 'billing:write',
          'reports:read', 'settings:manage'
        ];
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

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    resetForm();
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
          <p className="text-gray-600">Manage users, teams, departments, and permissions</p>
        </div>
        {activeTab === 'users' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiUsers} className="w-4 h-4" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'teams' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiUsers} className="w-4 h-4" />
            <span>Teams</span>
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiBriefcase} className="w-4 h-4" />
            <span>Departments</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <SafeIcon icon={FiUsers} className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'Active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Doctors</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.filter(u => u.role === 'Doctor').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <SafeIcon icon={FiBriefcase} className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Administrators</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter(u => u.role === 'Administrator').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <SafeIcon icon={FiShield} className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
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
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
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
                    <th className="text-left py-3 px-4">Teams</th>
                    <th className="text-left py-3 px-4">Status</th>
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
                        <div className="flex flex-wrap gap-1">
                          {user.teams && user.teams.length > 0 ? (
                            user.teams.map((team, idx) => (
                              <span
                                key={idx}
                                className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                              >
                                {team}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">None</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-1 text-gray-400 hover:text-primary-600"
                            title="View User"
                          >
                            <SafeIcon icon={FiEye} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-1 text-gray-400 hover:text-primary-600"
                            title="Edit User"
                          >
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="p-1 text-gray-400 hover:text-warning-600"
                            title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                          >
                            <SafeIcon icon={user.status === 'Active' ? FiLock : FiUnlock} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-gray-400 hover:text-danger-600"
                            title="Delete User"
                          >
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
            onClose={handleCloseModal}
            title="Add New User"
            size="xl"
          >
            <UserForm
              user={newUser}
              setUser={setNewUser}
              onSubmit={handleAddUser}
              onCancel={handleCloseModal}
              roles={roles}
              departments={departments.map(d => d.name)}
              teams={teams.map(t => t.name)}
              permissionGroups={permissionGroups}
              handlePermissionChange={handlePermissionChange}
              handleRoleChange={handleRoleChange}
              handleTeamChange={handleTeamChange}
            />
          </Modal>

          {/* Edit User Modal */}
          <Modal
            isOpen={showEditModal}
            onClose={handleCloseModal}
            title="Edit User"
            size="xl"
          >
            <UserForm
              user={newUser}
              setUser={setNewUser}
              onSubmit={handleUpdateUser}
              onCancel={handleCloseModal}
              roles={roles}
              departments={departments.map(d => d.name)}
              teams={teams.map(t => t.name)}
              permissionGroups={permissionGroups}
              handlePermissionChange={handlePermissionChange}
              handleRoleChange={handleRoleChange}
              handleTeamChange={handleTeamChange}
              isEdit={true}
            />
          </Modal>

          {/* View User Modal */}
          <Modal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            title="User Details"
            size="lg"
          >
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.role} • {selectedUser.department}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{selectedUser.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-medium">Last Login:</span> {selectedUser.lastLogin}</p>
                      <p><span className="font-medium">Created:</span> {selectedUser.createdAt}</p>
                      <p><span className="font-medium">Permissions:</span> {selectedUser.permissions.length} assigned</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Teams</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.teams && selectedUser.teams.length > 0 ? (
                      selectedUser.teams.map((team, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {team}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No teams assigned</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map(permission => (
                      <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}

      {activeTab === 'teams' && <TeamManagement />}
      {activeTab === 'departments' && <DepartmentManagement />}
    </motion.div>
  );
};

// User Form Component
const UserForm = ({
  user = {}, // Add default empty object
  setUser,
  onSubmit,
  onCancel,
  roles = [], // Add default empty array
  departments = [], // Add default empty array
  teams = [], // Add default empty array
  permissionGroups = [], // Add default empty array
  handlePermissionChange,
  handleRoleChange,
  handleTeamChange,
  isEdit = false
}) => {
  // Ensure user object has all required properties with default values
  const safeUser = {
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    teams: [],
    permissions: [],
    ...user // Spread the actual user data over defaults
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={safeUser.name}
              onChange={(e) => setUser({ ...safeUser, name: e.target.value })}
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
              value={safeUser.email}
              onChange={(e) => setUser({ ...safeUser, email: e.target.value })}
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
              value={safeUser.phone}
              onChange={(e) => setUser({ ...safeUser, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={safeUser.role}
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
              value={safeUser.department}
              onChange={(e) => setUser({ ...safeUser, department: e.target.value })}
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

        {/* Teams */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUsers} className="w-4 h-4" />
                <span>Teams</span>
              </div>
            </label>
          </div>
          <div className="border border-gray-300 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
            {teams.length > 0 ? (
              teams.map((team, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`team-${index}`}
                    checked={safeUser.teams.includes(team)}
                    onChange={() => handleTeamChange(team)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor={`team-${index}`} className="text-sm text-gray-700">
                    {team}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No teams available. Create teams in the Teams tab.</p>
            )}
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
          <div className="border border-gray-300 rounded-lg p-4 space-y-4 max-h-64 overflow-y-auto">
            {permissionGroups.map((group) => (
              <div key={group.name}>
                <h4 className="font-medium text-gray-900 mb-2">{group.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {group.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={safeUser.permissions.includes(permission.id)}
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
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {isEdit ? 'Update User' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserManagement;