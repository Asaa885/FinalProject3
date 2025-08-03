// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import PrivateRoute from './Components/ui/PrivateRoute.js';
import Login from './pages/Login';
import CreateAcc from './pages/CreateAcc';
import MainLayout from './Layout/MainLayout';

import Home from './pages/Home'; 
import AdminPg from './pages/AdminPg.js'
import AdminDashboard from './pages/AdminDashboard';
import BoardManagement from './Components/ModelManagement';
import ClovePurchase from './pages/ClovePurchase';
import PaymentPage from './pages/PaymentPage.js';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Login />} />
        <Route path='createAcc' element={<CreateAcc />} />

        {/* Protected Routes  */}
        <Route path='main' element={
          <PrivateRoute allowedRoles={['admin', 'officer']}>
            <MainLayout />
          </PrivateRoute>
        }>
          {/* Sub-routes inside layout */}
          <Route path='home' element={
            <PrivateRoute allowedRoles={['officer']}>
              <Home />
            </PrivateRoute>
          } />

          <Route path='admnpg' element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPg />
            </PrivateRoute>
          } />

          <Route path='admndash' element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          <Route path='board' element={
            <PrivateRoute allowedRoles={['admin']}>
              <BoardManagement />
            </PrivateRoute>
          } />

          <Route path='purchase' element={
            <PrivateRoute allowedRoles={['officer']}>
              <ClovePurchase />
            </PrivateRoute>
          } />

          <Route path='payment' element={
            <PrivateRoute allowedRoles={['officer']}>
            <PaymentPage/>
            </PrivateRoute>          
          }/>

         
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
