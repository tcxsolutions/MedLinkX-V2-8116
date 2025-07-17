import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Modal from '../common/Modal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useOrganization } from '../../contexts/OrganizationContext';

const DepartmentManagement = () => {
  const { selectedOrganization } = useOrganization();
  const [departments, setDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    organization_id: selectedOrganization?.id
  });

  // Load departments when component mounts or organization changes
  useEffect(() => {
    if (selectedOrganization) {
      fetchDepartments();
      fetchUsers();
    }
  }, [selectedOrganization]);

  // Fetch departments from mock data
  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      
      // For demo purposes, use mock data instead of Supabase
      const mockDepartments = [
        {
          id: 'dept-1',
          name: 'Cardiology',
          description: 'Heart and cardiovascular care',
          organization_id: selectedOrganization.id
        },
        {
          id: 'dept-2',
          name: 'Neurology',
          description: 'Brain and nervous system care',
          organization_id: selectedOrganization.id
        },
        {
          id: 'dept-3',
          name: 'Pediatrics',
          description: 'Child healthcare services',
          organization_id: selectedOrganization.id
        },
        {
          id: 'dept-4',
          name: 'Pharmacy',
          description: 'Medication management',
          organization_id: selectedOrganization.id
        }
      ];
      
      setDepartments(mockDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      // In a real app, this would fetch actual users
      // For now, use mock data
      setUsers([
        { id: 'user1', name: 'Dr. John Smith', role: 'Doctor' },
        { id: 'user2', name: 'Nurse Sarah Johnson', role: 'Nurse' },
        { id: 'user3', name: 'Admin Robert Davis', role: 'Administrator' },
        { id: 'user4', name: 'Dr. Emily Wilson', role: 'Doctor' },
        { id: 'user5', name: 'James Rodriguez', role: 'Pharmacist' }
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch department members
  const fetchDepartmentMembers = async (departmentId) => {
    try {
      // In a real app, this would fetch actual department members from the junction table
      // For now, use mock data based on departmentId
      const mockMembers = [
        {
          id: 'member1',
          user_id: 'user1',
          department_id: departmentId,
          is_primary: true,
          user: { name: 'Dr. John Smith', role: 'Doctor' }
        },
        {
          id: 'member2',
          user_id: 'user4',
          department_id: departmentId,
          is_primary: false,
          user: { name: 'Dr. Emily Wilson', role: 'Doctor' }
        }
      ];
      
      setDepartmentMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching department members:', error);
      toast.error('Failed to load department members');
    }
  };

  // Handle adding a new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes, create a mock department
      const newDept = {
        id: `dept-${Date.now()}`,
        ...newDepartment,
        organization_id: selectedOrganization.id
      };
      
      setDepartments(prev => [...prev, newDept]);
      setShowAddModal(false);
      setNewDepartment({
        name: '',
        description: '',
        organization_id: selectedOrganization?.id
      });
      
      toast.success('Department created successfully!');
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department');
    }
  };

  // Handle updating a department
  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes, update department in memory
      const updatedDepartments = departments.map(department => 
        department.id === selectedDepartment.id 
          ? { ...department, name: newDepartment.name, description: newDepartment.description }
          : department
      );
      
      setDepartments(updatedDepartments);
      setShowEditModal(false);
      toast.success('Department updated successfully!');
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Failed to update department');
    }
  };

  // Handle deleting a department
  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return;
    }
    
    try {
      // For demo purposes, delete from local state
      setDepartments(prev => prev.filter(department => department.id !== departmentId));
      toast.success('Department deleted successfully!');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  // Handle opening the edit modal
  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setNewDepartment({
      name: department.name,
      description: department.description,
      organization_id: department.organization_id
    });
    setShowEditModal(true);
  };

  // Handle opening the members modal
  const handleViewMembers = (department) => {
    setSelectedDepartment(department);
    fetchDepartmentMembers(department.id);
    setShowMembersModal(true);
  };

  // Add user to department
  const handleAddUserToDepartment = async (userId, isPrimary = false) => {
    try {
      // In a real app, this would insert into the junction table
      // For now, just update the UI
      const user = users.find(u => u.id === userId);
      const newMember = {
        id: `member${Date.now()}`,
        user_id: userId,
        department_id: selectedDepartment.id,
        is_primary: isPrimary,
        user
      };
      
      setDepartmentMembers(prev => [...prev, newMember]);
      toast.success(`Added ${user.name} to the department`);
    } catch (error) {
      console.error('Error adding user to department:', error);
      toast.error('Failed to add user to department');
    }
  };

  // Remove user from department
  const handleRemoveFromDepartment = async (memberId) => {
    try {
      // In a real app, this would delete from the junction table
      // For now, just update the UI
      setDepartmentMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('User removed from department');
    } catch (error) {
      console.error('Error removing user from department:', error);
      toast.error('Failed to remove user from department');
    }
  };

  // Toggle primary status
  const handleTogglePrimary = async (memberId) => {
    try {
      // In a real app, this would update the junction table
      // For now, just update the UI
      setDepartmentMembers(prev =>
        prev.map(member =>
          member.id === memberId ? { ...member, is_primary: !member.is_primary } : member
        )
      );
      toast.success('Updated primary status');
    } catch (error) {
      console.error('Error updating primary status:', error);
      toast.error('Failed to update primary status');
    }
  };

  if (!selectedOrganization) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select an organization to manage departments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Department Management</h2>
          <p className="text-gray-600">Create and manage departments within your organization</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments List */}
      {isLoading ? (
        <Card>
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </Card>
      ) : departments.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SafeIcon icon={FiIcons.FiBriefcase} className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Departments Created</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Departments help organize your staff by specialty or function. Create your first department to get started.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
              <span>Create Department</span>
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(department => (
            <motion.div
              key={department.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">{department.name}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditDepartment(department)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                      title="Edit Department"
                    >
                      <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department.id)}
                      className="p-1 text-gray-400 hover:text-danger-600"
                      title="Delete Department"
                    >
                      <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {department.description || 'No description provided'}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewMembers(department)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiUsers} className="w-4 h-4" />
                    <span>Manage Staff</span>
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Department"
        size="md"
      >
        <form onSubmit={handleAddDepartment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name *
            </label>
            <input
              type="text"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newDepartment.description}
              onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
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
              Create Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Department"
        size="md"
      >
        <form onSubmit={handleUpdateDepartment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name *
            </label>
            <input
              type="text"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newDepartment.description}
              onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Update Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Department Members Modal */}
      <Modal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title={selectedDepartment ? `${selectedDepartment.name} Staff` : 'Department Staff'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Current Members */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Staff</h3>
            {departmentMembers.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No staff in this department yet</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {departmentMembers.map(member => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {member.user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{member.user.name}</p>
                          {member.is_primary && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{member.user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTogglePrimary(member.id)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title={member.is_primary ? "Remove primary status" : "Set as primary"}
                      >
                        <SafeIcon icon={member.is_primary ? FiIcons.FiStar : FiIcons.FiStar} className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveFromDepartment(member.id)}
                        className="p-1 text-gray-400 hover:text-danger-600"
                        title="Remove from department"
                      >
                        <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Members */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Staff</h3>
            <div className="space-y-3">
              {users
                .filter(user => !departmentMembers.some(member => member.user_id === user.id))
                .map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`primary-${user.id}`}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`primary-${user.id}`} className="text-sm text-gray-700">
                          Primary
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const checkbox = document.getElementById(`primary-${user.id}`);
                          handleAddUserToDepartment(user.id, checkbox ? checkbox.checked : false);
                        }}
                        className="p-1 text-gray-400 hover:text-success-600"
                        title="Add to department"
                      >
                        <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              {users.filter(user => !departmentMembers.some(member => member.user_id === user.id)).length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">All users are already in this department</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowMembersModal(false)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;