// Demo roster — in a real deployment this would come from the municipal ops database.
export const TEAMS = [
  { id: 0, unit: "Unit 1 · Neer-1", inchargeName: "R. Prasad", role: "Boat Maintenance & Ops", phone: "+91 90000 00011" },
  { id: 1, unit: "Unit 2 · Neer-2", inchargeName: "K. Lakshmi", role: "Boat Maintenance & Ops", phone: "+91 90000 00022" },
  { id: 2, unit: "Unit 3 · Neer-3", inchargeName: "S. Anitha", role: "Boat Maintenance & Ops", phone: "+91 90000 00033" },
];

export const OPS_MANAGER = {
  name: "V. Suresh Reddy",
  role: "Ops Manager — Water Bodies Division",
  phone: "+91 90000 00001",
  email: "ops@jalrakshak.demo",
};

export function teamForUnit(unitId) {
  return TEAMS.find((t) => t.id === unitId) || null;
}
