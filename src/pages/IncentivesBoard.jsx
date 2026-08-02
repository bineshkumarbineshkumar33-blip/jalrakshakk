import { useEffect, useState } from "react";
import { leaderboard, TIERS, REWARDS_CATALOG, pointsFor } from "../lib/rewards";
import { getCurrentUser } from "../lib/auth";

export default function IncentivesBoard() {
  const [rows, setRows] = useState(leaderboard());
  const user = getCurrentUser();

  useEffect(() => {
    const interval = setInterval(() => setRows(leaderboard()), 1500);
    return () => clearInterval(interval);
  }, []);

  const myPoints = user ? pointsFor(user.name) : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">Incentives Board</p>
      <h1 className="font-display font-bold text-3xl mb-2">Guardian points, tiers &amp; rewards</h1>
      <p className="text-mistDim text-sm mb-8 leading-relaxed">
        Every verified report earns points. Once your credits reach a threshold, you unlock real
        rewards — including furniture crafted from the very trash this platform recycles.
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        {TIERS.map((t) => (
          <span key={t.label} className="font-mono text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: t.color, color: t.color }}>
            {t.label} · {t.min}+ pts
          </span>
        ))}
      </div>

      <h3 className="font-display font-semibold text-mist mb-3">Rewards store</h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {REWARDS_CATALOG.map((r) => {
          const unlocked = myPoints >= r.threshold;
          return (
            <div key={r.title} className={`bg-river/60 border rounded-xl p-4 ${unlocked ? "border-cyan/50" : "border-riverLight/40 opacity-70"}`}>
              <p className="font-mono text-xs text-silt">{r.threshold} pts</p>
              <p className="font-display font-semibold text-mist mt-1">{r.title}</p>
              <p className="font-mono text-xs text-mistDim mt-1">{r.desc}</p>
              <p className="font-mono text-xs mt-2" style={{ color: unlocked ? "#4CC9C0" : "#9FB3AF" }}>
                {unlocked ? "✓ Unlocked" : user ? `${r.threshold - myPoints} pts to go` : "Log in to track progress"}
              </p>
            </div>
          );
        })}
      </div>

      <h3 className="font-display font-semibold text-mist mb-3">Leaderboard</h3>
      <div className="space-y-2">
        {rows.length === 0 && <p className="font-mono text-sm text-mistDim">No reports yet — be the first Guardian on the board.</p>}
        {rows.map((r, i) => (
          <div key={r.name} className="bg-river/60 border border-riverLight/40 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-mistDim w-6">{i + 1}</span>
              <div>
                <p className="font-display text-mist">{r.name}</p>
                <p className="font-mono text-xs" style={{ color: r.tier.color }}>{r.tier.label}</p>
              </div>
            </div>
            <p className="font-mono text-lg text-cyan">{r.points} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
}
