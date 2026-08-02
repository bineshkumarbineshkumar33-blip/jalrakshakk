import { useEffect, useState } from "react";
import { getReports } from "../lib/storage";
import { getFleetStatus, getTickets, addTicket, resolveTicket } from "../lib/storage";
import { TEAMS, OPS_MANAGER } from "../lib/teams";
import { getCurrentUser } from "../lib/auth";

export default function Management() {
  const [reports, setReports] = useState(getReports());
  const [fleet, setFleet] = useState(getFleetStatus());
  const [tickets, setTickets] = useState(getTickets());
  const [question, setQuestion] = useState("");
  const user = getCurrentUser();

  useEffect(() => {
    const interval = setInterval(() => {
      setReports(getReports());
      setFleet(getFleetStatus());
      setTickets(getTickets());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const working = fleet?.units.filter((u) => u.status === "enroute").length || 0;
  const idle = fleet?.units.filter((u) => u.status === "idle").length || 0;

  function submitTicket(e) {
    e.preventDefault();
    if (!question.trim()) return;
    addTicket({ id: crypto.randomUUID(), question, from: user?.name || "Anonymous", createdAt: Date.now(), resolved: false });
    setQuestion("");
    setTickets(getTickets());
  }

  const openTickets = tickets.filter((t) => !t.resolved);
  const resolvedTickets = tickets.filter((t) => t.resolved);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">Management</p>
      <h1 className="font-display font-bold text-3xl mb-1">Workforce &amp; fleet oversight</h1>
      <p className="text-mistDim text-sm mb-8">
        We give jobs to the people who maintain and operate the autonomous cleanup boats — this is
        where their status, location, and tooling get tracked, and where any user's doubts reach us directly.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-4">
          <p className="font-display font-bold text-2xl text-cyan">{fleet?.units.length || 0}</p>
          <p className="font-mono text-xs text-mistDim mt-1">Total boats deployed</p>
        </div>
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-4">
          <p className="font-display font-bold text-2xl text-silt">{working}</p>
          <p className="font-mono text-xs text-mistDim mt-1">Currently working (en route)</p>
        </div>
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-4">
          <p className="font-display font-bold text-2xl text-cyan">{idle}</p>
          <p className="font-mono text-xs text-mistDim mt-1">Available / idle</p>
        </div>
      </div>

      <h3 className="font-display font-semibold text-mist mb-3">Field jobs — boat maintenance &amp; operations</h3>
      <p className="font-mono text-xs text-mistDim mb-1">Reporting to {OPS_MANAGER.name}, {OPS_MANAGER.role}</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-10 mt-3">
        {TEAMS.map((t, i) => {
          const unit = fleet?.units.find((u) => u.id === t.id);
          const status = unit?.status === "enroute" ? "On a cleanup run" : "Available / maintaining boat";
          return (
            <div key={t.id} className="bg-river/60 border border-riverLight/40 rounded-xl p-4">
              <p className="font-display text-mist">{t.inchargeName}</p>
              <p className="font-mono text-xs text-mistDim">{t.role} · {t.unit}</p>
              <a href={`tel:${t.phone}`} className="font-mono text-xs text-cyan hover:underline block mt-1">{t.phone}</a>
              <p className="font-mono text-xs mt-2" style={{ color: unit?.status === "enroute" ? "#D4A24C" : "#4CC9C0" }}>{status}</p>
            </div>
          );
        })}
      </div>

      <h3 className="font-display font-semibold text-mist mb-3">Help center</h3>
      <p className="text-mistDim text-sm mb-4">Got a doubt while or after uploading a report? Ask here — it goes straight to the management team.</p>
      <form onSubmit={submitTicket} className="bg-river/60 border border-riverLight/40 rounded-xl p-6 mb-6 flex gap-3">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question or doubt…"
          className="flex-1 bg-deep border border-riverLight/50 rounded px-3 py-2 text-mist font-mono text-sm" />
        <button type="submit" className="bg-cyan text-deep font-display font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition shrink-0">Ask</button>
      </form>

      <div className="space-y-2">
        {openTickets.map((t) => (
          <div key={t.id} className="bg-river/60 border border-riverLight/40 rounded-lg p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-mist">{t.question}</p>
              <p className="font-mono text-xs text-mistDim mt-1">from {t.from}</p>
            </div>
            <button onClick={() => { resolveTicket(t.id); setTickets(getTickets()); }} className="font-mono text-xs text-cyan hover:underline shrink-0">Mark resolved</button>
          </div>
        ))}
        {resolvedTickets.length > 0 && (
          <>
            <p className="font-mono text-xs text-mistDim mt-4">Resolved ({resolvedTickets.length})</p>
            {resolvedTickets.map((t) => (
              <div key={t.id} className="opacity-50 bg-river/60 border border-riverLight/40 rounded-lg p-4">
                <p className="font-mono text-sm text-mist">{t.question}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
