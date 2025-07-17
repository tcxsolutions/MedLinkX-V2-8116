import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { usePractice } from '../../contexts/PracticeContext';
import { useNavigate } from 'react-router-dom';

const PracticeSetupForm = () => {
  const { practiceSettings, savePracticeSettings } = usePractice();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      practice_name: practiceSettings?.practice_name || '',
      practice_type: practiceSettings?.practice_type || 'individual',
      address: practiceSettings?.address || '',
      phone: practiceSettings?.phone || '',
      email: practiceSettings?.email || ''
    }
  });
  
  const selectedPracticeType = watch('practice_type');
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Saving practice settings:", data);
      
      const result = await savePracticeSettings(data);
      
      console.log("Save result:", result);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        console.error("Error saving practice settings:", result.error);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiIcons.FiActivity} className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MedLink EHR</h1>
            <p className="text-gray-600">
              {practiceSettings
                ? 'Update your practice settings'
                : 'Complete your practice setup to get started'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Practice Name *
              </label>
              <input
                type="text"
                {...register('practice_name', { required: 'Practice name is required' })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.practice_name && (
                <p className="mt-1 text-sm text-red-600">{errors.practice_name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Practice Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type="radio"
                    id="individual"
                    value="individual"
                    {...register('practice_type', { required: 'Practice type is required' })}
                    className="sr-only"
                  />
                  <label
                    htmlFor="individual"
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      selectedPracticeType === 'individual'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedPracticeType === 'individual' ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      >
                        <SafeIcon
                          icon={FiIcons.FiUser}
                          className={`w-6 h-6 ${
                            selectedPracticeType === 'individual' ? 'text-white' : 'text-gray-500'
                          }`}
                        />
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-center">Individual Doctor</h3>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Solo practitioner with simplified patient management
                    </p>
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="radio"
                    id="family_practice"
                    value="family_practice"
                    {...register('practice_type')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="family_practice"
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      selectedPracticeType === 'family_practice'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedPracticeType === 'family_practice' ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      >
                        <SafeIcon
                          icon={FiIcons.FiUsers}
                          className={`w-6 h-6 ${
                            selectedPracticeType === 'family_practice' ? 'text-white' : 'text-gray-500'
                          }`}
                        />
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-center">Family Practice</h3>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Multi-provider clinic with family-focused care
                    </p>
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="radio"
                    id="hospital"
                    value="hospital"
                    {...register('practice_type')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="hospital"
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      selectedPracticeType === 'hospital'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedPracticeType === 'hospital' ? 'bg-purple-500' : 'bg-gray-200'
                        }`}
                      >
                        <SafeIcon
                          icon={FiIcons.FiActivity}
                          className={`w-6 h-6 ${
                            selectedPracticeType === 'hospital' ? 'text-white' : 'text-gray-500'
                          }`}
                        />
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-center">Hospital</h3>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Full-featured system for hospital departments
                    </p>
                  </label>
                </div>
              </div>
              {errors.practice_type && (
                <p className="mt-1 text-sm text-red-600">{errors.practice_type.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                {...register('address')}
                rows="3"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                * Required fields
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5" />
                    <span>{practiceSettings ? 'Update Settings' : 'Complete Setup'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PracticeSetupForm;