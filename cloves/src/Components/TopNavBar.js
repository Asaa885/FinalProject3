import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNavBar = () => {
  const userRole = localStorage.getItem("role")?.toLowerCase(); 
  console.log("User role is:", userRole); 

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/main/admndash' },
    { name: 'Board Management', path: '/main/clovestation' },
    
    // { name: 'Admin page', path: '/main/admnpg' },
  ];

  const officerNavItems = [
    { name: 'Home', path: '/main/home' },
    { name: 'Purchase Clove', path: '/main/purchase' },
    { name: 'Payment', path: '/main/payment' },
    { name: 'Generate Report', path: '/main/officerreport' },
  ];

  const sharedNavItems = [
    { name: 'Logout', path: '/logout' },
    
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
