// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full p-3 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full p-3 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Don't have an account? <Link to="/register" className="text-indigo-600">Create one</Link>
      </p>
    </div>
  );
}
