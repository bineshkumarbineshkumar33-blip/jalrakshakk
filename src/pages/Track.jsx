import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getReport, updateReport } from "../lib/storage";
import { WASTE_CLASSES, priorityTier, classInfo } from "../lib/priority";
import { OPS_MANAGER } from "../lib/teams";
import StatusBadge from "../components/StatusBadge";

const STAGES = ["Reported", "Verified", "Dispatched", "Cleaned"];

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => onChange(n)} className="text-2xl leading-none" style={{ color: n <= value ? "#D4A24C" : "#2E5266" }}>★</button>
      ))}
    </div>
  );
}

export default function Track() {
  const { id } = useParams();
  const [report, setReport] = useState(() => getReport(id));
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setReport(getReport(id)), 1000);
    return () => clearInterval(interval);
  }, [id]);

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-mistDim">Report not found in this browser's storage.</p>
        <Link to="/dashboard" className="text-cyan font-mono text-sm hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const wasteClass = classInfo(report.classKey);
  const tier = priorityTier(report.score);
  const stageIndex = STAGES.indexOf(report.status);

  function submitFeedback(e) {
    e.preventDefault();
    updateReport(report.id, { feedback: { rating, comment, submittedAt: Date.now() } });
    setFeedbackSaved(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">Report Tracking</p>
      <h1 className="font-display font-bold text-3xl mb-1" style={{ color: wasteClass?.color }}>{wasteClass?.label}</h1>
      <p className="font-mono text-xs text-mistDim mb-2">
        Reported by {report.reporterName || "Anonymous"} · Priority {report.score}/100 · {tier.label}
      </p>
      {wasteClass?.disposal && <p className="font-mono text-xs text-mistDim mb-8">{wasteClass.disposal}</p>}

      <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {STAGES.map((stage, i) => (
            <div key={stage} className="flex-1 flex flex-col items-center relative">
              {i > 0 && <div className="absolute top-2.5 right-1/2 w-full h-0.5 -z-10" style={{ background: i <= stageIndex ? "#4CC9C0" : "#2E5266" }} />}
              <div className="w-5 h-5 rounded-full border-2" style={{ background: i <= stageIndex ? "#4CC9C0" : "#173A44", borderColor: i <= stageIndex ? "#4CC9C0" : "#2E5266" }} />
              <p className="font-mono text-xs text-mistDim mt-2 text-center">{stage}</p>
            </div>
          ))}
        </div>
      </div>

      {report.assignedTeam ? (
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6 mb-6">
          <h3 className="font-display font-semibold text-mist mb-3">Assigned cleanup team</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-mist">{report.assignedTeam.inchargeName}</p>
              <p className="font-mono text-xs text-mistDim">{report.assignedTeam.role} · {report.assignedTeam.unit}</p>
            </div>
            <a href={`tel:${report.assignedTeam.phone}`} className="font-mono text-sm text-cyan hover:underline">{report.assignedTeam.phone}</a>
          </div>
          {report.status === "Dispatched" && report.etaMinutes && (
            <p className="font-mono text-xs text-silt mt-4">Estimated arrival: ~{report.etaMinutes} min from dispatch</p>
          )}
          <div className="border-t border-riverLight/40 mt-4 pt-4">
            <p className="font-mono text-xs text-mistDim">Escalate to ops manager</p>
            <p className="font-display text-sm text-mist mt-1">{OPS_MANAGER.name} · {OPS_MANAGER.role}</p>
            <a href={`tel:${OPS_MANAGER.phone}`} className="font-mono text-xs text-cyan hover:underline">{OPS_MANAGER.phone}</a>
          </div>
        </div>
      ) : (
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6 mb-6">
          <p className="font-mono text-sm text-mistDim">Awaiting AI verification — a team will be auto-assigned once verified and a unit is available.</p>
        </div>
      )}

      {report.status === "Cleaned" && (
        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6">
          <h3 className="font-display font-semibold text-mist mb-1">Rate this cleanup</h3>
          {report.feedback || feedbackSaved ? (
            <p className="font-mono text-sm text-cyan mt-2">Thanks for the feedback — this helps improve routing.</p>
          ) : (
            <form onSubmit={submitFeedback} className="mt-3 space-y-3">
              <Stars value={rating} onChange={setRating} />
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional comment" className="w-full bg-deep border border-riverLight/50 rounded px-3 py-2 text-mist font-mono text-sm" rows={2} />
              <button type="submit" disabled={rating === 0} className="bg-cyan text-deep font-display font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition disabled:opacity-40">Submit feedback</button>
            </form>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <StatusBadge status={report.status} />
        <Link to="/dashboard" className="font-mono text-xs text-mistDim hover:text-cyan">← Back to dashboard</Link>
      </div>
    </div>
  );
}
