// A cross-section of a door panel, drawn in code. The server renders the finished state
// (what no-JS and reduced-motion visitors see); the motion runtime rewinds it to step one and
// scrubs it through the seven passes. Every moving part is addressed by data-p.
const X0 = 40, X1 = 520;
const Y = { film: 212, clear: 226, base: 262, primer: 300, ecoat: 330, steel: 350, bottom: 420 };

// clear coat with every defect: two scratches, a run of swirls, a stone chip
const JAGGED = `M${X0} ${Y.clear}H128L140 242L152 ${Y.clear}H198q6 -5 12 0t12 0t12 0t12 0t12 0t12 0H318L330 246L342 ${Y.clear}H408V${Y.base}H434V${Y.clear}H${X1}V${Y.base}H${X0}Z`;
// after correction: swirls and scratches polished out, the chip still needs paint
const CORRECTED = `M${X0} ${Y.clear}H408V${Y.base}H434V${Y.clear}H${X1}V${Y.base}H${X0}Z`;

const DUST = [
  [62, 206, 2.4], [96, 200, 1.6], [131, 208, 2], [176, 203, 2.8], [214, 207, 1.5], [251, 199, 2.2],
  [289, 205, 1.8], [318, 201, 2.6], [356, 207, 1.6], [391, 202, 2.1], [447, 206, 2.7], [489, 200, 1.7],
] as const;

const MARKERS = [
  { x: 140, y: 236, label: "Scratch", lx: 108, ly: 150 },
  { x: 234, y: 222, label: "Swirls", lx: 214, ly: 112 },
  { x: 330, y: 238, label: "Scratch", lx: 310, ly: 150 },
  { x: 421, y: 246, label: "Stone chip", lx: 398, ly: 112 },
] as const;

const label = { fontSize: 13, letterSpacing: "0.08em", fontWeight: 600 } as const;

export function ProcessStage() {
  return (
    <svg className="process-stage" viewBox="0 0 560 440" role="presentation" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ps-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D2070A" />
          <stop offset="1" stopColor="#8E0405" />
        </linearGradient>
        <linearGradient id="ps-new" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1181B" />
          <stop offset="0.6" stopColor="#B80507" />
          <stop offset="1" stopColor="#8E0405" />
        </linearGradient>
        <linearGradient id="ps-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3E2" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FFF3E2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ps-heat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EC0609" stopOpacity="0.75" />
          <stop offset="1" stopColor="#EC0609" stopOpacity="0" />
        </linearGradient>
        <pattern id="ps-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30.75)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#4A5058" strokeWidth="1.5" />
        </pattern>
        <clipPath id="ps-panel">
          <rect x={X0} y="40" width={X1 - X0} height="400" />
        </clipPath>
        <clipPath id="ps-polished">
          <rect data-p="polish-mask" x={X0} y="180" width={X1 - X0} height="120" />
        </clipPath>
      </defs>

      {/* studio light overhead: the passes happen under it */}
      <rect x={X0} y="34" width={X1 - X0} height="4" rx="2" fill="#FFF3E2" opacity="0.8" data-p="lamp" />
      <path d={`M${X0} 38H${X1}L${X1 + 10} ${Y.film}H${X0 - 10}Z`} fill="url(#ps-light)" data-p="cone" />

      <g clipPath="url(#ps-panel)">
        {/* steel, e-coat, primer, base */}
        <rect x={X0} y={Y.steel} width={X1 - X0} height={Y.bottom - Y.steel} fill="#2B3036" />
        <rect x={X0} y={Y.steel} width={X1 - X0} height={Y.bottom - Y.steel} fill="url(#ps-hatch)" />
        <rect x={X0} y={Y.ecoat} width={X1 - X0} height={Y.steel - Y.ecoat} fill="#3A3F47" />
        <rect x={X0} y={Y.primer} width={X1 - X0} height={Y.ecoat - Y.primer} fill="#6F737A" />
        <rect x={X0} y={Y.base} width={X1 - X0} height={Y.primer - Y.base} fill="url(#ps-base)" />

        {/* clear coat: damaged, then corrected (revealed behind the polisher) */}
        <path d={JAGGED} fill="#EDEBE7" fillOpacity="0.16" stroke="#EDEBE7" strokeOpacity="0.5" strokeWidth="1" data-p="jagged" opacity="0" />
        <g clipPath="url(#ps-polished)">
          <path d={CORRECTED} fill="#EDEBE7" fillOpacity="0.16" stroke="#EDEBE7" strokeOpacity="0.5" strokeWidth="1" data-p="corrected" />
        </g>

        {/* fresh base + clear, laid down in one pass; fills the chip */}
        <g data-p="newcoat">
          <rect x={X0} y={Y.clear} width={X1 - X0} height={Y.primer - Y.clear} fill="url(#ps-new)" />
          <rect x={X0} y={Y.clear} width={X1 - X0} height={Y.base - Y.clear} fill="#EDEBE7" fillOpacity="0.14" />
          <rect x={X0} y={Y.clear} width={X1 - X0} height="1.5" fill="#FFFFFF" opacity="0.7" />
        </g>

        {/* protection: film or ceramic */}
        <g data-p="film">
          <rect x={X0} y={Y.film} width={X1 - X0} height={Y.clear - Y.film} fill="#EDEBE7" fillOpacity="0.2" />
          <rect x={X0} y={Y.film} width={X1 - X0} height="1.5" fill="#FFFFFF" opacity="0.85" />
        </g>

        {/* cure: heat through the layers */}
        <rect x={X0} y={Y.film} width={X1 - X0} height={Y.bottom - Y.film} fill="url(#ps-heat)" opacity="0" data-p="heat" />
      </g>

      {/* layer names */}
      <g style={label} className="font-display uppercase">
        <text x={X1} y={Y.film - 8} textAnchor="end" fill="#8B929C">Film / ceramic</text>
        <text x={X0 + 12} y={Y.clear + 23} fill="#8B929C">Clear coat</text>
        <text x={X0 + 12} y={Y.base + 25} fill="#FFFFFF">Base colour</text>
        <text x={X0 + 12} y={Y.primer + 20} fill="#08090B">Primer</text>
        <text x={X0 + 12} y={Y.ecoat + 15} fill="#8B929C" fontSize="11">E-coat</text>
        <text x={X0 + 12} y={Y.steel + 40} fill="#8B929C">Steel</text>
      </g>

      {/* step 1: inspection markers */}
      <g data-p="markers" opacity="0">
        {MARKERS.map((mk) => (
          <g key={`${mk.x}-${mk.label}`}>
            <line x1={mk.x} y1={mk.y - 12} x2={mk.lx + 22} y2={mk.ly + 8} stroke="#EC0609" strokeWidth="1" opacity="0.7" />
            <circle cx={mk.x} cy={mk.y} r="11" fill="none" stroke="#EC0609" strokeWidth="2" data-p="marker" />
            <text x={mk.lx} y={mk.ly} fill="#EDEBE7" style={label} className="font-display uppercase">
              {mk.label}
            </text>
          </g>
        ))}
      </g>

      {/* step 2: dust, tar and iron fallout sitting on the paint */}
      <g data-p="dust" opacity="0">
        {DUST.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 4 === 0 ? "#3A2A22" : "#9AA0A8"} data-p="speck" />
        ))}
      </g>

      {/* step 3: the polisher */}
      <g data-p="polisher" opacity="0">
        <ellipse cx="0" cy={Y.clear - 3} rx="46" ry="7" fill="#3A4048" />
        <rect x="-24" y={Y.clear - 58} width="48" height="50" rx="10" fill="#16191E" stroke="#4A5058" />
        <rect x="-7" y={Y.clear - 92} width="14" height="36" rx="4" fill="#1F232A" stroke="#4A5058" />
      </g>

      {/* step 4: masking tape at the edges */}
      <g data-p="tape" opacity="0">
        <rect x={X0 - 6} y={Y.film - 40} width="30" height="64" fill="#EDEBE7" opacity="0.88" transform={`rotate(-4 ${X0 + 9} ${Y.film})`} />
        <rect x={X1 - 24} y={Y.film - 40} width="30" height="64" fill="#EDEBE7" opacity="0.88" transform={`rotate(5 ${X1 - 9} ${Y.film})`} />
      </g>

      {/* step 7: a straight reflection, and the pass */}
      <rect x={X0} y={Y.film + 3} width={X1 - X0} height="2" fill="#FFFFFF" data-p="reflect" />
      <g data-p="stamp" transform="translate(392 70)">
        <rect x="0" y="0" width="128" height="40" rx="20" fill="none" stroke="#EC0609" strokeWidth="2" />
        <g transform="translate(20 11)">
          <path d="M0 0h5.4l10.5 18H10.5Z" fill="#EC0609" />
          <path d="M9 0h5.4l10.5 18H19.5Z" fill="#EDEBE7" />
        </g>
        <text x="52" y="26" fill="#EDEBE7" style={{ ...label, fontSize: 14 }} className="font-display uppercase">
          Passed
        </text>
      </g>
    </svg>
  );
}
