"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import {
  ArrowLeft, FunnelSimple, PencilSimple, CaretDown, CaretRight, House,
  ChartBar, ArrowsClockwise, Info, Table,
} from "@phosphor-icons/react";
import { Pagination } from "@/components/list/ListParts";

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

// Numeric-looking cells (₹ amounts, %, counts) are right-aligned so figures line up.
const isNumeric = (v: string) => /^[₹$]?[\d,.]+%?$/.test(v.trim());

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const reportId = parseInt(id);
  const report  = REPORT_DATA[reportId] ?? { ...DEFAULT_REPORT, name: `Report ${reportId}` };

  const [showDetails, setShowDetails] = useState(false);

  const numericCol = report.columns.map((_, j) => report.rows.length > 0 && report.rows.every(r => isNumeric(r[j] ?? "")));
  const template   = report.columns.map((_, j) => numericCol[j] ? "minmax(120px,0.8fr)" : "minmax(160px,1.2fr)").join(" ");

  const iconBtn = { width: 34, height: 34, borderRadius: "10px", border: "1px solid var(--line)", bgcolor: "var(--card)", "&:hover": { bgcolor: "var(--surface)", borderColor: "var(--link)" } } as const;

  return (
    <div className="flex h-screen bg-page font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto bg-canvas">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">

          {/* ══ Breadcrumb ══ */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-fg-3">
            <Link href="/" aria-label="Dashboard" className="hover:text-link transition-colors"><House size={13} weight="duotone" /></Link>
            <CaretRight size={11} weight="bold" className="text-slate-300" />
            <Link href="/reports" className="hover:text-link transition-colors font-medium">Reports</Link>
            <CaretRight size={11} weight="bold" className="text-slate-300" />
            <span aria-current="page" className="text-fg-2 font-semibold truncate max-w-[320px]">{report.name}</span>
          </nav>

          {/* ══ Report header card ══ */}
          <div className="bg-card rounded-2xl border border-line shadow-card">
            <div className="flex items-center gap-4 px-5 py-4 flex-wrap">
              <Tooltip title="Back to Reports">
                <IconButton size="small" aria-label="Back to Reports" onClick={() => router.push("/reports")} sx={iconBtn}>
                  <ArrowLeft size={17} color="var(--fg-2)" weight="bold" />
                </IconButton>
              </Tooltip>

              <span className="w-11 h-11 rounded-xl bg-surface ring-1 ring-line flex items-center justify-center flex-shrink-0">
                <ChartBar size={22} color="var(--link)" weight="duotone" />
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-[19px] font-extrabold text-fg tracking-tight truncate">{report.name}</h1>
                  <Tooltip title="Report information">
                    <button aria-label="Report information" className="text-fg-3 hover:text-link rounded outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                      <Info size={16} weight="duotone" />
                    </button>
                  </Tooltip>
                </div>
                <p className="text-[12px] text-fg-3 mt-0.5">{report.updatedAt}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Tooltip title="Refresh">
                  <IconButton size="small" aria-label="Refresh report" sx={iconBtn}>
                    <ArrowsClockwise size={16} color="var(--fg-2)" weight="bold" />
                  </IconButton>
                </Tooltip>

                {/* Split button: Edit + options */}
                <div className="flex items-center h-[34px] border border-line rounded-[10px] overflow-hidden bg-card">
                  <Button size="small" startIcon={<PencilSimple size={14} weight="duotone" />}
                    onClick={() => router.push("/reports/create")}
                    sx={{ height:"100%", borderRadius:0, textTransform:"none", fontWeight:600, fontSize:"0.78rem", color:"var(--fg)", px:1.5, "&:hover":{ bgcolor:"var(--surface)", color:"var(--link)" } }}>
                    Edit
                  </Button>
                  <span className="w-px h-5 bg-line" />
                  <IconButton size="small" aria-label="More edit options" sx={{ height:"100%", borderRadius:0, px:1, "&:hover":{ bgcolor:"var(--surface)" } }}>
                    <CaretDown size={12} color="var(--fg-2)" weight="bold" />
                  </IconButton>
                </div>

                <Button variant="contained" size="small" startIcon={<ChartBar size={15} weight="duotone" />}
                  sx={{ height:34, bgcolor:"#1D4ED8", color:"#fff", borderRadius:"10px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:1.75, boxShadow:"0 1px 8px #1D4ED833", "&:hover":{ bgcolor:"#1E40AF" }, "&:active":{ bgcolor:"#0C2472" } }}>
                  Create Chart
                </Button>
              </div>
            </div>

            {/* Sub-toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-line-soft">
              <div className="flex items-center gap-3">
                <Button variant="outlined" size="small" startIcon={<FunnelSimple size={14} weight="duotone" />}
                  sx={{ height:32, borderColor:"var(--line)", color:"var(--fg)", bgcolor:"var(--card)", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.76rem", "&:hover":{ borderColor:"var(--link)", color:"var(--link)", bgcolor:"var(--surface)" } }}>
                  Filter
                </Button>
                <span className="text-[12.5px] text-fg-2">
                  <span className="font-bold text-fg tabular-nums">{report.rows.length}</span> {report.rows.length === 1 ? "record" : "records"}
                </span>
              </div>
              <button onClick={() => setShowDetails(v => !v)} aria-expanded={showDetails}
                className="flex items-center gap-1 text-[12.5px] font-semibold text-fg-2 hover:text-link px-2 py-1 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                {showDetails ? "Hide details" : "Show details"}
                <CaretDown size={12} weight="bold" className={`transition-transform ${showDetails ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* ══ Results table ══ */}
          <section aria-label="Report results" className="bg-card rounded-2xl border border-line shadow-card overflow-clip">
            {report.rows.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface ring-1 ring-line flex items-center justify-center mx-auto mb-4">
                  <Table size={24} color="#60A5FA" weight="duotone" />
                </div>
                <p className="font-heading text-[14px] font-bold text-fg">No data to display</p>
                <p className="text-[12.5px] mt-1 text-fg-3">Run the report to see results.</p>
              </div>
            ) : (
              <>
                <div className="sticky top-[60px] z-10 grid items-center px-5 h-10 bg-surface-subtle border-b border-line" style={{ gridTemplateColumns: template }}>
                  {report.columns.map((col, j) => (
                    <div key={col} className={`font-heading text-[11px] font-bold text-fg-2 uppercase tracking-wider truncate pr-3 ${numericCol[j] ? "text-right" : ""}`}>{col}</div>
                  ))}
                </div>
                <div className="divide-y divide-line-soft">
                  {report.rows.map((row, i) => (
                    <div key={i} className="grid items-center px-5 min-h-[48px] hover:bg-surface-subtle transition-colors" style={{ gridTemplateColumns: template }}>
                      {row.map((cell, j) => (
                        <p key={j} className={`text-[13px] truncate pr-3 ${numericCol[j] ? "text-right tabular-nums font-semibold text-fg" : j === 0 ? "font-semibold text-fg" : "text-fg-2"}`}>{cell}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
            <Pagination shown={report.rows.length} noun={["record", "records"]} pageSize={25} />
          </section>
        </main>
      </div>
    </div>
  );
}
