import React, { useState } from 'react';
import { login } from '../services/auth';
export default function Login({onSuccess}){
  const [email,setEmail] = useState(''); const [password,setPassword] = useState('');
  const [err,setErr] = useState(null);
  async function submit(e){
    e.preventDefault();
    try{
      await login({email,password});
      onSuccess && onSuccess();
    }catch(e){
      setErr(e.response?.data?.error || 'Login failed');
    }
  }
  return (
    <form onSubmit={submit}>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
      <button>Login</button>
      {err && <div style={{color:'red'}}>{err}</div>}
    </form>
  );
}
