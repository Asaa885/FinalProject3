import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNavBar = () => {
  const userRole = localStorage.getItem("role")?.toLowerCase(); 
  console.log("User role is:", userRole); 

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/main/admndash' },
    { name: 'Board Management', path: '/main/board' },
    
    // { name: 'Admin page', path: '/main/admnpg' },
  ];

  const officerNavItems = [
    { name: 'Home', path: '/main/home' },
    { name: 'Clove Purchase', path: '/main/purchase' },
    { name: 'PaymentPage', path: '/main/payment' },
  ];

  const sharedNavItems = [
    
  ];

  const navItemsToRender = [
    ...(userRole === 'admin' ? adminNavItems : officerNavItems),
    ...sharedNavItems,
  ];

  return (
    <nav className="bg-green-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">ZCFRMS System</h2>
        <ul className="flex space-x-8">
          {navItemsToRender.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-white hover:text-yellow-400 transition duration-200 ${
                    isActive ? 'underline font-semibold' : ''
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TopNavBar;
