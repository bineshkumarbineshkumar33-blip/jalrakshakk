import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { getReports, updateReport, saveFleetStatus } from "../lib/storage";
import { WASTE_CLASSES, priorityTier } from "../lib/priority";
import { teamForUnit } from "../lib/teams";
import { awardPoints } from "../lib/rewards";
import StatusBadge from "../components/StatusBadge";

const N_UNITS = 3;
const DEPOT = [17.385, 78.4867];
const TICK_MS = 900;
const STEP = 0.06;
const ARRIVE_EPS = 0.01;

function unitIcon(status) {
  const color = status === "enroute" ? "#4CC9C0" : "#2E5266";
  return L.divIcon({ className: "", html: `<div style="width:14px;height:14px;border-radius:4px;background:${color};border:2px solid #0B2027;transform:rotate(45deg);box-shadow:0 0 8px ${color};"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
}
function reportIcon(classKey, status) {
  const c = WASTE_CLASSES.find((c) => c.key === classKey);
  const color = status === "Cleaned" ? "#4CC9C0" : c?.color || "#D4A24C";
  const opacity = status === "Cleaned" ? 0.4 : 1;
  return L.divIcon({ className: "", html: `<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:${color};opacity:${opacity};transform:rotate(-45deg);border:2px solid #0B2027;"></div>`, iconSize: [18, 18], iconAnchor: [9, 18] });
}

export default function Dashboard() {
  const [reports, setReports] = useState(getReports());
  const [units, setUnits] = useState(
    Array.from({ length: N_UNITS }, (_, i) => ({
      id: i,
      pos: [DEPOT[0] + (Math.random() - 0.5) * 0.02, DEPOT[1] + (Math.random() - 0.5) * 0.02],
      status: "idle",
      targetId: null,
    }))
  );
  const reportsRef = useRef(reports);
  reportsRef.current = reports;

  useEffect(() => {
    const interval = setInterval(() => tick(), TICK_MS);
    return () => clearInterval(interval);
  }, []);

  function tick() {
    let current = getReports();
    current = current.map((r) => (r.status === "Reported" && Date.now() - r.createdAt > 1800 ? { ...r, status: "Verified" } : r));

    setUnits((prevUnits) => {
      let units = prevUnits.map((u) => ({ ...u }));
      const assignedIds = new Set(units.filter((u) => u.targetId).map((u) => u.targetId));
      const queue = current.filter((r) => r.status === "Verified" && !assignedIds.has(r.id)).sort((a, b) => b.score - a.score);

      units.forEach((u) => {
        if (u.status === "idle" && queue.length) {
          const target = queue.shift();
          u.targetId = target.id;
          u.status = "enroute";
          const team = teamForUnit(u.id);
          const etaMinutes = 3 + Math.round(Math.random() * 5);
          current = current.map((r) => (r.id === target.id ? { ...r, status: "Dispatched", assignedTeam: team, dispatchedAt: Date.now(), etaMinutes } : r));
        }
      });

      units = units.map((u) => {
        if (u.status !== "enroute") return u;
        const target = current.find((r) => r.id === u.targetId);
        if (!target) return { ...u, status: "idle", targetId: null };
        const dx = target.position[0] - u.pos[0];
        const dy = target.position[1] - u.pos[1];
        const dist = Math.hypot(dx, dy);
        if (dist < ARRIVE_EPS) {
          current = current.map((r) => (r.id === target.id ? { ...r, status: "Cleaned", cleanedAt: Date.now() } : r));
          if (target.reporterName) awardPoints(target.reporterName, 25);
          return { ...u, status: "idle", targetId: null };
        }
        return { ...u, pos: [u.pos[0] + dx * STEP, u.pos[1] + dy * STEP] };
      });

      saveFleetStatus(units);
      return units;
    });

    current.forEach((r) => {
      const prev = reportsRef.current.find((p) => p.id === r.id);
      if (prev && prev.status !== r.status) updateReport(r.id, { status: r.status });
    });
    setReports(current);
  }

  const active = [...reports].filter((r) => r.status !== "Cleaned").sort((a, b) => b.score - a.score);
  const cleaned = reports.filter((r) => r.status === "Cleaned");

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">Live Dashboard</p>
      <h1 className="font-display font-bold text-3xl mb-1">Fleet &amp; priority queue</h1>
      <p className="text-mistDim text-sm mb-8">
        Simulated autonomous cleanup fleet — {N_UNITS} units routed by the priority engine.
      </p>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="rounded-xl overflow-hidden border border-riverLight/40" style={{ height: 480 }}>
          <MapContainer center={DEPOT} zoom={11} style={{ height: "100%", width: "100%" }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {reports.map((r) => (
              <Marker key={r.id} position={r.position} icon={reportIcon(r.classKey, r.status)}>
                <Popup><span className="font-mono text-xs">{WASTE_CLASSES.find((c) => c.key === r.classKey)?.label} · score {r.score} · {r.status}</span></Popup>
              </Marker>
            ))}
            {units.map((u) => (
              <Marker key={u.id} position={u.pos} icon={unitIcon(u.status)}>
                <Popup><span className="font-mono text-xs">Unit {u.id + 1} · {u.status}</span></Popup>
              </Marker>
            ))}
            <CircleMarker center={DEPOT} radius={5} pathOptions={{ color: "#9FB3AF" }} />
          </MapContainer>
        </div>

        <div className="space-y-3">
          <h3 className="font-display font-semibold text-mist mb-1">Priority queue ({active.length})</h3>
          {active.length === 0 && <p className="font-mono text-xs text-mistDim">No open reports yet — submit one from the Recycle page.</p>}
          {active.map((r) => {
            const c = WASTE_CLASSES.find((c) => c.key === r.classKey);
            const tier = priorityTier(r.score);
            return (
              <Link to={`/track/${r.id}`} key={r.id} className="bg-river/60 border border-riverLight/40 rounded-lg p-4 flex items-center justify-between gap-3 hover:border-cyan/50 transition">
                <div>
                  <p className="font-display font-semibold text-sm" style={{ color: c?.color }}>{c?.label}</p>
                  <p className="font-mono text-xs text-mistDim mt-0.5">score {r.score} · {tier.label} · {r.reporterName || "Anonymous"}</p>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            );
          })}

          {cleaned.length > 0 && (
            <>
              <h3 className="font-display font-semibold text-mist mt-6 mb-1">Cleaned ({cleaned.length})</h3>
              {cleaned.map((r) => (
                <div key={r.id} className="opacity-50 bg-river/60 border border-riverLight/40 rounded-lg p-4 flex items-center justify-between">
                  <p className="font-mono text-xs text-mistDim">{WASTE_CLASSES.find((c) => c.key === r.classKey)?.label}</p>
                  <StatusBadge status="Cleaned" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
