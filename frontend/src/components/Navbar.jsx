import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>TaskManager</Link>
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="btn btn-primary" style={{ background: 'transparent', border: '1px solid var(--panel-border)' }}>Dashboard</Link>
            <button onClick={onLogout} className="btn btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn" style={{ color: 'var(--text-main)' }}>Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
