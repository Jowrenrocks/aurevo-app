import axios from 'axios';
const base = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const api = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export function setAuthToken(token){
  if(token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}
export default api;