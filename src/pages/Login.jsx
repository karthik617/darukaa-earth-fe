import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      nav('/projects');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-emerald-700">Darukaa.Earth</h1>
        <p className="text-center text-slate-500 mt-2">Carbon & Biodiversity Analytics</p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary w-full mt-2" disabled={loading} type="submit">
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <div className="mt-6 text-sm text-center text-slate-500">
            <Link to="/register" className="text-blue-600 font-medium">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
