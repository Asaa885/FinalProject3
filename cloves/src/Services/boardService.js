// src/services/boardService.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/board/';

// Get Authorization headers if token exists
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET all boards
const getBoards = async () => {
  try {
    const res = await axios.get(API_BASE, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching boards:', error.response || error.message);
    throw error;
  }
};

// GET a single board by ID
const getBoard = async (id) => {
  if (!id) throw new Error('Board ID is required');
  try {
    const res = await axios.get(`${API_BASE}${id}/`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching board ${id}:`, error.response || error.message);
    throw error;
  }
};

// POST create a new board
const createBoard = async (boardData) => {
  if (!boardData || typeof boardData !== 'object') {
    throw new Error('boardData must be an object');
  }
  try {
    const res = await axios.post(API_BASE, boardData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error creating board:', error.response || error.message);
    throw error;
  }
};

// PUT update an existing board by ID
const updateBoard = async (id, boardData) => {
  if (!id) throw new Error('Board ID is required');
  if (!boardData || typeof boardData !== 'object') {
    throw new Error('boardData must be an object');
  }
  try {
    const res = await axios.put(`${API_BASE}${id}/`, boardData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating board ${id}:`, error.response || error.message);
    throw error;
  }
};

// DELETE a board by ID
const deleteBoard = async (id) => {
  if (!id) throw new Error('Board ID is required');
  try {
    const res = await axios.delete(`${API_BASE}${id}/`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting board ${id}:`, error.response || error.message);
    throw error;
  }
};

const boardService = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};

export default boardService;
