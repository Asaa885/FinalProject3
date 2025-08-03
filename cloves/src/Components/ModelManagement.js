import React, { useState } from "react";
import ManageBoard from "../pages/ManageBoard";
import ManageFarmer from "../pages/ManageFarmer";
import ManagePayment from "../pages/ManagePayment";
import ManageOfficer from "../pages/ManageOfficer";
import ManageCloveFirms from "../pages/ManageCloveFirm";

const ModelManagement = () => {
  const [activeTab, setActiveTab] = useState("board");

  const renderTab = () => {
    switch (activeTab) {
      case "board":
        return <ManageBoard />;
      case "farmer":
        return <ManageFarmer />;
      case "payment":
        return <ManagePayment />;
      case "officer":
        return <ManageOfficer />;

      case "clovefirm":
        return <ManageCloveFirms />

      default:
        return <div>Chagua tab ili kuanza</div>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-4 flex space-x-4 border-b">
        {["board", "farmer", "payment", "officer", "clovefirm"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div>{renderTab()}</div>
    </div>
  );
};

export default ModelManagement;
