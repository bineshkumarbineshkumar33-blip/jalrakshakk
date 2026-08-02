import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../lib/auth";
import { pointsFor, tierFor } from "../lib/rewards";

const linkClass = ({ isActive }) =>
  `font-mono text-xs sm:text-sm tracking-wide px-2.5 py-2 rounded transition-colors whitespace-nowrap ${
    isActive ? "text-cyan bg-river" : "text-mistDim hover:text-mist"
  }`;

export default function Navbar() {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setUser(getCurrentUser()), 1500);
    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    navigate("/");
  }

  const points = user ? pointsFor(user.name) : 0;
  const tier = tierFor(points);

  return (
    <header className="border-b border-riverLight/40 sticky top-0 z-30 bg-deep/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan animate-pulseDot" />
          <span className="font-display font-bold text-lg tracking-tight">JalRakshak</span>
        </NavLink>

        <nav className="flex items-center gap-0.5 flex-wrap">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/management" className={linkClass}>Management</NavLink>
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/recycle" className={linkClass}>Recycle</NavLink>
          <NavLink to="/incentives" className={linkClass}>Incentives Board</NavLink>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <NavLink to="/profile" className="font-mono text-xs text-mist hover:text-cyan flex items-center gap-2">
                <span>{user.name}</span>
                <span className="px-2 py-0.5 rounded-full" style={{ background: `${tier.color}22`, color: tier.color }}>
                  {points} pts
                </span>
              </NavLink>
              <button onClick={handleLogout} className="font-mono text-xs text-mistDim hover:text-rust">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="font-mono text-xs text-mist hover:text-cyan">Login</NavLink>
              <NavLink to="/signup" className="bg-cyan text-deep font-mono text-xs px-3 py-1.5 rounded-lg hover:brightness-110">Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
