import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import ProductionPlanner from './pages/ProductionPlanner';
import Admin from './pages/Admin';
import Customers from './pages/Customers';
import Employees from './pages/Employees';

// Shop Components
import ShopLayout from './components/ShopLayout';
import ShopHome from './pages/shop/Home';
import ShopCatalog from './pages/shop/ShopCatalog';
import ShopAuth from './pages/shop/Auth';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useStore();
  if (!user || !user.isLoggedIn) {
    return <Navigate to="/staff-login" replace />;
  }
  return children;
};

const ManagerRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useStore();
  if (user?.role !== 'manager') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* --- Public Shop Routes --- */}
        <Route element={<ShopLayout />}>
           <Route path="/" element={<ShopHome />} />
           <Route path="/shop" element={<ShopCatalog />} />
           <Route path="/auth" element={<ShopAuth />} />
        </Route>

        {/* --- Staff Auth --- */}
        <Route path="/staff-login" element={<Login />} />
        
        {/* --- Protected Staff Routes --- */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          
          {/* Manager Only Routes */}
          <Route path="/production" element={<ManagerRoute><ProductionPlanner /></ManagerRoute>} />
          <Route path="/admin" element={<ManagerRoute><Admin /></ManagerRoute>} />
          <Route path="/customers" element={<ManagerRoute><Customers /></ManagerRoute>} />
          <Route path="/employees" element={<ManagerRoute><Employees /></ManagerRoute>} />
        </Route>
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppRoutes />
    </StoreProvider>
  );
};

export default App;