"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const data = [
  { month: "Dec '25", revenue: 180000 },
  { month: "Jan '26", revenue: 195200 },
  { month: "Feb '26", revenue: 188500 },
  { month: "Mar '26", revenue: 210300 },
  { month: "Apr '26", revenue: 225100 },
  { month: "May '26", revenue: 234800 },
];

const fmt = (v: number) => `₹${(v / 1000).toFixed(0)}k`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const pct = payload[0].value === data[0].revenue
    ? 0
    : (((payload[0].value - data[0].revenue) / data[0].revenue) * 100).toFixed(1);
  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs shadow-2xl border border-white/10">
      <p className="text-slate-400 mb-1 text-[11px]">{label}</p>
      <p className="font-extrabold text-[17px] tracking-tight">{fmt(payload[0].value)}</p>
      {Number(pct) !== 0 && (
        <p className="text-emerald-400 text-[10px] mt-0.5">+{pct}% vs Dec</p>
      )}
    </div>
  );
};

export default function RevenueChart() {
  const avg = data.reduce((s, d) => s + d.revenue, 0) / data.length;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[14px] font-bold text-slate-900">Revenue Trend</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Booked revenue · last 6 months</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
            ↑ 30.4% growth
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <ReferenceLine y={avg} stroke="#E2E8F0" strokeDasharray="4 3" label={{ value: "avg", fontSize: 9, fill: "#94A3B8" }} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            width={46}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#3B82F6", strokeWidth: 1, strokeDasharray: "4 3" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="#3B82F6"
            fillOpacity={0.07}
            dot={false}
            activeDot={{ r: 5, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
