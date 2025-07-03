import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"; // <- icons

const fieldsMap = {
  renter: ["name", "email", "phone"],
  clove_farmer: ["name", "location", "nida"],
  clove_firm: ["name", "address"],
  cloves: ["type", "quantity", "price"],
  payment: ["amount", "method", "date"],
  purchase: ["buyer", "clove_id", "amount"],
  board: ["name", "role"],
  officer: ["name", "department"],
};

const ModelManagement = ({ model }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const fields = fieldsMap[model] || [];

  useEffect(() => {
    fetchData();
    setForm({});
    setEditId(null);
  }, [model]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/${model}/`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/${model}/${editId}/`, form);
      } else {
        await axios.post(`/api/${model}/`, form);
      }
      fetchData();
      setForm({});
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/${model}/${id}/`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (item) => {
    alert(JSON.stringify(item, null, 2)); // You can replace this with a modal or custom view
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-4 capitalize">Manage {model.replace("_", " ")}</h2>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        {fields.map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={form[field] || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        ))}
        <div className="flex space-x-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editId ? "Update" : "Add"} {model}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setForm({});
                setEditId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="w-full text-left border mt-4">
        <thead>
          <tr>
            <th>ID</th>
            {fields.map((field) => (
              <th key={field}>{field}</th>
            ))}
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td>{item.id}</td>
              {fields.map((field) => (
                <td key={field}>{item[field]}</td>
              ))}
              <td className="flex justify-center space-x-2 py-1">
                <button onClick={() => handleView(item)} className="text-blue-500 hover:text-blue-700">
                  <FaEye />
                </button>
                <button onClick={() => handleEdit(item)} className="text-yellow-500 hover:text-yellow-700">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModelManagement;
