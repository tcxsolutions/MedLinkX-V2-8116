import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useOrganization } from '../../contexts/OrganizationContext';
import { toast } from 'react-toastify';

const OrganizationForm = ({ onSuccess, onCancel }) => {
  const { createOrganization } = useOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'hospital',
    description: '',
    phone_main: '',
    email_main: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    address_country: 'USA'
  });

  const organizationTypes = [
    {
      id: 'individual',
      name: 'Individual Practice',
      description: 'Solo practitioner with simplified patient management',
      icon: 'FiUser',
      color: 'blue'
    },
    {
      id: 'family_practice',
      name: 'Family Practice',
      description: 'Multi-provider clinic with family-focused care',
      icon: 'FiUsers',
      color: 'green'
    },
    {
      id: 'hospital',
      name: 'Hospital System',
      description: 'Full-featured system for hospital departments',
      icon: 'FiActivity',
      color: 'purple'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createOrganization(formData);
      if (result.success) {
        toast.success('Organization created successfully!');
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        toast.error(result.error || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error('An error occurred while creating the organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Organization</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Organization Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {organizationTypes.map((type) => (
              <div key={type.id} className="relative">
                <input
                  type="radio"
                  id={type.id}
                  name="type"
                  value={type.id}
                  checked={formData.type === type.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor={type.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.type === type.id
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                      formData.type === type.id ? `bg-${type.color}-100` : 'bg-gray-100'
                    }`}>
                      <SafeIcon 
                        icon={FiIcons[type.icon]} 
                        className={`w-6 h-6 ${
                          formData.type === type.id ? `text-${type.color}-600` : 'text-gray-500'
                        }`} 
                      />
                    </div>
                    <h4 className="font-medium text-gray-900">{type.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Phone
            </label>
            <input
              type="tel"
              name="phone_main"
              value={formData.phone_main}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Email
          </label>
          <input
            type="email"
            name="email_main"
            value={formData.email_main}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Address Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Address</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="address_street"
                value={formData.address_street}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="address_city"
                  value={formData.address_city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="address_state"
                  value={formData.address_state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="address_zip"
                  value={formData.address_zip}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Create Organization</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default OrganizationForm;