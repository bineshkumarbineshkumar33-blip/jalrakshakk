// Waste classes the classifier recognizes, mapped to severity + disposal routing.
export const WASTE_CLASSES = [
  { key: "clean", label: "Clean Water", severity: 0, color: "#4CC9C0", recyclable: null, disposal: "No waste detected — site is clean." },
  { key: "biomass", label: "Organic / Sewage Debris", severity: 2, color: "#D4A24C", recyclable: false, disposal: "Non-recyclable — composted or converted to energy via controlled incineration." },
  { key: "plastic", label: "Plastic Waste", severity: 3, color: "#D4A24C", recyclable: true, disposal: "Recyclable — sorted and routed to the recycling stream." },
  { key: "oil", label: "Oil / Industrial Discharge", severity: 4, color: "#B5533C", recyclable: false, disposal: "Non-recyclable hazardous waste — safely incinerated under controlled conditions." },
];

const IMPACT_WEIGHT = { low: 1, medium: 2, high: 3 };
const ACCESS_WEIGHT = { hard: 3, medium: 2, easy: 1 }; // harder access = higher urgency to route smartly

export function classSeverity(classKey) {
  const c = WASTE_CLASSES.find((c) => c.key === classKey);
  return c ? c.severity : 0;
}

export function classInfo(classKey) {
  return WASTE_CLASSES.find((c) => c.key === classKey) || null;
}

// Weighted priority score (0-100): severity 50%, population impact 30%, access difficulty 20%
export function computePriority({ classKey, confidence, populationImpact, accessDifficulty }) {
  const severity = classSeverity(classKey); // 0-4
  const severityScore = (severity / 4) * 50;
  const impactScore = ((IMPACT_WEIGHT[populationImpact] || 1) / 3) * 30;
  const accessScore = ((ACCESS_WEIGHT[accessDifficulty] || 1) / 3) * 20;
  const confidenceAdj = 0.7 + 0.3 * (confidence || 0.7); // low-confidence reports scored slightly more conservatively
  const raw = (severityScore + impactScore + accessScore) * confidenceAdj;
  return Math.round(Math.min(100, raw));
}

export function priorityTier(score) {
  if (score >= 70) return { label: "Critical", color: "#B5533C" };
  if (score >= 40) return { label: "High", color: "#D4A24C" };
  if (score > 0) return { label: "Moderate", color: "#4CC9C0" };
  return { label: "Clear", color: "#4CC9C0" };
}
