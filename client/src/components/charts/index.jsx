import React, { useId, useMemo, useState } from "react";

/**
 * Dependency-free, interactive SVG chart kit.
 * All charts are responsive (viewBox based), support dark mode and hover tooltips.
 */

export const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1"];

export const palette = (i) => CHART_COLORS[i % CHART_COLORS.length];

const useTooltip = () => {
  const [tip, setTip] = useState(null);
  const Tooltip = () =>
    tip ? (
      <div
        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-gray-900/90 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm dark:bg-black/80"
        style={{ left: tip.x, top: tip.y - 8 }}
      >
        <div className="whitespace-nowrap">{tip.label}</div>
        {tip.value !== undefined ? <div className="text-[13px] font-semibold">{tip.value}</div> : null}
      </div>
    ) : null;
  return { tip, setTip, Tooltip };
};

export const ChartCard = ({ title, subtitle, action, children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          {title && <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

/* --------------------------------- Donut --------------------------------- */
export const DonutChart = ({ data = [], size = 180, thickness = 22, centerLabel, centerValue }) => {
  const { tip, setTip, Tooltip } = useTooltip();
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);
  const radius = (size - thickness) / 2;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={thickness} className="text-gray-100 dark:text-gray-700" />
          {total > 0 &&
            data.map((d, i) => {
              const frac = (Number(d.value) || 0) / total;
              const dash = frac * circ;
              const seg = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={d.color || palette(i)}
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseEnter={(e) => setTip({ x: size / 2, y: size / 2, label: d.label, value: `${d.value} (${Math.round(frac * 100)}%)` })}
                  onMouseLeave={() => setTip(null)}
                />
              );
              offset += dash;
              return seg;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">{centerValue ?? total}</span>
          {centerLabel && <span className="text-xs text-gray-400">{centerLabel}</span>}
        </div>
        <Tooltip />
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 sm:flex-col sm:justify-start">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color || palette(i) }} />
            <span className="text-gray-600 dark:text-gray-300">{d.label}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------- Bar ---------------------------------- */
export const BarChart = ({ data = [], height = 220, color, formatValue = (v) => v, horizontal = false }) => {
  const { tip, setTip, Tooltip } = useTooltip();
  const max = Math.max(1, ...data.map((d) => Number(d.value) || 0));

  if (horizontal) {
    return (
      <div className="relative space-y-2.5">
        {data.map((d, i) => {
          const pct = ((Number(d.value) || 0) / max) * 100;
          return (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="w-24 shrink-0 truncate text-gray-500 dark:text-gray-400" title={d.label}>
                {d.label}
              </span>
              <div className="h-5 flex-1 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                <div
                  className="flex h-full items-center justify-end rounded-md pr-2 text-[10px] font-semibold text-white transition-all duration-500"
                  style={{ width: `${Math.max(pct, 6)}%`, background: d.color || color || palette(i) }}
                >
                  {formatValue(d.value)}
                </div>
              </div>
            </div>
          );
        })}
        {data.length === 0 && <EmptyChart />}
      </div>
    );
  }

  const barW = 100 / (data.length * 1.6 || 1);
  const gap = barW * 0.6;
  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
        {[0, 25, 50, 75, 100].map((g) => (
          <line key={g} x1="0" x2="100" y1={g} y2={g} stroke="currentColor" strokeWidth="0.2" className="text-gray-100 dark:text-gray-700" />
        ))}
        {data.map((d, i) => {
          const h = ((Number(d.value) || 0) / max) * 92;
          const x = i * (barW + gap) + gap;
          return (
            <rect
              key={i}
              x={x}
              y={100 - h}
              width={barW}
              height={h}
              rx="1.5"
              fill={d.color || color || palette(i)}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={() => setTip({ x: `${x + barW / 2}%`, y: ((100 - h) / 100) * height, label: d.label, value: formatValue(d.value) })}
              onMouseLeave={() => setTip(null)}
            />
          );
        })}
      </svg>
      <div className="mt-1.5 flex justify-around">
        {data.map((d, i) => (
          <span key={i} className="flex-1 truncate text-center text-[10px] text-gray-400" title={d.label}>
            {d.label}
          </span>
        ))}
      </div>
      <Tooltip />
      {data.length === 0 && <EmptyChart />}
    </div>
  );
};

/* ------------------------------ Line / Area ------------------------------ */
export const LineChart = ({ data = [], height = 220, color = "#3b82f6", area = true, formatValue = (v) => v }) => {
  const gid = useId().replace(/:/g, "");
  const { tip, setTip, Tooltip } = useTooltip();
  const W = 100;
  const H = 100;
  const max = Math.max(1, ...data.map((d) => Number(d.value) || 0));
  const min = Math.min(0, ...data.map((d) => Number(d.value) || 0));
  const range = max - min || 1;
  const pts = data.map((d, i) => ({
    x: data.length > 1 ? (i / (data.length - 1)) * W : W / 2,
    y: H - ((Number(d.value) - min) / range) * (H * 0.9) - 5,
    d,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fill = `${line} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((g) => (
          <line key={g} x1="0" x2="100" y1={g} y2={g} stroke="currentColor" strokeWidth="0.2" className="text-gray-100 dark:text-gray-700" />
        ))}
        {area && pts.length > 1 && <path d={fill} fill={`url(#grad-${gid})`} />}
        {pts.length > 1 && <path d={line} fill="none" stroke={color} strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.4"
            fill="#fff"
            stroke={color}
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
            className="cursor-pointer"
            onMouseEnter={() => setTip({ x: `${p.x}%`, y: (p.y / 100) * height, label: p.d.label, value: formatValue(p.d.value) })}
            onMouseLeave={() => setTip(null)}
          />
        ))}
      </svg>
      <div className="mt-1.5 flex justify-between px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] text-gray-400">
            {d.label}
          </span>
        ))}
      </div>
      <Tooltip />
      {data.length === 0 && <EmptyChart />}
    </div>
  );
};

/* ------------------------------- Sparkline ------------------------------- */
export const Sparkline = ({ data = [], color = "#3b82f6", width = 100, height = 32 }) => {
  const max = Math.max(1, ...data);
  const min = Math.min(0, ...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

/* ------------------------------ ProgressRing ----------------------------- */
export const ProgressRing = ({ value = 0, max = 100, size = 120, thickness = 12, color = "#3b82f6", label }) => {
  const radius = (size - thickness) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(1, (Number(value) || 0) / (max || 1));
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={thickness} className="text-gray-100 dark:text-gray-700" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-800 dark:text-white">{Math.round(pct * 100)}%</span>
        {label && <span className="text-[10px] text-gray-400">{label}</span>}
      </div>
    </div>
  );
};

const EmptyChart = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <p className="text-xs text-gray-300 dark:text-gray-600">No data yet</p>
  </div>
);

/* ------------------------------ helpers ------------------------------ */
export const groupCount = (items = [], key) => {
  const map = {};
  items.forEach((it) => {
    const k = (typeof key === "function" ? key(it) : it?.[key]) ?? "Unknown";
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
};

export const groupSum = (items = [], key, valueKey) => {
  const map = {};
  items.forEach((it) => {
    const k = (typeof key === "function" ? key(it) : it?.[key]) ?? "Unknown";
    map[k] = (map[k] || 0) + (Number(typeof valueKey === "function" ? valueKey(it) : it?.[valueKey]) || 0);
  });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
};
