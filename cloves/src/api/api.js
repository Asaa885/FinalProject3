// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",  // badilisha kama backend yako ipo sehemu nyingine
  // headers: {
  //   Authorization: "Bearer token_yako", // kama unatumia authentication
  // },
});

export default api;
