import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8000/api/officer/'; // Update to match your backend URL

const ManageOfficer = () => {
  const [officers, setOfficers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch officers
  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const response = await axios.get(apiUrl);
      setOfficers(response.data);
    } catch (error) {
      console.error('Error fetching officers:', error);
    }
  };

  // Add or Update officer
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      user: {
        username,
        email,
        password,
        role: 'officer'
      },
      name,
    };

    try {
      if (editingId) {
        await axios.put(`${apiUrl}${editingId}/`, data);
      } else {
        await axios.post(apiUrl, data);
      }

      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setEditingId(null);
      fetchOfficers();
    } catch (error) {
      console.error('Error submitting officer:', error.response?.data || error.message);
    }
  };

  const handleEdit = (officer) => {
    setEditingId(officer.id);
    setName(officer.name);
    setUsername(officer.user.username);
    setEmail(officer.user.email);
    setPassword('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}${id}/`);
      fetchOfficers();
    } catch (error) {
      console.error('Error deleting officer:', error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Officer' : 'Add Officer'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded shadow">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        {!editingId && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-2">All Officers</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {officers.map((officer) => (
            <tr key={officer.id} className="text-center">
              <td className="border p-2">{officer.id}</td>
              <td className="border p-2">{officer.name}</td>
              <td className="border p-2">{officer.user.username}</td>
              <td className="border p-2">{officer.user.email}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(officer)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(officer.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {officers.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No officers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOfficer;
