import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiDollarSign, FiPlus, FiSearch, FiDownload, FiSend, 
  FiClock, FiCheckCircle, FiXCircle, FiAlertCircle 
} = FiIcons;

const Billing = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInvoice, setNewInvoice] = useState({
    patientId: '',
    patientName: '',
    services: [],
    insuranceProvider: '',
    insurancePolicyNumber: '',
    notes: ''
  });

  const invoices = [
    {
      id: 'INV-001',
      patientName: 'John Doe',
      patientId: 'P001',
      amount: 1250.00,
      insuranceAmount: 1000.00,
      patientAmount: 250.00,
      status: 'Paid',
      date: '2024-01-18',
      dueDate: '2024-02-18',
      services: ['Consultation', 'Lab Tests', 'X-Ray'],
      insuranceProvider: 'Blue Cross',
      claimNumber: 'CLM-2024-001'
    },
    {
      id: 'INV-002',
      patientName: 'Jane Smith',
      patientId: 'P002',
      amount: 850.00,
      insuranceAmount: 680.00,
      patientAmount: 170.00,
      status: 'Pending',
      date: '2024-01-17',
      dueDate: '2024-02-17',
      services: ['Annual Check-up', 'Blood Work'],
      insuranceProvider: 'Aetna',
      claimNumber: 'CLM-2024-002'
    },
    {
      id: 'INV-003',
      patientName: 'Bob Wilson',
      patientId: 'P003',
      amount: 3200.00,
      insuranceAmount: 2560.00,
      patientAmount: 640.00,
      status: 'Overdue',
      date: '2024-01-10',
      dueDate: '2024-02-10',
      services: ['Surgery', 'Anesthesia', 'Recovery'],
      insuranceProvider: 'Medicare',
      claimNumber: 'CLM-2024-003'
    }
  ];

  const claims = [
    {
      id: 'CLM-2024-001',
      patientName: 'John Doe',
      insuranceProvider: 'Blue Cross',
      amount: 1000.00,
      status: 'Approved',
      submittedDate: '2024-01-18',
      processedDate: '2024-01-20',
      services: ['Consultation', 'Lab Tests']
    },
    {
      id: 'CLM-2024-002',
      patientName: 'Jane Smith',
      insuranceProvider: 'Aetna',
      amount: 680.00,
      status: 'Processing',
      submittedDate: '2024-01-17',
      processedDate: null,
      services: ['Annual Check-up']
    },
    {
      id: 'CLM-2024-003',
      patientName: 'Bob Wilson',
      insuranceProvider: 'Medicare',
      amount: 2560.00,
      status: 'Denied',
      submittedDate: '2024-01-10',
      processedDate: '2024-01-15',
      services: ['Surgery'],
      denialReason: 'Pre-authorization required'
    }
  ];

  const payments = [
    {
      id: 'PAY-001',
      invoiceId: 'INV-001',
      patientName: 'John Doe',
      amount: 250.00,
      method: 'Credit Card',
      status: 'Completed',
      date: '2024-01-19',
      reference: 'TXN-12345'
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-002',
      patientName: 'Jane Smith',
      amount: 170.00,
      method: 'Insurance',
      status: 'Pending',
      date: '2024-01-18',
      reference: 'INS-67890'
    }
  ];

  const servicesCatalog = [
    { code: 'CONS001', name: 'General Consultation', price: 150.00 },
    { code: 'LAB001', name: 'Basic Blood Panel', price: 85.00 },
    { code: 'XRAY001', name: 'Chest X-Ray', price: 120.00 },
    { code: 'SURG001', name: 'Minor Surgery', price: 1500.00 },
    { code: 'ANES001', name: 'Local Anesthesia', price: 200.00 }
  ];

  const tabs = [
    { id: 'invoices', label: 'Invoices', icon: FiDollarSign },
    { id: 'claims', label: 'Insurance Claims', icon: FiSend },
    { id: 'payments', label: 'Payments', icon: FiCheckCircle }
  ];

  const filteredInvoices = invoices.filter(invoice =>
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'overdue': return 'bg-danger-100 text-danger-800';
      case 'approved': return 'bg-success-100 text-success-800';
      case 'processing': return 'bg-warning-100 text-warning-800';
      case 'denied': return 'bg-danger-100 text-danger-800';
      case 'completed': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    console.log('Creating invoice:', newInvoice);
    setShowCreateModal(false);
    setNewInvoice({
      patientId: '',
      patientName: '',
      services: [],
      insuranceProvider: '',
      insurancePolicyNumber: '',
      notes: ''
    });
  };

  const addService = (service) => {
    setNewInvoice(prev => ({
      ...prev,
      services: [...prev.services, service]
    }));
  };

  const removeService = (index) => {
    setNewInvoice(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const totalAmount = newInvoice.services.reduce((sum, service) => sum + service.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Accounts</h1>
          <p className="text-gray-600">Manage invoices, insurance claims, and payments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$125,430</p>
              <p className="text-sm text-success-600">+12% from last month</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Claims</p>
              <p className="text-2xl font-bold text-warning-600">
                {claims.filter(c => c.status === 'Processing').length}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Invoices</p>
              <p className="text-2xl font-bold text-danger-600">
                {invoices.filter(i => i.status === 'Overdue').length}
              </p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <SafeIcon icon={FiAlertCircle} className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Collection Rate</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <SafeIcon icon={FiCheckCircle} className="w-6 h-6 text-primary-600" />
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
        {activeTab === 'invoices' && (
          <>
            {/* Search */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </Card>

            {/* Invoices List */}
            <Card title="Invoices">
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{invoice.id}</h4>
                        <p className="text-sm text-gray-600">{invoice.patientName} • {invoice.patientId}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-semibold text-lg">${invoice.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Insurance</p>
                        <p className="font-medium">${invoice.insuranceAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Patient Responsibility</p>
                        <p className="font-medium">${invoice.patientAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {invoice.services.map((service, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        <p>Date: {invoice.date} • Due: {invoice.dueDate}</p>
                        <p>Insurance: {invoice.insuranceProvider}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                          View
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === 'claims' && (
          <Card title="Insurance Claims">
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{claim.id}</h4>
                      <p className="text-sm text-gray-600">{claim.patientName}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Insurance Provider</p>
                      <p className="font-medium">{claim.insuranceProvider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Claim Amount</p>
                      <p className="font-medium">${claim.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted Date</p>
                      <p className="font-medium">{claim.submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Processed Date</p>
                      <p className="font-medium">{claim.processedDate || 'Pending'}</p>
                    </div>
                  </div>

                  {claim.denialReason && (
                    <div className="p-3 bg-danger-50 rounded-lg mb-4">
                      <p className="text-sm font-medium text-danger-800">Denial Reason:</p>
                      <p className="text-sm text-danger-700">{claim.denialReason}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {claim.services.map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <button className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                      View Details
                    </button>
                    {claim.status === 'Denied' && (
                      <button className="px-3 py-1 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors text-sm">
                        Resubmit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card title="Payments">
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{payment.id}</h4>
                      <p className="text-sm text-gray-600">{payment.patientName}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-lg">${payment.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">{payment.method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{payment.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reference</p>
                      <p className="font-medium">{payment.reference}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Invoice"
        size="xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID *
              </label>
              <input
                type="text"
                value={newInvoice.patientId}
                onChange={(e) => setNewInvoice({...newInvoice, patientId: e.target.value})}
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
                value={newInvoice.patientName}
                onChange={(e) => setNewInvoice({...newInvoice, patientName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Provider
              </label>
              <input
                type="text"
                value={newInvoice.insuranceProvider}
                onChange={(e) => setNewInvoice({...newInvoice, insuranceProvider: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Number
              </label>
              <input
                type="text"
                value={newInvoice.insurancePolicyNumber}
                onChange={(e) => setNewInvoice({...newInvoice, insurancePolicyNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {servicesCatalog.map((service) => (
                  <div key={service.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.code}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">${service.price.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => addService(service)}
                        className="px-2 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Services */}
              {newInvoice.services.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Selected Services</h4>
                  <div className="space-y-2">
                    {newInvoice.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-primary-50 rounded">
                        <span>{service.name}</span>
                        <div className="flex items-center space-x-2">
                          <span>${service.price.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="text-danger-600 hover:text-danger-700"
                          >
                            <SafeIcon icon={FiXCircle} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={newInvoice.notes}
              onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional notes or instructions..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Billing;