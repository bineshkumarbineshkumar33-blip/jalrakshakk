import { useEffect, useRef, useState } from "react";
import { WASTE_CLASSES } from "../lib/priority";
import { addExample, getExampleCounts, resetTraining, initModel } from "../lib/aiClassifier";

export default function TrainPanel({ onTrainedChange }) {
  const [counts, setCounts] = useState({});
  const [busyClass, setBusyClass] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    initModel().then(() => setModelReady(true));
    refreshCounts();
  }, []);

  async function refreshCounts() {
    const c = await getExampleCounts();
    setCounts(c);
    const total = Object.values(c).reduce((a, b) => a + b, 0);
    onTrainedChange?.(total > 0);
  }

  async function handleFiles(classKey, fileList) {
    setBusyClass(classKey);
    const files = Array.from(fileList).slice(0, 8);
    for (const file of files) {
      const url = URL.createObjectURL(file);
      await new Promise((resolve) => {
        const img = imgRef.current;
        img.onload = async () => {
          await addExample(img, classKey);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });
    }
    await refreshCounts();
    setBusyClass(null);
  }

  const totalExamples = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-river/60 border border-riverLight/40 rounded-xl p-6">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-display font-semibold text-mist">Step 1 · Teach the classifier</h3>
        {!modelReady && <span className="font-mono text-xs text-silt">loading MobileNet…</span>}
      </div>
      <p className="text-mistDim text-sm mb-5 leading-relaxed">
        Upload 5–8 reference photos per category. The model extracts visual features via
        MobileNet transfer learning and remembers them in your browser. Do this once; it's saved locally.
      </p>

      <img ref={imgRef} alt="" className="hidden" crossOrigin="anonymous" />

      <div className="grid sm:grid-cols-2 gap-4">
        {WASTE_CLASSES.filter((c) => c.key !== "clean").map((c) => (
          <label key={c.key} className="flex items-center justify-between gap-3 border border-riverLight/50 rounded-lg px-4 py-3 cursor-pointer hover:border-cyan/60 transition">
            <div>
              <p className="font-mono text-sm text-mist">{c.label}</p>
              <p className="font-mono text-xs text-mistDim">{counts[c.key] || 0} examples</p>
            </div>
            {busyClass === c.key ? (
              <span className="font-mono text-xs text-cyan">training…</span>
            ) : (
              <span className="font-mono text-xs text-silt">+ add photos</span>
            )}
            <input type="file" accept="image/*" multiple disabled={!modelReady || busyClass !== null} className="hidden"
              onChange={(e) => e.target.files.length && handleFiles(c.key, e.target.files)} />
          </label>
        ))}
        <label className="flex items-center justify-between gap-3 border border-riverLight/50 rounded-lg px-4 py-3 cursor-pointer hover:border-cyan/60 transition">
          <div>
            <p className="font-mono text-sm text-mist">Clean Water</p>
            <p className="font-mono text-xs text-mistDim">{counts.clean || 0} examples</p>
          </div>
          {busyClass === "clean" ? (
            <span className="font-mono text-xs text-cyan">training…</span>
          ) : (
            <span className="font-mono text-xs text-silt">+ add photos</span>
          )}
          <input type="file" accept="image/*" multiple disabled={!modelReady || busyClass !== null} className="hidden"
            onChange={(e) => e.target.files.length && handleFiles("clean", e.target.files)} />
        </label>
      </div>

      <div className="flex items-center justify-between mt-5">
        <p className="font-mono text-xs text-mistDim">{totalExamples} total examples</p>
        <button onClick={async () => { await resetTraining(); refreshCounts(); }} className="font-mono text-xs text-rust hover:underline">
          Reset training data
        </button>
      </div>
    </div>
  );
}
