export default function ImpactChart({ data, height = 220 }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.reported, d.cleaned)));
  const barWidth = 28;
  const gap = 22;
  const width = data.length * (barWidth * 2 + gap) + gap;
  const chartH = height - 40;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }}>
      {data.map((d, i) => {
        const x = gap + i * (barWidth * 2 + gap);
        const reportedH = (d.reported / max) * chartH;
        const cleanedH = (d.cleaned / max) * chartH;
        return (
          <g key={d.label}>
            <rect x={x} y={chartH - reportedH} width={barWidth} height={reportedH} rx="3" fill="#D4A24C" opacity="0.85" />
            <rect x={x + barWidth + 4} y={chartH - cleanedH} width={barWidth} height={cleanedH} rx="3" fill="#4CC9C0" />
            <text x={x + barWidth} y={height - 14} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#9FB3AF">
              {d.label}
            </text>
          </g>
        );
      })}
      <line x1="0" y1={chartH} x2={width} y2={chartH} stroke="#2E5266" strokeWidth="1" />
    </svg>
  );
}
