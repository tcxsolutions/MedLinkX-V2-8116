import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMedication, setNewMedication] = useState({
    name: '',
    genericName: '',
    dosage: '',
    form: '',
    manufacturer: '',
    quantity: '',
    unitPrice: '',
    expiryDate: '',
    batchNumber: '',
    supplier: ''
  });

  const medications = [
    {
      id: 1,
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      form: 'Tablet',
      manufacturer: 'Pfizer',
      quantity: 150,
      unitPrice: 2.50,
      expiryDate: '2025-06-15',
      batchNumber: 'LIS001',
      supplier: 'MedSupply Co',
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Metformin',
      genericName: 'Metformin HCl',
      dosage: '500mg',
      form: 'Tablet',
      manufacturer: 'Teva',
      quantity: 25,
      unitPrice: 1.75,
      expiryDate: '2024-12-30',
      batchNumber: 'MET002',
      supplier: 'PharmaDist',
      status: 'Low Stock'
    },
    {
      id: 3,
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      dosage: '250mg',
      form: 'Capsule',
      manufacturer: 'GSK',
      quantity: 0,
      unitPrice: 3.25,
      expiryDate: '2024-08-20',
      batchNumber: 'AMX003',
      supplier: 'MedSupply Co',
      status: 'Out of Stock'
    },
    {
      id: 4,
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      dosage: '81mg',
      form: 'Tablet',
      manufacturer: 'Bayer',
      quantity: 300,
      unitPrice: 0.75,
      expiryDate: '2025-03-10',
      batchNumber: 'ASP004',
      supplier: 'PharmaDist',
      status: 'In Stock'
    }
  ];

  const prescriptions = [
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 'P001',
      medication: 'Lisinopril 10mg',
      quantity: 30,
      dosage: 'Once daily',
      prescribedBy: 'Dr. Smith',
      prescribedDate: '2024-01-18',
      status: 'Pending',
      instructions: 'Take with food'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 'P002',
      medication: 'Metformin 500mg',
      quantity: 60,
      dosage: 'Twice daily',
      prescribedBy: 'Dr. Johnson',
      prescribedDate: '2024-01-17',
      status: 'Dispensed',
      instructions: 'Take with meals'
    },
    {
      id: 3,
      patientName: 'Bob Wilson',
      patientId: 'P003',
      medication: 'Amoxicillin 250mg',
      quantity: 21,
      dosage: 'Three times daily',
      prescribedBy: 'Dr. Brown',
      prescribedDate: '2024-01-16',
      status: 'Pending',
      instructions: 'Complete full course'
    }
  ];

  const interactions = [
    {
      id: 1,
      patientName: 'John Doe',
      medication1: 'Lisinopril',
      medication2: 'Ibuprofen',
      severity: 'Moderate',
      description: 'May reduce effectiveness of Lisinopril',
      recommendation: 'Monitor blood pressure closely'
    },
    {
      id: 2,
      patientName: 'Alice Brown',
      medication1: 'Warfarin',
      medication2: 'Aspirin',
      severity: 'High',
      description: 'Increased risk of bleeding',
      recommendation: 'Avoid combination or monitor INR frequently'
    }
  ];

  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: FiIcons.FiPackage },
    { id: 'prescriptions', label: 'Prescriptions', icon: FiIcons.FiFileText },
    { id: 'interactions', label: 'Drug Interactions', icon: FiIcons.FiAlertTriangle }
  ];

  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'bg-success-100 text-success-800';
      case 'low stock': return 'bg-warning-100 text-warning-800';
      case 'out of stock': return 'bg-danger-100 text-danger-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'dispensed': return 'bg-success-100 text-success-800';
      case 'cancelled': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-danger-100 text-danger-800';
      case 'moderate': return 'bg-warning-100 text-warning-800';
      case 'low': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    console.log('Adding medication:', newMedication);
    setShowAddModal(false);
    setNewMedication({
      name: '',
      genericName: '',
      dosage: '',
      form: '',
      manufacturer: '',
      quantity: '',
      unitPrice: '',
      expiryDate: '',
      batchNumber: '',
      supplier: ''
    });
  };

  const dispensePrescription = (id) => {
    console.log('Dispensing prescription:', id);
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
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy</h1>
          <p className="text-gray-600">Manage medications, prescriptions, and drug interactions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Medications</p>
              <p className="text-2xl font-bold text-gray-900">{medications.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiPackage} className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-warning-600">
                {medications.filter(m => m.status === 'Low Stock').length}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiTrendingDown} className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'Pending').length}
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiClock} className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drug Interactions</p>
              <p className="text-2xl font-bold text-danger-600">{interactions.length}</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'inventory' && (
          <>
            {/* Search */}
            <Card>
              <div className="relative">
                <SafeIcon
                  icon={FiIcons.FiSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                />
                <input
                  type="text"
                  placeholder="Search medications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </Card>

            {/* Inventory List */}
            <Card title="Medication Inventory">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Medication</th>
                      <th className="text-left py-3 px-4">Dosage</th>
                      <th className="text-left py-3 px-4">Form</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-left py-3 px-4">Unit Price</th>
                      <th className="text-left py-3 px-4">Expiry Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedications.map((medication) => (
                      <tr key={medication.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{medication.name}</p>
                            <p className="text-sm text-gray-500">{medication.genericName}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{medication.dosage}</td>
                        <td className="py-3 px-4">{medication.form}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-medium ${
                              medication.quantity === 0
                                ? 'text-danger-600'
                                : medication.quantity < 50
                                ? 'text-warning-600'
                                : 'text-success-600'
                            }`}
                          >
                            {medication.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4">${medication.unitPrice}</td>
                        <td className="py-3 px-4">{medication.expiryDate}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              medication.status
                            )}`}
                          >
                            {medication.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-primary-600 hover:text-primary-700 text-sm">
                              Edit
                            </button>
                            <button className="text-danger-600 hover:text-danger-700 text-sm">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'prescriptions' && (
          <Card title="Prescriptions">
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{prescription.patientName}</h4>
                      <p className="text-sm text-gray-500">ID: {prescription.patientId}</p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        prescription.status
                      )}`}
                    >
                      {prescription.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Medication:</p>
                      <p className="font-medium">{prescription.medication}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity:</p>
                      <p className="font-medium">{prescription.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dosage:</p>
                      <p className="font-medium">{prescription.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prescribed By:</p>
                      <p className="font-medium">{prescription.prescribedBy}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Instructions:</p>
                    <p className="text-sm text-gray-800">{prescription.instructions}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="text-sm text-gray-500">
                      Prescribed on {prescription.prescribedDate}
                    </p>
                    {prescription.status === 'Pending' && (
                      <button
                        onClick={() => dispensePrescription(prescription.id)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        Dispense
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'interactions' && (
          <Card title="Drug Interactions">
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{interaction.patientName}</h4>
                      <p className="text-sm text-gray-600">
                        {interaction.medication1} + {interaction.medication2}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                        interaction.severity
                      )}`}
                    >
                      {interaction.severity} Risk
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Description:</p>
                    <p className="text-sm text-gray-800">{interaction.description}</p>
                  </div>
                  <div className="p-3 bg-warning-50 rounded-lg">
                    <p className="text-sm font-medium text-warning-800">Recommendation:</p>
                    <p className="text-sm text-warning-700">{interaction.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Add Medication Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Medication"
        size="lg"
      >
        <form onSubmit={handleAddMedication} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication Name *
              </label>
              <input
                type="text"
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generic Name *
              </label>
              <input
                type="text"
                value={newMedication.genericName}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, genericName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 10mg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form *
              </label>
              <select
                value={newMedication.form}
                onChange={(e) => setNewMedication({ ...newMedication, form: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Form</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Liquid">Liquid</option>
                <option value="Injection">Injection</option>
                <option value="Cream">Cream</option>
                <option value="Drops">Drops</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                value={newMedication.manufacturer}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, manufacturer: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={newMedication.quantity}
                onChange={(e) => setNewMedication({ ...newMedication, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={newMedication.unitPrice}
                onChange={(e) => setNewMedication({ ...newMedication, unitPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="date"
                value={newMedication.expiryDate}
                onChange={(e) => setNewMedication({ ...newMedication, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number
              </label>
              <input
                type="text"
                value={newMedication.batchNumber}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, batchNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={newMedication.supplier}
                onChange={(e) => setNewMedication({ ...newMedication, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
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
              Add Medication
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Pharmacy;