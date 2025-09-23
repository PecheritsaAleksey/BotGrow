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
    isActive
      ? 'px-2 py-1 rounded-xl font-medium text-primary'
      : 'px-2 py-1 rounded-xl text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

  return (
    <nav className="bg-surface border-b border-border">
      <div className="container mx-auto px-4 py-3 flex gap-4 items-center">
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
            <div className="ml-auto flex items-center gap-3">
              {user?.username && (
                <span className="text-sm text-text-muted">
                  @{user.username}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="btn-ghost text-error text-sm"
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
