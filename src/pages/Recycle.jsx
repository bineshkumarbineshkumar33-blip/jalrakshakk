import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TrainPanel from "../components/TrainPanel";
import LocationPicker from "../components/LocationPicker";
import { classifyImage } from "../lib/aiClassifier";
import { WASTE_CLASSES, computePriority, priorityTier, classInfo } from "../lib/priority";
import { saveReport } from "../lib/storage";
import { awardPoints } from "../lib/rewards";
import { getCurrentUser } from "../lib/auth";

export default function Recycle() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const imgRef = useRef(null);
  const [trained, setTrained] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [position, setPosition] = useState(null);
  const [impact, setImpact] = useState("medium");
  const [access, setAccess] = useState("medium");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">Login required</p>
        <h1 className="font-display font-bold text-2xl mb-4">Log in to submit a report</h1>
        <p className="text-mistDim text-sm mb-6">
          Reports are tied to your Guardian profile so your points and history stay with you.
        </p>
        <Link to="/login" className="bg-cyan text-deep font-display font-semibold px-6 py-3 rounded-lg inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  async function handlePhoto(file) {
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setResult(null);
    setClassifying(true);
    const img = imgRef.current;
    img.onload = async () => {
      const r = await classifyImage(img);
      setResult(r);
      setClassifying(false);
    };
    img.src = url;
  }

  const score = result
    ? computePriority({ classKey: result.classKey, confidence: result.confidence, populationImpact: impact, accessDifficulty: access })
    : null;
  const tier = score !== null ? priorityTier(score) : null;
  const wasteClass = result ? classInfo(result.classKey) : null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!position || !result) return;
    const id = crypto.randomUUID();
    const report = {
      id,
      classKey: result.classKey,
      confidence: result.confidence,
      score,
      status: "Reported",
      position,
      impact,
      access,
      note,
      reporterName: user.name,
      createdAt: Date.now(),
    };
    saveReport(report);
    awardPoints(user.name, 10);
    setSubmitted(true);
    setTimeout(() => navigate(`/track/${id}`), 1000);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="font-mono text-xs text-silt tracking-widest uppercase mb-2">Recycle</p>
      <h1 className="font-display font-bold text-3xl mb-2">Report &amp; classify a polluted site</h1>
      <p className="text-mistDim text-sm mb-8">
        Logged in as {user.name} — reports and points are saved to your profile.
      </p>

      <div className="space-y-6">
        <TrainPanel onTrainedChange={setTrained} />

        <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6">
          <h3 className="font-display font-semibold text-mist mb-1">Step 2 · Photograph the site</h3>
          <p className="text-mistDim text-sm mb-4 leading-relaxed">
            {trained ? "Upload a photo. The trained model classifies it and tells you how it should be disposed of." : "Train at least one category above first, then upload a photo here."}
          </p>

          <img ref={imgRef} alt="" className="hidden" crossOrigin="anonymous" />

          <label className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            trained ? "border-riverLight/60 hover:border-cyan/60" : "border-riverLight/20 opacity-50 cursor-not-allowed"
          }`}>
            <input type="file" accept="image/*" disabled={!trained} className="hidden"
              onChange={(e) => e.target.files[0] && handlePhoto(e.target.files[0])} />
            <span className="font-mono text-sm text-mistDim">Click to upload a photo</span>
          </label>

          {photoUrl && (
            <div className="mt-4 flex gap-4 items-start">
              <img src={photoUrl} alt="Uploaded site" className="w-32 h-32 object-cover rounded-lg border border-riverLight/50" />
              <div className="flex-1">
                {classifying && <p className="font-mono text-sm text-cyan">Classifying…</p>}
                {result && wasteClass && (
                  <div>
                    <p className="font-display font-semibold" style={{ color: wasteClass.color }}>{wasteClass.label}</p>
                    <p className="font-mono text-xs text-mistDim mt-1">confidence {(result.confidence * 100).toFixed(0)}%</p>
                    {tier && <p className="font-mono text-xs mt-1" style={{ color: tier.color }}>Priority score {score}/100 · {tier.label}</p>}
                    <div className="mt-3 border-t border-riverLight/40 pt-3">
                      <p className="font-mono text-xs" style={{ color: wasteClass.recyclable === true ? "#4CC9C0" : wasteClass.recyclable === false ? "#D4A24C" : "#9FB3AF" }}>
                        {wasteClass.recyclable === true ? "♻ Recyclable" : wasteClass.recyclable === false ? "⚠ Non-recyclable" : "No action needed"}
                      </p>
                      <p className="font-mono text-xs text-mistDim mt-1">{wasteClass.disposal}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {result && (
          <>
            <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6">
              <h3 className="font-display font-semibold text-mist mb-4">Step 3 · Pin the location</h3>
              <LocationPicker position={position} onChange={setPosition} />
            </div>

            <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6">
              <h3 className="font-display font-semibold text-mist mb-4">Step 4 · Context for the priority engine</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-mistDim block mb-1">Population impact nearby</label>
                  <select value={impact} onChange={(e) => setImpact(e.target.value)} className="w-full bg-deep border border-riverLight/50 rounded px-3 py-2 text-mist font-mono text-sm">
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs text-mistDim block mb-1">Site access difficulty</label>
                  <select value={access} onChange={(e) => setAccess(e.target.value)} className="w-full bg-deep border border-riverLight/50 rounded px-3 py-2 text-mist font-mono text-sm">
                    <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note"
                className="w-full bg-deep border border-riverLight/50 rounded px-3 py-2 text-mist font-mono text-sm mt-4" rows={2} />
            </div>

            <form onSubmit={handleSubmit}>
              <button type="submit" disabled={!position || submitted}
                className="w-full bg-cyan text-deep font-display font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition disabled:opacity-40">
                {submitted ? "Submitted — redirecting…" : "Submit report (+10 pts)"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
