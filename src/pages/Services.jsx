import { useEffect, useState } from "react";
import { getReports, getFleetStatus } from "../lib/storage";
import { WASTE_CLASSES } from "../lib/priority";
import ImpactChart from "../components/ImpactChart";

function dayLabel(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Services() {
  const [reports, setReports] = useState(getReports());
  const [fleet, setFleet] = useState(getFleetStatus());

  useEffect(() => {
    const interval = setInterval(() => { setReports(getReports()); setFleet(getFleetStatus()); }, 1500);
    return () => clearInterval(interval);
  }, []);

  const totalBoats = fleet?.units.length || 0;
  const working = fleet?.units.filter((u) => u.status === "enroute").length || 0;
  const available = totalBoats - working;

  const today = dayLabel(Date.now());
  const dispatchedToday = reports.filter((r) => dayLabel(r.dispatchedAt || 0) === today).length;
  const pending = reports.filter((r) => ["Reported", "Verified"].includes(r.status)).length;
  const cleanedToday = reports.filter((r) => dayLabel(r.cleanedAt || 0) === today).length;

  const byDay = {};
  reports.forEach((r) => {
    const key = dayLabel(r.createdAt);
    byDay[key] = byDay[key] || { label: key, reported: 0, cleaned: 0 };
    byDay[key].reported += 1;
    if (r.status === "Cleaned") byDay[key].cleaned += 1;
  });
  const trend = Object.values(byDay).length ? Object.values(byDay) : [{ label: today, reported: 0, cleaned: 0 }];

  const total = reports.length;
  const cleaned = reports.filter((r) => r.status === "Cleaned").length;
  const cleanRate = total ? Math.round((cleaned / total) * 100) : 0;

  const byClass = WASTE_CLASSES.filter((c) => c.key !== "clean").map((c) => {
    const items = reports.filter((r) => r.classKey === c.key);
    return { ...c, count: items.length, cleaned: items.filter((r) => r.status === "Cleaned").length };
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">Services</p>
      <h1 className="font-display font-bold text-3xl mb-1">Fleet availability &amp; cleanup activity</h1>
      <p className="text-mistDim text-sm mb-8">How many boats are available, how many went out to clean today, and whether the waters are actually getting cleaner over time.</p>

      <div className="grid sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-4">
          <p className="font-display font-bold text-2xl text-cyan">{available}/{totalBoats}</p>
          <p className="font-mono text-xs text-mistDim mt-1">Boats available now</p>
        </div>
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-4">
          <p className="font-display font-bold text-2xl text-silt">{dispatchedToday}</p>
          <p className="font-mono text-xs text-mistDim mt-1">Sent to clean today</p>
        </div>
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-4">
          <p className="font-display font-bold text-2xl text-cyan">{cleanedToday}</p>
          <p className="font-mono text-xs text-mistDim mt-1">Cleaned today</p>
        </div>
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-4">
          <p className="font-display font-bold text-2xl text-rust">{pending}</p>
          <p className="font-mono text-xs text-mistDim mt-1">Pending sites</p>
        </div>
      </div>

      <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-display font-semibold text-mist">Is it getting cleaner? Reported vs. cleaned, by day</h3>
          <p className="font-mono text-xs text-cyan">{cleanRate}% resolution rate</p>
        </div>
        <div className="flex gap-4 font-mono text-xs mb-4">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#D4A24C" }} /> Reported</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#4CC9C0" }} /> Cleaned</span>
        </div>
        <ImpactChart data={trend} />
      </div>

      <h3 className="font-display font-semibold text-mist mb-3">By pollution category</h3>
      <div className="space-y-2">
        {byClass.map((c) => (
          <div key={c.key} className="bg-river/60 border border-riverLight/40 rounded-lg p-4 flex items-center justify-between">
            <p className="font-display text-sm" style={{ color: c.color }}>{c.label}</p>
            <p className="font-mono text-xs text-mistDim">{c.cleaned} cleaned / {c.count} reported</p>
          </div>
        ))}
      </div>
    </div>
  );
}
