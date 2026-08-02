const STYLES = {
  Reported: { bg: "bg-riverLight/40", text: "text-mistDim" },
  Verified: { bg: "bg-silt/20", text: "text-silt" },
  Dispatched: { bg: "bg-cyan/20", text: "text-cyan" },
  Cleaned: { bg: "bg-cyan/30", text: "text-cyan" },
};

export default function StatusBadge({ status }) {
  const s = STYLES[status] || STYLES.Reported;
  return (
    <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      {status}
    </span>
  );
}
