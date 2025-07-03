// src/Layout/MainLayout.js
import React from 'react';
import TopNavBar from '../Components/TopNavBar';  // Use TopNavBar
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <TopNavBar />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
