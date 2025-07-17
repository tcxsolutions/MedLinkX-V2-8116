import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { uploadOrganizationLogo } from '../../utils/importExportService';
import { useOrganization } from '../../contexts/OrganizationContext';

const OrganizationLogo = () => {
  const { selectedOrganization } = useOrganization();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewLogo, setPreviewLogo] = useState(null);
  
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setError('');
      setSuccess('');
      
      const result = await uploadOrganizationLogo(file, selectedOrganization.id);
      
      if (!result.success) {
        setError(result.error);
        return;
      }
      
      setSuccess('Logo uploaded successfully!');
      setPreviewLogo(result.logoUrl);
      
      // In a real implementation, we would refresh the organization data
      // For demo purposes, we'll just show the success message
    } catch (err) {
      setError('Error uploading logo: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  if (!selectedOrganization) return null;
  
  // Use preview logo if available, otherwise use the organization's logo
  const logoUrl = previewLogo || selectedOrganization.logoUrl;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Logo</h3>
      
      <div className="flex flex-col items-center mb-4">
        {logoUrl ? (
          <div className="w-32 h-32 rounded-lg overflow-hidden mb-4 border border-gray-200">
            <img 
              src={logoUrl} 
              alt={selectedOrganization.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
            <SafeIcon
              icon={selectedOrganization.type === 'hospital' ? FiIcons.FiActivity : FiIcons.FiHeart}
              className="w-12 h-12 text-primary-600"
            />
          </div>
        )}
        
        <label className="relative cursor-pointer">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiIcons.FiUpload} className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Logo'}</span>
          </motion.div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoChange}
            disabled={isUploading}
          />
        </label>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p className="font-medium mb-1">Logo requirements:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>File types: JPEG, PNG, WebP</li>
          <li>Size: Maximum 2MB</li>
          <li>Dimensions: Between 100x100px and 1000x1000px</li>
          <li>Recommended: Square format with transparent background</li>
        </ul>
      </div>
    </div>
  );
};

export default OrganizationLogo;