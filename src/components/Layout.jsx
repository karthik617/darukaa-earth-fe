import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Layout({ children }) {
  const { user ,logout } = useAuth();
  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/projects" className="font-bold text-lg">Darukaa.Earth</Link>
          <div className="flex items-center gap-3">
            {user && <button onClick={() => { logout(); window.location.href = '/login'; }} className="text-sm">Logout</button>}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
