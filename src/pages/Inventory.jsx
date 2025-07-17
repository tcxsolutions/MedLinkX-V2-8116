import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPackage, FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiAlertTriangle, FiTrendingDown } = FiIcons;

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    unitPrice: '',
    supplier: '',
    expiryDate: '',
    location: '',
    notes: ''
  });

  const inventoryItems = [
    {
      id: 1,
      name: 'Surgical Gloves',
      category: 'Medical Supplies',
      quantity: 500,
      unitPrice: 0.75,
      supplier: 'MedSupply Co',
      expiryDate: '2025-06-15',
      location: 'Storage Room A',
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Examination Table Paper',
      category: 'Medical Supplies',
      quantity: 20,
      unitPrice: 15.50,
      supplier: 'MedEquip Inc',
      expiryDate: null,
      location: 'Storage Room B',
      status: 'Low Stock'
    },
    {
      id: 3,
      name: 'Syringe 10ml',
      category: 'Medical Supplies',
      quantity: 0,
      unitPrice: 0.35,
      supplier: 'MedSupply Co',
      expiryDate: '2024-08-20',
      location: 'Storage Room A',
      status: 'Out of Stock'
    },
    {
      id: 4,
      name: 'Blood Pressure Monitor',
      category: 'Equipment',
      quantity: 8,
      unitPrice: 65.00,
      supplier: 'MedEquip Inc',
      expiryDate: null,
      location: 'Equipment Room',
      status: 'In Stock'
    },
    {
      id: 5,
      name: 'Hand Sanitizer',
      category: 'Hygiene',
      quantity: 15,
      unitPrice: 4.25,
      supplier: 'CleanCare Ltd',
      expiryDate: '2025-03-10',
      location: 'Storage Room C',
      status: 'In Stock'
    }
  ];

  const categories = ['Medical Supplies', 'Equipment', 'Hygiene', 'Office Supplies', 'Medications'];
  
  const suppliers = ['MedSupply Co', 'MedEquip Inc', 'CleanCare Ltd', 'Office Solutions', 'PharmaDist'];
  
  const locations = ['Storage Room A', 'Storage Room B', 'Storage Room C', 'Equipment Room', 'Pharmacy Storage'];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'bg-success-100 text-success-800';
      case 'low stock': return 'bg-warning-100 text-warning-800';
      case 'out of stock': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    console.log('Adding inventory item:', newItem);
    setShowAddModal(false);
    setNewItem({
      name: '',
      category: '',
      quantity: '',
      unitPrice: '',
      supplier: '',
      expiryDate: '',
      location: '',
      notes: ''
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage supplies, equipment, and stock levels</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <SafeIcon icon={FiPackage} className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-warning-600">
                {inventoryItems.filter(i => i.status === 'Low Stock').length}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <SafeIcon icon={FiTrendingDown} className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-danger-600">
                {inventoryItems.filter(i => i.status === 'Out of Stock').length}
              </p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${inventoryItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <SafeIcon icon={FiPackage} className="w-6 h-6 text-success-600" />
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
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {filteredItems.length} items
            </span>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card title="Inventory Items">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Item Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Quantity</th>
                <th className="text-left py-3 px-4">Unit Price</th>
                <th className="text-left py-3 px-4">Supplier</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{item.name}</p>
                  </td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${
                      item.quantity === 0 ? 'text-danger-600' :
                      item.quantity < 30 ? 'text-warning-600' :
                      'text-success-600'
                    }`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">{item.supplier}</td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-primary-600">
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-danger-600">
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

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Inventory Item"
        size="lg"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
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
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({...newItem, unitPrice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier *
              </label>
              <select
                value={newItem.supplier}
                onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                value={newItem.location}
                onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={newItem.expiryDate}
                onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={newItem.notes}
              onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional information about this item..."
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
              Add Item
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Inventory;