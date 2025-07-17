import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Prescriptions = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    patientName: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refills: '0'
  });

  // Sample data
  const prescriptions = [
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 'P001',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      refills: 3,
      refillsRemaining: 2,
      status: 'Active',
      prescribedBy: 'Dr. Smith',
      instructions: 'Take with food'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 'P002',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-01-05',
      endDate: '2024-07-05',
      refills: 5,
      refillsRemaining: 4,
      status: 'Active',
      prescribedBy: 'Dr. Johnson',
      instructions: 'Take with meals'
    },
    {
      id: 3,
      patientName: 'Bob Wilson',
      patientId: 'P003',
      medication: 'Amoxicillin',
      dosage: '250mg',
      frequency: 'Three times daily',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      refills: 0,
      refillsRemaining: 0,
      status: 'Completed',
      prescribedBy: 'Dr. Brown',
      instructions: 'Take until finished'
    },
    {
      id: 4,
      patientName: 'Mary Johnson',
      patientId: 'P004',
      medication: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily at bedtime',
      startDate: '2024-01-12',
      endDate: '2024-07-12',
      refills: 5,
      refillsRemaining: 5,
      status: 'Active',
      prescribedBy: 'Dr. Smith',
      instructions: 'Take at night'
    }
  ];

  const medications = [
    { id: 1, name: 'Lisinopril', forms: ['Tablet'], strengths: ['5mg', '10mg', '20mg'] },
    { id: 2, name: 'Metformin', forms: ['Tablet'], strengths: ['500mg', '850mg', '1000mg'] },
    { id: 3, name: 'Amoxicillin', forms: ['Capsule', 'Tablet', 'Suspension'], strengths: ['250mg', '500mg'] },
    { id: 4, name: 'Atorvastatin', forms: ['Tablet'], strengths: ['10mg', '20mg', '40mg', '80mg'] },
    { id: 5, name: 'Amlodipine', forms: ['Tablet'], strengths: ['2.5mg', '5mg', '10mg'] }
  ];

  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 12 hours',
    'Every 8 hours',
    'Every 6 hours',
    'Every 4 hours',
    'As needed',
    'At bedtime'
  ];

  const durations = [
    '7 days',
    '10 days',
    '14 days',
    '30 days',
    '60 days',
    '90 days',
    '6 months',
    '1 year',
    'Ongoing'
  ];

  // Filter prescriptions based on active tab and search term
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      (activeTab === 'active' && prescription.status === 'Active') ||
      (activeTab === 'completed' && prescription.status === 'Completed') ||
      (activeTab === 'all');
    
    return matchesSearch && matchesTab;
  });

  const handleAddPrescription = (e) => {
    e.preventDefault();
    console.log('Adding prescription:', newPrescription);
    setShowAddModal(false);
    setNewPrescription({
      patientId: '',
      patientName: '',
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      refills: '0'
    });
  };

  const handleRefill = (prescriptionId) => {
    console.log('Refilling prescription:', prescriptionId);
  };

  const handleCancel = (prescriptionId) => {
    console.log('Canceling prescription:', prescriptionId);
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
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600">Manage patient prescriptions and medication orders</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiActivity} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refills Due</p>
              <p className="text-2xl font-bold text-warning-600">
                {prescriptions.filter(p => p.status === 'Active' && p.refillsRemaining > 0).length}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiRefreshCw} className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-danger-600">3</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiClock} className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-600">
                {prescriptions.filter(p => p.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiCheckCircle} className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'active'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'completed'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
          </div>
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SafeIcon icon={FiIcons.FiFileText} className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'active'
                  ? 'No active prescriptions match your search.'
                  : activeTab === 'completed'
                  ? 'No completed prescriptions match your search.'
                  : 'No prescriptions match your search criteria.'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiRefreshCw} className="w-4 h-4" />
                <span>Clear Search</span>
              </button>
            </div>
          </Card>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{prescription.medication} {prescription.dosage}</h3>
                      <p className="text-sm text-gray-600">Patient: {prescription.patientName} (ID: {prescription.patientId})</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      prescription.status === 'Active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prescription.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Frequency</p>
                      <p className="font-medium">{prescription.frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{prescription.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{prescription.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Refills</p>
                      <p className="font-medium">{prescription.refillsRemaining} of {prescription.refills}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Instructions</p>
                    <p className="text-sm">{prescription.instructions}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    Prescribed by {prescription.prescribedBy}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                  {prescription.status === 'Active' && (
                    <>
                      <button
                        onClick={() => handleRefill(prescription.id)}
                        disabled={prescription.refillsRemaining === 0}
                        className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Refill
                      </button>
                      <button
                        onClick={() => handleCancel(prescription.id)}
                        className="px-3 py-1 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    Print
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Prescription Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="New Prescription"
        size="lg"
      >
        <form onSubmit={handleAddPrescription} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID *
              </label>
              <input
                type="text"
                value={newPrescription.patientId}
                onChange={(e) => setNewPrescription({...newPrescription, patientId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                value={newPrescription.patientName}
                onChange={(e) => setNewPrescription({...newPrescription, patientName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication *
              </label>
              <select
                value={newPrescription.medication}
                onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Medication</option>
                {medications.map(med => (
                  <option key={med.id} value={med.name}>{med.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                value={newPrescription.frequency}
                onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Frequency</option>
                {frequencies.map((freq, index) => (
                  <option key={index} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <select
                value={newPrescription.duration}
                onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Duration</option>
                {durations.map((duration, index) => (
                  <option key={index} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refills
              </label>
              <input
                type="number"
                min="0"
                max="12"
                value={newPrescription.refills}
                onChange={(e) => setNewPrescription({...newPrescription, refills: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              value={newPrescription.instructions}
              onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Special instructions for the patient..."
              required
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
              Create Prescription
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Prescriptions;