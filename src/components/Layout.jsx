import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children }) {
  const { logout, user } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/projects" className="text-xl font-bold text-emerald-700">
            🌍 Darukaa.Earth
          </Link>
          {user && (
            <nav className="flex items-center gap-6">
              <Link
                to="/projects"
                className={`text-sm ${pathname.startsWith('/projects') ? 'text-emerald-700 font-medium' : ''}`}
              >
                Projects
              </Link>

              <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600">
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
