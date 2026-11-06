"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  ArrowLeft, FunnelSimple, PencilSimple, CaretDown,
  ChartBar, ArrowsClockwise, Info, CaretRight,
} from "@phosphor-icons/react";

// ─────────────────────────────────────────────
//  Sample report data
// ─────────────────────────────────────────────
const REPORT_DATA: Record<number, {
  name: string; updatedAt: string;
  columns: string[]; rows: string[][];
}> = {
  1: {
    name: "compoent 1", updatedAt: "Updated about 6 hours ago",
    columns: ["STAGE"],
    rows: [["Identify Decision Makers"], ["Needs Analysis"], ["Proposal/Price Quote"], ["Qualification"], ["Value Proposition"]],
  },
  2: {
    name: "Account Wise Deal Summary", updatedAt: "Updated 18 minutes ago",
    columns: ["ACCOUNT NAME", "TOTAL DEALS", "TOTAL AMOUNT", "AVG PROBABILITY"],
    rows: [["Sweany Inc", "1", "₹29,999", "75%"], ["RMVT", "4", "₹1,400,000", "10%"], ["SDL", "2", "₹210,000", "43%"], ["test", "3", "₹350,000", "17%"]],
  },
  8: {
    name: "Deal with Stage", updatedAt: "Updated May 19, 2026",
    columns: ["DEAL NAME", "STAGE", "AMOUNT", "PROBABILITY"],
    rows: [["New", "Proposal/Price Quote", "₹29,999", "75%"], ["testing", "Needs Analysis", "₹500,000", "20%"], ["Smith", "Value Proposition", "₹100,000", "40%"]],
  },
  9: {
    name: "Deal with Filter", updatedAt: "Updated May 21, 2026",
    columns: ["DEAL NAME", "STAGE", "AMOUNT"],
    rows: [["New", "Proposal/Price Quote", "₹29,999"], ["Test", "Proposal/Price Quote", "₹10,000"]],
  },
};

const DEFAULT_REPORT = { name: "Report", updatedAt: "Updated recently", columns: ["NAME"], rows: [] };

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const reportId = parseInt(id);
  const report  = REPORT_DATA[reportId] ?? { ...DEFAULT_REPORT, name: `Report ${reportId}` };

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex h-screen bg-[#EFF6FF] font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto">
        <TopBar />

        <main className="flex-1 flex flex-col animate-fade-in">

          {/* ══ Report header ══ */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E3ECFC]">
            <div className="flex items-center gap-3">
              <Tooltip title="Back to Reports">
                <IconButton size="small" onClick={() => router.push("/reports")}
                  sx={{ borderRadius:"8px", border:"1.5px solid #E3ECFC", "&:hover":{ bgcolor:"#EFF6FF" } }}>
                  <ArrowLeft size={17} color="#64748B" weight="duotone" />
                </IconButton>
              </Tooltip>
              <h1 className="font-heading text-[16px] font-bold text-slate-900">{report.name}</h1>
              <Tooltip title="Report information">
                <Info size={15} color="#94A3B8" weight="duotone" className="cursor-pointer hover:text-[#1D4ED8]" />
              </Tooltip>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11.5px] text-slate-400 font-medium">{report.updatedAt}</span>
              <Tooltip title="Refresh">
                <IconButton size="small" sx={{ borderRadius:"8px", "&:hover":{ bgcolor:"#EFF6FF" } }}>
                  <ArrowsClockwise size={16} color="#64748B" weight="duotone" />
                </IconButton>
              </Tooltip>
              <div className="flex items-center border border-[#E3ECFC] rounded-xl overflow-hidden shadow-sm">
                <Button variant="outlined" size="small"
                  startIcon={<PencilSimple size={13} weight="duotone" />}
                  onClick={() => router.push("/reports/create")}
                  sx={{ borderColor:"transparent", borderRadius:0, textTransform:"none", fontWeight:600, fontSize:"0.76rem", color:"#475569", "&:hover":{ bgcolor:"#EFF6FF", color:"#1D4ED8", borderColor:"transparent" } }}>
                  Edit
                </Button>
                <div className="w-px h-6 bg-[#E3ECFC]" />
                <IconButton size="small" sx={{ borderRadius:0, px:1, "&:hover":{ bgcolor:"#EFF6FF" } }}>
                  <CaretDown size={12} color="#64748B" weight="duotone" />
                </IconButton>
              </div>
              <Button variant="contained" size="small"
                startIcon={<ChartBar size={14} weight="duotone" />}
                sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.76rem", px:2, py:0.8, boxShadow:"0 1px 8px #1D4ED833", "&:hover":{ bgcolor:"#60A5FA" }, "&:active":{ bgcolor:"#0C2472" } }}>
                Create Chart
              </Button>
            </div>
          </div>

          {/* ══ Sub-toolbar ══ */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#EFF6FF]">
            <div className="flex items-center gap-3">
              <Button variant="outlined" size="small"
                startIcon={<FunnelSimple size={13} weight="duotone" />}
                sx={{ borderColor:"#1D4ED8", color:"#1D4ED8", borderRadius:"8px", textTransform:"none", fontWeight:600, fontSize:"0.74rem", bgcolor:"#EFF6FF", "&:hover":{ bgcolor:"#E3ECFC" } }}>
                Filter
              </Button>
              <span className="text-[12px] font-semibold text-slate-700">
                Total Records : <span className="text-[#1D4ED8]">{report.rows.length}</span>
              </span>
            </div>
            <button
              onClick={() => setShowDetails(v => !v)}
              className="flex items-center gap-1 text-[12px] font-semibold text-slate-500 hover:text-[#1D4ED8] transition-colors">
              Show Details
              <CaretDown size={12} weight="duotone" className={`transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* ══ Results table ══ */}
          <div className="flex-1 bg-white mx-6 my-4 rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
            {report.rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <ChartBar size={32} color="#93C5FD" weight="duotone" className="mb-3" />
                <p className="font-heading text-sm font-semibold text-slate-500">No data to display</p>
                <p className="text-xs mt-1 text-slate-300">Run the report to see results</p>
              </div>
            ) : (
              <>
                {/* Column headers */}
                <div className="border-b border-[#E3ECFC] bg-[#E3ECFC]">
                  <div className="grid px-4 py-2.5" style={{ gridTemplateColumns: `repeat(${report.columns.length}, 1fr)` }}>
                    {report.columns.map(col => (
                      <div key={col} className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">{col}</div>
                    ))}
                  </div>
                </div>

                {/* Data rows */}
                <div className="divide-y divide-[#EFF6FF]">
                  {report.rows.map((row, i) => (
                    <div key={i} className="grid px-4 py-3 hover:bg-[#60A5FA]/[0.04] transition-colors"
                      style={{ gridTemplateColumns: `repeat(${report.columns.length}, 1fr)` }}>
                      {row.map((cell, j) => (
                        <p key={j} className="text-[12.5px] text-slate-700 font-medium">{cell}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-end px-4 py-3 border-t border-[#EFF6FF] gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Rows per page:</span>
                <button className="flex items-center gap-0.5 bg-[#EFF6FF] text-[#1D4ED8] font-bold px-2 py-1 rounded-lg hover:bg-[#E3ECFC] text-[11px]">
                  25 <CaretDown size={12} weight="duotone" />
                </button>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">1–{report.rows.length} of {report.rows.length}</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] disabled:opacity-30 font-bold text-sm" disabled>‹</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] disabled:opacity-30 font-bold text-sm" disabled>›</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
