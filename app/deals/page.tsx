"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewDealDrawer from "@/components/deals/NewDealDrawer";
import DealGridView from "@/components/deals/DealGridView";
import DealKanbanView from "@/components/deals/DealKanbanView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import {
  Plus, MagnifyingGlass, SlidersHorizontal, SortAscending, Columns,
  ArrowsDownUp, List, GridFour, Kanban, CaretDown, House, CaretRight,
  Trash, DotsThreeVertical, FunnelSimple, TrendUp,
} from "@phosphor-icons/react";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
type DealStage = "Qualification" | "Needs Analysis" | "Value Proposition" |
  "Identify Decision Makers" | "Proposal/Price Quote" | "Negotiation/Review" | "Closed Won";

interface Deal {
  id: number; name: string; amount: number; account: string;
  stage: DealStage; probability: number; contactName: string;
  createdBy: string; modifiedBy: string; creation: string; modified: string;
  owner: string; ownerInitials: string;
}

// ─────────────────────────────────────────────
//  Data — exact from screenshot
// ─────────────────────────────────────────────
const ALL_DEALS: Deal[] = [
  { id:1,  name:"New",                         amount:29999,  account:"Sweany Inc",    stage:"Proposal/Price Quote",      probability:75, contactName:"",                 createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"27 May 2026, 03:14 PM", modified:"30 May 2026, 02:10 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:2,  name:"Deal SDL 11",                 amount:500000, account:"SDL LEAD1",     stage:"Identify Decision Makers",  probability:60, contactName:"Lead SDL 11",      createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"15 Apr 2026, 11:13 AM", modified:"05 May 2026, 04:55 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:3,  name:"test deal john smith",        amount:200000, account:"Sears Homelife",stage:"Qualification",             probability:0,  contactName:"John Smith",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:45 PM", modified:"14 Apr 2026, 07:45 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:4,  name:"testing",                     amount:500000, account:"RMVT",          stage:"Needs Analysis",            probability:20, contactName:"Raja rajan",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:30 PM", modified:"14 Apr 2026, 07:34 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:5,  name:"fsm enterprise application",  amount:800000, account:"RMVT",          stage:"Needs Analysis",            probability:20, contactName:"mmmm mmmm",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:53 PM", modified:"14 Apr 2026, 07:07 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:6,  name:"CRM Application",             amount:200000, account:"SDL",           stage:"Qualification",             probability:10, contactName:"SDL Test Test-SDL", createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:04 PM", modified:"14 Apr 2026, 07:04 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:7,  name:"fsm single user application", amount:200000, account:"RMVT",          stage:"Qualification",             probability:0,  contactName:"Raja rajan",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:40 PM", modified:"14 Apr 2026, 06:40 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:8,  name:"CRM Application",             amount:500000, account:"RMVT",          stage:"Qualification",             probability:0,  contactName:"Vishnutharan R",   createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:38 PM", modified:"14 Apr 2026, 06:38 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:9,  name:"Deal test",                   amount:150000, account:"test",          stage:"Qualification",             probability:10, contactName:"test test",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:35 PM", modified:"13 Apr 2026, 06:35 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:10, name:"test",                        amount:50000,  account:"test",          stage:"Needs Analysis",            probability:20, contactName:"test test",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:17 PM", modified:"13 Apr 2026, 06:34 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:11, name:"Smith",                       amount:100000, account:"test",          stage:"Value Proposition",         probability:40, contactName:"John Smith",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:00 PM", modified:"13 Apr 2026, 06:02 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:12, name:"Mike",                        amount:0,      account:"Speedy Motors", stage:"Qualification",             probability:0,  contactName:"Speedy Mike",      createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 05:56 PM", modified:"13 Apr 2026, 05:56 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:13, name:"Test",                        amount:10000,  account:"SDL",           stage:"Proposal/Price Quote",      probability:75, contactName:"",                 createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"25 Mar 2026, 08:10 PM", modified:"07 Apr 2026, 04:53 PM", owner:"PM SDL",    ownerInitials:"PM" },
];

// ─────────────────────────────────────────────
//  Stage config
// ─────────────────────────────────────────────
const STAGE_CFG: Record<DealStage, { bg: string; text: string; dot: string }> = {
  "Qualification":            { bg: "#EFF6FF", text: "#0C2472", dot: "#1D4ED8" },
  "Needs Analysis":           { bg: "#E3ECFC", text: "#1D4ED8", dot: "#3B82F6" },
  "Value Proposition":        { bg: "#E3ECFC", text: "#0C2472", dot: "#60A5FA" },
  "Identify Decision Makers": { bg: "#E3ECFC", text: "#1D4ED8", dot: "#0C2472" },
  "Proposal/Price Quote":     { bg: "#EFF6FF", text: "#0C2472", dot: "#0C2472" },
  "Negotiation/Review":       { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  "Closed Won":               { bg: "#DCFCE7", text: "#166534", dot: "#10B981" },
};

// ─────────────────────────────────────────────
//  Stage tabs
// ─────────────────────────────────────────────
const STAGE_TABS = [
  "All", "Qualification", "Needs Analysis", "Value Proposition",
  "Identify Decision Makers", "Proposal/Price Quote", "Negotiation/Review", "Closed Won",
];

// ─────────────────────────────────────────────
//  Column definitions
// ─────────────────────────────────────────────
const COL_DEFS: { key: string; label: string; width: string }[] = [
  { key: "dealName",    label: "Deal Name",       width: "1fr"   },
  { key: "amount",      label: "Amount",          width: "110px" },
  { key: "accountName", label: "Account Name",    width: "140px" },
  { key: "stage",       label: "Stage",           width: "180px" },
  { key: "probability", label: "Probability (%)", width: "110px" },
  { key: "contactName", label: "Contact Name",    width: "140px" },
  { key: "createdBy",   label: "Created By",      width: "130px" },
  { key: "modifiedBy",  label: "Modified By",     width: "130px" },
  { key: "creation",    label: "Creation",        width: "175px" },
  { key: "modified",    label: "Modified",        width: "175px" },
];

const DEFAULT_VISIBLE_COLS = new Set([
  "dealName", "amount", "accountName", "stage", "probability",
  "contactName", "creation", "modified",
]);

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
const fmt = (n: number) => n === 0 ? "₹0" : `₹${n.toLocaleString("en-IN")}`;

function ColHeader({ label }: { label: string }) {
  return (
    <div className="font-heading flex items-center gap-0.5 text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider cursor-pointer hover:text-[#1D4ED8] transition-colors group select-none">
      {label}
      <ArrowsDownUp size={12} weight="duotone" className="opacity-30 group-hover:opacity-100 text-[#60A5FA] transition-opacity" />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function DealsPage() {
  const router = useRouter();

  const [selected, setSelected]       = useState<number[]>([]);
  const [activeStage, setActiveStage] = useState("All");
  const [search, setSearch]           = useState("");
  const [view, setView]               = useState<"list" | "grid" | "kanban">("list");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sortAnchor, setSortAnchor]   = useState<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterRow[]>([]);
  const [activeSorts,   setActiveSorts]   = useState<SortRow[]>([]);
  const [visibleCols, setVisibleCols]     = useState<Set<string>>(new Set(DEFAULT_VISIBLE_COLS));

  // Stage counts
  const stageCounts: Record<string, number> = { All: ALL_DEALS.length };
  ALL_DEALS.forEach(d => { stageCounts[d.stage] = (stageCounts[d.stage] ?? 0) + 1; });

  // Filtered deals
  const filtered = ALL_DEALS.filter(d => {
    const matchStage  = activeStage === "All" || d.stage === activeStage;
    const q           = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.account.toLowerCase().includes(q) || d.contactName.toLowerCase().includes(q);
    return matchStage && matchSearch;
  });

  const totalValue = filtered.reduce((s, d) => s + d.amount, 0);

  const allChecked  = selected.length === filtered.length && filtered.length > 0;
  const someChecked = selected.length > 0 && !allChecked;
  const toggleAll   = () => setSelected(allChecked ? [] : filtered.map(d => d.id));
  const toggleOne   = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const visibleColDefs = COL_DEFS.filter(c => visibleCols.has(c.key));
  const gridTemplate   = ["36px", ...visibleColDefs.map(c => c.width), "40px"].join(" ");

  return (
    <div className="flex h-screen bg-[#EFF6FF] font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">

          {/* ══ Breadcrumb + Header ══ */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
                <House size={12} weight="duotone" />
                <CaretRight size={11} weight="duotone" />
                <Link href="/deals" className="hover:text-[#1D4ED8] transition-colors font-medium">Deals</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-[20px] font-extrabold text-slate-900 tracking-tight">Deals</h1>
                <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E3ECFC] px-2 py-0.5 rounded-full shadow-sm">
                  {ALL_DEALS.length} total
                </span>
                {/* Total pipeline value */}
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <TrendUp size={10} weight="duotone" />
                  Pipeline: ₹{(ALL_DEALS.reduce((s, d) => s + d.amount, 0) / 100000).toFixed(1)}L
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* View toggle */}
              <div className="flex items-center bg-white border border-[#E3ECFC] rounded-xl p-0.5 gap-0.5 shadow-sm">
                {[
                  { k: "list",   Icon: List,     label: "List"   },
                  { k: "grid",   Icon: GridFour, label: "Grid"   },
                  { k: "kanban", Icon: Kanban,   label: "Kanban" },
                ].map(({ k, Icon, label }) => (
                  <button key={k} onClick={() => setView(k as typeof view)}
                    className={`flex items-center gap-1.5 px-2.5 py-[7px] rounded-lg text-[11.5px] font-semibold transition-all ${
                      view === k ? "bg-[#EFF6FF] text-[#1D4ED8]" : "text-slate-400 hover:text-slate-600"
                    }`}>
                    <Icon size={14} weight="duotone" />{label}
                  </button>
                ))}
              </div>

              <Button variant="contained"
                startIcon={<Plus size={16} weight="duotone" />}
                onClick={() => setDrawerOpen(true)}
                sx={{ bgcolor: "#1D4ED8", borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: "0.78rem", px: 2, py: 0.85, boxShadow: "0 1px 8px 0 #1D4ED833", "&:hover": { bgcolor: "#60A5FA", boxShadow: "0 2px 14px #60A5FA55" }, "&:active": { bgcolor: "#0C2472" } }}>
                New Deal
              </Button>
            </div>
          </div>

          {/* ══ Stage filter tabs ══ */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {STAGE_TABS.map(stage => {
              const cnt    = stageCounts[stage] ?? 0;
              const active = activeStage === stage;
              if (stage !== "All" && cnt === 0) return null;
              return (
                <button key={stage} onClick={() => setActiveStage(stage)}
                  className={`flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    active ? "bg-[#1D4ED8] text-white shadow-sm shadow-[#1D4ED8]/25"
                           : "bg-[#E3ECFC] text-[#0C2472] hover:bg-[#1D4ED8]/10 hover:text-[#1D4ED8]"
                  }`}>
                  {stage}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                    active ? "bg-white/20 text-white" : "bg-[#1D4ED8]/10 text-[#0C2472]"
                  }`}>{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* ══ Toolbar ══ */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#E3ECFC] rounded-xl px-3 py-2 w-72 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search by deal name, account…" value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: "0.76rem", color: "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
              />
              {search && <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 text-sm">✕</button>}
            </div>

            {/* Filters */}
            <Button variant="outlined" size="small"
              startIcon={activeFilters.length > 0
                ? <Badge badgeContent={activeFilters.length} color="primary" sx={{ "& .MuiBadge-badge": { fontSize: "0.55rem", height: 14, minWidth: 14 } }}>
                    <FunnelSimple size={14} weight="duotone" />
                  </Badge>
                : <FunnelSimple size={14} weight="duotone" />
              }
              onClick={() => setFiltersOpen(true)}
              sx={{ borderColor: activeFilters.length > 0 ? "#1D4ED8" : "#E3ECFC", color: activeFilters.length > 0 ? "#1D4ED8" : "#475569", bgcolor: activeFilters.length > 0 ? "#EFF6FF" : "transparent", borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: "0.74rem", "&:hover": { borderColor: "#1D4ED8", color: "#1D4ED8", bgcolor: "#EFF6FF" } }}>
              Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>

            {/* Columns */}
            <Button variant="outlined" size="small"
              startIcon={<Columns size={14} weight="duotone" />}
              onClick={() => setColumnsOpen(true)}
              sx={{ borderColor: "#E3ECFC", color: "#475569", borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: "0.74rem", "&:hover": { borderColor: "#1D4ED8", color: "#1D4ED8", bgcolor: "#EFF6FF" } }}>
              Columns
            </Button>

            {/* Sort */}
            <Button variant="outlined" size="small"
              startIcon={<SortAscending size={14} weight="duotone" />}
              endIcon={<CaretDown size={11} weight="duotone" />}
              onClick={e => setSortAnchor(e.currentTarget)}
              sx={{ borderColor: activeSorts.length > 0 ? "#1D4ED8" : "#E3ECFC", color: activeSorts.length > 0 ? "#1D4ED8" : "#475569", bgcolor: activeSorts.length > 0 ? "#EFF6FF" : "transparent", borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: "0.74rem", "&:hover": { borderColor: "#1D4ED8", color: "#1D4ED8", bgcolor: "#EFF6FF" } }}>
              Sort{activeSorts.length > 0 ? ` (${activeSorts.length})` : ""}
            </Button>

            {/* Filtered value */}
            <div className="ml-auto flex items-center gap-3">
              {filtered.length !== ALL_DEALS.length && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  ₹{(totalValue / 100000).toFixed(1)}L filtered
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-medium">
                {filtered.length} of {ALL_DEALS.length} records
              </span>
            </div>
          </div>

          {/* ══ Bulk action bar ══ */}
          {selected.length > 0 && (
            <div className="flex items-center gap-3 bg-[#0C2472] text-white px-4 py-2.5 rounded-xl animate-slide-up shadow-lg shadow-[#0C2472]/20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#1D4ED8] flex items-center justify-center text-[10px] font-extrabold">{selected.length}</span>
                <span className="text-[12px] font-semibold">selected</span>
              </div>
              <div className="w-px h-4 bg-white/15" />
              <button className="text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">Update Stage</button>
              <button className="text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">Assign Owner</button>
              <button onClick={() => setSelected([])} className="ml-auto text-[11.5px] font-semibold text-white/50 hover:text-white transition-colors">Clear</button>
              <button className="flex items-center gap-1.5 text-[11.5px] font-semibold text-red-300 hover:text-red-200 transition-colors">
                <Trash size={14} weight="duotone" /> Delete
              </button>
            </div>
          )}

          {/* ══ GRID ══ */}
          {view === "grid" && <DealGridView deals={filtered} />}

          {/* ══ KANBAN ══ */}
          {view === "kanban" && <DealKanbanView deals={filtered} />}

          {/* ══ LIST ══ */}
          {view === "list" && (
            <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="grid items-center px-4 py-2.5 bg-[#E3ECFC] border-b border-[#E3ECFC]"
                style={{ gridTemplateColumns: gridTemplate }}>
                <Checkbox size="small" checked={allChecked} indeterminate={someChecked} onChange={toggleAll}
                  sx={{ p: 0.5, color: "#CBD5E1", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#1D4ED8" } }} />
                {visibleColDefs.map(c => <ColHeader key={c.key} label={c.label} />)}
                <div />
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#EFF6FF]">
                {filtered.map(deal => {
                  const isSel = selected.includes(deal.id);
                  const cfg   = STAGE_CFG[deal.stage] ?? STAGE_CFG["Qualification"];

                  return (
                    <div key={deal.id}
                      className={`grid items-center px-4 py-3 transition-all duration-100 cursor-pointer group ${
                        isSel ? "bg-[#EFF6FF]" : "hover:bg-[#60A5FA]/[0.04]"
                      }`}
                      style={{ gridTemplateColumns: gridTemplate }}
                      onClick={() => router.push(`/deals/${deal.id}`)}>

                      <Checkbox size="small" checked={isSel} onChange={() => toggleOne(deal.id)} onClick={e => e.stopPropagation()}
                        sx={{ p: 0.5, color: "#CBD5E1", "&.Mui-checked": { color: "#1D4ED8" } }} />

                      {/* Deal Name */}
                      {visibleCols.has("dealName") && (
                        <p className="font-heading text-[12.5px] font-semibold text-slate-800 truncate pr-2 group-hover:text-[#1D4ED8] transition-colors">
                          {deal.name}
                        </p>
                      )}

                      {/* Amount */}
                      {visibleCols.has("amount") && (
                        <p className="text-[12px] font-bold text-slate-800 truncate pr-2">{fmt(deal.amount)}</p>
                      )}

                      {/* Account Name */}
                      {visibleCols.has("accountName") && (
                        <p className="text-[12px] text-slate-500 truncate pr-2">
                          {deal.account || <span className="text-slate-200">—</span>}
                        </p>
                      )}

                      {/* Stage */}
                      {visibleCols.has("stage") && (
                        <div className="pr-2">
                          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-[3px] rounded-full"
                            style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                            <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
                            {deal.stage}
                          </span>
                        </div>
                      )}

                      {/* Probability */}
                      {visibleCols.has("probability") && (
                        <div className="flex items-center gap-1.5 pr-2">
                          <div className="w-14 h-1 bg-[#E3ECFC] rounded-full overflow-hidden flex-shrink-0">
                            <div className="h-full rounded-full" style={{ width: `${deal.probability}%`, backgroundColor: cfg.dot }} />
                          </div>
                          <span className="text-[11.5px] text-slate-500 font-medium">{deal.probability}%</span>
                        </div>
                      )}

                      {/* Contact Name */}
                      {visibleCols.has("contactName") && (
                        <p className="text-[12px] text-slate-500 truncate pr-2">
                          {deal.contactName || <span className="text-slate-200">—</span>}
                        </p>
                      )}

                      {/* Created By */}
                      {visibleCols.has("createdBy") && (
                        <p className="text-[11.5px] text-slate-400 truncate pr-2">{deal.createdBy}</p>
                      )}

                      {/* Modified By */}
                      {visibleCols.has("modifiedBy") && (
                        <p className="text-[11.5px] text-slate-400 truncate pr-2">{deal.modifiedBy}</p>
                      )}

                      {/* Creation */}
                      {visibleCols.has("creation") && (
                        <p className="text-[11px] text-slate-400 truncate pr-2">{deal.creation}</p>
                      )}

                      {/* Modified */}
                      {visibleCols.has("modified") && (
                        <p className="text-[11px] text-slate-400 truncate">{deal.modified}</p>
                      )}

                      {/* Row action */}
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip title="Actions">
                          <IconButton size="small" sx={{ borderRadius: "6px", p: 0.5, "&:hover": { bgcolor: "#E3ECFC" } }}>
                            <DotsThreeVertical size={15} color="#94A3B8" weight="duotone" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-3">
                    <MagnifyingGlass size={22} color="#93C5FD" weight="duotone" />
                  </div>
                  <p className="font-heading text-slate-500 text-sm font-semibold">No deals found</p>
                  <p className="text-slate-300 text-xs mt-1">Try adjusting your search or stage filter</p>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#EFF6FF]">
                <p className="text-[11px] text-slate-400 font-medium">
                  Showing <span className="text-slate-700 font-bold">1–{filtered.length}</span> of{" "}
                  <span className="text-slate-700 font-bold">{ALL_DEALS.length}</span> records
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>Rows per page:</span>
                    <button className="flex items-center gap-0.5 bg-[#EFF6FF] text-[#1D4ED8] font-bold px-2 py-1 rounded-lg hover:bg-[#E3ECFC] transition-colors text-[11px]">
                      20 <CaretDown size={12} weight="duotone" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#E3ECFC] disabled:opacity-30 font-bold text-sm" disabled>‹</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1D4ED8] text-white text-[11px] font-bold shadow-sm">1</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#E3ECFC] disabled:opacity-30 font-bold text-sm" disabled>›</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══ Panels ══ */}
      <NewDealDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <FiltersDrawer
        open={filtersOpen} onClose={() => setFiltersOpen(false)}
        filters={activeFilters} onChange={setActiveFilters}
      />

      <ColumnsDrawer
        open={columnsOpen} onClose={() => setColumnsOpen(false)}
        selected={visibleCols} onChange={setVisibleCols}
      />

      <SortPopover
        anchor={sortAnchor} onClose={() => setSortAnchor(null)}
        sorts={activeSorts} onChange={setActiveSorts}
      />
    </div>
  );
}
