"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewLeadDrawer from "@/components/leads/NewLeadDrawer";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer, { COLUMN_GROUPS, DEFAULT_COLUMNS } from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import LeadGridView from "@/components/leads/LeadGridView";
import LeadKanbanView from "@/components/leads/LeadKanbanView";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import {
  Plus, MagnifyingGlass, SlidersHorizontal, SortAscending, Columns,
  DotsThreeVertical, ArrowsDownUp, List, GridFour, Kanban,
  CaretDown, House, CaretRight, Trash, UserCheck, NotePencil, Phone,
  FunnelSimple,
} from "@phosphor-icons/react";
import { LEAD_AVATARS, OWNER_AVATARS } from "@/lib/avatars";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
type LeadStatus = "New" | "Contacted" | "Qualified" | "In Progress" | "Lost" | "Unqualified";

interface Lead {
  id: number; name: string; company: string; email: string; mobile: string;
  status: LeadStatus; owner: string; ownerInitials: string; created: string;
  leadSource: string; rating: string;
}

// ─────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────
const ALL_LEADS: Lead[] = [
  { id:1,  name:"Mrs. Shobha R",      company:"Shobha Realty",    email:"",                     mobile:"",               status:"New",         owner:"PM SDL",    ownerInitials:"PM", created:"27 May 2026", leadSource:"Web",       rating:"Hot"  },
  { id:2,  name:"Priya Nair",         company:"Nair & Co",        email:"priya.nair@demo.com",  mobile:"9988776655",     status:"Contacted",   owner:"SE User 1", ownerInitials:"SU", created:"02 Feb 2025", leadSource:"Referral",  rating:"Warm" },
  { id:3,  name:"John Carter",        company:"Carter Traders",   email:"john.carter@demo.com", mobile:"9876543210",     status:"Qualified",   owner:"SE User 1", ownerInitials:"SU", created:"02 Feb 2025", leadSource:"Cold Call", rating:"Hot"  },
  { id:4,  name:"Sudha R",            company:"ddd",              email:"Sudha@gmail.com",      mobile:"76656564456544", status:"In Progress", owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"",          rating:"Cold" },
  { id:5,  name:"Jaya 56678",         company:"",                 email:"",                     mobile:"76656564456544", status:"New",         owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"Web",       rating:""     },
  { id:6,  name:"Leo $#$#$#",         company:"",                 email:"",                     mobile:"7865443322",     status:"Unqualified", owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"",          rating:"Cold" },
  { id:7,  name:"gfdsfs%$%^$^%$",    company:"",                 email:"",                     mobile:"9876543212",     status:"Lost",        owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"",          rating:""     },
  { id:8,  name:"335634656",          company:"",                 email:"",                     mobile:"675432124578",   status:"New",         owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"",          rating:""     },
  { id:9,  name:"Leo",                company:"",                 email:"",                     mobile:"6757567456",     status:"Contacted",   owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"Web",       rating:"Cold" },
  { id:10, name:"James Wilson",       company:"Wilson & Partners",email:"james@wilson.com",     mobile:"9876541234",     status:"Qualified",   owner:"PM SDL",    ownerInitials:"PM", created:"15 May 2026", leadSource:"Referral",  rating:"Hot"  },
  { id:11, name:"Sara Kim",           company:"TechFlow Ltd",     email:"sara.kim@techflow.io", mobile:"8765432109",     status:"In Progress", owner:"SE User 1", ownerInitials:"SU", created:"10 Apr 2026", leadSource:"Trade Show",rating:"Warm" },
  { id:12, name:"Raj Mehta",          company:"Apex Group",       email:"raj@apex.in",          mobile:"9845123456",     status:"New",         owner:"Admin",     ownerInitials:"AD", created:"08 Mar 2026", leadSource:"Web",       rating:"Hot"  },
];

// ─────────────────────────────────────────────
//  Status config
// ─────────────────────────────────────────────
const STATUS_CFG: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  "New":         { bg:"#EFF6FF", text:"#0C2472", dot:"#1D4ED8" },
  "Contacted":   { bg:"#E3ECFC", text:"#1D4ED8", dot:"#3B82F6" },
  "Qualified":   { bg:"#DCFCE7", text:"#166534", dot:"#16A34A" },
  "In Progress": { bg:"#E3ECFC", text:"#0C2472", dot:"#60A5FA" },
  "Lost":        { bg:"#FEF2F2", text:"#991B1B", dot:"#EF4444" },
  "Unqualified": { bg:"#F1F5F9", text:"#475569", dot:"#94A3B8" },
};

const TABS: Array<{ key: LeadStatus | "All"; label: string }> = [
  { key:"All",         label:"All"         },
  { key:"New",         label:"New"         },
  { key:"Contacted",   label:"Contacted"   },
  { key:"In Progress", label:"In Progress" },
  { key:"Qualified",   label:"Qualified"   },
  { key:"Lost",        label:"Lost"        },
  { key:"Unqualified", label:"Unqualified" },
];

const AVATAR_PAL = ["#0C2472","#1D4ED8","#3B82F6","#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_PAL.length];
const initials    = (n: string) => { const p=n.trim().split(/\s+/); return p.length>=2?(p[0][0]+p[1][0]).toUpperCase():n.substring(0,2).toUpperCase(); };

function ColHeader({ label }: { label: string }) {
  return (
    <div className="font-heading flex items-center gap-0.5 text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider cursor-pointer hover:text-[#1D4ED8] transition-colors group select-none">
      {label}
      <ArrowsDownUp size={12} weight="duotone" className="opacity-30 group-hover:opacity-100 text-[#60A5FA] transition-opacity" />
    </div>
  );
}

// ─────────────────────────────────────────────
//  All column definitions (for list view)
// ─────────────────────────────────────────────
const COL_DEFS: { key: string; label: string; width: string }[] = [
  { key:"leadName",    label:"Lead Name",  width:"1fr"   },
  { key:"company",     label:"Company",    width:"140px" },
  { key:"email",       label:"Email",      width:"190px" },
  { key:"mobile",      label:"Mobile",     width:"135px" },
  { key:"leadStatus",  label:"Status",     width:"125px" },
  { key:"leadOwner",   label:"Lead Owner", width:"145px" },
  { key:"creation",    label:"Created",    width:"110px" },
];

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function LeadsPage() {
  const router = useRouter();

  // ── View & selection state
  const [selected, setSelected] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch]       = useState("");
  const [view, setView]           = useState<"list" | "grid" | "kanban">("list");

  // ── Panel state
  const [drawerOpen,   setDrawerOpen]   = useState(false);   // New Lead
  const [filtersOpen,  setFiltersOpen]  = useState(false);
  const [columnsOpen,  setColumnsOpen]  = useState(false);
  const [sortAnchor,   setSortAnchor]   = useState<HTMLElement | null>(null);

  // ── Filter / Sort / Columns data
  const [activeFilters, setActiveFilters] = useState<FilterRow[]>([]);
  const [activeSorts,   setActiveSorts]   = useState<SortRow[]>([]);
  const [visibleCols,   setVisibleCols]   = useState<Set<string>>(new Set(DEFAULT_COLUMNS));

  // ── Counts per status
  const counts: Record<string, number> = { All: ALL_LEADS.length };
  ALL_LEADS.forEach(l => { counts[l.status] = (counts[l.status] ?? 0) + 1; });

  // ── Filtered list
  const filtered = ALL_LEADS.filter(l => {
    const matchTab    = activeTab === "All" || l.status === activeTab;
    const q           = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
    // Apply active filters
    const matchFilters = activeFilters.every(f => {
      const val = (l as unknown as Record<string, string>)[f.column] || "";
      if (f.operator === "is_empty")     return !val;
      if (f.operator === "is_not_empty") return !!val;
      if (!f.value) return true;
      const v = f.value.toLowerCase();
      switch (f.operator) {
        case "contains":         return val.toLowerCase().includes(v);
        case "does_not_contain": return !val.toLowerCase().includes(v);
        case "equals":           return val.toLowerCase() === v;
        case "does_not_equal":   return val.toLowerCase() !== v;
        case "starts_with":      return val.toLowerCase().startsWith(v);
        case "ends_with":        return val.toLowerCase().endsWith(v);
        default: return true;
      }
    });
    return matchTab && matchSearch && matchFilters;
  });

  const allChecked  = selected.length === filtered.length && filtered.length > 0;
  const someChecked = selected.length > 0 && !allChecked;
  const toggleAll   = () => setSelected(allChecked ? [] : filtered.map(l => l.id));
  const toggleOne   = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // Visible list columns (ordered by COL_DEFS)
  const visibleColDefs = COL_DEFS.filter(c => visibleCols.has(c.key));
  const gridTemplate   = ["36px", ...visibleColDefs.map(c => c.width), "40px"].join(" ");

  return (
    <div className="flex h-screen bg-[#EFF6FF] font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">

          {/* ══ Page header ══ */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
                <House size={12} weight="duotone" />
                <CaretRight size={11} weight="duotone" />
                <Link href="/leads" className="hover:text-[#1D4ED8] transition-colors font-medium">Leads</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-[20px] font-extrabold text-slate-900 tracking-tight">Leads</h1>
                <span className="text-[11px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full shadow-sm">
                  {ALL_LEADS.length} total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* View toggle */}
              <div className="flex items-center bg-white border border-slate-100 rounded-xl p-0.5 gap-0.5 shadow-sm">
                {[
                  { k:"list",   Icon:List,     label:"List"   },
                  { k:"grid",   Icon:GridFour, label:"Grid"   },
                  { k:"kanban", Icon:Kanban,   label:"Kanban" },
                ].map(({ k, Icon, label }) => (
                  <button key={k} onClick={() => setView(k as typeof view)}
                    className={`flex items-center gap-1.5 px-2.5 py-[7px] rounded-lg text-[11.5px] font-semibold transition-all ${
                      view === k ? "bg-[#EFF6FF] text-[#1D4ED8]" : "text-slate-400 hover:text-slate-600"
                    }`}>
                    <Icon size={14} weight="duotone" />{label}
                  </button>
                ))}
              </div>

              <Button variant="contained" startIcon={<Plus size={16} weight="duotone" />}
                onClick={() => setDrawerOpen(true)}
                sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:2, py:0.85, boxShadow:"0 1px 8px 0 #1D4ED833", "&:hover":{ bgcolor:"#60A5FA", boxShadow:"0 2px 14px 0 #60A5FA55" }, "&:active":{ bgcolor:"#0C2472" } }}>
                New Lead
              </Button>
            </div>
          </div>

          {/* ══ Status tabs ══ */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {TABS.map(({ key, label }) => {
              const cnt = counts[key] ?? 0;
              const active = activeTab === key;
              if (key !== "All" && cnt === 0) return null;
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all ${
                    active ? "bg-[#1D4ED8] text-white shadow-sm shadow-[#1D4ED8]/25"
                           : "bg-[#E3ECFC] text-[#0C2472] hover:bg-[#1D4ED8]/10 hover:text-[#1D4ED8]"
                  }`}>
                  {label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                    active ? "bg-white/20 text-white" : "bg-[#1D4ED8]/10 text-[#0C2472]"
                  }`}>{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* ══ Toolbar: Search | Filters | Columns | Sort ══ */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#E3ECFC] rounded-xl px-3 py-2 w-72 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search by name, company, email…" value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex:1, fontSize:"0.76rem", color:"#334155", "& input::placeholder":{ color:"#94A3B8", opacity:1 } }}
              />
              {search && <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 transition-colors text-sm">✕</button>}
            </div>

            {/* Filters button */}
            <Button variant="outlined" size="small"
              startIcon={
                activeFilters.length > 0
                  ? <Badge badgeContent={activeFilters.length} color="primary" sx={{ "& .MuiBadge-badge": { fontSize: "0.55rem", height: 14, minWidth: 14 } }}>
                      <FunnelSimple size={14} weight="duotone" />
                    </Badge>
                  : <FunnelSimple size={14} weight="duotone" />
              }
              onClick={() => setFiltersOpen(true)}
              sx={{
                borderColor: activeFilters.length > 0 ? "#1D4ED8" : "#E2E8F0",
                color: activeFilters.length > 0 ? "#1D4ED8" : "#475569",
                bgcolor: activeFilters.length > 0 ? "#EFF6FF" : "transparent",
                borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.74rem",
                "&:hover":{ borderColor:"#1D4ED8", color:"#1D4ED8", bgcolor:"#EFF6FF" },
              }}>
              Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>

            {/* Columns button */}
            <Button variant="outlined" size="small"
              startIcon={<Columns size={14} weight="duotone" />}
              onClick={() => setColumnsOpen(true)}
              sx={{
                borderColor: visibleCols.size !== DEFAULT_COLUMNS.size ? "#1D4ED8" : "#E2E8F0",
                color: visibleCols.size !== DEFAULT_COLUMNS.size ? "#1D4ED8" : "#475569",
                bgcolor: visibleCols.size !== DEFAULT_COLUMNS.size ? "#EFF6FF" : "transparent",
                borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.74rem",
                "&:hover":{ borderColor:"#1D4ED8", color:"#1D4ED8", bgcolor:"#EFF6FF" },
              }}>
              Columns
            </Button>

            {/* Sort button */}
            <Button variant="outlined" size="small"
              startIcon={<SortAscending size={14} weight="duotone" />}
              endIcon={<CaretDown size={11} weight="duotone" />}
              onClick={e => setSortAnchor(e.currentTarget)}
              sx={{
                borderColor: activeSorts.length > 0 ? "#1D4ED8" : "#E2E8F0",
                color: activeSorts.length > 0 ? "#1D4ED8" : "#475569",
                bgcolor: activeSorts.length > 0 ? "#EFF6FF" : "transparent",
                borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.74rem",
                "&:hover":{ borderColor:"#1D4ED8", color:"#1D4ED8", bgcolor:"#EFF6FF" },
              }}>
              Sort{activeSorts.length > 0 ? ` (${activeSorts.length})` : ""}
            </Button>

            <span className="ml-auto text-[11px] text-slate-400 font-medium">
              {filtered.length} of {ALL_LEADS.length} records
            </span>
          </div>

          {/* ══ Bulk action bar ══ */}
          {selected.length > 0 && (
            <div className="flex items-center gap-3 bg-[#0C2472] text-white px-4 py-2.5 rounded-xl animate-slide-up shadow-lg shadow-[#0C2472]/20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#1D4ED8] flex items-center justify-center text-[10px] font-extrabold">{selected.length}</span>
                <span className="text-[12px] font-semibold">selected</span>
              </div>
              <div className="w-px h-4 bg-white/15" />
              <button className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">
                <UserCheck size={14} weight="duotone" /> Assign Owner
              </button>
              <button className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">
                <NotePencil size={14} weight="duotone" /> Update Status
              </button>
              <button onClick={() => setSelected([])} className="ml-auto text-[11.5px] font-semibold text-white/50 hover:text-white transition-colors">Clear</button>
              <button className="flex items-center gap-1.5 text-[11.5px] font-semibold text-red-300 hover:text-red-200 transition-colors">
                <Trash size={14} weight="duotone" /> Delete
              </button>
            </div>
          )}

          {/* ══ GRID VIEW ══ */}
          {view === "grid" && <LeadGridView leads={filtered} />}

          {/* ══ KANBAN VIEW ══ */}
          {view === "kanban" && <LeadKanbanView leads={filtered} />}

          {/* ══ LIST VIEW ══ */}
          {view === "list" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Header row */}
              <div className="grid items-center px-4 py-2.5 bg-[#E3ECFC] border-b border-[#E3ECFC]"
                style={{ gridTemplateColumns: gridTemplate }}>
                <Checkbox size="small" checked={allChecked} indeterminate={someChecked} onChange={toggleAll}
                  sx={{ p:0.5, color:"#CBD5E1", "&.Mui-checked, &.MuiCheckbox-indeterminate":{ color:"#1D4ED8" } }} />
                {visibleColDefs.map(c => <ColHeader key={c.key} label={c.label} />)}
                <div />
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#EFF6FF]">
                {filtered.map(lead => {
                  const isSel  = selected.includes(lead.id);
                  const cfg    = STATUS_CFG[lead.status];
                  const avCol  = avatarColor(lead.name);
                  const owCol  = avatarColor(lead.owner);
                  const ini    = initials(lead.name);

                  return (
                    <div key={lead.id} className={`grid items-center px-4 py-[11px] transition-all duration-100 cursor-pointer group ${isSel ? "bg-[#EFF6FF]" : "hover:bg-[#60A5FA]/[0.04]"}`}
                      style={{ gridTemplateColumns: gridTemplate }}
                      onClick={() => router.push(`/leads/${lead.id}`)}>

                      <Checkbox size="small" checked={isSel} onChange={() => toggleOne(lead.id)} onClick={e => e.stopPropagation()}
                        sx={{ p:0.5, color:"#CBD5E1", "&.Mui-checked":{ color:"#1D4ED8" } }} />

                      {/* Lead Name */}
                      {visibleCols.has("leadName") && (
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <Avatar src={LEAD_AVATARS[lead.id]} sx={{ width:28, height:28, bgcolor:avCol, fontSize:"0.6rem", fontWeight:800, flexShrink:0 }}>{ini}</Avatar>
                          <p className="font-heading text-[12.5px] font-semibold text-slate-800 truncate group-hover:text-[#1D4ED8] transition-colors">{lead.name}</p>
                        </div>
                      )}

                      {/* Company */}
                      {visibleCols.has("company") && (
                        <div className="text-[12px] text-slate-500 truncate pr-3">
                          {lead.company || <span className="text-slate-200">—</span>}
                        </div>
                      )}

                      {/* Email */}
                      {visibleCols.has("email") && (
                        <Tooltip title={lead.email} placement="top">
                          <div className="text-[12px] truncate pr-3">
                            {lead.email
                              ? <span className="text-[#3B82F6] hover:underline cursor-pointer">{lead.email}</span>
                              : <span className="text-slate-200">—</span>}
                          </div>
                        </Tooltip>
                      )}

                      {/* Mobile */}
                      {visibleCols.has("mobile") && (
                        <div className="text-[12px] text-slate-500 font-mono truncate pr-3">
                          {lead.mobile
                            ? <span className="flex items-center gap-1"><Phone size={11} color="#93C5FD" weight="duotone" />{lead.mobile}</span>
                            : <span className="text-slate-200">—</span>}
                        </div>
                      )}

                      {/* Status */}
                      {visibleCols.has("leadStatus") && (
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-[3px] rounded-full"
                            style={{ backgroundColor:cfg.bg, color:cfg.text }}>
                            <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ backgroundColor:cfg.dot }} />
                            {lead.status}
                          </span>
                        </div>
                      )}

                      {/* Owner */}
                      {visibleCols.has("leadOwner") && (
                        <Tooltip title={lead.owner} placement="top">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Avatar src={OWNER_AVATARS[lead.owner]} sx={{ width:20, height:20, bgcolor:owCol, fontSize:"0.48rem", fontWeight:800, flexShrink:0 }}>
                              {lead.ownerInitials}
                            </Avatar>
                            <span className="text-[11.5px] text-slate-500 truncate">{lead.owner}</span>
                          </div>
                        </Tooltip>
                      )}

                      {/* Created */}
                      {visibleCols.has("creation") && (
                        <div className="text-[11px] text-slate-400 truncate">{lead.created}</div>
                      )}

                      {/* Row action */}
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip title="Actions">
                          <IconButton size="small" sx={{ borderRadius:"6px", p:0.5, "&:hover":{ bgcolor:"#E3ECFC" } }}>
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
                  <p className="font-heading text-slate-500 text-sm font-semibold">No leads found</p>
                  <p className="text-slate-300 text-xs mt-1">Try adjusting your search, filters or tab</p>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#EFF6FF]">
                <p className="text-[11px] text-slate-400 font-medium">
                  Showing <span className="text-slate-700 font-bold">1–{filtered.length}</span> of{" "}
                  <span className="text-slate-700 font-bold">{ALL_LEADS.length}</span> records
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>Rows per page:</span>
                    <button className="flex items-center gap-0.5 bg-[#EFF6FF] text-[#1D4ED8] font-bold px-2 py-1 rounded-lg hover:bg-[#E3ECFC] transition-colors text-[11px]">
                      20 <CaretDown size={12} weight="duotone" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#E3ECFC] disabled:opacity-30 font-bold text-sm transition-colors" disabled>‹</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1D4ED8] text-white text-[11px] font-bold shadow-sm">1</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#E3ECFC] disabled:opacity-30 font-bold text-sm transition-colors" disabled>›</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══ Panels ══ */}
      <NewLeadDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={activeFilters}
        onChange={setActiveFilters}
      />

      <ColumnsDrawer
        open={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        selected={visibleCols}
        onChange={setVisibleCols}
      />

      <SortPopover
        anchor={sortAnchor}
        onClose={() => setSortAnchor(null)}
        sorts={activeSorts}
        onChange={setActiveSorts}
      />
    </div>
  );
}
