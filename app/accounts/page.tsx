"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewAccountDrawer from "@/components/accounts/NewAccountDrawer";
import AccountGridView from "@/components/accounts/AccountGridView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { SortAscending, Columns, Trash, FunnelSimple, Phone, UserCheck, Tag } from "@phosphor-icons/react";
import {
  PageHeader, ViewToggle, PrimaryButton, ListCard, Toolbar, SearchBox, ToolbarButton, ResultCount,
  BulkBar, TableHeader, TableRow, EmptyState, Pagination, Pill, Empty, gridTemplate, scopedSelection,
} from "@/components/list/ListParts";
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
  "Individual": { bg: "var(--surface)", text: "var(--ink)", dot: "#1D4ED8" },
  "Customer":   { bg: "var(--st-green-bg)", text: "var(--st-green-fg)", dot: "#10B981" },
  "Partner":    { bg: "var(--tint)", text: "var(--link)", dot: "#3B82F6" },
  "Prospect":   { bg: "var(--st-amber-bg)", text: "var(--st-amber-fg)", dot: "#F59E0B" },
  "Vendor":     { bg: "var(--tint)", text: "var(--ink)", dot: "#60A5FA" },
  "Analyst":    { bg: "var(--surface-subtle)", text: "var(--fg-2)", dot: "#94A3B8" },
  "Competitor": { bg: "var(--st-red-bg)", text: "var(--st-red-fg)", dot: "#EF4444" },
};

// ─────────────────────────────────────────────
//  Column defs — all fixed px (horizontal scroll)
// ─────────────────────────────────────────────
// Text columns flex (minmax) so the table fits the card; dates keep fixed widths.
const COL_DEFS = [
  { key: "accountName",  label: "Account Name",  width: "minmax(160px,1.4fr)" },
  { key: "accountOwner", label: "Account Owner", width: "minmax(120px,1fr)"   },
  { key: "phone",        label: "Phone",         width: "135px"               },
  { key: "accountType",  label: "Account Type",  width: "130px"               },
  { key: "modifiedBy",   label: "Modified By",   width: "minmax(120px,1fr)"   },
  { key: "creation",     label: "Created",       width: "150px"               },
  { key: "modified",     label: "Modified",      width: "150px"               },
];
const DEFAULT_VISIBLE = new Set(["accountName", "accountOwner", "phone", "accountType", "modifiedBy", "creation", "modified"]);

const AVATAR_PAL = ["#0C2472", "#1D4ED8", "#3B82F6", "#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];


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
  // KNOWN LIMITATION: Sort-menu rules (and Filters-drawer rules) are stored and counted on the
  // toolbar buttons but NOT applied to `filtered`. Applying them is new functionality and needs separate approval.
  const [activeSorts,   setActiveSorts]   = useState<SortRow[]>([]);
  const [visibleCols, setVisibleCols]     = useState<Set<string>>(new Set(DEFAULT_VISIBLE));

  const filtered = ALL_ACCOUNTS.filter(a => {
    const q = search.toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || a.ownerName.toLowerCase().includes(q);
  });

  // Selection is scoped to visible rows
  const sel = scopedSelection(selected, setSelected, filtered.map(a => a.id));

  const visibleColDefs = COL_DEFS.filter(c => visibleCols.has(c.key));
  const template       = gridTemplate(visibleColDefs.map(c => c.width));

  return (
    <div className="flex h-screen bg-page font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto bg-canvas">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">
          <PageHeader title="Accounts" count={ALL_ACCOUNTS.length}
            actions={<>
              <ViewToggle value={view} onChange={v => setView(v as typeof view)} views={["list", "grid"]} />
              <PrimaryButton onClick={() => setDrawerOpen(true)}>New Account</PrimaryButton>
            </>} />

          <ListCard>
            <Toolbar bulk={sel.visibleSel.length > 0 ? (
              <BulkBar count={sel.visibleSel.length} onClear={sel.clear} actions={[
                { icon: <UserCheck size={15} weight="duotone" />, label: "Assign Owner" },
                { icon: <Tag size={15} weight="duotone" />,       label: "Update Type" },
                { icon: <Trash size={15} weight="duotone" />,     label: "Delete", danger: true },
              ]} />
            ) : undefined}>
              <SearchBox value={search} onChange={setSearch} label="Search accounts" placeholder="Search by account name or owner" />
              <ToolbarButton icon={<FunnelSimple size={15} weight="duotone" />} label="Filters"
                active={activeFilters.length > 0} count={activeFilters.length} onClick={() => setFiltersOpen(true)} />
              <ToolbarButton icon={<Columns size={15} weight="duotone" />} label="Columns"
                active={visibleCols.size !== DEFAULT_VISIBLE.size} onClick={() => setColumnsOpen(true)} />
              <ToolbarButton icon={<SortAscending size={15} weight="duotone" />} label="Sort" caret
                active={activeSorts.length > 0} count={activeSorts.length} onClick={e => setSortAnchor(e.currentTarget)} />
              {!!search && <span className="ml-auto"><ResultCount shown={filtered.length} total={ALL_ACCOUNTS.length} noun="accounts" /></span>}
            </Toolbar>

            {view === "list" && (
              <>
                <TableHeader template={template} labels={visibleColDefs.map(c => c.label)}
                  allChecked={sel.allChecked} someChecked={sel.someChecked} onToggleAll={sel.toggleAll} selectAllLabel="Select all accounts" />

                <div className="divide-y divide-line-soft">
                  {filtered.map(acc => {
                    const typCfg = TYPE_CFG[acc.accountType];
                    return (
                      <TableRow key={acc.id} template={template} name={acc.name}
                        selected={selected.includes(acc.id)} onToggle={() => sel.toggleOne(acc.id)}
                        onOpen={() => router.push(`/accounts/${acc.id}`)}>

                        {visibleCols.has("accountName") && (
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10.5px] font-extrabold flex-shrink-0"
                              style={{ backgroundColor: avatarColor(acc.name) }} aria-hidden>
                              {acc.name.substring(0, 2).toUpperCase()}
                            </span>
                            <p className="font-heading text-[13px] font-semibold text-fg truncate group-hover:text-link transition-colors">{acc.name}</p>
                          </div>
                        )}
                        {visibleCols.has("accountOwner") && (
                          <Tooltip title={`${acc.ownerName} · ${acc.ownerEmail}`} placement="top">
                            <div className="flex items-center gap-2 min-w-0 pr-3">
                              <Avatar src={OWNER_AVATARS[acc.ownerName]} sx={{ width:22, height:22, bgcolor:avatarColor(acc.ownerName), fontSize:"0.5rem", fontWeight:800, flexShrink:0 }}>
                                {acc.ownerInitials}
                              </Avatar>
                              <span className="text-[12.5px] text-fg-2 truncate">{acc.ownerName}</span>
                            </div>
                          </Tooltip>
                        )}
                        {visibleCols.has("phone") && (
                          <div className="text-[12.5px] text-fg-2 tabular-nums truncate pr-3">
                            {acc.phone
                              ? <span className="flex items-center gap-1.5"><Phone size={13} color="#60A5FA" weight="duotone" className="flex-shrink-0" />{acc.phone}</span>
                              : <Empty />}
                          </div>
                        )}
                        {visibleCols.has("accountType") && (
                          <div className="pr-3">
                            {typCfg ? <Pill bg={typCfg.bg} text={typCfg.text} dot={typCfg.dot}>{acc.accountType}</Pill> : <Empty />}
                          </div>
                        )}
                        {visibleCols.has("modifiedBy") && (
                          <Tooltip title={`${acc.modifiedByName} · ${acc.modifiedByEmail}`} placement="top">
                            <div className="flex items-center gap-2 min-w-0 pr-3">
                              <Avatar src={OWNER_AVATARS[acc.modifiedByName]} sx={{ width:22, height:22, bgcolor:avatarColor(acc.modifiedByName), fontSize:"0.5rem", fontWeight:800, flexShrink:0 }}>
                                {acc.modifiedByName.split(" ").map(w => w[0]).join("").substring(0, 2)}
                              </Avatar>
                              <span className="text-[12.5px] text-fg-2 truncate">{acc.modifiedByName}</span>
                            </div>
                          </Tooltip>
                        )}
                        {visibleCols.has("creation") && (
                          <p className="text-[12px] text-fg-3 tabular-nums truncate pr-3">{acc.creation}</p>
                        )}
                        {visibleCols.has("modified") && (
                          <p className="text-[12px] text-fg-3 tabular-nums truncate">{acc.modified}</p>
                        )}
                      </TableRow>
                    );
                  })}
                </div>

                {filtered.length === 0 && <EmptyState title="No accounts match" hint="Try a different account name or owner." />}
                <Pagination shown={filtered.length} noun={["account", "accounts"]} />
              </>
            )}
          </ListCard>

          {view === "grid" && (
            <AccountGridView accounts={filtered.map(a => ({
              id: a.id, name: a.name, ownerName: a.ownerName, ownerInitials: a.ownerInitials,
              phone: a.phone, accountType: a.accountType, creation: a.creation,
            }))} />
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
