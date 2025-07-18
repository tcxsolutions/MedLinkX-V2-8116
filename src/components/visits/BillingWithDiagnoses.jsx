import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { getBillingItemsWithDiagnoses, createInvoice } from '../../services/billingService';
import { toast } from 'react-toastify';

const BillingWithDiagnoses = ({ visitId, patientId, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingItems, setBillingItems] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insurancePercentage, setInsurancePercentage] = useState(80);
  const [notes, setNotes] = useState('');

  // Load billing items and diagnoses
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const result = await getBillingItemsWithDiagnoses(visitId);
      
      if (result.success) {
        setBillingItems(result.data.billingItems);
        setDiagnoses(result.data.diagnoses);
      } else {
        toast.error('Failed to load billing data');
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [visitId]);

  // Calculate totals
  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const insuranceAmount = (totalAmount * insurancePercentage) / 100;
  const patientAmount = totalAmount - insuranceAmount;

  // Handle adding an item
  const handleAddItem = (item) => {
    // Check if already added
    const existingIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Update quantity if already added
      const updatedItems = [...selectedItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + 1
      };
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      setSelectedItems([
        ...selectedItems,
        {
          id: item.id,
          name: item.name,
          code: item.code,
          price: item.price,
          quantity: 1,
          diagnosticCodeId: null
        }
      ]);
    }
  };

  // Handle removing an item
  const handleRemoveItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  // Handle quantity change
  const handleQuantityChange = (index, value) => {
    const quantity = parseInt(value, 10);
    if (isNaN(quantity) || quantity < 1) return;
    
    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity
    };
    setSelectedItems(updatedItems);
  };

  // Handle diagnostic code change
  const handleDiagnosisChange = (index, diagnosticCodeId) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      diagnosticCodeId
    };
    setSelectedItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createInvoice({
        patientId,
        visitId,
        items: selectedItems,
        insuranceAmount,
        patientAmount,
        notes,
        createdBy: 'Current User'
      });
      
      if (result.success) {
        toast.success('Invoice created successfully');
        onSuccess(result.data);
      } else {
        toast.error('Failed to create invoice');
      }
    } catch (error) {
      toast.error('An error occurred while creating the invoice');
      console.error('Invoice creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and group billing items by category
  const groupedBillingItems = billingItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Create Invoice</h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Items */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Available Services & Procedures</h4>
            
            <div className="space-y-4">
              {Object.entries(groupedBillingItems).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">{category}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {items.map(item => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.code}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => handleAddItem(item)}
                            className="p-1 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200"
                          >
                            <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected Items */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Selected Items</h4>
            
            {selectedItems.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No items selected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedItems.map((item, index) => (
                  <div 
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.code}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <SafeIcon icon={FiIcons.FiX} className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-300 rounded-md">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-300 rounded-md font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Diagnostic Code Selector */}
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Diagnostic Code
                      </label>
                      <select
                        value={item.diagnosticCodeId || ''}
                        onChange={(e) => handleDiagnosisChange(index, e.target.value || null)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      >
                        <option value="">Select a diagnostic code</option>
                        {diagnoses.map(diagnosis => (
                          <option key={diagnosis.id} value={diagnosis.diagnostic_code_id}>
                            {diagnosis.diagnostic_code.code} - {diagnosis.diagnostic_code.description}
                            {diagnosis.primary ? ' (Primary)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Insurance and Patient Responsibility */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Insurance & Payment</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Coverage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={insurancePercentage}
                  onChange={(e) => setInsurancePercentage(Math.min(100, Math.max(0, parseInt(e.target.value || 0, 10))))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium">
                    ${totalAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Pays
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium">
                    ${insuranceAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Responsibility
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium">
                    ${patientAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Additional notes or instructions..."
            />
          </div>
          
          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              disabled={isSubmitting || selectedItems.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiIcons.FiDollarSign} className="w-4 h-4" />
                  <span>Create Invoice</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BillingWithDiagnoses;