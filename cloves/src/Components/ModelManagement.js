import React, { useState, useEffect } from "react";
import ManageBoard from "../pages/ManageBoard";
import ManageFarmer from "../pages/ManageFarmer";
import ManagePayment from "../pages/ManagePayment";
import ManageOfficer from "../pages/ManageOfficer";
import ManageCloveFirms from "../pages/ManageCloveFirm";
import { statsAPI } from "../api/api";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

// Fallback data in case API fails - using your original dummy data
const fallbackStats = {
  clovestation: { total: 3, active: 3, inactive: 0},
  farmer: { total: 3, active: 3, inactive: 0},
  payment: { total: 100, paid: 80, unpaid: 20 },
  officer: { total: 2, active: 1, inactive: 1 },
  clovefirm: { total: 5, rented: 4, not_rented: 1 }
};

const ModelManagement = () => {
  const [activeTab, setActiveTab] = useState("board");
  const [stats, setStats] = useState(fallbackStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics from database
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch all stats at once, or individual stats
      try {
        const allStats = await statsAPI.getAllStats();
        setStats(allStats);
      } catch (err) {
        // If getAllStats fails, fetch individual stats
        const [clovestation, farmer, payment, officer, clovefirm] = await Promise.all([
          statsAPI.getCloveStationStats().catch(() => fallbackStats.clovestation),
          statsAPI.getFarmerStats().catch(() => fallbackStats.farmer),
          statsAPI.getPaymentStats().catch(() => fallbackStats.payment),
          statsAPI.getOfficerStats().catch(() => fallbackStats.officer),
          statsAPI.getCloveFirmStats().catch(() => fallbackStats.clovefirm)
        ]);
        
        setStats({ clovestation, farmer, payment, officer, clovefirm });
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Imeshindwa kupata takwimu. Tumia data ya mfumo.');
      setStats(fallbackStats);
    } finally {
      setLoading(false);
    }
  };

  // Load stats when component mounts
  useEffect(() => {
    fetchStats();
  }, []);

  const getStats = () => {
    switch (activeTab) {
      case "clovestation":
        return stats.clovestation;
      case "farmer":
        return stats.farmer;
      case "payment":
        return stats.payment;
      case "officer":
        return stats.officer;
      case "clovefirm":
        return stats.clovefirm;
      default:
        return {};
    }
  };

  const getPieData = () => {
    const stats = getStats();
    if (activeTab === "payment") {
      return [
        { name: "Paid", value: stats.paid },
        { name: "Unpaid", value: stats.unpaid }
      ];
    }
    if (activeTab === "clovefirm") {
      return [
        { name: "Rented", value: stats.rented },
        { name: "Not Rented", value: stats.not_rented }
      ];
    }
    return [
      { name: "Active", value: stats.active },
      { name: "Inactive", value: stats.inactive }
    ];
  };

  const renderTab = () => {
    // Show loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Inapakia takwimu...</span>
        </div>
      );
    }

    // Show error state with retry button
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchStats}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Jaribu Tena
            </button>
          </div>
        </div>
      );
    }

    // Cards and Chart
    const currentStats = getStats();
    const pieData = getPieData();

    return (
      <div>
        {/* Refresh Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'loading...' : 'Sasisha Takwimu'}
          </button>
        </div>
        
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="font-semibold">Total</h2>
            <p className="text-xl">{currentStats.total || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="font-semibold">
              {activeTab === "payment" ? "Paid" : 
               activeTab === "clovefirm" ? "Rented" : "Active"}
            </h2>
            <p className="text-xl text-green-600">
              {activeTab === "payment" ? (currentStats.paid || 0) : 
               activeTab === "clovefirm" ? (currentStats.rented || 0) : 
               (currentStats.active || 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="font-semibold">
              {activeTab === "payment" ? "Unpaid" : 
               activeTab === "clovefirm" ? "Not Rented" : "Inactive"}
            </h2>
            <p className="text-xl text-red-600">
              {activeTab === "payment" ? (currentStats.unpaid || 0) : 
               activeTab === "clovefirm" ? (currentStats.not_rented || 0) : 
               (currentStats.inactive || 0)}
            </p>
          </div>
        </div>
        {/* Chart */}
        <div className="bg-white p-4 rounded shadow mb-6 w-full md:w-1/2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Tab Content */}
        <div>
          {(() => {
            switch (activeTab) {
              case "clovestation":
                return <ManageBoard />;
              case "farmer":
                return <ManageFarmer />;
              case "payment":
                return <ManagePayment />;
              case "officer":
                return <ManageOfficer />;
              case "clovefirm":
                return <ManageCloveFirms />;
              default:
                return <div>Select the table</div>;
            }
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-4 flex space-x-4 border-b">
        {["clovestation", "farmer", "payment", "officer", "clovefirm"].map((tab) => (
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