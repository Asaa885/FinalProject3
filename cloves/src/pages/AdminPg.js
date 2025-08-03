import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ModelManagement from "../Components/ModelManagement";

function AdminPanel() {
  const models = [
    "Farmer",
    "Renter",
    "CloveFirm",
    "Cloves",
    "Payment",
    "Purchase",
    "Board",
    "Officer",
    "FirmCloveFarm",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul>
          {models.map((model) => (
            <li key={model} className="mb-2">
              <Link
                to={`/admin/${model}`}
                className="hover:underline hover:text-blue-300"
              >
                Manage {model}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <Routes>
          <Route
            path="/admin/:model"
            element={<ModelManagement />}
          />
          <Route
            path="/admin"
            element={
              <div>
                <h1 className="text-2xl font-bold">Welcome to Admin Panel</h1>
                <p>Select a model from the sidebar to manage.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default AdminPanel;
