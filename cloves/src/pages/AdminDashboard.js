import React from 'react';

import img002 from './../assets/karafuu2.jpeg';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 text-center">
        Admin Dashboard - ZCFRM System
      </h1>

      <p className="text-center text-gray-600 mb-8 max-w-xl">
        Welcome, Administrator! You have access to manage users, view reports, and perform system operations.
      </p>

      <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
       
        <img
          src={img002}
          alt="Admin Image 2"
          className="w-full max-w-2xl object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
