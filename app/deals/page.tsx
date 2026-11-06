"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewDealDrawer from "@/components/deals/NewDealDrawer";
import DealGridView from "@/components/deals/DealGridView";
import DealKanbanView from "@/components/deals/DealKanbanView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import { SortAscending, Columns, Trash, FunnelSimple, TrendUp, UserCheck, ArrowsClockwise } from "@phosphor-icons/react";
import {
  PageHeader, ViewToggle, PrimaryButton, ListCard, TabBar, Toolbar, SearchBox, ToolbarButton, ResultCount,
  BulkBar, TableHeader, TableRow, EmptyState, Pagination, Pill, Empty, gridTemplate, scopedSelection,
} from "@/components/list/ListParts";

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
  "Qualification":            { bg: "var(--surface)", text: "var(--ink)", dot: "#1D4ED8" },
  "Needs Analysis":           { bg: "var(--tint)", text: "var(--link)", dot: "#3B82F6" },
  "Value Proposition":        { bg: "var(--tint)", text: "var(--ink)", dot: "#60A5FA" },
  "Identify Decision Makers": { bg: "var(--tint)", text: "var(--link)", dot: "#0C2472" },
  "Proposal/Price Quote":     { bg: "var(--surface)", text: "var(--ink)", dot: "#0C2472" },
  "Negotiation/Review":       { bg: "var(--st-amber-bg)", text: "var(--st-amber-fg)", dot: "#F59E0B" },
  "Closed Won":               { bg: "var(--st-green-bg)", text: "var(--st-green-fg)", dot: "#10B981" },
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
// Text columns flex (minmax) so the table fits the card; numbers/dates keep fixed widths.
const COL_DEFS: { key: string; label: string; width: string }[] = [
  { key: "dealName",    label: "Deal Name",       width: "minmax(150px,1.3fr)" },
  { key: "amount",      label: "Amount",          width: "100px"               },
  { key: "accountName", label: "Account Name",    width: "minmax(100px,0.9fr)" },
  { key: "stage",       label: "Stage",           width: "minmax(190px,1.3fr)" },
  { key: "probability", label: "Probability",     width: "100px"               },
  { key: "contactName", label: "Contact Name",    width: "minmax(100px,0.9fr)" },
  { key: "createdBy",   label: "Created By",      width: "minmax(100px,0.8fr)" },
  { key: "modifiedBy",  label: "Modified By",     width: "minmax(100px,0.8fr)" },
  { key: "creation",    label: "Created",         width: "132px"               },
  { key: "modified",    label: "Modified",        width: "132px"               },
];

const DEFAULT_VISIBLE_COLS = new Set([
  "dealName", "amount", "accountName", "stage", "probability",
  "contactName", "creation", "modified",
]);

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
const fmt = (n: number) => n === 0 ? "₹0" : `₹${n.toLocaleString("en-IN")}`;


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
  // KNOWN LIMITATION: Sort-menu rules (and Filters-drawer rules) are stored and counted on the
  // toolbar buttons but NOT applied to `filtered`. Applying them is new functionality and needs separate approval.
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

  const totalValue    = filtered.reduce((s, d) => s + d.amount, 0);
  const pipelineValue = ALL_DEALS.reduce((s, d) => s + d.amount, 0);
  const lakhs = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

  // Selection is scoped to visible rows
  const sel = scopedSelection(selected, setSelected, filtered.map(d => d.id));
  const isFiltered = activeStage !== "All" || !!search;

  const visibleColDefs = COL_DEFS.filter(c => visibleCols.has(c.key));
  const template       = gridTemplate(visibleColDefs.map(c => c.width));

  return (
    <div className="flex h-screen bg-page font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto bg-canvas">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">
          <PageHeader title="Deals" count={ALL_DEALS.length}
            badges={
              <span className="flex items-center gap-1 text-[11.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full tabular-nums">
                <TrendUp size={12} weight="bold" /> Pipeline {lakhs(pipelineValue)}
              </span>
            }
            actions={<>
              <ViewToggle value={view} onChange={setView} views={["list", "grid", "kanban"]} />
              <PrimaryButton onClick={() => setDrawerOpen(true)}>New Deal</PrimaryButton>
            </>} />

          <ListCard minWidth={1120}>
            <TabBar label="Deal stage" value={activeStage} onChange={setActiveStage}
              tabs={STAGE_TABS.filter(s => s === "All" || (stageCounts[s] ?? 0) > 0).map(s => ({ key: s, label: s, count: stageCounts[s] ?? 0 }))} />

            <Toolbar bulk={sel.visibleSel.length > 0 ? (
              <BulkBar count={sel.visibleSel.length} onClear={sel.clear} actions={[
                { icon: <ArrowsClockwise size={15} weight="duotone" />, label: "Update Stage" },
                { icon: <UserCheck size={15} weight="duotone" />,       label: "Assign Owner" },
                { icon: <Trash size={15} weight="duotone" />,           label: "Delete", danger: true },
              ]} />
            ) : undefined}>
              <SearchBox value={search} onChange={setSearch} label="Search deals" placeholder="Search by deal, account or contact" />
              <ToolbarButton icon={<FunnelSimple size={15} weight="duotone" />} label="Filters"
                active={activeFilters.length > 0} count={activeFilters.length} onClick={() => setFiltersOpen(true)} />
              <ToolbarButton icon={<Columns size={15} weight="duotone" />} label="Columns"
                active={visibleCols.size !== DEFAULT_VISIBLE_COLS.size} onClick={() => setColumnsOpen(true)} />
              <ToolbarButton icon={<SortAscending size={15} weight="duotone" />} label="Sort" caret
                active={activeSorts.length > 0} count={activeSorts.length} onClick={e => setSortAnchor(e.currentTarget)} />
              {isFiltered && (
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-[11.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full tabular-nums">
                    {lakhs(totalValue)} in view
                  </span>
                  <ResultCount shown={filtered.length} total={ALL_DEALS.length} noun="deals" />
                </div>
              )}
            </Toolbar>

            {view === "list" && (
              <>
                <TableHeader template={template} labels={visibleColDefs.map(c => c.label)}
                  allChecked={sel.allChecked} someChecked={sel.someChecked} onToggleAll={sel.toggleAll} selectAllLabel="Select all deals" />

                <div className="divide-y divide-line-soft">
                  {filtered.map(deal => {
                    const cfg = STAGE_CFG[deal.stage] ?? STAGE_CFG["Qualification"];
                    return (
                      <TableRow key={deal.id} template={template} name={deal.name}
                        selected={selected.includes(deal.id)} onToggle={() => sel.toggleOne(deal.id)}
                        onOpen={() => router.push(`/deals/${deal.id}`)}>

                        {visibleCols.has("dealName") && (
                          <p className="font-heading text-[13px] font-semibold text-fg truncate pr-3 group-hover:text-link transition-colors">{deal.name}</p>
                        )}
                        {visibleCols.has("amount") && (
                          <p className={`text-[13px] font-bold tabular-nums truncate pr-3 ${deal.amount ? "text-fg" : "text-fg-3"}`}>{fmt(deal.amount)}</p>
                        )}
                        {visibleCols.has("accountName") && (
                          <p className="text-[12.5px] text-fg-2 truncate pr-3">{deal.account || <Empty />}</p>
                        )}
                        {visibleCols.has("stage") && (
                          <div className="pr-3 min-w-0"><Pill bg={cfg.bg} text={cfg.text} dot={cfg.dot}>{deal.stage}</Pill></div>
                        )}
                        {visibleCols.has("probability") && (
                          <div className="flex items-center gap-2 pr-3" aria-label={`${deal.probability}% probability`}>
                            <div className="w-14 h-1.5 bg-tint rounded-full overflow-hidden flex-shrink-0">
                              <div className="h-full rounded-full bg-[#3B82F6]" style={{ width: `${deal.probability}%` }} />
                            </div>
                            <span className="text-[12px] text-fg-2 font-semibold tabular-nums">{deal.probability}%</span>
                          </div>
                        )}
                        {visibleCols.has("contactName") && (
                          <p className="text-[12.5px] text-fg-2 truncate pr-3">{deal.contactName || <Empty />}</p>
                        )}
                        {visibleCols.has("createdBy") && (
                          <p className="text-[12px] text-fg-3 truncate pr-3">{deal.createdBy}</p>
                        )}
                        {visibleCols.has("modifiedBy") && (
                          <p className="text-[12px] text-fg-3 truncate pr-3">{deal.modifiedBy}</p>
                        )}
                        {visibleCols.has("creation") && (
                          <p className="text-[12px] text-fg-3 tabular-nums truncate pr-3">{deal.creation}</p>
                        )}
                        {visibleCols.has("modified") && (
                          <p className="text-[12px] text-fg-3 tabular-nums truncate">{deal.modified}</p>
                        )}
                      </TableRow>
                    );
                  })}
                </div>

                {filtered.length === 0 && <EmptyState title="No deals match" hint="Try a different search term or stage." />}
                <Pagination shown={filtered.length} noun={["deal", "deals"]} />
              </>
            )}
          </ListCard>

          {view === "grid"   && <DealGridView deals={filtered} />}
          {view === "kanban" && <DealKanbanView deals={filtered} />}
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
