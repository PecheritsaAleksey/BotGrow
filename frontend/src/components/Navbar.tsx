import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-semibold text-blue-600' : 'text-gray-600';

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-2 flex gap-4 items-center">
        {isAuthenticated && (
          <>
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/bots" className={linkClass}>
              Bots
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              Settings
            </NavLink>
            <div className="ml-auto flex items-center gap-2">
              {user?.username && (
                <span className="text-sm text-gray-500">@{user.username}</span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
