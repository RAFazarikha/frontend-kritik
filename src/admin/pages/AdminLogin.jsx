import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Toast from '../components/Toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Gagal login');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50">
      <div className="flex min-h-screen items-center justify-center bg-white bg-opacity-10 p-10">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6">
            <span className="text-3xl font-bold text-rose-500">💌</span>
            <span className="text-2xl font-bold text-amber-500 ml-1">Confess</span>
            <span className="text-sm font-light text-gray-500 ml-2">Admin Dashboard</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                placeholder="password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-indigo-500 focus:ring-2 focus:ring-indigo-300 transition duration-150 ease-in-out"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      {error && <Toast type="error" message={error} />}
    </div>
  );
}