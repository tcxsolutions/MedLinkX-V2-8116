import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const FamilyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [newRelationship, setNewRelationship] = useState({
    patientId: '',
    relatedPatientId: '',
    relationship: '',
    isEmergencyContact: false,
    notes: ''
  });

  // Sample data for families
  const families = [
    {
      id: 1,
      primaryMember: {
        id: 'P001',
        name: 'John Doe',
        age: 45,
        gender: 'Male'
      },
      members: [
        {
          id: 'P005',
          name: 'Mary Doe',
          age: 42,
          gender: 'Female',
          relationship: 'Spouse',
          isEmergencyContact: true
        },
        {
          id: 'P006',
          name: 'James Doe',
          age: 15,
          gender: 'Male',
          relationship: 'Child',
          isEmergencyContact: false
        },
        {
          id: 'P007',
          name: 'Emma Doe',
          age: 12,
          gender: 'Female',
          relationship: 'Child',
          isEmergencyContact: false
        }
      ]
    },
    {
      id: 2,
      primaryMember: {
        id: 'P002',
        name: 'Jane Smith',
        age: 32,
        gender: 'Female'
      },
      members: [
        {
          id: 'P008',
          name: 'Michael Smith',
          age: 35,
          gender: 'Male',
          relationship: 'Spouse',
          isEmergencyContact: true
        },
        {
          id: 'P009',
          name: 'Olivia Smith',
          age: 5,
          gender: 'Female',
          relationship: 'Child',
          isEmergencyContact: false
        }
      ]
    },
    {
      id: 3,
      primaryMember: {
        id: 'P003',
        name: 'Bob Wilson',
        age: 67,
        gender: 'Male'
      },
      members: [
        {
          id: 'P010',
          name: 'Alice Wilson',
          age: 65,
          gender: 'Female',
          relationship: 'Spouse',
          isEmergencyContact: true
        }
      ]
    }
  ];

  // Sample data for all patients
  const patients = [
    { id: 'P001', name: 'John Doe', age: 45, gender: 'Male' },
    { id: 'P002', name: 'Jane Smith', age: 32, gender: 'Female' },
    { id: 'P003', name: 'Bob Wilson', age: 67, gender: 'Male' },
    { id: 'P004', name: 'Sarah Johnson', age: 28, gender: 'Female' },
    { id: 'P005', name: 'Mary Doe', age: 42, gender: 'Female' },
    { id: 'P006', name: 'James Doe', age: 15, gender: 'Male' },
    { id: 'P007', name: 'Emma Doe', age: 12, gender: 'Female' },
    { id: 'P008', name: 'Michael Smith', age: 35, gender: 'Male' },
    { id: 'P009', name: 'Olivia Smith', age: 5, gender: 'Female' },
    { id: 'P010', name: 'Alice Wilson', age: 65, gender: 'Female' }
  ];

  // Relationship types
  const relationshipTypes = [
    'Spouse',
    'Child',
    'Parent',
    'Sibling',
    'Grandparent',
    'Grandchild',
    'Guardian',
    'Caregiver',
    'Other'
  ];

  // Filter families based on search term
  const filteredFamilies = families.filter(family => {
    const matchesPrimary = family.primaryMember.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMembers = family.members.some(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesPrimary || matchesMembers;
  });

  const handleAddRelationship = (e) => {
    e.preventDefault();
    console.log('Adding relationship:', newRelationship);
    setShowAddModal(false);
    setNewRelationship({
      patientId: '',
      relatedPatientId: '',
      relationship: '',
      isEmergencyContact: false,
      notes: ''
    });
  };

  const handleViewFamily = (family) => {
    setSelectedFamily(family);
    setShowViewModal(true);
  };

  const countFamilyMembers = (family) => {
    return family.members.length + 1; // +1 for primary member
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
          <h1 className="text-2xl font-bold text-gray-900">Family Management</h1>
          <p className="text-gray-600">Manage family relationships and emergency contacts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5" />
          <span>Add Relationship</span>
        </button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative max-w-md">
          <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search families..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Families Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFamilies.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SafeIcon icon={FiIcons.FiUsers} className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Families Found</h3>
                <p className="text-gray-600 mb-6">No families match your search criteria.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiIcons.FiRefreshCw} className="w-4 h-4" />
                  <span>Clear Search</span>
                </button>
              </div>
            </Card>
          </div>
        ) : (
          filteredFamilies.map((family) => (
            <Card key={family.id} hover onClick={() => handleViewFamily(family)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {family.primaryMember.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiIcons.FiUser} className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{family.primaryMember.name}</h3>
                    <p className="text-sm text-gray-500">
                      ID: {family.primaryMember.id} • {family.primaryMember.age} years
                    </p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {countFamilyMembers(family)} members
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Family Members</h4>
                {family.members.slice(0, 2).map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-xs font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.relationship}</p>
                    </div>
                    {member.isEmergencyContact && (
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-warning-100 text-warning-800">
                        Emergency
                      </span>
                    )}
                  </div>
                ))}
                
                {family.members.length > 2 && (
                  <div className="text-center text-sm text-primary-600 pt-2">
                    +{family.members.length - 2} more members
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end">
                <button
                  className="text-primary-600 text-sm flex items-center space-x-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewFamily(family);
                  }}
                >
                  <span>View details</span>
                  <SafeIcon icon={FiIcons.FiArrowRight} className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Relationship Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Family Relationship"
        size="md"
      >
        <form onSubmit={handleAddRelationship} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient *
            </label>
            <select
              value={newRelationship.patientId}
              onChange={(e) => setNewRelationship({...newRelationship, patientId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Patient *
            </label>
            <select
              value={newRelationship.relatedPatientId}
              onChange={(e) => setNewRelationship({...newRelationship, relatedPatientId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select Related Patient</option>
              {patients
                .filter(p => p.id !== newRelationship.patientId)
                .map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship *
            </label>
            <select
              value={newRelationship.relationship}
              onChange={(e) => setNewRelationship({...newRelationship, relationship: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select Relationship</option>
              {relationshipTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isEmergencyContact"
              checked={newRelationship.isEmergencyContact}
              onChange={(e) => setNewRelationship({...newRelationship, isEmergencyContact: e.target.checked})}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
            />
            <label htmlFor="isEmergencyContact" className="text-sm text-gray-700">
              Set as emergency contact
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={newRelationship.notes}
              onChange={(e) => setNewRelationship({...newRelationship, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional notes about this relationship..."
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
              Add Relationship
            </button>
          </div>
        </form>
      </Modal>

      {/* View Family Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Family Details"
        size="lg"
      >
        {selectedFamily && (
          <div className="space-y-6">
            {/* Primary Member */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {selectedFamily.primaryMember.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiIcons.FiUser} className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedFamily.primaryMember.name}</h3>
                  <p className="text-gray-600">
                    {selectedFamily.primaryMember.age} years • {selectedFamily.primaryMember.gender}
                  </p>
                  <p className="text-sm text-gray-500">Patient ID: {selectedFamily.primaryMember.id}</p>
                </div>
              </div>
            </div>

            {/* Family Members */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Family Members</h4>
              <div className="space-y-3">
                {selectedFamily.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {member.age} years • {member.gender}
                          </span>
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {member.relationship}
                          </span>
                          {member.isEmergencyContact && (
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-warning-100 text-warning-800">
                              Emergency Contact
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Patient ID: {member.id}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                        title="View Patient"
                      >
                        <SafeIcon icon={FiIcons.FiEye} className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-danger-600 rounded-lg hover:bg-gray-100"
                        title="Remove Relationship"
                      >
                        <SafeIcon icon={FiIcons.FiX} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiUserPlus} className="w-4 h-4" />
                <span>Add Family Member</span>
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default FamilyManagement;