import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagePayment = () => {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    pamount: "",
    paid_from: "",
    paid_to: "",
    farm: "",
    transaction_type: "rent", // match backend choices ('rent' or 'clove_sale')
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken");

  // Fetch all users for paid_from and paid_to selects
  const [users, setUsers] = useState([]);
  // Fetch farms for farm select
  const [farms, setFarms] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/payment/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/customUser/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchFarms = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/clovefirms/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarms(res.data);
    } catch (err) {
      console.error("Failed to fetch farms", err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUsers();
    fetchFarms();
  }, []);

  const resetForm = () => {
    setFormData({
      pamount: "",
      paid_from: "",
      paid_to: "",
      farm: "",
      transaction_type: "rent",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://127.0.0.1:8000/api/payment/${editId}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Payment updated successfully");
      } else {
        await axios.post("http://127.0.0.1:8000/api/payment/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Payment created successfully");
      }
      resetForm();
      fetchPayments();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting payment:", error);
      setMessage("Failed to submit payment");
    }
  };

  const handleEdit = (payment) => {
    setFormData({
      pamount: payment.pamount || "",
      paid_from: payment.paid_from || "",
      paid_to: payment.paid_to || "",
      farm: payment.farm || "",
      transaction_type: payment.transaction_type || "rent",
    });
    setEditId(payment.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una hakika unataka kufuta?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/payment/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Payment deleted successfully");
      fetchPayments();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Delete failed", error);
      setMessage("Failed to delete payment");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Payment</h2>

      {message && <div className="mb-4 text-green-600">{message}</div>}

      <form onSubmit={handleSubmit} className="mb-6 max-w-md">
        <div className="mb-2">
          <label className="block font-medium">Amount (TZS)</label>
          <input
            type="number"
            value={formData.pamount}
            onChange={(e) => setFormData({ ...formData, pamount: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium">Paid From</label>
          <select
            value={formData.paid_from}
            onChange={(e) => setFormData({ ...formData, paid_from: e.target.value })}
            required
            className="w-full border rounded p-2"
          >
            <option value="">-- Chagua Mlipaji --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block font-medium">Paid To</label>
          <select
            value={formData.paid_to}
            onChange={(e) => setFormData({ ...formData, paid_to: e.target.value })}
            required
            className="w-full border rounded p-2"
          >
            <option value="">-- Chagua Mpokeaji --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block font-medium">Farm</label>
          <select
            value={formData.farm}
            onChange={(e) => setFormData({ ...formData, farm: e.target.value })}
            required
            className="w-full border rounded p-2"
          >
            <option value="">-- Chagua Shamba --</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block font-medium">Transaction Type</label>
          <select
            value={formData.transaction_type}
            onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
            required
            className="w-full border rounded p-2"
          >
            <option value="rent">Rent</option>
            <option value="clove_sale">Clove Sale</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editId ? "Update" : "Create"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                pamount: "",
                paid_from: "",
                paid_to: "",
                farm: "",
                transaction_type: "rent",
              });
              setEditId(null);
            }}
            className="ml-2 py-2 px-4 border rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Paid From</th>
            <th className="border p-2">Paid To</th>
            <th className="border p-2">Farm</th>
            <th className="border p-2">Transaction Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="border p-2">{payment.id}</td>
              <td className="border p-2">{payment.pamount}</td>
              <td className="border p-2">{payment.paid_from?.username || ""}</td>
              <td className="border p-2">{payment.paid_to?.username || ""}</td>
              <td className="border p-2">{payment.farm?.name || ""}</td>
              <td className="border p-2">{payment.transaction_type}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(payment)}
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(payment.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4">
                Hakuna data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePayment;
