import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { getCurrentUser } from "../lib/auth";
import { getReports } from "../lib/storage";
import { pointsFor, tierFor, REWARDS_CATALOG } from "../lib/rewards";
import { WASTE_CLASSES } from "../lib/priority";
import StatusBadge from "../components/StatusBadge";

export default function Profile() {
  const [user] = useState(getCurrentUser());
  const [reports, setReports] = useState(getReports());

  useEffect(() => {
    const interval = setInterval(() => setReports(getReports()), 1500);
    return () => clearInterval(interval);
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const points = pointsFor(user.name);
  const tier = tierFor(points);
  const mine = reports.filter((r) => r.reporterName === user.name);
  const nextReward = REWARDS_CATALOG.find((r) => r.threshold > points);

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">My Profile</p>
      <h1 className="font-display font-bold text-3xl mb-1">{user.name}</h1>
      <p className="font-mono text-xs text-mistDim mb-8">{user.email}</p>

      <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6 mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs" style={{ color: tier.color }}>{tier.label}</p>
          <p className="font-display font-bold text-3xl text-cyan mt-1">{points} pts</p>
        </div>
        {nextReward && (
          <p className="font-mono text-xs text-mistDim text-right max-w-[200px]">
            {nextReward.threshold - points} pts to unlock <span className="text-silt">{nextReward.title}</span>
          </p>
        )}
      </div>

      <h3 className="font-display font-semibold text-mist mb-3">My reports ({mine.length})</h3>
      <div className="space-y-2">
        {mine.length === 0 && (
          <p className="font-mono text-sm text-mistDim">
            No reports yet — <Link to="/recycle" className="text-cyan hover:underline">submit your first one</Link>.
          </p>
        )}
        {mine.map((r) => {
          const c = WASTE_CLASSES.find((c) => c.key === r.classKey);
          return (
            <Link key={r.id} to={`/track/${r.id}`} className="bg-river/60 border border-riverLight/40 rounded-lg p-4 flex items-center justify-between hover:border-cyan/50 transition">
              <p className="font-display text-sm" style={{ color: c?.color }}>{c?.label}</p>
              <StatusBadge status={r.status} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
