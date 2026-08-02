import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const res = login({ email, password });
    if (!res.ok) return setError(res.error);
    navigate("/profile");
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">Welcome back</p>
      <h1 className="font-display font-bold text-3xl mb-8">Log in to JalRakshak</h1>

      <form onSubmit={handleSubmit} className="bg-river/60 border border-riverLight/40 rounded-xl p-6 space-y-4">
        <div>
          <label className="font-mono text-xs text-mistDim block mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-deep border border-riverLight/50 rounded px-3 py-2 text-mist font-mono text-sm" />
        </div>
        <div>
          <label className="font-mono text-xs text-mistDim block mb-1">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-deep border border-riverLight/50 rounded px-3 py-2 text-mist font-mono text-sm" />
        </div>
        {error && <p className="font-mono text-xs text-rust">{error}</p>}
        <button type="submit" className="w-full bg-cyan text-deep font-display font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition">
          Log In
        </button>
      </form>

      <p className="font-mono text-xs text-mistDim mt-4 text-center">
        No account yet? <Link to="/signup" className="text-cyan hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
