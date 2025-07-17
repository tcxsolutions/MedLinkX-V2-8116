// Simplified version of the import/export service that doesn't depend on Supabase
import { v4 as uuidv4 } from 'uuid';

// Allowed file types and their MIME types
const ALLOWED_FILE_TYPES = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  json: 'application/json'
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
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
};

// Sample data for different data types
const SAMPLE_DATA = {
  patients: {
    csv: `id,name,age,gender,phone,email,address,blood_type,allergies,insurance,admission_date,condition,doctor
P001,John Doe,45,Male,+1-555-123-4567,john.doe@email.com,"123 Main St,City,State 12345",A+,Penicillin,Blue Cross,2024-01-15,Hypertension,Dr. Smith
P002,Jane Smith,32,Female,+1-555-987-6543,jane.smith@email.com,"456 Oak Ave,City,State 12345",B-,Latex,Aetna,2024-01-10,Diabetes,Dr. Johnson
P003,Bob Johnson,67,Male,+1-555-456-7890,bob.johnson@email.com,"789 Pine Rd,City,State 12345",O+,Aspirin,Medicare,2024-01-18,Chest Pain,Dr. Brown`,
    json: [
      {
        id: "P001",
        name: "John Doe",
        age: 45,
        gender: "Male",
        phone: "+1-555-123-4567",
        email: "john.doe@email.com",
        address: "123 Main St,City,State 12345",
        blood_type: "A+",
        allergies: "Penicillin",
        insurance: "Blue Cross",
        admission_date: "2024-01-15",
        condition: "Hypertension",
        doctor: "Dr. Smith"
      },
      {
        id: "P002",
        name: "Jane Smith",
        age: 32,
        gender: "Female",
        phone: "+1-555-987-6543",
        email: "jane.smith@email.com",
        address: "456 Oak Ave,City,State 12345",
        blood_type: "B-",
        allergies: "Latex",
        insurance: "Aetna",
        admission_date: "2024-01-10",
        condition: "Diabetes",
        doctor: "Dr. Johnson"
      }
    ]
  },
  appointments: {
    csv: `id,patient_id,patient_name,date,time,type,doctor,duration,status,notes
A001,P001,John Doe,2024-01-20,09:00,Consultation,Dr. Smith,30,Confirmed,Follow-up for hypertension
A002,P002,Jane Smith,2024-01-20,10:30,Check-up,Dr. Johnson,45,Pending,Annual physical examination
A003,P003,Bob Wilson,2024-01-20,14:00,Surgery,Dr. Brown,120,Confirmed,Cardiac catheterization`,
    json: [
      {
        id: "A001",
        patient_id: "P001",
        patient_name: "John Doe",
        date: "2024-01-20",
        time: "09:00",
        type: "Consultation",
        doctor: "Dr. Smith",
        duration: 30,
        status: "Confirmed",
        notes: "Follow-up for hypertension"
      },
      {
        id: "A002",
        patient_id: "P002",
        patient_name: "Jane Smith",
        date: "2024-01-20",
        time: "10:30",
        type: "Check-up",
        doctor: "Dr. Johnson",
        duration: 45,
        status: "Pending",
        notes: "Annual physical examination"
      }
    ]
  },
  inventory: {
    csv: `id,name,category,quantity,unit_price,supplier,expiry_date,location,status
I001,Surgical Gloves,Medical Supplies,500,0.75,MedSupply Co,2025-06-15,Storage Room A,In Stock
I002,Examination Table Paper,Medical Supplies,20,15.50,MedEquip Inc,,Storage Room B,Low Stock
I003,Syringe 10ml,Medical Supplies,0,0.35,MedSupply Co,2024-08-20,Storage Room A,Out of Stock`,
    json: [
      {
        id: "I001",
        name: "Surgical Gloves",
        category: "Medical Supplies",
        quantity: 500,
        unit_price: 0.75,
        supplier: "MedSupply Co",
        expiry_date: "2025-06-15",
        location: "Storage Room A",
        status: "In Stock"
      },
      {
        id: "I002",
        name: "Examination Table Paper",
        category: "Medical Supplies",
        quantity: 20,
        unit_price: 15.50,
        supplier: "MedEquip Inc",
        expiry_date: null,
        location: "Storage Room B",
        status: "Low Stock"
      }
    ]
  },
  billing: {
    csv: `id,patient_id,patient_name,amount,insurance_amount,patient_amount,status,date,due_date,services,insurance_provider
INV001,P001,John Doe,1250.00,1000.00,250.00,Paid,2024-01-18,2024-02-18,"Consultation,Lab Tests,X-Ray",Blue Cross
INV002,P002,Jane Smith,850.00,680.00,170.00,Pending,2024-01-17,2024-02-17,"Annual Check-up,Blood Work",Aetna
INV003,P003,Bob Wilson,3200.00,2560.00,640.00,Overdue,2024-01-10,2024-02-10,"Surgery,Anesthesia,Recovery",Medicare`,
    json: [
      {
        id: "INV001",
        patient_id: "P001",
        patient_name: "John Doe",
        amount: 1250.00,
        insurance_amount: 1000.00,
        patient_amount: 250.00,
        status: "Paid",
        date: "2024-01-18",
        due_date: "2024-02-18",
        services: ["Consultation", "Lab Tests", "X-Ray"],
        insurance_provider: "Blue Cross"
      },
      {
        id: "INV002",
        patient_id: "P002",
        patient_name: "Jane Smith",
        amount: 850.00,
        insurance_amount: 680.00,
        patient_amount: 170.00,
        status: "Pending",
        date: "2024-01-17",
        due_date: "2024-02-17",
        services: ["Annual Check-up", "Blood Work"],
        insurance_provider: "Aetna"
      }
    ]
  }
};

/**
 * Generate a sample file for a specific data type and format
 * @param {string} dataType - The type of data (patients, appointments, etc.)
 * @param {string} format - The file format (csv, xlsx, json)
 * @returns {Promise<object>} Sample file result
 */
export const generateSampleFile = async (dataType, format) => {
  try {
    if (!SAMPLE_DATA[dataType]) {
      return {
        success: false,
        error: `No sample data available for ${dataType}`
      };
    }

    const sampleData = SAMPLE_DATA[dataType];
    let content;
    let mimeType;
    let filename;

    switch (format) {
      case 'csv':
        content = sampleData.csv;
        mimeType = 'text/csv';
        filename = `${dataType}_sample.csv`;
        break;
      case 'json':
        content = JSON.stringify(sampleData.json, null, 2);
        mimeType = 'application/json';
        filename = `${dataType}_sample.json`;
        break;
      case 'xlsx':
        // For Excel, we'll generate a CSV-like format as a simple implementation
        // In a real application, you would use a library like xlsx or exceljs
        content = sampleData.csv;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = `${dataType}_sample.xlsx`;
        break;
      default:
        return {
          success: false,
          error: `Unsupported format: ${format}`
        };
    }

    return {
      success: true,
      content,
      mimeType,
      filename
    };
  } catch (error) {
    console.error('Error generating sample file:', error);
    return {
      success: false,
      error: error.message
    };
  }
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
    return {
      success: false,
      error: error.message
    };
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
    return {
      success: false,
      error: error.message
    };
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
    return {
      success: false,
      error: error.message
    };
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
    return {
      success: false,
      error: error.message
    };
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
    return {
      success: false,
      error: error.message
    };
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
      resolve({
        width: img.width,
        height: img.height
      });
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
      return {
        success: false,
        error: 'No records specified for deletion'
      };
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
    return {
      success: false,
      error: error.message
    };
  }
};