"use client";
import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  icon: ReactNode;
  gradFrom: string;
  gradTo: string;
  sparkData: number[];
}

export default function KPICard({
  title,
  value,
  trend,
  icon,
  gradFrom,
  gradTo,
  sparkData,
}: KPICardProps) {
  const isPositive = trend >= 0;
  const W = 76;
  const H = 30;
  const max = Math.max(...sparkData);
  const min = Math.min(...sparkData);
  const range = max - min || 1;

  const coords = sparkData.map((d, i) => ({
    x: (i / (sparkData.length - 1)) * W,
    y: H - ((d - min) / range) * (H - 5) - 2,
  }));

  const linePts = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const areaPts = [
    `0,${H}`,
    ...coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`),
    `${W},${H}`,
  ].join(" ");

  const lineColor = isPositive ? "#10B981" : "#EF4444";

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden hover:shadow-md hover:-translate-y-px transition-all duration-200 cursor-default">
      {/* ── Coloured top-border ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
        style={{ backgroundColor: gradFrom }}
      />

      <div className="flex items-start justify-between gap-3">
        {/* ── Left: label + value + badge ── */}
        <div className="flex-1 min-w-0">
          <p className="font-heading text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-1.5 truncate">
            {title}
          </p>
          <p className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none mb-3">
            {value}
          </p>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(trend)}% vs last month
          </span>
        </div>

        {/* ── Right: icon + sparkline ── */}
        <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
          {/* Icon bubble */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: gradFrom }}
          >
            {icon}
          </div>

          {/* SVG sparkline with flat area fill */}
          <svg width={W} height={H} style={{ display: "block" }}>
            <polygon points={areaPts} fill={lineColor} fillOpacity={0.08} />
            <polyline
              points={linePts}
              fill="none"
              stroke={lineColor}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Last data point dot */}
            <circle
              cx={coords[coords.length - 1].x.toFixed(1)}
              cy={coords[coords.length - 1].y.toFixed(1)}
              r="2.5"
              fill={lineColor}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
