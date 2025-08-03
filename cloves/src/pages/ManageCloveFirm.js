import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiBaseUrl = 'http://127.0.0.1:8000/api/clovefirms/';

const ManageCloveFirms = () => {
  const [cloveFirms, setCloveFirms] = useState([]);
  const [clovesOptions, setClovesOptions] = useState([]);
  const [editingFirm, setEditingFirm] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    size: '',
    price: '',
    location: '',
    description: '',
    is_verified: false,
    verification_comment: '',
    cloves: '',
  });

  useEffect(() => {
    fetchCloveFirms();
    fetchCloves();
  }, []);

  const fetchCloveFirms = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setCloveFirms(response.data);
    } catch (error) {
      console.error('Error fetching clove firms:', error);
    }
  };

  const fetchCloves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/cloves/');
      setClovesOptions(response.data);
    } catch (error) {
      console.error('Error fetching cloves:', error);
    }
  };

  const handleEditClick = (firm) => {
    setEditingFirm(firm.id);
    setFormData({
      name: firm.name,
      owner: firm.owner,
      size: firm.size,
      price: firm.price,
      location: firm.location,
      description: firm.description,
      is_verified: firm.is_verified,
      verification_comment: firm.verification_comment || '',
      cloves: firm.cloves || '',
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this clove firm?')) return;

    try {
      await axios.delete(`${apiBaseUrl}${id}/`);
      fetchCloveFirms();
    } catch (error) {
      console.error('Error deleting clove firm:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFirm) {
        await axios.put(`${apiBaseUrl}${editingFirm}/`, formData);
      } else {
        await axios.post(apiBaseUrl, formData);
        alert('Clove firm created successfully');
      }
      setEditingFirm(null);
      setFormData({
        name: '',
        owner: '',
        size: '',
        price: '',
        location: '',
        description: '',
        is_verified: false,
        verification_comment: '',
        cloves: '',
      });
      fetchCloveFirms();
    } catch (error) {
      console.error('Error submitting clove firm:', error.response?.data || error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Clove Firms</h2>

      <div className="border p-4 bg-gray-50 rounded mb-8">
        <h3 className="text-xl mb-2">{editingFirm ? 'Edit Clove Firm' : 'Add Clove Firm'}</h3>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="border p-2" required />
          <input name="owner" value={formData.owner} onChange={handleInputChange} placeholder="Owner" className="border p-2" required />
          <input name="size" value={formData.size} onChange={handleInputChange} placeholder="Size" type="number" className="border p-2" />
          <input name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" type="number" className="border p-2" />
          <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" className="border p-2" />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="border p-2 col-span-2" />

          <select name="cloves" value={formData.cloves} onChange={handleInputChange} className="border p-2 col-span-2" required>
            <option value="">Select Clove</option>
            {clovesOptions.map((clove) => (
              <option key={clove.id} value={clove.id}>
                {clove.grade}
              </option>
            ))}
          </select>

          <label className="col-span-2 flex items-center">
            <input type="checkbox" name="is_verified" checked={formData.is_verified} onChange={handleInputChange} className="mr-2" />
            Verified
          </label>
          <textarea name="verification_comment" value={formData.verification_comment} onChange={handleInputChange} placeholder="Verification Comment" className="border p-2 col-span-2" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 col-span-2">
            {editingFirm ? 'Update' : 'Add'}
          </button>
        </form>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Owner</th>
            <th className="border px-2 py-1">Size</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Location</th>
            <th className="border px-2 py-1">Verified</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cloveFirms.map((firm) => (
            <tr key={firm.id}>
              <td className="border px-2 py-1">{firm.id}</td>
              <td className="border px-2 py-1">{firm.name}</td>
              <td className="border px-2 py-1">{firm.owner}</td>
              <td className="border px-2 py-1">{firm.size}</td>
              <td className="border px-2 py-1">{firm.price}</td>
              <td className="border px-2 py-1">{firm.location}</td>
              <td className="border px-2 py-1">{firm.is_verified ? 'Yes' : 'No'}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEditClick(firm)} className="bg-yellow-400 px-2 py-1 mr-2 rounded">Edit</button>
                <button onClick={() => handleDeleteClick(firm.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCloveFirms;
