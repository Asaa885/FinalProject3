import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBoard = () => {
  const [boards, setBoards] = useState([]);
  const [cloveFirms, setCloveFirms] = useState([]); // ✅ NEW
  const [formData, setFormData] = useState({
    boardName: '',
    location: '',
    CloveFirm: '', // ✅ NEW
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchBoards = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/board/', { headers });
      setBoards(res.data);
    } catch (err) {
      console.error('Error fetching boards:', err);
    }
  };

  const fetchCloveFirms = async () => { // ✅ NEW
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/clovefirms/', { headers });
      setCloveFirms(res.data);
    } catch (err) {
      console.error('Error fetching clove firms:', err);
    }
  };

  useEffect(() => {
    fetchBoards();
    fetchCloveFirms(); // ✅ NEW
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
      Officer: userId,
    }
      if (editId) {
        await axios.put(`http://127.0.0.1:8000/api/board/${editId}/`, payload, { headers });

      } else {
       await axios.post('http://127.0.0.1:8000/api/board/', payload, { headers });

      }
      setFormData({ boardName: '', location: '', CloveFirm: '' }); // ✅ RESET clovefirm
      setEditId(null);
      fetchBoards();
    } catch (err) {
      console.error('Error submitting board:', err);
      console.log(err.response?.data);
    }
  };

  const handleEdit = (board) => {
    setFormData({
      boardName: board.boardName,
      location: board.location,
      CloveFirm: board.CloveFirm || '', // ✅ include when editing
    });
    setEditId(board.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/board/${id}/`, { headers });
      fetchBoards();
    } catch (err) {
      console.error('Error deleting board:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Board' : 'Add New Board'}</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          name="boardName"
          value={formData.boardName}
          onChange={handleChange}
          placeholder="Board Name"
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
        
        {/* ✅ NEW: CloveFirm Dropdown */}
        <select
          name="CloveFirm"
          value={formData.CloveFirm}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Clove Firm</option>
          {cloveFirms.map((firm) => (
            <option key={firm.id} value={firm.id}>
              {firm.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editId ? 'Update Board' : 'Add Board'}
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">All Boards</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Board Name</th>
            <th className="border px-2 py-1">Location</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board.id}>
              <td className="border px-2 py-1">{board.id}</td>
              <td className="border px-2 py-1">{board.boardName}</td>
              <td className="border px-2 py-1">{board.location}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEdit(board)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(board.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {boards.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-2 text-gray-500">No boards found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBoard;
