import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const LabResults = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [newLabOrder, setNewLabOrder] = useState({
    patientId: '',
    patientName: '',
    tests: [],
    priority: 'Routine',
    notes: ''
  });

  // Sample data for lab tests
  const labTests = [
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 'P001',
      orderedBy: 'Dr. Smith',
      orderedDate: '2024-01-18',
      status: 'Completed',
      priority: 'Routine',
      tests: [
        {
          name: 'Complete Blood Count',
          code: 'CBC',
          status: 'Completed',
          results: {
            WBC: { value: '7.2', unit: '10³/µL', range: '4.5-11.0', flag: 'Normal' },
            RBC: { value: '4.8', unit: '10⁶/µL', range: '4.5-5.5', flag: 'Normal' },
            Hemoglobin: { value: '14.2', unit: 'g/dL', range: '13.5-17.5', flag: 'Normal' },
            Hematocrit: { value: '42', unit: '%', range: '41-50', flag: 'Normal' },
            Platelets: { value: '250', unit: '10³/µL', range: '150-450', flag: 'Normal' }
          }
        },
        {
          name: 'Basic Metabolic Panel',
          code: 'BMP',
          status: 'Completed',
          results: {
            Sodium: { value: '140', unit: 'mEq/L', range: '136-145', flag: 'Normal' },
            Potassium: { value: '4.0', unit: 'mEq/L', range: '3.5-5.0', flag: 'Normal' },
            Chloride: { value: '101', unit: 'mEq/L', range: '98-107', flag: 'Normal' },
            CO2: { value: '24', unit: 'mEq/L', range: '23-29', flag: 'Normal' },
            BUN: { value: '18', unit: 'mg/dL', range: '7-20', flag: 'Normal' },
            Creatinine: { value: '0.9', unit: 'mg/dL', range: '0.6-1.2', flag: 'Normal' },
            Glucose: { value: '95', unit: 'mg/dL', range: '70-99', flag: 'Normal' }
          }
        }
      ]
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 'P002',
      orderedBy: 'Dr. Johnson',
      orderedDate: '2024-01-19',
      status: 'Pending',
      priority: 'Urgent',
      tests: [
        {
          name: 'Lipid Panel',
          code: 'LIPID',
          status: 'Pending',
          results: null
        }
      ]
    },
    {
      id: 3,
      patientName: 'Bob Wilson',
      patientId: 'P003',
      orderedBy: 'Dr. Brown',
      orderedDate: '2024-01-17',
      status: 'In Progress',
      priority: 'Routine',
      tests: [
        {
          name: 'Comprehensive Metabolic Panel',
          code: 'CMP',
          status: 'In Progress',
          results: null
        },
        {
          name: 'Thyroid Panel',
          code: 'THYROID',
          status: 'In Progress',
          results: null
        }
      ]
    },
    {
      id: 4,
      patientName: 'John Doe',
      patientId: 'P001',
      orderedBy: 'Dr. Smith',
      orderedDate: '2024-01-15',
      status: 'Completed',
      priority: 'Routine',
      tests: [
        {
          name: 'Hemoglobin A1C',
          code: 'HBA1C',
          status: 'Completed',
          results: {
            'Hemoglobin A1C': { value: '5.7', unit: '%', range: '4.0-5.6', flag: 'High' }
          }
        }
      ]
    }
  ];

  // Sample patients
  const patients = [
    { id: 'P001', name: 'John Doe' },
    { id: 'P002', name: 'Jane Smith' },
    { id: 'P003', name: 'Bob Wilson' }
  ];

  // Sample test options
  const testOptions = [
    { code: 'CBC', name: 'Complete Blood Count' },
    { code: 'BMP', name: 'Basic Metabolic Panel' },
    { code: 'CMP', name: 'Comprehensive Metabolic Panel' },
    { code: 'LIPID', name: 'Lipid Panel' },
    { code: 'THYROID', name: 'Thyroid Panel' },
    { code: 'HBA1C', name: 'Hemoglobin A1C' },
    { code: 'LFT', name: 'Liver Function Tests' },
    { code: 'UA', name: 'Urinalysis' }
  ];

  // Filter lab tests based on active tab and search term
  const filteredLabTests = labTests.filter(test => {
    const matchesSearch = 
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      test.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.tests.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = 
      (activeTab === 'pending' && (test.status === 'Pending' || test.status === 'In Progress')) ||
      (activeTab === 'completed' && test.status === 'Completed') ||
      activeTab === 'all';
    
    return matchesSearch && matchesTab;
  });

  const handleAddLabOrder = (e) => {
    e.preventDefault();
    console.log('Adding lab order:', newLabOrder);
    setShowAddModal(false);
    setNewLabOrder({
      patientId: '',
      patientName: '',
      tests: [],
      priority: 'Routine',
      notes: ''
    });
  };

  const handleViewResults = (test) => {
    setSelectedTest(test);
    setShowResultsModal(true);
  };

  const handleToggleTest = (testCode) => {
    setNewLabOrder(prev => {
      if (prev.tests.includes(testCode)) {
        return { ...prev, tests: prev.tests.filter(t => t !== testCode) };
      } else {
        return { ...prev, tests: [...prev.tests, testCode] };
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-danger-100 text-danger-800';
      case 'routine': return 'bg-blue-100 text-blue-800';
      case 'stat': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultFlagColor = (flag) => {
    switch (flag.toLowerCase()) {
      case 'high': return 'text-danger-800';
      case 'low': return 'text-warning-800';
      case 'normal': return 'text-success-800';
      default: return 'text-gray-800';
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
          <p className="text-gray-600">Track and manage laboratory tests and results</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5" />
          <span>Order Lab Test</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Tests</p>
              <p className="text-2xl font-bold text-warning-600">
                {labTests.filter(test => test.status === 'Pending').length}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiClock} className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {labTests.filter(test => test.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiActivity} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-success-600">
                {labTests.filter(test => test.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiCheckCircle} className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'pending'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending & In Progress
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
              placeholder="Search lab tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Lab Tests List */}
      <div className="space-y-4">
        {filteredLabTests.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SafeIcon icon={FiIcons.FiActivity} className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Tests Found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'pending'
                  ? 'No pending or in progress lab tests match your search.'
                  : activeTab === 'completed'
                  ? 'No completed lab tests match your search.'
                  : 'No lab tests match your search criteria.'}
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
          filteredLabTests.map((test) => (
            <Card key={test.id}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{test.patientName}</h3>
                      <p className="text-sm text-gray-600">
                        Patient ID: {test.patientId} • Ordered by: {test.orderedBy}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(test.priority)}`}>
                        {test.priority}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tests</h4>
                    <div className="flex flex-wrap gap-2">
                      {test.tests.map((labTest, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
                            labTest.status === 'Completed'
                              ? 'bg-success-100 text-success-800'
                              : labTest.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-warning-100 text-warning-800'
                          }`}
                        >
                          <span>{labTest.name}</span>
                          {labTest.status === 'Completed' && (
                            <SafeIcon icon={FiIcons.FiCheckCircle} className="w-4 h-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    Ordered: {test.orderedDate}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                  {test.status === 'Completed' && (
                    <button
                      onClick={() => handleViewResults(test)}
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      View Results
                    </button>
                  )}
                  {test.status === 'Pending' && (
                    <button
                      className="px-3 py-1 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors text-sm"
                    >
                      Process
                    </button>
                  )}
                  <button
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Print
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Order Lab Test Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Order Lab Test"
        size="lg"
      >
        <form onSubmit={handleAddLabOrder} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                value={newLabOrder.patientId}
                onChange={(e) => {
                  const patient = patients.find(p => p.id === e.target.value);
                  setNewLabOrder({
                    ...newLabOrder,
                    patientId: e.target.value,
                    patientName: patient ? patient.name : ''
                  });
                }}
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
                Priority
              </label>
              <select
                value={newLabOrder.priority}
                onChange={(e) => setNewLabOrder({...newLabOrder, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="STAT">STAT (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tests *
            </label>
            <div className="border border-gray-300 rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
              {testOptions.map((test, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`test-${test.code}`}
                    checked={newLabOrder.tests.includes(test.code)}
                    onChange={() => handleToggleTest(test.code)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor={`test-${test.code}`} className="text-sm text-gray-700">
                    {test.name} ({test.code})
                  </label>
                </div>
              ))}
            </div>
            {newLabOrder.tests.length === 0 && (
              <p className="text-xs text-danger-800 mt-1">Please select at least one test</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={newLabOrder.notes}
              onChange={(e) => setNewLabOrder({...newLabOrder, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional instructions or clinical information..."
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
              disabled={newLabOrder.tests.length === 0}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Order Tests
            </button>
          </div>
        </form>
      </Modal>

      {/* View Results Modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        title="Lab Results"
        size="lg"
      >
        {selectedTest && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">
                  Patient: <span className="font-medium">{selectedTest.patientName}</span> (ID: {selectedTest.patientId})
                </p>
                <p className="text-sm text-gray-600">
                  Ordered by: <span className="font-medium">{selectedTest.orderedBy}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date: <span className="font-medium">{selectedTest.orderedDate}</span>
                </p>
              </div>
              <div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTest.status)}`}>
                  {selectedTest.status}
                </span>
              </div>
            </div>

            {selectedTest.tests.map((test, testIndex) => (
              <div key={testIndex} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b p-4">
                  <h3 className="font-medium text-gray-900">{test.name} ({test.code})</h3>
                </div>
                {test.results ? (
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Test</th>
                          <th className="text-left py-2 px-4">Result</th>
                          <th className="text-left py-2 px-4">Unit</th>
                          <th className="text-left py-2 px-4">Reference Range</th>
                          <th className="text-left py-2 px-4">Flag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(test.results).map(([name, result], index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-4">{name}</td>
                            <td className="py-2 px-4 font-medium">{result.value}</td>
                            <td className="py-2 px-4">{result.unit}</td>
                            <td className="py-2 px-4">{result.range}</td>
                            <td className={`py-2 px-4 font-medium ${getResultFlagColor(result.flag)}`}>
                              {result.flag}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Results not yet available
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowResultsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log('Printing results for test:', selectedTest.id);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiIcons.FiPrinter} className="w-4 h-4" />
                  <span>Print</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default LabResults;