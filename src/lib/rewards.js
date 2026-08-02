const CONTRIB_KEY = "jalrakshak_contributors_v1";

export const TIERS = [
  { min: 0, label: "New Guardian", color: "#9FB3AF" },
  { min: 50, label: "Bronze Guardian", color: "#D4A24C" },
  { min: 150, label: "Silver Guardian", color: "#C7D0CE" },
  { min: 300, label: "River Guardian", color: "#4CC9C0" },
];

export const REWARDS_CATALOG = [
  { threshold: 100, title: "Digital Guardian Badge", desc: "A verified badge on your profile." },
  { threshold: 500, title: "Recycled-Plastic Tote Bag", desc: "Made from plastic collected through the platform." },
  { threshold: 1000, title: "Recycled-Material Furniture Voucher", desc: "Furniture crafted from recycled trash, redeemable at partner recycling centers." },
  { threshold: 2000, title: "Community Guardian Recognition", desc: "Featured on the public Guardians wall." },
];

export function tierFor(points) {
  return [...TIERS].reverse().find((t) => points >= t.min) || TIERS[0];
}

export function getContributors() {
  try {
    const raw = localStorage.getItem(CONTRIB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveContributors(map) {
  localStorage.setItem(CONTRIB_KEY, JSON.stringify(map));
}

// +10 points for any report submitted, +25 bonus once that report is confirmed Cleaned/Recycled
export function awardPoints(name, points) {
  const key = (name || "Anonymous").trim() || "Anonymous";
  const map = getContributors();
  map[key] = (map[key] || 0) + points;
  saveContributors(map);
  return map[key];
}

export function pointsFor(name) {
  const map = getContributors();
  return map[(name || "Anonymous").trim()] || 0;
}

export function leaderboard() {
  const map = getContributors();
  return Object.entries(map)
    .map(([name, points]) => ({ name, points, tier: tierFor(points) }))
    .sort((a, b) => b.points - a.points);
}
