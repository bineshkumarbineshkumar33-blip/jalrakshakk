import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ContourMotif from "../components/ContourMotif";
import { getReports } from "../lib/storage";

export default function Landing() {
  const [reports, setReports] = useState(getReports());
  useEffect(() => {
    const interval = setInterval(() => setReports(getReports()), 2000);
    return () => clearInterval(interval);
  }, []);
  const total = reports.length;
  const cleaned = reports.filter((r) => r.status === "Cleaned").length;
  const rate = total ? Math.round((cleaned / total) * 100) : 0;

  return (
    <div>
      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-70">
          <ContourMotif className="w-full h-full" />
        </div>

        <p className="font-mono text-xs text-silt tracking-widest uppercase mb-4">
          Idea2Impact 2026 · Clean &amp; Green Technology
        </p>
        <h1 className="font-display font-bold text-5xl md:text-6xl leading-[1.05] max-w-3xl">
          India's waters are choking on waste.
          <span className="text-cyan"> AI can find it before it spreads.</span>
        </h1>
        <p className="text-mistDim text-lg max-w-2xl mt-6 leading-relaxed">
          JalRakshak turns every citizen's phone into a pollution sensor. A trained
          vision model classifies waste in a photo, sorts it into what can be recycled
          and what can't, and a coordinated autonomous cleanup fleet is routed to the
          worst sites first — with a manager overseeing every team, and Guardians earning
          real rewards for keeping it going.
        </p>

        <div className="flex flex-wrap gap-4 mt-10">
          <Link to="/recycle" className="bg-cyan text-deep font-display font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition">
            Report &amp; Recycle a Site
          </Link>
          <Link to="/dashboard" className="border border-riverLight text-mist font-display font-semibold px-6 py-3 rounded-lg hover:border-cyan hover:text-cyan transition">
            View Live Dashboard
          </Link>
        </div>

        <div className="flex flex-wrap gap-8 mt-12 font-mono text-sm">
          <div><span className="text-cyan text-2xl font-display font-bold">{total}</span> <span className="text-mistDim">sites reported</span></div>
          <div><span className="text-cyan text-2xl font-display font-bold">{cleaned}</span> <span className="text-mistDim">confirmed clean</span></div>
          <div><span className="text-cyan text-2xl font-display font-bold">{rate}%</span> <span className="text-mistDim">resolution rate</span></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          { n: "Recycle", body: "Upload a photo — the AI classifies the waste and routes it: recyclable material to the recycling stream, hazardous or organic waste to safe controlled disposal." },
          { n: "Management", body: "Field teams maintaining the autonomous fleet, live boat status by location, and a help center where any user's doubts reach the ops team directly." },
          { n: "Incentives Board", body: "Verified contributions earn points and Guardian tiers — redeemable for real rewards, including furniture crafted from the very trash the platform recycles." },
        ].map((c) => (
          <div key={c.n} className="bg-river/60 border border-riverLight/40 rounded-xl p-6">
            <h3 className="font-display font-semibold text-cyan mb-2">{c.n}</h3>
            <p className="text-mistDim text-sm leading-relaxed">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
