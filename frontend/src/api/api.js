// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://220.68.27.140:8000",
});

export default api;
