"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewContactDrawer from "@/components/contacts/NewContactDrawer";
import ContactGridView from "@/components/contacts/ContactGridView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import {
  Plus, MagnifyingGlass, SlidersHorizontal, SortAscending, Columns,
  ArrowsDownUp, List, GridFour, House, CaretRight, Trash,
  DotsThreeVertical, Phone, DeviceMobile, Envelope, FunnelSimple, CaretDown,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

// ─────────────────────────────────────────────
//  Data — exact from screenshot (13 visible of 25)
// ─────────────────────────────────────────────
interface Contact {
  id: number; firstName: string; lastName: string;
  ownerName: string; ownerEmail: string; ownerInitials: string;
  email: string; phone: string; mobile: string;
  accountName: string; creation: string; modified: string;
}

const ALL_CONTACTS: Contact[] = [
  { id:1,  firstName:"Cop",          lastName:"Mar",     ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"",                        phone:"",           mobile:"",           accountName:"",            creation:"27 May 2026, 02:38 PM", modified:"27 May 2026, 02:38 PM" },
  { id:2,  firstName:"Michael",      lastName:"Lee",     ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"michael.lee@demo.com",    phone:"",           mobile:"9123456780",  accountName:"",            creation:"15 May 2026, 09:31 AM", modified:"15 May 2026, 09:31 AM" },
  { id:3,  firstName:"Lead SDL",     lastName:"11",      ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"leadsdl1@mailinator.com", phone:"",           mobile:"9999992222",  accountName:"SDL LEAD1",   creation:"15 Apr 2026, 11:13 AM", modified:"15 Apr 2026, 11:13 AM" },
  { id:4,  firstName:"John",         lastName:"Smith",   ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"johnsmith@mailinator.com",phone:"9898989898",  mobile:"",           accountName:"Sears Homelife", creation:"13 Apr 2026, 06:00 PM", modified:"14 Apr 2026, 07:45 PM" },
  { id:5,  firstName:"Raja",         lastName:"rajan",   ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"rajarajan@rmvt.com",      phone:"",           mobile:"",           accountName:"RMVT",        creation:"14 Apr 2026, 06:40 PM", modified:"14 Apr 2026, 07:30 PM" },
  { id:6,  firstName:"mmmm",         lastName:"mmmm",    ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"mmmm@rmvt.com",           phone:"",           mobile:"",           accountName:"RMVT",        creation:"14 Apr 2026, 06:53 PM", modified:"14 Apr 2026, 06:53 PM" },
  { id:7,  firstName:"Vishnutharan", lastName:"R",       ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"vishnu@rmvt.com",         phone:"",           mobile:"",           accountName:"RMVT",        creation:"14 Apr 2026, 06:38 PM", modified:"14 Apr 2026, 06:44 PM" },
  { id:8,  firstName:"test",         lastName:"test",    ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"test@mailinator.com",     phone:"",           mobile:"",           accountName:"test",        creation:"13 Apr 2026, 06:17 PM", modified:"13 Apr 2026, 06:17 PM" },
  { id:9,  firstName:"Speedy",       lastName:"Mike",    ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"",                        phone:"",           mobile:"0111111111",  accountName:"Speedy Motors", creation:"13 Apr 2026, 05:56 PM", modified:"13 Apr 2026, 05:56 PM" },
  { id:10, firstName:"SDL Test",     lastName:"Test",    ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"sdltest@mailinator.com",  phone:"9988776655", mobile:"",           accountName:"SDL",         creation:"17 Mar 2026, 06:06 PM", modified:"20 Mar 2026, 05:13 PM" },
  { id:11, firstName:"SDL Mar 17",   lastName:"SDL",     ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"",                        phone:"77881122",   mobile:"",           accountName:"SDL",         creation:"17 Mar 2026, 11:32 AM", modified:"17 Mar 2026, 11:34 AM" },
  { id:12, firstName:"Jimmy",        lastName:"Davis",   ownerName:"Admin",     ownerEmail:"admin@mailinator.com",  ownerInitials:"AD", email:"",                        phone:"8877994455", mobile:"",           accountName:"",            creation:"08 Jul 2025, 11:14 AM", modified:"17 Mar 2026, 11:32 AM" },
  { id:13, firstName:"Test",         lastName:"user001", ownerName:"Admin",     ownerEmail:"admin@mailinator.com",  ownerInitials:"AD", email:"",                        phone:"9978654311", mobile:"",           accountName:"",            creation:"20 Aug 2025, 11:57 AM", modified:"05 Feb 2026, 06:50 PM" },
];

// ─────────────────────────────────────────────
//  Column definitions
// ─────────────────────────────────────────────
// Fixed px widths — table scrolls horizontally on narrow viewports
const COL_DEFS = [
  { key: "firstName",    label: "First Name",     width: "200px" },
  { key: "lastName",     label: "Last Name",      width: "130px" },
  { key: "contactOwner", label: "Contact Owner",  width: "170px" },
  { key: "email",        label: "Email",          width: "210px" },
  { key: "phone",        label: "Phone",          width: "130px" },
  { key: "mobile",       label: "Mobile",         width: "130px" },
  { key: "creation",     label: "Creation",       width: "165px" },
  { key: "modified",     label: "Modified",       width: "165px" },
];

// Default: firstName, lastName, owner, email, phone, creation
// Mobile + modified hidden by default — visible via Columns drawer
// Fixed total (no firstName, no mobile, no modified): 36+120+135+195+120+150+40 = 796px
// At 1280px viewport (1002px table): firstName → 1002−796 = 206px ✓
// At 1440px viewport (1162px table): firstName → 1162−796 = 366px ✓
const DEFAULT_VISIBLE = new Set(["firstName", "lastName", "contactOwner", "email", "phone", "creation"]);

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
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
export default function ContactsPage() {
  const router = useRouter();

  const [selected, setSelected]     = useState<number[]>([]);
  const [search, setSearch]         = useState("");
  const [view, setView]             = useState<"list" | "grid">("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sortAnchor, setSortAnchor]   = useState<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterRow[]>([]);
  const [activeSorts,   setActiveSorts]   = useState<SortRow[]>([]);
  const [visibleCols, setVisibleCols]     = useState<Set<string>>(new Set(DEFAULT_VISIBLE));

  const filtered = ALL_CONTACTS.filter(c => {
    const q = search.toLowerCase();
    return !q ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.ownerName.toLowerCase().includes(q);
  });

  const allChecked  = selected.length === filtered.length && filtered.length > 0;
  const someChecked = selected.length > 0 && !allChecked;
  const toggleAll   = () => setSelected(allChecked ? [] : filtered.map(c => c.id));
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
                <Link href="/contacts" className="hover:text-[#1D4ED8] transition-colors font-medium">Contacts</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-[20px] font-extrabold text-slate-900 tracking-tight">Contacts</h1>
                <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E3ECFC] px-2 py-0.5 rounded-full shadow-sm">
                  {ALL_CONTACTS.length} total
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
                New Contact
              </Button>
            </div>
          </div>

          {/* ══ Toolbar ══ */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#E3ECFC] rounded-xl px-3 py-2 w-72 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search by name, email, owner…" value={search}
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
              {filtered.length} of {ALL_CONTACTS.length} records
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
              <button className="text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">Send Email</button>
              <button className="text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">Assign Owner</button>
              <button onClick={() => setSelected([])} className="ml-auto text-[11.5px] font-semibold text-white/50 hover:text-white transition-colors">Clear</button>
              <button className="flex items-center gap-1.5 text-[11.5px] font-semibold text-red-300 hover:text-red-200 transition-colors">
                <Trash size={14} weight="duotone" /> Delete
              </button>
            </div>
          )}

          {/* ══ GRID VIEW ══ */}
          {view === "grid" && (
            <ContactGridView contacts={filtered.map(c => ({
              id: c.id, firstName: c.firstName, lastName: c.lastName,
              ownerName: c.ownerName, ownerInitials: c.ownerInitials,
              email: c.email, phone: c.phone, mobile: c.mobile,
              accountName: c.accountName,
            }))} />
          )}

          {/* ══ LIST VIEW ══ */}
          {view === "list" && (
            <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm flex flex-col">
              {/* overflow-x-auto: inner scroll so pagination stays outside and rounded card border is preserved */}
              <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
              {/* Header row */}
              <div className="grid items-center px-4 py-2.5 bg-[#E3ECFC] border-b border-[#E3ECFC]"
                style={{ gridTemplateColumns: gridTemplate }}>
                <Checkbox size="small" checked={allChecked} indeterminate={someChecked} onChange={toggleAll}
                  sx={{ p: 0.5, color: "#CBD5E1", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#1D4ED8" } }} />
                {visibleColDefs.map(c => <ColHeader key={c.key} label={c.label} />)}
                <div />
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#EFF6FF]">
                {filtered.map(contact => {
                  const isSel  = selected.includes(contact.id);
                  const owCol  = avatarColor(contact.ownerName);

                  return (
                    <div key={contact.id}
                      className={`grid items-center px-4 py-[11px] transition-all duration-100 cursor-pointer group ${
                        isSel ? "bg-[#EFF6FF]" : "hover:bg-[#60A5FA]/[0.04]"
                      }`}
                      style={{ gridTemplateColumns: gridTemplate }}
                      onClick={() => router.push(`/contacts/${contact.id}`)}>

                      <Checkbox size="small" checked={isSel} onChange={() => toggleOne(contact.id)} onClick={e => e.stopPropagation()}
                        sx={{ p: 0.5, color: "#CBD5E1", "&.Mui-checked": { color: "#1D4ED8" } }} />

                      {/* First Name */}
                      {visibleCols.has("firstName") && (
                        <p className="font-heading text-[12.5px] font-semibold text-[#1D4ED8] truncate pr-2 hover:underline cursor-pointer">
                          {contact.firstName}
                        </p>
                      )}

                      {/* Last Name */}
                      {visibleCols.has("lastName") && (
                        <p className="text-[12px] text-slate-700 truncate pr-2">{contact.lastName}</p>
                      )}

                      {/* Contact Owner */}
                      {visibleCols.has("contactOwner") && (
                        <Tooltip title={`${contact.ownerName} · ${contact.ownerEmail}`} placement="top">
                          <div className="flex items-center gap-1.5 min-w-0 pr-2">
                            <Avatar src={OWNER_AVATARS[contact.ownerName]} sx={{ width: 20, height: 20, bgcolor: owCol, fontSize: "0.48rem", fontWeight: 800, flexShrink: 0 }}>
                              {contact.ownerInitials}
                            </Avatar>
                            <span className="text-[11.5px] text-slate-500 truncate">{contact.ownerEmail}</span>
                          </div>
                        </Tooltip>
                      )}

                      {/* Email */}
                      {visibleCols.has("email") && (
                        <Tooltip title={contact.email} placement="top">
                          <div className="text-[12px] truncate pr-2">
                            {contact.email
                              ? <span className="text-[#3B82F6] flex items-center gap-1"><Envelope size={11} color="#93C5FD" weight="duotone" className="flex-shrink-0" />{contact.email}</span>
                              : <span className="text-slate-200">—</span>}
                          </div>
                        </Tooltip>
                      )}

                      {/* Phone */}
                      {visibleCols.has("phone") && (
                        <div className="text-[12px] text-slate-500 font-mono truncate pr-2">
                          {contact.phone
                            ? <span className="flex items-center gap-1"><Phone size={11} color="#93C5FD" weight="duotone" />{contact.phone}</span>
                            : <span className="text-slate-200">—</span>}
                        </div>
                      )}

                      {/* Mobile */}
                      {visibleCols.has("mobile") && (
                        <div className="text-[12px] text-slate-500 font-mono truncate pr-2">
                          {contact.mobile
                            ? <span className="flex items-center gap-1"><DeviceMobile size={11} color="#93C5FD" weight="duotone" />{contact.mobile}</span>
                            : <span className="text-slate-200">—</span>}
                        </div>
                      )}

                      {/* Creation */}
                      {visibleCols.has("creation") && (
                        <p className="text-[11px] text-slate-400 truncate pr-2">{contact.creation}</p>
                      )}

                      {/* Modified */}
                      {visibleCols.has("modified") && (
                        <p className="text-[11px] text-slate-400 truncate">{contact.modified}</p>
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
                    <MagnifyingGlass size={22} color="#93C5FD" weight="duotone" />
                  </div>
                  <p className="font-heading text-slate-500 text-sm font-semibold">No contacts found</p>
                  <p className="text-slate-300 text-xs mt-1">Try adjusting your search or filters</p>
                </div>
              )}

              </div> {/* end overflow-x-auto */}

              {/* Pagination — outside scroll, always visible at bottom of card */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#EFF6FF]">
                <p className="text-[11px] text-slate-400 font-medium">
                  Showing <span className="text-slate-700 font-bold">1–{filtered.length}</span> of{" "}
                  <span className="text-slate-700 font-bold">25</span> records
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
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#E3ECFC] font-bold text-sm">2</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#E3ECFC] font-bold text-sm">›</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══ Panels ══ */}
      <NewContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

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
