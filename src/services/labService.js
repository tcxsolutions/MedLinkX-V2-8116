// Mock lab service that doesn't depend on Supabase
import { v4 as uuidv4 } from 'uuid';

// In-memory storage
const labTests = [
  { id: '1', test_name: 'Complete Blood Count', test_code: 'CBC' },
  { id: '2', test_name: 'Basic Metabolic Panel', test_code: 'BMP' },
  { id: '3', test_name: 'Lipid Panel', test_code: 'LIPID' },
  { id: '4', test_name: 'Hemoglobin A1C', test_code: 'HBA1C' }
];

const labOrders = [];
const labOrderItems = [];
const labResults = [];

// Get all lab tests
export const getAllLabTests = async () => {
  try {
    return { success: true, data: labTests };
  } catch (error) {
    console.error('Error getting lab tests:', error);
    return { success: false, error: error.message };
  }
};

// Create lab order
export const createLabOrder = async (orderData) => {
  try {
    // First create the lab order
    const newOrder = {
      id: uuidv4(),
      patient_id: orderData.patient_id,
      visit_id: orderData.visit_id,
      ordered_by: orderData.ordered_by,
      status: 'Ordered',
      ordered_date: new Date().toISOString()
    };
    
    labOrders.push(newOrder);
    
    // Then create the lab order items
    const orderItems = orderData.tests.map(testId => ({
      id: uuidv4(),
      lab_order_id: newOrder.id,
      lab_test_id: testId,
      status: 'Ordered'
    }));
    
    labOrderItems.push(...orderItems);
    
    return { 
      success: true, 
      data: {
        order: newOrder,
        items: orderItems
      }
    };
  } catch (error) {
    console.error('Error creating lab order:', error);
    return { success: false, error: error.message };
  }
};

// Get patient lab orders
export const getPatientLabOrders = async (patientId) => {
  try {
    const orders = labOrders.filter(order => order.patient_id === patientId);
    
    // Sort by ordered date descending
    orders.sort((a, b) => new Date(b.ordered_date) - new Date(a.ordered_date));
    
    // Add order items, tests, and results to each order
    const enrichedOrders = orders.map(order => {
      const items = labOrderItems.filter(item => item.lab_order_id === order.id);
      
      const enrichedItems = items.map(item => {
        const test = labTests.find(test => test.id === item.lab_test_id);
        const results = labResults.filter(result => result.lab_order_item_id === item.id);
        
        return {
          ...item,
          lab_tests_af245g6e7h: test,
          lab_results_af245g6e7h: results
        };
      });
      
      return {
        ...order,
        lab_order_items_af245g6e7h: enrichedItems
      };
    });
    
    return { success: true, data: enrichedOrders };
  } catch (error) {
    console.error('Error getting patient lab orders:', error);
    return { success: false, error: error.message };
  }
};

// Update lab order status
export const updateLabOrderStatus = async (orderId, status) => {
  try {
    const index = labOrders.findIndex(order => order.id === orderId);
    
    if (index === -1) {
      return { success: false, error: 'Lab order not found' };
    }
    
    labOrders[index] = {
      ...labOrders[index],
      status,
      updated_at: new Date().toISOString()
    };
    
    return { success: true, data: labOrders[index] };
  } catch (error) {
    console.error('Error updating lab order status:', error);
    return { success: false, error: error.message };
  }
};

// Record lab result
export const recordLabResult = async (resultData) => {
  try {
    // Insert the lab result
    const newResult = {
      ...resultData,
      id: uuidv4(),
      result_date: new Date().toISOString()
    };
    
    labResults.push(newResult);
    
    // Update the lab order item status
    const itemIndex = labOrderItems.findIndex(item => item.id === resultData.lab_order_item_id);
    
    if (itemIndex !== -1) {
      labOrderItems[itemIndex] = {
        ...labOrderItems[itemIndex],
        status: 'Completed'
      };
    }
    
    return { success: true, data: newResult };
  } catch (error) {
    console.error('Error recording lab result:', error);
    return { success: false, error: error.message };
  }
};