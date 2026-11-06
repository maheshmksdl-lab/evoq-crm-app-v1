"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewLeadDrawer from "@/components/leads/NewLeadDrawer";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer, { DEFAULT_COLUMNS } from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import LeadGridView from "@/components/leads/LeadGridView";
import LeadKanbanView from "@/components/leads/LeadKanbanView";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { SortAscending, Columns, Trash, UserCheck, NotePencil, Phone, FunnelSimple } from "@phosphor-icons/react";
import {
  PageHeader, ViewToggle, PrimaryButton, ListCard, TabBar, Toolbar, SearchBox, ToolbarButton, ResultCount,
  BulkBar, TableHeader, TableRow, EmptyState, Pagination, Pill, Empty, gridTemplate, scopedSelection,
} from "@/components/list/ListParts";
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
  "New":         { bg:"var(--surface)", text:"var(--ink)", dot:"#1D4ED8" },
  "Contacted":   { bg:"var(--tint)", text:"var(--link)", dot:"#3B82F6" },
  "Qualified":   { bg:"var(--st-green-bg)", text:"var(--st-green-fg)", dot:"#16A34A" },
  "In Progress": { bg:"var(--tint)", text:"var(--ink)", dot:"#60A5FA" },
  "Lost":        { bg:"var(--st-red-bg)", text:"var(--st-red-fg)", dot:"#EF4444" },
  "Unqualified": { bg:"var(--surface-subtle)", text:"var(--fg-2)", dot:"#94A3B8" },
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


// ─────────────────────────────────────────────
//  All column definitions (for list view)
// ─────────────────────────────────────────────
// Text columns flex (minmax) so the table fits the card instead of clipping;
// status/date keep fixed widths so their content always lines up.
const COL_DEFS: { key: string; label: string; width: string }[] = [
  { key:"leadName",    label:"Lead Name",  width:"minmax(170px,1.5fr)" },
  { key:"company",     label:"Company",    width:"minmax(100px,1fr)"   },
  { key:"email",       label:"Email",      width:"minmax(140px,1.4fr)" },
  { key:"mobile",      label:"Mobile",     width:"minmax(115px,1fr)"   },
  { key:"leadStatus",  label:"Status",     width:"122px"               },
  { key:"leadOwner",   label:"Lead Owner", width:"minmax(110px,1fr)"   },
  { key:"creation",    label:"Created",    width:"104px"               },
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
  // KNOWN LIMITATION: sort rules chosen in the Sort menu are stored here (and shown as a
  // count on the Sort button) but are NOT applied to `filtered` — the list keeps its
  // original order. Applying them is new functionality and needs separate approval.
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

  // ── Selection is scoped to what's visible (rows hidden by a tab/search/filter don't count)
  const sel = scopedSelection(selected, setSelected, filtered.map(l => l.id));

  const isFiltered = activeTab !== "All" || !!search || activeFilters.length > 0;
  const openLead   = (id: number) => router.push(`/leads/${id}`);

  const visibleColDefs = COL_DEFS.filter(c => visibleCols.has(c.key));
  const template       = gridTemplate(visibleColDefs.map(c => c.width));

  return (
    <div className="flex h-screen bg-page font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto bg-canvas">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">
          <PageHeader title="Leads" count={ALL_LEADS.length}
            actions={<>
              <ViewToggle value={view} onChange={setView} views={["list", "grid", "kanban"]} />
              <PrimaryButton onClick={() => setDrawerOpen(true)}>New Lead</PrimaryButton>
            </>} />

          <ListCard>
            <TabBar label="Lead status" value={activeTab} onChange={setActiveTab}
              tabs={TABS.filter(t => t.key === "All" || (counts[t.key] ?? 0) > 0).map(t => ({ ...t, count: counts[t.key] ?? 0 }))} />

            <Toolbar bulk={sel.visibleSel.length > 0 ? (
              <BulkBar count={sel.visibleSel.length} onClear={sel.clear} actions={[
                { icon: <UserCheck size={15} weight="duotone" />,  label: "Assign Owner" },
                { icon: <NotePencil size={15} weight="duotone" />, label: "Update Status" },
                { icon: <Trash size={15} weight="duotone" />,      label: "Delete", danger: true },
              ]} />
            ) : undefined}>
              <SearchBox value={search} onChange={setSearch} label="Search leads" placeholder="Search by name, company or email" />
              <ToolbarButton icon={<FunnelSimple size={15} weight="duotone" />} label="Filters"
                active={activeFilters.length > 0} count={activeFilters.length} onClick={() => setFiltersOpen(true)} />
              <ToolbarButton icon={<Columns size={15} weight="duotone" />} label="Columns"
                active={visibleCols.size !== DEFAULT_COLUMNS.size} onClick={() => setColumnsOpen(true)} />
              <ToolbarButton icon={<SortAscending size={15} weight="duotone" />} label="Sort" caret
                active={activeSorts.length > 0} count={activeSorts.length} onClick={e => setSortAnchor(e.currentTarget)} />
              {isFiltered && <span className="ml-auto"><ResultCount shown={filtered.length} total={ALL_LEADS.length} noun="leads" /></span>}
            </Toolbar>

            {view === "list" && (
              <>
                <TableHeader template={template} labels={visibleColDefs.map(c => c.label)}
                  allChecked={sel.allChecked} someChecked={sel.someChecked} onToggleAll={sel.toggleAll} selectAllLabel="Select all leads" />

                <div className="divide-y divide-line-soft">
                  {filtered.map(lead => {
                    const cfg = STATUS_CFG[lead.status];
                    return (
                      <TableRow key={lead.id} template={template} name={lead.name}
                        selected={selected.includes(lead.id)} onToggle={() => sel.toggleOne(lead.id)} onOpen={() => openLead(lead.id)}>

                        {visibleCols.has("leadName") && (
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <Avatar src={LEAD_AVATARS[lead.id]} sx={{ width:32, height:32, bgcolor:avatarColor(lead.name), fontSize:"0.65rem", fontWeight:800, flexShrink:0 }}>{initials(lead.name)}</Avatar>
                            <div className="min-w-0">
                              <p className="font-heading text-[13px] font-semibold text-fg truncate group-hover:text-link transition-colors">{lead.name}</p>
                              {!visibleCols.has("company") && lead.company && <p className="text-[11.5px] text-fg-3 truncate">{lead.company}</p>}
                            </div>
                          </div>
                        )}

                        {visibleCols.has("company") && (
                          <div className="text-[12.5px] text-fg-2 truncate pr-3">{lead.company || <Empty />}</div>
                        )}

                        {visibleCols.has("email") && (
                          <div className="text-[12.5px] truncate pr-3">
                            {lead.email ? (
                              <Tooltip title={`Email ${lead.email}`} placement="top">
                                <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()}
                                  className="text-link hover:text-link-hover hover:underline underline-offset-2 rounded outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                                  {lead.email}
                                </a>
                              </Tooltip>
                            ) : <Empty />}
                          </div>
                        )}

                        {visibleCols.has("mobile") && (
                          <div className="text-[12.5px] text-fg-2 tabular-nums truncate pr-3">
                            {lead.mobile
                              ? <span className="flex items-center gap-1.5"><Phone size={13} color="#60A5FA" weight="duotone" className="flex-shrink-0" /><span className="truncate">{lead.mobile}</span></span>
                              : <Empty />}
                          </div>
                        )}

                        {visibleCols.has("leadStatus") && (
                          <div className="pr-2"><Pill bg={cfg.bg} text={cfg.text} dot={cfg.dot}>{lead.status}</Pill></div>
                        )}

                        {visibleCols.has("leadOwner") && (
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <Avatar src={OWNER_AVATARS[lead.owner]} sx={{ width:22, height:22, bgcolor:avatarColor(lead.owner), fontSize:"0.5rem", fontWeight:800, flexShrink:0 }}>{lead.ownerInitials}</Avatar>
                            <span className="text-[12.5px] text-fg-2 truncate">{lead.owner}</span>
                          </div>
                        )}

                        {visibleCols.has("creation") && (
                          <div className="text-[12px] text-fg-3 tabular-nums truncate">{lead.created}</div>
                        )}
                      </TableRow>
                    );
                  })}
                </div>

                {filtered.length === 0 && <EmptyState title="No leads match" hint="Try a different search term, status tab or filter." />}
                <Pagination shown={filtered.length} noun={["lead", "leads"]} />
              </>
            )}
          </ListCard>

          {view === "grid"   && <LeadGridView leads={filtered} />}
          {view === "kanban" && <LeadKanbanView leads={filtered} />}
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
