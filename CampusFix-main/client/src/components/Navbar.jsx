import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-brand-600 text-lg">CampusFix</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/notifications" className="text-sm text-gray-600 hover:text-brand-600">Notifications</Link>
            <Link to="/profile" className="text-sm text-gray-600 hover:text-brand-600">{user.name}</Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-brand-600">Login</Link>
            <Link to="/register" className="text-sm px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
