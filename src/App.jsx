import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import { PracticeProvider } from './contexts/PracticeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import Pharmacy from './pages/Pharmacy';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import OrganizationManagement from './pages/OrganizationManagement';
import DataImportExport from './components/dataManagement/DataImportExport';
import AppLayout from './components/layout/AppLayout';
import DatabaseInitializer from './components/common/DatabaseInitializer';
import { supabase } from './lib/supabase';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [dbStatus, setDbStatus] = useState({ checking: true, initialized: false });

  useEffect(() => {
    if (user && !loading) {
      checkDatabase();
    }
  }, [user, loading]);

  const checkDatabase = async () => {
    try {
      // Check if patients table exists and has data
      const { data, error } = await supabase
        .from('patients_medlink_x7a9b2c3')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Database check error:', error);
        setDbStatus({ checking: false, initialized: false, error: error.message });
      } else {
        setDbStatus({ 
          checking: false, 
          initialized: true, 
          hasData: data && data.length > 0 
        });
      }
    } catch (error) {
      console.error('Error checking database:', error);
      setDbStatus({ checking: false, initialized: false, error: error.message });
    }
  };

  if (loading || dbStatus.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Show database initializer if database is not ready
  if (!dbStatus.initialized) {
    return (
      <DatabaseInitializer 
        onComplete={() => setDbStatus(prev => ({ ...prev, initialized: true }))}
      />
    );
  }

  return (
    <TenantProvider>
      <OrganizationProvider>
        <PracticeProvider>
          <AppLayout>{children}</AppLayout>
        </PracticeProvider>
      </OrganizationProvider>
    </TenantProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        <Route path="/" element={<LoginRoute />} />
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute>
          <Patients />
        </ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute>
          <PatientDetails />
        </ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute>
          <Appointments />
        </ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute>
          <Billing />
        </ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute>
          <Inventory />
        </ProtectedRoute>} />
        <Route path="/pharmacy" element={<ProtectedRoute>
          <Pharmacy />
        </ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute>
          <Reports />
        </ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute>
          <UserManagement />
        </ProtectedRoute>} />
        <Route path="/data-management" element={<ProtectedRoute>
          <DataImportExport />
        </ProtectedRoute>} />
        <Route path="/organizations/*" element={<ProtectedRoute>
          <OrganizationManagement />
        </ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

// Login route component
const LoginRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <Login />;
};

export default App;