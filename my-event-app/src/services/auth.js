import api, { setAuthToken } from '../utils/api';

export async function register(payload){
  const res = await api.post('/auth/register', payload);
  const token = res.data.token;
  if(token) { localStorage.setItem('token', token); setAuthToken(token); }
  return res.data;
}

export async function login({email, password}){
  const res = await api.post('/auth/login', {email,password});
  const token = res.data.token;
  if(token) { localStorage.setItem('token', token); setAuthToken(token); }
  return res.data;
}

export function logout(){
  localStorage.removeItem('token'); setAuthToken(null);
}
export function initAuth(){
  const token = localStorage.getItem('token');
  if(token) setAuthToken(token);
}
