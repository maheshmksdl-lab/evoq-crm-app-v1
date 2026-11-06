"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import {
  House, CaretRight, MagnifyingGlass, Star, DotsThree,
  ChartBar, CaretDown, Plus,
} from "@phosphor-icons/react";

// ─────────────────────────────────────────────
//  Data — exact from screenshot
// ─────────────────────────────────────────────
interface Report {
  id: number; name: string; description: string;
  collection: string; lastAccessed: string; createdBy: string;
  isFavorite: boolean;
}

const ALL_REPORTS: Report[] = [
  { id:1,  name:"compoent 1",                description:"",                         collection:"",            lastAccessed:"Now",              createdBy:"PM SDL",       isFavorite:false },
  { id:2,  name:"Account Wise Deal Summary", description:"Account Wise Deal Summary", collection:"Deal Reports", lastAccessed:"18 minutes ago",   createdBy:"Administrator",isFavorite:false },
  { id:3,  name:"Pie chart test 1",          description:"",                         collection:"",            lastAccessed:"18 minutes ago",   createdBy:"PM SDL",       isFavorite:false },
  { id:4,  name:"1231123",                   description:"afsdsdf",                  collection:"Deal Reports", lastAccessed:"about 2 hours ago", createdBy:"PM SDL",       isFavorite:false },
  { id:5,  name:"stage pie chart",           description:"",                         collection:"",            lastAccessed:"—",                 createdBy:"PM SDL",       isFavorite:false },
  { id:6,  name:"Pie Chart",                 description:"",                         collection:"",            lastAccessed:"—",                 createdBy:"PM SDL",       isFavorite:false },
  { id:7,  name:"Untitled Report",           description:"",                         collection:"",            lastAccessed:"May 18, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:8,  name:"Deal with Stage",           description:"Deal with Stage",          collection:"Deal Reports", lastAccessed:"May 19, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:9,  name:"Deal with Filter",          description:"",                         collection:"Deal Reports", lastAccessed:"May 21, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:10, name:"Lead Summary",              description:"Monthly lead summary",     collection:"Lead Reports", lastAccessed:"May 20, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:11, name:"Contact Activity",          description:"",                         collection:"",            lastAccessed:"May 15, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:12, name:"Revenue by Month",          description:"Monthly revenue breakdown",collection:"Deal Reports", lastAccessed:"May 10, 2026",     createdBy:"Administrator",isFavorite:false },
];

const COLLECTIONS = ["All Reports", "Deal Reports", "Lead Reports", "Contact Reports", "Account Reports"];

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports]     = useState<Report[]>(ALL_REPORTS);
  const [selected, setSelected]   = useState<number[]>([]);
  const [collection, setCollection] = useState("All Reports");
  const [search, setSearch]       = useState("");

  const filtered = reports.filter(r => {
    const matchCol  = collection === "All Reports" || r.collection === collection;
    const q         = search.toLowerCase();
    const matchQ    = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    return matchCol && matchQ;
  });

  const allChecked  = selected.length === filtered.length && filtered.length > 0;
  const someChecked = selected.length > 0 && !allChecked;
  const toggleAll   = () => setSelected(allChecked ? [] : filtered.map(r => r.id));
  const toggleOne   = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setReports(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

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
                <Link href="/reports" className="hover:text-[#1D4ED8] transition-colors font-medium">Reports</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-[20px] font-extrabold text-slate-900 tracking-tight">Reports</h1>
                <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E3ECFC] px-2 py-0.5 rounded-full shadow-sm">
                  {ALL_REPORTS.length} total
                </span>
              </div>
            </div>

            <Button variant="contained"
              startIcon={<Plus size={16} weight="duotone" />}
              onClick={() => router.push("/reports/create")}
              sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.8rem", px:2.5, py:0.9, mt:1, boxShadow:"0 1px 8px #1D4ED833", "&:hover":{ bgcolor:"#60A5FA", boxShadow:"0 2px 14px #60A5FA55" }, "&:active":{ bgcolor:"#0C2472" } }}>
              Create Report
            </Button>
          </div>

          {/* ══ Toolbar ══ */}
          <div className="flex items-center gap-2.5">
            {/* Collection filter dropdown */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select value={collection} onChange={e => setCollection(e.target.value)}
                sx={{ borderRadius:"10px", bgcolor:"white", fontSize:"0.82rem", border:"1.5px solid #E3ECFC", "&:hover": { borderColor:"#60A5FA" }, "& .MuiOutlinedInput-notchedOutline":{ border:"none" }, "& .MuiSelect-select":{ py:"7px", px:"12px" } }}>
                {COLLECTIONS.map(c => <MenuItem key={c} value={c} sx={{ fontSize:"0.82rem" }}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Search */}
            <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#E3ECFC] rounded-xl px-3 py-2 w-64 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
              <MagnifyingGlass size={14} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search All Reports" value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex:1, fontSize:"0.76rem", color:"#334155", "& input::placeholder":{ color:"#94A3B8", opacity:1 } }}
              />
              {search && <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 text-sm">✕</button>}
            </div>

            <span className="ml-auto text-[11px] text-slate-400 font-medium">{filtered.length} of {ALL_REPORTS.length} reports</span>
          </div>

          {/* ══ Table ══ */}
          <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid items-center px-4 py-2.5 bg-[#E3ECFC] border-b border-[#E3ECFC]"
              style={{ gridTemplateColumns: "36px 36px 1fr 220px 160px 170px 180px 40px" }}>
              <Checkbox size="small" checked={allChecked} indeterminate={someChecked} onChange={toggleAll}
                sx={{ p:0.5, color:"#CBD5E1", "&.Mui-checked, &.MuiCheckbox-indeterminate":{ color:"#1D4ED8" } }} />
              <div className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">Fav.</div>
              <div className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">Report Name</div>
              <div className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">Description</div>
              <div className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">Collection</div>
              <div className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">Last Accessed Date</div>
              <div className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">Created By</div>
              <div />
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#EFF6FF]">
              {filtered.map(report => {
                const isSel = selected.includes(report.id);
                return (
                  <div key={report.id}
                    className={`grid items-center px-4 py-3 transition-all cursor-pointer group ${isSel ? "bg-[#EFF6FF]" : "hover:bg-[#60A5FA]/[0.04]"}`}
                    style={{ gridTemplateColumns: "36px 36px 1fr 220px 160px 170px 180px 40px" }}
                    onClick={() => router.push(`/reports/${report.id}`)}>

                    <Checkbox size="small" checked={isSel} onChange={() => toggleOne(report.id)} onClick={e => e.stopPropagation()}
                      sx={{ p:0.5, color:"#CBD5E1", "&.Mui-checked":{ color:"#1D4ED8" } }} />

                    {/* Favorite star */}
                    <Tooltip title={report.isFavorite ? "Remove from favourites" : "Add to favourites"}>
                      <IconButton size="small" onClick={e => toggleFav(report.id, e)}
                        sx={{ p:0.25, borderRadius:"6px", "&:hover":{ bgcolor:"#EFF6FF" } }}>
                        <Star
                          size={15}
                          weight={report.isFavorite ? "fill" : "regular"}
                          color={report.isFavorite ? "#F59E0B" : "#CBD5E1"}
                        />
                      </IconButton>
                    </Tooltip>

                    {/* Report Name */}
                    <div className="flex items-center gap-2 pr-2 min-w-0">
                      <span className="font-heading text-[12.5px] font-semibold text-[#1D4ED8] hover:underline truncate">
                        {report.name}
                      </span>
                      <button onClick={e => { e.stopPropagation(); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <DotsThree size={16} color="#94A3B8" weight="bold" />
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-[12px] text-slate-500 truncate pr-2">
                      {report.description || <span className="text-slate-200">—</span>}
                    </p>

                    {/* Collection */}
                    <div className="pr-2">
                      {report.collection ? (
                        <span className="text-[11px] font-semibold bg-[#E3ECFC] text-[#1D4ED8] px-2 py-0.5 rounded-full">
                          {report.collection}
                        </span>
                      ) : <span className="text-slate-200 text-[12px]">—</span>}
                    </div>

                    {/* Last Accessed */}
                    <p className="text-[12px] text-slate-500 pr-2">
                      {report.lastAccessed === "—" ? <span className="text-slate-300">—</span> : report.lastAccessed}
                    </p>

                    {/* Created By */}
                    <p className="text-[12px] text-slate-500 truncate">{report.createdBy}</p>

                    {/* Actions */}
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip title="More actions">
                        <IconButton size="small" onClick={e => e.stopPropagation()}
                          sx={{ borderRadius:"6px", p:0.5, "&:hover":{ bgcolor:"#E3ECFC" } }}>
                          <DotsThree size={15} color="#94A3B8" weight="bold" />
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
                  <ChartBar size={22} color="#93C5FD" weight="duotone" />
                </div>
                <p className="font-heading text-slate-500 text-sm font-semibold">No reports found</p>
                <p className="text-slate-300 text-xs mt-1">Try adjusting your search or collection filter</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-end px-4 py-3 border-t border-[#EFF6FF] gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Rows per page:</span>
                <button className="flex items-center gap-0.5 bg-[#EFF6FF] text-[#1D4ED8] font-bold px-2 py-1 rounded-lg hover:bg-[#E3ECFC] text-[11px]">
                  20 <CaretDown size={12} weight="duotone" />
                </button>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">1–{filtered.length} of {ALL_REPORTS.length}</span>
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
