"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

// Funnel: dark (most deals) → medium (fewest) — floor at Hover so bars stay legible on white
const stages = [
  { name: "Qualification", deals: 425, color: "#0C2472" }, // Depth   — widest
  { name: "Needs Analysis", deals: 287, color: "#1D4ED8" }, // Primary
  { name: "Value Prop.", deals: 198, color: "#3B82F6" },   // Action
  { name: "Decision", deals: 156, color: "#3B82F6" },      // Action  (repeat — still distinct)
  { name: "Proposal", deals: 124, color: "#60A5FA" },      // Hover
  { name: "Negotiation", deals: 93, color: "#60A5FA" },    // Hover   — narrowest, still visible
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = stages.reduce((s, d) => s + d.deals, 0);
  const pct = ((payload[0].value / total) * 100).toFixed(1);
  return (
    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-white/10">
      <p className="text-slate-400 text-[11px] mb-1">{label}</p>
      <p className="font-bold text-[15px]">{payload[0].value} deals</p>
      <p className="text-slate-400 text-[10px] mt-0.5">{pct}% of pipeline</p>
    </div>
  );
};

export default function DealStageChart() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm h-full">
      <div className="mb-4">
        <h3 className="text-[14px] font-bold text-slate-900">Pipeline by Stage</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Active deals distribution</p>
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <BarChart
          data={stages}
          layout="vertical"
          margin={{ top: 0, right: 28, left: 0, bottom: 0 }}
          barSize={13}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10.5, fill: "#64748B", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={78}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#EFF6FF" }} />
          <Bar dataKey="deals" radius={[0, 6, 6, 0]}>
            <LabelList
              dataKey="deals"
              position="right"
              style={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
            />
            {stages.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
