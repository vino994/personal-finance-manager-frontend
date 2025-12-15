// src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full p-3 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
