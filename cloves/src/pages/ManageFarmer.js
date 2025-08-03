import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageFarmer = () => {
  const [farmers, setFarmers] = useState([]);
  const [formData, setFormData] = useState({
    faName: "",
    phonNo: "",
    email: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken");

  const fetchFarmers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/farmer/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(res.data);
    } catch (err) {
      console.log("Server errors:", err.response?.data);

    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

 const resetForm = () => {
  setFormData({ faName: "", phonNo: "", email: "" }); // fix field names
  setEditId(null);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId'); // Logged-in user's ID

  try {
    if (editId) {
      // UPDATE farmer
      await axios.put(
        `http://127.0.0.1:8000/api/farmer/${editId}/`,
        {
          ...formData,
          user: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Farmer updated successfully");
    } else {
      // CREATE farmer
      const payload = {
        ...formData,
         user: userId,
      };

      await axios.post("http://127.0.0.1:8000/api/farmer/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Farmer created successfully");
    }

    resetForm();
    fetchFarmers();
    setTimeout(() => setMessage(""), 3000);
  } catch (error) {
    console.error("Server errors:", error.response?.data || error.message);
    setMessage("Failed to submit farmer");
  }
};



  const handleEdit = (farmer) => {
    setFormData({
      faName: farmer.faName || "",
      phonNo: farmer.phonNo || "",
      email: farmer.email || "",
    });
    setEditId(farmer.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una hakika unataka kufuta?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/farmer/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Farmer deleted successfully");
      fetchFarmers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Delete failed", error);
      setMessage("Failed to delete farmer");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Farmer</h2>

      {message && <div className="mb-4 text-green-600">{message}</div>}

      <form onSubmit={handleSubmit} className="mb-6 max-w-md">
        <div className="mb-2">
          <label className="block font-medium">Farmer Name</label>
          <input
            type="text"
            value={formData.faName}
            onChange={(e) =>
              setFormData({ ...formData, faName: e.target.value })
            }
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium">Phone</label>
          <input
            type="tel"
            value={formData.phonNo}
            onChange={(e) =>
              setFormData({ ...formData, phonNo: e.target.value })
            }
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full border rounded p-2"
          />
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
            onClick={resetForm}
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
            <th className="border p-2">Farmer Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((farmer) => (
            <tr key={farmer.id}>
              <td className="border p-2">{farmer.id}</td>
              <td className="border p-2">{farmer.faName}</td>
              <td className="border p-2">{farmer.phonNo}</td>
              <td className="border p-2">{farmer.email}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(farmer)}
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(farmer.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {farmers.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4">
                Hakuna data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageFarmer;
