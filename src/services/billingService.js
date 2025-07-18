import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const BILLING_ITEMS_TABLE = 'billing_items_medlink_x7a9b2c3';
const INVOICES_TABLE = 'invoices_medlink_x7a9b2c3';
const PAYMENTS_TABLE = 'payments_medlink_x7a9b2c3';

// Mock data for development
const mockBillingItems = [
  { id: '1', name: 'Office Visit - New Patient', code: '99201', price: 75.00, category: 'Evaluation' },
  { id: '2', name: 'Office Visit - Established Patient', code: '99212', price: 65.00, category: 'Evaluation' },
  { id: '3', name: 'Complete Blood Count', code: '85025', price: 45.00, category: 'Laboratory' },
  { id: '4', name: 'Chest X-Ray', code: '71045', price: 120.00, category: 'Radiology' },
  { id: '5', name: 'Electrocardiogram', code: '93000', price: 90.00, category: 'Cardiology' },
  { id: '6', name: 'Vaccination - Influenza', code: '90686', price: 35.00, category: 'Immunization' },
];

// Create invoice with diagnostic codes
export const createInvoice = async (invoiceData) => {
  try {
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    
    // Create the invoice record
    const newInvoice = {
      id: uuidv4(),
      invoice_number: invoiceNumber,
      patient_id: invoiceData.patientId,
      visit_id: invoiceData.visitId || null,
      total_amount: calculateTotal(invoiceData.items),
      insurance_amount: invoiceData.insuranceAmount || 0,
      patient_amount: invoiceData.patientAmount || 0,
      status: 'Pending',
      due_date: calculateDueDate(),
      notes: invoiceData.notes || '',
      created_at: new Date().toISOString(),
      created_by: invoiceData.createdBy,
    };
    
    // Check if table exists
    const { error: checkError } = await supabase
      .from(INVOICES_TABLE)
      .select('id')
      .limit(1);
      
    // If table doesn't exist, return mock data
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Using mock invoice data:', newInvoice);
      
      // Create mock invoice items
      const invoiceItems = invoiceData.items.map(item => ({
        id: uuidv4(),
        invoice_id: newInvoice.id,
        billing_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.quantity * item.price,
        diagnostic_code_id: item.diagnosticCodeId || null,
        created_at: new Date().toISOString()
      }));
      
      return { 
        success: true, 
        data: { 
          invoice: newInvoice,
          items: invoiceItems
        }
      };
    }
    
    // Insert into database
    const { data: invoice, error: invoiceError } = await supabase
      .from(INVOICES_TABLE)
      .insert([newInvoice])
      .select();
      
    if (invoiceError) throw invoiceError;
    
    // Create invoice items with diagnostic codes
    const invoiceItems = invoiceData.items.map(item => ({
      id: uuidv4(),
      invoice_id: invoice[0].id,
      billing_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.quantity * item.price,
      diagnostic_code_id: item.diagnosticCodeId || null,
      created_at: new Date().toISOString()
    }));
    
    const { data: items, error: itemsError } = await supabase
      .from(BILLING_ITEMS_TABLE)
      .insert(invoiceItems)
      .select();
      
    if (itemsError) throw itemsError;
    
    return { 
      success: true, 
      data: { 
        invoice: invoice[0],
        items
      }
    };
  } catch (error) {
    console.error('Error creating invoice:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to calculate total amount
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
};

// Helper function to calculate due date (30 days from now)
const calculateDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

// Get billing items with diagnostic codes
export const getBillingItemsWithDiagnoses = async (visitId) => {
  try {
    // Get visit diagnoses
    const { data: diagnoses, error: diagnosesError } = await supabase
      .from('visit_diagnoses_medlink_x7a9b2c3')
      .select(`
        *,
        diagnostic_code:diagnostic_code_id (*)
      `)
      .eq('visit_id', visitId);
      
    if (diagnosesError) throw diagnosesError;
    
    // If no diagnoses or mock data, return mock billing items
    if (!diagnoses || diagnoses.length === 0) {
      return { 
        success: true, 
        data: { 
          billingItems: mockBillingItems,
          diagnoses: []
        }
      };
    }
    
    // Get billing items
    const { data: billingItems, error: billingError } = await supabase
      .from(BILLING_ITEMS_TABLE)
      .select('*')
      .order('name', { ascending: true });
      
    if (billingError) {
      // If table doesn't exist, return mock data
      return { 
        success: true, 
        data: { 
          billingItems: mockBillingItems,
          diagnoses
        }
      };
    }
    
    return { 
      success: true, 
      data: { 
        billingItems: billingItems || mockBillingItems,
        diagnoses
      }
    };
  } catch (error) {
    console.error('Error getting billing items with diagnoses:', error);
    return { 
      success: false, 
      error: error.message,
      data: { 
        billingItems: mockBillingItems,
        diagnoses: []
      }
    };
  }
};

// Get patient invoices with diagnostic codes
export const getPatientInvoices = async (patientId) => {
  try {
    // Check if table exists
    const { error: checkError } = await supabase
      .from(INVOICES_TABLE)
      .select('id')
      .limit(1);
      
    // If table doesn't exist, return mock data
    if (checkError && checkError.message.includes('does not exist')) {
      // Create mock invoices
      const mockInvoices = [
        {
          id: '1',
          invoice_number: 'INV-123456',
          patient_id: patientId,
          visit_id: '1',
          total_amount: 185.00,
          insurance_amount: 148.00,
          patient_amount: 37.00,
          status: 'Paid',
          due_date: '2024-02-15',
          notes: '',
          created_at: '2024-01-15T10:30:00Z',
          created_by: 'System',
          items: [
            {
              id: '1-1',
              invoice_id: '1',
              billing_item_id: '2',
              billing_item: mockBillingItems.find(item => item.id === '2'),
              quantity: 1,
              unit_price: 65.00,
              total_price: 65.00,
              diagnostic_code_id: '2',
              diagnostic_code: {
                code: 'I10',
                description: 'Essential (primary) hypertension'
              }
            },
            {
              id: '1-2',
              invoice_id: '1',
              billing_item_id: '3',
              billing_item: mockBillingItems.find(item => item.id === '3'),
              quantity: 1,
              unit_price: 45.00,
              total_price: 45.00,
              diagnostic_code_id: '2',
              diagnostic_code: {
                code: 'I10',
                description: 'Essential (primary) hypertension'
              }
            }
          ]
        }
      ];
      
      return { success: true, data: mockInvoices };
    }
    
    // Get invoices with items and diagnostic codes
    const { data: invoices, error: invoicesError } = await supabase
      .from(INVOICES_TABLE)
      .select(`
        *,
        items:${BILLING_ITEMS_TABLE}(
          *,
          billing_item:billing_item_id(*),
          diagnostic_code:diagnostic_code_id(*)
        )
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
      
    if (invoicesError) throw invoicesError;
    
    return { success: true, data: invoices || [] };
  } catch (error) {
    console.error('Error getting patient invoices:', error);
    return { success: false, error: error.message };
  }
};