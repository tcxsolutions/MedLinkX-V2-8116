import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Modal from '../common/Modal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useOrganization } from '../../contexts/OrganizationContext';

const TeamManagement = () => {
  const { selectedOrganization } = useOrganization();
  const [teams, setTeams] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    type: 'standard',
    organization_id: selectedOrganization?.id
  });

  // Team types with descriptions
  const teamTypes = [
    {
      id: 'standard',
      name: 'Standard Team',
      description: 'Regular operational team for day-to-day activities'
    },
    {
      id: 'emergency',
      name: 'Emergency Team',
      description: 'Rapid response team for urgent medical situations'
    },
    {
      id: 'specialty',
      name: 'Specialty Team',
      description: 'Team focused on specific medical specialties or procedures'
    },
    {
      id: 'administrative',
      name: 'Administrative Team',
      description: 'Team handling administrative tasks and management'
    }
  ];

  // Load teams when component mounts or organization changes
  useEffect(() => {
    if (selectedOrganization) {
      fetchTeamsAndUsers();
    }
  }, [selectedOrganization]);

  // Fetch teams and users
  const fetchTeamsAndUsers = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, use mock data
      const mockTeams = [
        {
          id: 'team-1',
          name: 'Emergency Response Team',
          description: 'Handles emergency cases and rapid response situations',
          type: 'emergency',
          organization_id: selectedOrganization.id
        },
        {
          id: 'team-2',
          name: 'Surgery Team',
          description: 'Specialized team for surgical procedures',
          type: 'specialty',
          organization_id: selectedOrganization.id
        },
        {
          id: 'team-3',
          name: 'Administration Team',
          description: 'Handles hospital administration and management',
          type: 'administrative',
          organization_id: selectedOrganization.id
        }
      ];
      
      setTeams(mockTeams);
      
      // Mock users
      setUsers([
        { id: 'user1', name: 'Dr. John Smith', role: 'Doctor' },
        { id: 'user2', name: 'Nurse Sarah Johnson', role: 'Nurse' },
        { id: 'user3', name: 'Admin Robert Davis', role: 'Administrator' },
        { id: 'user4', name: 'Dr. Emily Wilson', role: 'Doctor' },
        { id: 'user5', name: 'James Rodriguez', role: 'Pharmacist' }
      ]);
    } catch (error) {
      console.error('Error fetching teams and users:', error);
      toast.error('Failed to load teams and users');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch team members
  const fetchTeamMembers = async (teamId) => {
    try {
      // In a real app, this would fetch actual team members from the junction table
      // For now, use mock data based on teamId
      const mockMembers = [
        {
          id: 'member1',
          user_id: 'user1',
          team_id: teamId,
          role: 'Leader',
          user: { name: 'Dr. John Smith', role: 'Doctor' }
        },
        {
          id: 'member2',
          user_id: 'user2',
          team_id: teamId,
          role: 'Member',
          user: { name: 'Nurse Sarah Johnson', role: 'Nurse' }
        }
      ];
      
      setTeamMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    }
  };

  // Handle adding a new team
  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes, create a mock team
      const newTeamData = {
        id: `team-${Date.now()}`,
        ...newTeam,
        organization_id: selectedOrganization.id
      };
      
      setTeams(prev => [...prev, newTeamData]);
      setShowAddModal(false);
      setNewTeam({
        name: '',
        description: '',
        type: 'standard',
        organization_id: selectedOrganization?.id
      });
      
      toast.success('Team created successfully!');
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    }
  };

  // Handle updating a team
  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes, update the team in memory
      setTeams(prev => 
        prev.map(team => 
          team.id === selectedTeam.id 
            ? {
                ...team,
                name: newTeam.name,
                description: newTeam.description,
                type: newTeam.type
              } 
            : team
        )
      );
      
      setShowEditModal(false);
      toast.success('Team updated successfully!');
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Failed to update team');
    }
  };

  // Handle deleting a team
  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }
    
    try {
      // For demo purposes, delete from local state
      setTeams(prev => prev.filter(team => team.id !== teamId));
      toast.success('Team deleted successfully!');
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Failed to delete team');
    }
  };

  // Handle opening the edit modal
  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setNewTeam({
      name: team.name,
      description: team.description,
      type: team.type,
      organization_id: team.organization_id
    });
    setShowEditModal(true);
  };

  // Handle opening the members modal
  const handleViewMembers = (team) => {
    setSelectedTeam(team);
    fetchTeamMembers(team.id);
    setShowMembersModal(true);
  };

  // Add user to team
  const handleAddUserToTeam = async (userId, role = 'Member') => {
    try {
      // In a real app, this would insert into the junction table
      // For now, just update the UI
      const user = users.find(u => u.id === userId);
      const newMember = {
        id: `member${Date.now()}`,
        user_id: userId,
        team_id: selectedTeam.id,
        role,
        user
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      toast.success(`Added ${user.name} to the team`);
    } catch (error) {
      console.error('Error adding user to team:', error);
      toast.error('Failed to add user to team');
    }
  };

  // Remove user from team
  const handleRemoveFromTeam = async (memberId) => {
    try {
      // In a real app, this would delete from the junction table
      // For now, just update the UI
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('User removed from team');
    } catch (error) {
      console.error('Error removing user from team:', error);
      toast.error('Failed to remove user from team');
    }
  };

  // Get team type name
  const getTeamTypeName = (type) => {
    const teamType = teamTypes.find(t => t.id === type);
    return teamType ? teamType.name : 'Unknown Type';
  };

  // Get team type color
  const getTeamTypeColor = (type) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'specialty':
        return 'bg-purple-100 text-purple-800';
      case 'administrative':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (!selectedOrganization) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select an organization to manage teams.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Create and manage teams within your organization</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
          <span>Add Team</span>
        </button>
      </div>

      {/* Teams List */}
      {isLoading ? (
        <Card>
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </Card>
      ) : teams.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SafeIcon icon={FiIcons.FiUsers} className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Created</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Teams help organize your staff into functional groups. Create your first team to get started.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
              <span>Create Team</span>
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{team.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getTeamTypeColor(team.type)}`}>
                      {getTeamTypeName(team.type)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                      title="Edit Team"
                    >
                      <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-1 text-gray-400 hover:text-danger-600"
                      title="Delete Team"
                    >
                      <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {team.description || 'No description provided'}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewMembers(team)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiUsers} className="w-4 h-4" />
                    <span>Manage Members</span>
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Team Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Team"
        size="md"
      >
        <form onSubmit={handleAddTeam} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Type *
            </label>
            <select
              value={newTeam.type}
              onChange={(e) => setNewTeam({ ...newTeam, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              {teamTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {teamTypes.find(type => type.id === newTeam.type)?.description}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
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
              Create Team
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Team Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Team"
        size="md"
      >
        <form onSubmit={handleUpdateTeam} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Type *
            </label>
            <select
              value={newTeam.type}
              onChange={(e) => setNewTeam({ ...newTeam, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              {teamTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {teamTypes.find(type => type.id === newTeam.type)?.description}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
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
              Update Team
            </button>
          </div>
        </form>
      </Modal>

      {/* Team Members Modal */}
      <Modal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title={selectedTeam ? `${selectedTeam.name} Members` : 'Team Members'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Current Members */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Members</h3>
            {teamMembers.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No members in this team yet</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {teamMembers.map(member => (
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
                        <p className="font-medium text-gray-900">{member.user.name}</p>
                        <p className="text-sm text-gray-500">{member.role} • {member.user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromTeam(member.id)}
                      className="p-1 text-gray-400 hover:text-danger-600"
                      title="Remove from team"
                    >
                      <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Members */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Members</h3>
            <div className="space-y-3">
              {users
                .filter(user => !teamMembers.some(member => member.user_id === user.id))
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
                      <select
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        defaultValue="Member"
                        id={`role-select-${user.id}`}
                      >
                        <option value="Leader">Team Leader</option>
                        <option value="Member">Member</option>
                        <option value="Coordinator">Coordinator</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const roleSelect = document.getElementById(`role-select-${user.id}`);
                          const selectedRole = roleSelect ? roleSelect.value : 'Member';
                          handleAddUserToTeam(user.id, selectedRole);
                        }}
                        className="p-1 text-gray-400 hover:text-success-600"
                        title="Add to team"
                      >
                        <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              {users.filter(user => !teamMembers.some(member => member.user_id === user.id)).length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">All users are already in this team</p>
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

export default TeamManagement;