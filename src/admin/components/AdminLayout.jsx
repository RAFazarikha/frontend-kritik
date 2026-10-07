import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAdminAuth from '../../hooks/useAdminAuth';
import Toast from './Toast';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/confesses', label: 'Confesses', icon: '💌' },
];

export default function AdminLayout({ children }) {
  const { token, logout, error } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    setDrawerOpen(false);
  };

  const activeNav = NAV_ITEMS.find((n) => location.pathname === n.path)
    || location.pathname.replace('/admin/confesses', '/admin/confesses');

  return (
    <div className="admin-layout">
      <aside className="sidebar" aria-label="Admin navigation">
        <div className="nav-item" style={{ pointerEvents: 'none', cursor: 'default' }}>
          <span>💌</span>
          <span style={{ fontWeight: 700, color: '#E9D5FF' }}>Admin Panel</span>
        </div>
        <div className="nav-label">Menu</div>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <button onClick={handleLogout} className="nav-item" aria-label="Logout">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-content">
        <button
          className="md:hidden fixed top-3 left-3 z-50 p-2 rounded bg-[#1E293B] text-[#E2E8F0] border border-[#334155]"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="md:hidden">
          {drawerOpen && (
            <>
              <div className="overlay" onClick={() => setDrawerOpen(false)} />
              <div
                className="drawer"
                role="dialog"
                aria-label="Mobile navigation"
              >
                <div
                  className="nav-item"
                  style={{ pointerEvents: 'none', cursor: 'default', color: '#E9D5FF' }}
                >
                  <span>💌</span>
                  <span style={{ fontWeight: 700 }}>Admin Panel</span>
                </div>
                {NAV_ITEMS.map((item) => (
                  <div
                    key={item.path}
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => {
                      navigate(item.path);
                      setDrawerOpen(false);
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
                <button onClick={handleLogout} className="nav-item">
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
        {children}
      </main>

      {error && <Toast type="error" message={error} />}
    </div>
  );
}