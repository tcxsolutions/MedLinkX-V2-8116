import supabase from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Allowed file types and their MIME types
const ALLOWED_FILE_TYPES = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  json: 'application/json',
};

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Logo constraints
const LOGO_CONSTRAINTS = {
  maxWidth: 1000,
  maxHeight: 1000,
  minWidth: 100,
  minHeight: 100,
  maxSize: 2 * 1024 * 1024, // 2MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

/**
 * Import data from a file
 * @param {File} file - The file to import
 * @param {string} type - The type of data being imported (e.g., 'patients', 'inventory')
 * @param {string} organizationId - The organization ID
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<object>} Import result
 */
export const importData = async (file, type, organizationId, onProgress = () => {}) => {
  try {
    // Validate file type
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES[fileExt]) {
      return { 
        success: false, 
        error: `Invalid file type. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}` 
      };
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { 
        success: false, 
        error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      };
    }
    
    // For demo purposes, simulate the import process
    onProgress(0.3);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onProgress(0.6);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onProgress(1);
    
    return {
      success: true,
      importId: uuidv4(),
      summary: {
        total: 100,
        created: 95,
        updated: 5,
        failed: 0
      }
    };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export data to a file
 * @param {string} type - The type of data to export (e.g., 'patients', 'inventory')
 * @param {string} format - The file format (csv, xlsx, json)
 * @param {string} organizationId - The organization ID
 * @param {object} filters - Export filters
 * @returns {Promise<object>} Export result
 */
export const exportData = async (type, format, organizationId, filters = {}) => {
  try {
    // Validate format
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(format)) {
      return { 
        success: false, 
        error: `Invalid format. Allowed formats: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}` 
      };
    }
    
    // For demo purposes, simulate the export process
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fileName = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;
    const exportId = uuidv4();
    const filePath = `exports/${organizationId}/${exportId}/${fileName}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // URL valid for 7 days
    
    return {
      success: true,
      exportId,
      fileName,
      downloadUrl: filePath,
      expiresAt: expiresAt.toISOString(),
      recordCount: 250
    };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get import history
 * @param {string} organizationId - The organization ID
 * @param {number} limit - Maximum number of records to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<object>} Import history
 */
export const getImportHistory = async (organizationId, limit = 10, offset = 0) => {
  try {
    // For demo purposes, return mock data
    const mockImports = [
      {
        id: uuidv4(),
        organization_id: organizationId,
        import_type: 'patients',
        file_name: 'patients_data.csv',
        file_size: 1024 * 100, // 100KB
        record_count: 150,
        status: 'completed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 5).toISOString() // 5 minutes after creation
      },
      {
        id: uuidv4(),
        organization_id: organizationId,
        import_type: 'inventory',
        file_name: 'inventory_data.xlsx',
        file_size: 1024 * 500, // 500KB
        record_count: 75,
        status: 'completed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 48 + 1000 * 60 * 8).toISOString() // 8 minutes after creation
      },
      {
        id: uuidv4(),
        organization_id: organizationId,
        import_type: 'appointments',
        file_name: 'appointments.json',
        file_size: 1024 * 50, // 50KB
        status: 'processing',
        created_at: new Date().toISOString(),
        completed_at: null
      }
    ];

    return {
      success: true,
      imports: mockImports,
      total: mockImports.length
    };
  } catch (error) {
    console.error('Error fetching import history:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get export history
 * @param {string} organizationId - The organization ID
 * @param {number} limit - Maximum number of records to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<object>} Export history
 */
export const getExportHistory = async (organizationId, limit = 10, offset = 0) => {
  try {
    // For demo purposes, return mock data
    const mockExports = [
      {
        id: uuidv4(),
        organization_id: organizationId,
        export_type: 'patients',
        file_name: 'patients_export_2023-05-15.csv',
        record_count: 250,
        status: 'completed',
        download_url: 'https://example.com/exports/patients_export.csv',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 12 + 1000 * 60 * 3).toISOString() // 3 minutes after creation
      },
      {
        id: uuidv4(),
        organization_id: organizationId,
        export_type: 'billing',
        file_name: 'billing_export_2023-05-14.xlsx',
        record_count: 120,
        status: 'completed',
        download_url: 'https://example.com/exports/billing_export.xlsx',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 36 + 1000 * 60 * 5).toISOString() // 5 minutes after creation
      }
    ];

    return {
      success: true,
      exports: mockExports,
      total: mockExports.length
    };
  } catch (error) {
    console.error('Error fetching export history:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload an organization logo
 * @param {File} file - The logo file
 * @param {string} organizationId - The organization ID
 * @returns {Promise<object>} Upload result
 */
export const uploadOrganizationLogo = async (file, organizationId) => {
  try {
    // Validate file type
    if (!LOGO_CONSTRAINTS.allowedTypes.includes(file.type)) {
      return { 
        success: false, 
        error: `Invalid file type. Allowed types: ${LOGO_CONSTRAINTS.allowedTypes.map(t => t.split('/')[1]).join(', ')}` 
      };
    }
    
    // Validate file size
    if (file.size > LOGO_CONSTRAINTS.maxSize) {
      return { 
        success: false, 
        error: `File size exceeds the maximum limit of ${LOGO_CONSTRAINTS.maxSize / (1024 * 1024)}MB` 
      };
    }
    
    // Check dimensions
    const dimensions = await getImageDimensions(file);
    if (dimensions.width < LOGO_CONSTRAINTS.minWidth || dimensions.height < LOGO_CONSTRAINTS.minHeight) {
      return { 
        success: false, 
        error: `Image dimensions too small. Minimum: ${LOGO_CONSTRAINTS.minWidth}x${LOGO_CONSTRAINTS.minHeight}px` 
      };
    }
    
    if (dimensions.width > LOGO_CONSTRAINTS.maxWidth || dimensions.height > LOGO_CONSTRAINTS.maxHeight) {
      return { 
        success: false, 
        error: `Image dimensions too large. Maximum: ${LOGO_CONSTRAINTS.maxWidth}x${LOGO_CONSTRAINTS.maxHeight}px` 
      };
    }
    
    // For demo purposes, create a data URL to simulate the uploaded image
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          logoUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get image dimensions
 * @param {File} file - The image file
 * @returns {Promise<object>} Image dimensions
 */
const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Delete multiple records
 * @param {string} type - The type of data (e.g., 'patients', 'inventory')
 * @param {Array<string>} ids - Array of record IDs to delete
 * @param {string} organizationId - The organization ID
 * @returns {Promise<object>} Delete result
 */
export const bulkDeleteRecords = async (type, ids, organizationId) => {
  try {
    if (!ids || !ids.length) {
      return { success: false, error: 'No records specified for deletion' };
    }
    
    // For demo purposes, simulate the deletion process
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      deletedCount: ids.length
    };
  } catch (error) {
    console.error('Bulk delete error:', error);
    return { success: false, error: error.message };
  }
};