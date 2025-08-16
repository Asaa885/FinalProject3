import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBoard = () => {
  const [clovestations, setCloveStations] = useState([]);
  // const [cloveFirms, setCloveFirms] = useState([]); // ✅ NEW
  const [formData, setFormData] = useState({
    stationName: '',
    location: '',
    // CloveFirm: '', // ✅ NEW
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchCloveStations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/clovestation/', { headers });
      setCloveStations(res.data);
    } catch (err) {
      console.error('Error fetching CloveStations:', err);
    }
  };

  // const fetchCloveFirms = async () => { // ✅ NEW
  //   try {
  //     const res = await axios.get('http://127.0.0.1:8000/api/clovefirms/', { headers });
  //     // setCloveFirms(res.data);
  //   } catch (err) {
  //     console.error('Error fetching clove firms:', err);
  //   }
  // };

  useEffect(() => {
    fetchCloveStations();
    // fetchCloveFirms(); // ✅ NEW
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId"); // <-- ensure umehifadhi userId
    const payload = {
      ...formData,
      admin: userId,
    }
      if (editId) {
        await axios.put(`http://127.0.0.1:8000/api/clovestation/${editId}/`, payload, { headers });

      } else {
       await axios.post('http://127.0.0.1:8000/api/clovestation/', payload, { headers });

      }
      setFormData({ stationName: '', location: '',  }); // ✅ RESET clovefirm
      setEditId(null);
      fetchCloveStations();
    } catch (err) {
      console.error('Error submitting station:', err);
      console.log(err.response?.data);
    }
  };

  const handleEdit = (station) => {
    setFormData({
      stationName: station.stationName,
      location: station.location,
      // CloveFirm: clovestations.CloveFirm || '', // ✅ include when editing
    });
    setEditId(clovestations.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/clovestation/${id}/`, { headers });
      fetchCloveStations();
    } catch (err) {
      console.error('Error deleting station:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Station' : 'Add New Station'}</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          name="stationName"
          value={formData.stationName}
          onChange={handleChange}
          placeholder="Station Name"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editId ? 'Update Station' : 'Add Station'}
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">All Stations</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Station Name</th>
            <th className="border px-2 py-1">Location</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clovestations.map((clovestation) => (
            <tr key={clovestation.id}>
              <td className="border px-2 py-1">{clovestation.id}</td>
              <td className="border px-2 py-1">{clovestation.stationName}</td>
              <td className="border px-2 py-1">{clovestation.location}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEdit(clovestation)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(clovestation.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {clovestations.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-2 text-gray-500">No stations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBoard;
