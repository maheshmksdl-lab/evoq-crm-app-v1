"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewAccountDrawer from "@/components/accounts/NewAccountDrawer";
import AccountGridView from "@/components/accounts/AccountGridView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import {
  Plus, MagnifyingGlass, SlidersHorizontal, SortAscending, Columns,
  ArrowsDownUp, List, GridFour, House, CaretRight, Trash,
  DotsThreeVertical, Phone, FunnelSimple, CaretDown, Buildings,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

// ─────────────────────────────────────────────
//  Data — exact from screenshot
// ─────────────────────────────────────────────
interface Account {
  id: number; name: string;
  ownerName: string; ownerEmail: string; ownerInitials: string;
  phone: string; accountType: string;
  modifiedByName: string; modifiedByEmail: string;
  creation: string; modified: string;
}

const ALL_ACCOUNTS: Account[] = [
  { id:1,  name:"XYZ",          ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"01111111111", accountType:"",           modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"27 May 2026, 03:14 PM", modified:"27 May 2026, 03:14 PM" },
  { id:2,  name:"Sweany Inc",   ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"6663636",     accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"27 May 2026, 02:38 PM", modified:"27 May 2026, 02:45 PM" },
  { id:3,  name:"Lee Industries",ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",   ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"15 May 2026, 09:31 AM", modified:"15 May 2026, 09:31 AM" },
  { id:4,  name:"SDL LEAD1",    ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"15 Apr 2026, 11:13 AM", modified:"15 Apr 2026, 11:13 AM" },
  { id:5,  name:"RMVT",         ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"14 Apr 2026, 06:38 PM", modified:"14 Apr 2026, 06:43 PM" },
  { id:6,  name:"test",         ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"9977887788", accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"13 Apr 2026, 06:00 PM", modified:"13 Apr 2026, 06:17 PM" },
  { id:7,  name:"Speedy Motors", ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",   ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"13 Apr 2026, 05:56 PM", modified:"13 Apr 2026, 05:56 PM" },
  { id:8,  name:"SDL Test",     ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"16 Mar 2026, 07:25 PM", modified:"08 Apr 2026, 04:47 PM" },
  { id:9,  name:"Test 1233333", ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"23 Mar 2026, 05:16 PM", modified:"23 Mar 2026, 05:16 PM" },
  { id:10, name:"SDL",          ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"26 Jun 2025, 04:11 PM", modified:"16 Mar 2026, 07:45 PM" },
  { id:11, name:"Sears Homelife",ownerName:"Admin", ownerEmail:"admin@mailinator.com",    ownerInitials:"AD", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"08 Jul 2025, 11:15 AM", modified:"16 Mar 2026, 07:45 PM" },
  { id:12, name:"dfgdfg",       ownerName:"Admin",  ownerEmail:"admin@mailinator.com",    ownerInitials:"AD", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"25 Jul 2025, 05:16 PM", modified:"16 Mar 2026, 07:45 PM" },
  { id:13, name:"I&T",          ownerName:"Admin",  ownerEmail:"admin@mailinator.com",    ownerInitials:"AD", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"28 Jul 2025, 10:13 AM", modified:"16 Mar 2026, 07:45 PM" },
  { id:14, name:"dd",           ownerName:"Admin",  ownerEmail:"admin@mailinator.com",    ownerInitials:"AD", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"28 Jul 2025, 10:14 AM", modified:"16 Mar 2026, 07:45 PM" },
];

// ─────────────────────────────────────────────
//  Account type config
// ─────────────────────────────────────────────
const TYPE_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  "Individual": { bg: "#EFF6FF", text: "#0C2472", dot: "#1D4ED8" },
  "Customer":   { bg: "#DCFCE7", text: "#166534", dot: "#10B981" },
  "Partner":    { bg: "#E3ECFC", text: "#1D4ED8", dot: "#3B82F6" },
  "Prospect":   { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  "Vendor":     { bg: "#E3ECFC", text: "#0C2472", dot: "#60A5FA" },
  "Analyst":    { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
  "Competitor": { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
};

// ─────────────────────────────────────────────
//  Column defs — all fixed px (horizontal scroll)
// ─────────────────────────────────────────────
const COL_DEFS = [
  { key: "accountName", label: "Account Name",  width: "200px" },
  { key: "accountOwner",label: "Account Owner", width: "175px" },
  { key: "phone",       label: "Phone",         width: "130px" },
  { key: "accountType", label: "Account Type",  width: "130px" },
  { key: "modifiedBy",  label: "Modified by",   width: "175px" },
  { key: "creation",    label: "Creation",      width: "165px" },
  { key: "modified",    label: "Modified",      width: "165px" },
];
const DEFAULT_VISIBLE = new Set(["accountName", "accountOwner", "phone", "accountType", "modifiedBy", "creation", "modified"]);

const AVATAR_PAL = ["#0C2472", "#1D4ED8", "#3B82F6", "#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];

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
export default function AccountsPage() {
  const router = useRouter();

  const [selected, setSelected]       = useState<number[]>([]);
  const [search, setSearch]           = useState("");
  const [view, setView]               = useState<"list" | "grid">("list");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sortAnchor, setSortAnchor]   = useState<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterRow[]>([]);
  const [activeSorts,   setActiveSorts]   = useState<SortRow[]>([]);
  const [visibleCols, setVisibleCols]     = useState<Set<string>>(new Set(DEFAULT_VISIBLE));

  const filtered = ALL_ACCOUNTS.filter(a => {
    const q = search.toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || a.ownerName.toLowerCase().includes(q);
  });

  const allChecked  = selected.length === filtered.length && filtered.length > 0;
  const someChecked = selected.length > 0 && !allChecked;
  const toggleAll   = () => setSelected(allChecked ? [] : filtered.map(a => a.id));
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
                <Link href="/accounts" className="hover:text-[#1D4ED8] transition-colors font-medium">Accounts</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-[20px] font-extrabold text-slate-900 tracking-tight">Accounts</h1>
                <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E3ECFC] px-2 py-0.5 rounded-full shadow-sm">
                  {ALL_ACCOUNTS.length} total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* View toggle */}
              <div className="flex items-center bg-white border border-[#E3ECFC] rounded-xl p-0.5 gap-0.5 shadow-sm">
                {[
                  { k: "list", Icon: List,     label: "List" },
                  { k: "grid", Icon: GridFour, label: "Grid" },
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
                New Account
              </Button>
            </div>
          </div>

          {/* ══ Toolbar ══ */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#E3ECFC] rounded-xl px-3 py-2 w-72 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search by account name, owner…" value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: "0.76rem", color: "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
              />
              {search && <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 text-sm">✕</button>}
            </div>

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

            <Button variant="outlined" size="small"
              startIcon={<Columns size={14} weight="duotone" />}
              onClick={() => setColumnsOpen(true)}
              sx={{ borderColor: "#E3ECFC", color: "#475569", borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: "0.74rem", "&:hover": { borderColor: "#1D4ED8", color: "#1D4ED8", bgcolor: "#EFF6FF" } }}>
              Columns
            </Button>

            <Button variant="outlined" size="small"
              startIcon={<SortAscending size={14} weight="duotone" />}
              endIcon={<CaretDown size={11} weight="duotone" />}
              onClick={e => setSortAnchor(e.currentTarget)}
              sx={{ borderColor: activeSorts.length > 0 ? "#1D4ED8" : "#E3ECFC", color: activeSorts.length > 0 ? "#1D4ED8" : "#475569", bgcolor: activeSorts.length > 0 ? "#EFF6FF" : "transparent", borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: "0.74rem", "&:hover": { borderColor: "#1D4ED8", color: "#1D4ED8", bgcolor: "#EFF6FF" } }}>
              Sort{activeSorts.length > 0 ? ` (${activeSorts.length})` : ""}
            </Button>

            <span className="ml-auto text-[11px] text-slate-400 font-medium">
              {filtered.length} of {ALL_ACCOUNTS.length} records
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
              <button className="text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">Assign Owner</button>
              <button className="text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">Update Type</button>
              <button onClick={() => setSelected([])} className="ml-auto text-[11.5px] font-semibold text-white/50 hover:text-white transition-colors">Clear</button>
              <button className="flex items-center gap-1.5 text-[11.5px] font-semibold text-red-300 hover:text-red-200 transition-colors">
                <Trash size={14} weight="duotone" /> Delete
              </button>
            </div>
          )}

          {/* ══ GRID VIEW ══ */}
          {view === "grid" && (
            <AccountGridView accounts={filtered.map(a => ({
              id: a.id, name: a.name, ownerName: a.ownerName, ownerInitials: a.ownerInitials,
              phone: a.phone, accountType: a.accountType, creation: a.creation,
            }))} />
          )}

          {/* ══ LIST VIEW ══ */}
          {view === "list" && (
            <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm flex flex-col">
              <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
                {/* Header */}
                <div className="grid items-center px-4 py-2.5 bg-[#E3ECFC] border-b border-[#E3ECFC]"
                  style={{ gridTemplateColumns: gridTemplate }}>
                  <Checkbox size="small" checked={allChecked} indeterminate={someChecked} onChange={toggleAll}
                    sx={{ p: 0.5, color: "#CBD5E1", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#1D4ED8" } }} />
                  {visibleColDefs.map(c => <ColHeader key={c.key} label={c.label} />)}
                  <div />
                </div>

                {/* Rows */}
                <div className="divide-y divide-[#EFF6FF]">
                  {filtered.map(acc => {
                    const isSel  = selected.includes(acc.id);
                    const typCfg = TYPE_CFG[acc.accountType] || { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" };
                    const owCol  = avatarColor(acc.ownerName);
                    const mbCol  = avatarColor(acc.modifiedByName);

                    return (
                      <div key={acc.id}
                        className={`grid items-center px-4 py-3 transition-all duration-100 cursor-pointer group ${
                          isSel ? "bg-[#EFF6FF]" : "hover:bg-[#60A5FA]/[0.04]"
                        }`}
                        style={{ gridTemplateColumns: gridTemplate }}
                        onClick={() => router.push(`/accounts/${acc.id}`)}>

                        <Checkbox size="small" checked={isSel} onChange={() => toggleOne(acc.id)} onClick={e => e.stopPropagation()}
                          sx={{ p: 0.5, color: "#CBD5E1", "&.Mui-checked": { color: "#1D4ED8" } }} />

                        {/* Account Name */}
                        {visibleCols.has("accountName") && (
                          <div className="flex items-center gap-2 pr-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0"
                              style={{ backgroundColor: avatarColor(acc.name) }}>
                              {acc.name.substring(0, 2).toUpperCase()}
                            </div>
                            <p className="font-heading text-[12.5px] font-semibold text-[#1D4ED8] truncate hover:underline cursor-pointer">
                              {acc.name}
                            </p>
                          </div>
                        )}

                        {/* Account Owner */}
                        {visibleCols.has("accountOwner") && (
                          <Tooltip title={`${acc.ownerName} · ${acc.ownerEmail}`} placement="top">
                            <div className="flex items-center gap-1.5 min-w-0 pr-2">
                              <Avatar src={OWNER_AVATARS[acc.ownerName]} sx={{ width: 20, height: 20, bgcolor: owCol, fontSize: "0.48rem", fontWeight: 800, flexShrink: 0 }}>
                                {acc.ownerInitials}
                              </Avatar>
                              <span className="text-[11.5px] text-slate-500 truncate">{acc.ownerEmail}</span>
                            </div>
                          </Tooltip>
                        )}

                        {/* Phone */}
                        {visibleCols.has("phone") && (
                          <div className="text-[12px] text-slate-500 font-mono truncate pr-2">
                            {acc.phone
                              ? <span className="flex items-center gap-1"><Phone size={11} color="#93C5FD" weight="duotone" />{acc.phone}</span>
                              : <span className="text-slate-200">—</span>}
                          </div>
                        )}

                        {/* Account Type */}
                        {visibleCols.has("accountType") && (
                          <div className="pr-2">
                            {acc.accountType
                              ? <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-[3px] rounded-full"
                                  style={{ backgroundColor: typCfg.bg, color: typCfg.text }}>
                                  <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: typCfg.dot }} />
                                  {acc.accountType}
                                </span>
                              : <span className="text-slate-200 text-[12px]">—</span>}
                          </div>
                        )}

                        {/* Modified By */}
                        {visibleCols.has("modifiedBy") && (
                          <Tooltip title={`${acc.modifiedByName} · ${acc.modifiedByEmail}`} placement="top">
                            <div className="flex items-center gap-1.5 min-w-0 pr-2">
                              <Avatar src={OWNER_AVATARS[acc.modifiedByName]} sx={{ width: 20, height: 20, bgcolor: mbCol, fontSize: "0.48rem", fontWeight: 800, flexShrink: 0 }}>
                                {acc.modifiedByName.substring(0, 2).toUpperCase()}
                              </Avatar>
                              <span className="text-[11.5px] text-slate-500 truncate">{acc.modifiedByEmail}</span>
                            </div>
                          </Tooltip>
                        )}

                        {/* Creation */}
                        {visibleCols.has("creation") && (
                          <p className="text-[11px] text-slate-400 truncate pr-2">{acc.creation}</p>
                        )}

                        {/* Modified */}
                        {visibleCols.has("modified") && (
                          <p className="text-[11px] text-slate-400 truncate">{acc.modified}</p>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip title="Actions">
                            <IconButton size="small" onClick={e => e.stopPropagation()}
                              sx={{ borderRadius: "6px", p: 0.5, "&:hover": { bgcolor: "#E3ECFC" } }}>
                              <DotsThreeVertical size={15} color="#94A3B8" weight="duotone" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty */}
                {filtered.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-3">
                      <Buildings size={22} color="#93C5FD" weight="duotone" />
                    </div>
                    <p className="font-heading text-slate-500 text-sm font-semibold">No accounts found</p>
                    <p className="text-slate-300 text-xs mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#EFF6FF]">
                <p className="text-[11px] text-slate-400 font-medium">
                  Showing <span className="text-slate-700 font-bold">1–{filtered.length}</span> of{" "}
                  <span className="text-slate-700 font-bold">{ALL_ACCOUNTS.length}</span> records
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>Rows per page:</span>
                    <button className="flex items-center gap-0.5 bg-[#EFF6FF] text-[#1D4ED8] font-bold px-2 py-1 rounded-lg hover:bg-[#E3ECFC] text-[11px]">
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
      <NewAccountDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

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
