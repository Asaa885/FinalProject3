import React from 'react';
import img002 from './../assets/karafuu2.jpeg';

const AdminDashboard = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <img
        src={img002}
        alt="Admin Image 2"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default AdminDashboard;
