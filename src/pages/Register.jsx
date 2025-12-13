import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { authApi } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.post('/auth/register', form);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-slate-800">Create your account</h1>
        <p className="text-sm text-slate-500 mt-1">Start managing carbon & biodiversity projects</p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={update}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-100"
              placeholder="john@email.com"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={update}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-100"
            />
          </div>

          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
