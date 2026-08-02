export default function ContourMotif({ className = "", dots = true }) {
  return (
    <svg viewBox="0 0 1200 300" className={className} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4CC9C0" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#4CC9C0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4CC9C0" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path d="M0,120 C150,60 300,180 450,110 C600,40 750,160 900,100 C1000,60 1100,120 1200,90" fill="none" stroke="#2E5266" strokeWidth="1.5" />
      <path d="M0,170 C150,110 300,230 450,160 C600,90 750,210 900,150 C1000,110 1100,170 1200,140" fill="none" stroke="url(#riverGrad)" strokeWidth="2.5" strokeDasharray="10 8" className="animate-flow" />
      <path d="M0,220 C150,160 300,280 450,210 C600,140 750,260 900,200 C1000,160 1100,220 1200,190" fill="none" stroke="#2E5266" strokeWidth="1.5" />
      {dots && (
        <>
          <circle cx="450" cy="160" r="5" fill="#D4A24C" className="animate-pulseDot" />
          <circle cx="900" cy="150" r="5" fill="#B5533C" className="animate-pulseDot" />
          <circle cx="150" cy="110" r="4" fill="#4CC9C0" className="animate-pulseDot" />
        </>
      )}
    </svg>
  );
}
