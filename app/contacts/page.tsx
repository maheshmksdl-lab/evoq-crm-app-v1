"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewContactDrawer from "@/components/contacts/NewContactDrawer";
import ContactGridView from "@/components/contacts/ContactGridView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { SortAscending, Columns, Trash, FunnelSimple, Phone, DeviceMobile, Envelope, UserCheck } from "@phosphor-icons/react";
import {
  PageHeader, ViewToggle, PrimaryButton, ListCard, Toolbar, SearchBox, ToolbarButton, ResultCount,
  BulkBar, TableHeader, TableRow, EmptyState, Pagination, Pill, Empty, gridTemplate, scopedSelection,
} from "@/components/list/ListParts";
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
// Text columns flex (minmax) so the table fits the card; dates keep fixed widths.
const COL_DEFS = [
  { key: "firstName",    label: "First Name",    width: "minmax(160px,1.3fr)" },
  { key: "lastName",     label: "Last Name",     width: "minmax(100px,0.9fr)" },
  { key: "contactOwner", label: "Contact Owner", width: "minmax(120px,1fr)"   },
  { key: "email",        label: "Email",         width: "minmax(170px,1.5fr)" },
  { key: "phone",        label: "Phone",         width: "130px"               },
  { key: "mobile",       label: "Mobile",        width: "130px"               },
  { key: "creation",     label: "Created",       width: "150px"               },
  { key: "modified",     label: "Modified",      width: "150px"               },
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
  // KNOWN LIMITATION: Sort-menu rules (and Filters-drawer rules) are stored and counted on the
  // toolbar buttons but NOT applied to `filtered`. Applying them is new functionality and needs separate approval.
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

  // Selection is scoped to visible rows
  const sel = scopedSelection(selected, setSelected, filtered.map(c => c.id));

  const visibleColDefs = COL_DEFS.filter(c => visibleCols.has(c.key));
  const template       = gridTemplate(visibleColDefs.map(c => c.width));

  return (
    <div className="flex h-screen bg-page font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto bg-canvas">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">
          <PageHeader title="Contacts" count={ALL_CONTACTS.length}
            actions={<>
              <ViewToggle value={view} onChange={v => setView(v as typeof view)} views={["list", "grid"]} />
              <PrimaryButton onClick={() => setDrawerOpen(true)}>New Contact</PrimaryButton>
            </>} />

          <ListCard>
            <Toolbar bulk={sel.visibleSel.length > 0 ? (
              <BulkBar count={sel.visibleSel.length} onClear={sel.clear} actions={[
                { icon: <Envelope size={15} weight="duotone" />,  label: "Send Email" },
                { icon: <UserCheck size={15} weight="duotone" />, label: "Assign Owner" },
                { icon: <Trash size={15} weight="duotone" />,     label: "Delete", danger: true },
              ]} />
            ) : undefined}>
              <SearchBox value={search} onChange={setSearch} label="Search contacts" placeholder="Search by name, email or owner" />
              <ToolbarButton icon={<FunnelSimple size={15} weight="duotone" />} label="Filters"
                active={activeFilters.length > 0} count={activeFilters.length} onClick={() => setFiltersOpen(true)} />
              <ToolbarButton icon={<Columns size={15} weight="duotone" />} label="Columns"
                active={visibleCols.size !== DEFAULT_VISIBLE.size} onClick={() => setColumnsOpen(true)} />
              <ToolbarButton icon={<SortAscending size={15} weight="duotone" />} label="Sort" caret
                active={activeSorts.length > 0} count={activeSorts.length} onClick={e => setSortAnchor(e.currentTarget)} />
              {!!search && <span className="ml-auto"><ResultCount shown={filtered.length} total={ALL_CONTACTS.length} noun="contacts" /></span>}
            </Toolbar>

            {view === "list" && (
              <>
                <TableHeader template={template} labels={visibleColDefs.map(c => c.label)}
                  allChecked={sel.allChecked} someChecked={sel.someChecked} onToggleAll={sel.toggleAll} selectAllLabel="Select all contacts" />

                <div className="divide-y divide-line-soft">
                  {filtered.map(contact => {
                    const fullName = `${contact.firstName} ${contact.lastName}`.trim();
                    return (
                      <TableRow key={contact.id} template={template} name={fullName}
                        selected={selected.includes(contact.id)} onToggle={() => sel.toggleOne(contact.id)}
                        onOpen={() => router.push(`/contacts/${contact.id}`)}>

                        {visibleCols.has("firstName") && (
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <Avatar sx={{ width:32, height:32, bgcolor:avatarColor(fullName), fontSize:"0.65rem", fontWeight:800, flexShrink:0 }}>
                              {((contact.firstName[0] ?? "") + (contact.lastName[0] ?? "")).toUpperCase()}
                            </Avatar>
                            <p className="font-heading text-[13px] font-semibold text-fg truncate group-hover:text-link transition-colors">{contact.firstName}</p>
                          </div>
                        )}
                        {visibleCols.has("lastName") && (
                          <p className="text-[12.5px] text-fg-2 truncate pr-3">{contact.lastName || <Empty />}</p>
                        )}
                        {visibleCols.has("contactOwner") && (
                          <Tooltip title={`${contact.ownerName} · ${contact.ownerEmail}`} placement="top">
                            <div className="flex items-center gap-2 min-w-0 pr-3">
                              <Avatar src={OWNER_AVATARS[contact.ownerName]} sx={{ width:22, height:22, bgcolor:avatarColor(contact.ownerName), fontSize:"0.5rem", fontWeight:800, flexShrink:0 }}>
                                {contact.ownerInitials}
                              </Avatar>
                              <span className="text-[12.5px] text-fg-2 truncate">{contact.ownerName}</span>
                            </div>
                          </Tooltip>
                        )}
                        {visibleCols.has("email") && (
                          <div className="text-[12.5px] truncate pr-3">
                            {contact.email ? (
                              <a href={`mailto:${contact.email}`} onClick={e => e.stopPropagation()}
                                className="text-link hover:text-link-hover hover:underline underline-offset-2 rounded outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                                {contact.email}
                              </a>
                            ) : <Empty />}
                          </div>
                        )}
                        {visibleCols.has("phone") && (
                          <div className="text-[12.5px] text-fg-2 tabular-nums truncate pr-3">
                            {contact.phone
                              ? <span className="flex items-center gap-1.5"><Phone size={13} color="#60A5FA" weight="duotone" className="flex-shrink-0" />{contact.phone}</span>
                              : <Empty />}
                          </div>
                        )}
                        {visibleCols.has("mobile") && (
                          <div className="text-[12.5px] text-fg-2 tabular-nums truncate pr-3">
                            {contact.mobile
                              ? <span className="flex items-center gap-1.5"><DeviceMobile size={13} color="#60A5FA" weight="duotone" className="flex-shrink-0" />{contact.mobile}</span>
                              : <Empty />}
                          </div>
                        )}
                        {visibleCols.has("creation") && (
                          <p className="text-[12px] text-fg-3 tabular-nums truncate pr-3">{contact.creation}</p>
                        )}
                        {visibleCols.has("modified") && (
                          <p className="text-[12px] text-fg-3 tabular-nums truncate">{contact.modified}</p>
                        )}
                      </TableRow>
                    );
                  })}
                </div>

                {filtered.length === 0 && <EmptyState title="No contacts match" hint="Try a different name, email or owner." />}
                <Pagination shown={filtered.length} noun={["contact", "contacts"]} />
              </>
            )}
          </ListCard>

          {view === "grid" && (
            <ContactGridView contacts={filtered.map(c => ({
              id: c.id, firstName: c.firstName, lastName: c.lastName,
              ownerName: c.ownerName, ownerInitials: c.ownerInitials,
              email: c.email, phone: c.phone, mobile: c.mobile,
              accountName: c.accountName,
            }))} />
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
