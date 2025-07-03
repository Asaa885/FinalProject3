// src/Services/boardService.js (au src/services/boardService.js kulingana na folder yako)
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/board/';

const getBoards = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

const createBoard = async (boardData) => {
  const res = await axios.post(API_BASE, boardData);
  return res.data;
};

const boardService = {
  getBoards,
  createBoard,
};

export default boardService;
