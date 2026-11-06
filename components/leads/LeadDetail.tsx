"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewLeadDrawer from "@/components/leads/NewLeadDrawer";
import ConvertToDealDrawer from "@/components/leads/ConvertToDealDrawer";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InputBase from "@mui/material/InputBase";
// Phosphor Duotone Icons
import {
  House, CaretRight, PencilSimple, Phone, Envelope,
  DotsThreeVertical, Check, Note, ClipboardText, Paperclip,
  ClockCounterClockwise, User, AddressBook, TrendUp, Buildings,
  ArrowsLeftRight, Star, Clock, UserPlus, Copy, DownloadSimple,
  Trash, Users, Plus, PaperPlaneTilt,
  ThumbsUp, ThumbsDown, ArrowLeft, ArrowsClockwise,
} from "@phosphor-icons/react";
import { LEAD_AVATARS, OWNER_AVATARS } from "@/lib/avatars";

// ─────────────────────────────────────────────
//  Types & data
// ─────────────────────────────────────────────
type LeadStatus = "New" | "Contacted" | "In Progress" | "Qualified" | "Lost" | "Unqualified";

interface LeadRecord {
  id: number; salutation: string; firstName: string; lastName: string;
  company: string; title: string; email: string; phone: string;
  mobile: string; fax: string; website: string; status: LeadStatus;
  leadSource: string; industry: string; rating: string;
  noOfEmployees: string; annualRevenue: string; owner: string;
  ownerInitials: string; ownerColor: string; created: string;
  modified: string; emailOptOut: boolean; description: string;
}

const LEADS: Record<number, LeadRecord> = {
  1:  { id:1,  salutation:"Mrs.", firstName:"Shobha",    lastName:"R",       company:"Shobha Realty",     title:"Director",  email:"",                      phone:"",            mobile:"",               fax:"", website:"www.shobarealty.in",     status:"New",         leadSource:"Web",         industry:"Real Estate",   rating:"Hot",  noOfEmployees:"1–10",   annualRevenue:"",         owner:"PM SDL",    ownerInitials:"PM", ownerColor:"#1D4ED8", created:"27 May 2026", modified:"27 May 2026", emailOptOut:false, description:"" },
  2:  { id:2,  salutation:"Ms.",  firstName:"Priya",     lastName:"Nair",    company:"Nair & Co",         title:"Manager",   email:"priya.nair@demo.com",    phone:"04425561234", mobile:"9988776655",     fax:"", website:"",                      status:"Contacted",    leadSource:"Referral",    industry:"Finance",       rating:"Warm", noOfEmployees:"11–50",  annualRevenue:"2500000",  owner:"SE User 1", ownerInitials:"SU", ownerColor:"#3B82F6", created:"02 Feb 2025", modified:"15 Apr 2026", emailOptOut:false, description:"Interested in enterprise plan." },
  3:  { id:3,  salutation:"Mr.",  firstName:"John",      lastName:"Carter",  company:"Carter Traders",    title:"CEO",       email:"john.carter@demo.com",   phone:"",            mobile:"9876543210",     fax:"", website:"www.cartertraders.com", status:"Qualified",    leadSource:"Cold Call",   industry:"Retail",        rating:"Hot",  noOfEmployees:"51–200", annualRevenue:"8000000",  owner:"SE User 1", ownerInitials:"SU", ownerColor:"#3B82F6", created:"02 Feb 2025", modified:"10 May 2026", emailOptOut:false, description:"Looking for bulk pricing. Follow up next week." },
  4:  { id:4,  salutation:"Mrs.", firstName:"Sudha",     lastName:"R",       company:"ddd",               title:"",          email:"Sudha@gmail.com",        phone:"",            mobile:"76656564456544", fax:"", website:"",                      status:"In Progress",  leadSource:"Advertisement",industry:"Other",          rating:"Cold", noOfEmployees:"1–10",   annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  5:  { id:5,  salutation:"",     firstName:"Jaya",      lastName:"56678",   company:"",                  title:"",          email:"",                       phone:"",            mobile:"76656564456544", fax:"", website:"",                      status:"New",          leadSource:"Web",         industry:"",              rating:"",     noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  6:  { id:6,  salutation:"Mr.",  firstName:"Leo",       lastName:"",        company:"",                  title:"",          email:"",                       phone:"",            mobile:"7865443322",     fax:"", website:"",                      status:"Unqualified",  leadSource:"Web",         industry:"",              rating:"Cold", noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  7:  { id:7,  salutation:"",     firstName:"gfdsfs",    lastName:"",        company:"",                  title:"",          email:"",                       phone:"",            mobile:"9876543212",     fax:"", website:"",                      status:"Lost",         leadSource:"",            industry:"",              rating:"",     noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  8:  { id:8,  salutation:"",     firstName:"335634656", lastName:"",        company:"",                  title:"",          email:"",                       phone:"",            mobile:"675432124578",   fax:"", website:"",                      status:"New",          leadSource:"",            industry:"",              rating:"",     noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  9:  { id:9,  salutation:"Mr.",  firstName:"Leo",       lastName:"",        company:"",                  title:"",          email:"",                       phone:"",            mobile:"6757567456",     fax:"", website:"",                      status:"Contacted",    leadSource:"Web",         industry:"",              rating:"Cold", noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  10: { id:10, salutation:"Mr.",  firstName:"James",     lastName:"Wilson",  company:"Wilson & Partners", title:"Partner",   email:"james@wilson.com",       phone:"02244556677", mobile:"9876541234",     fax:"", website:"www.wilsonpartners.com",status:"Qualified",    leadSource:"Referral",    industry:"Finance",       rating:"Hot",  noOfEmployees:"11–50",  annualRevenue:"12000000", owner:"PM SDL",    ownerInitials:"PM", ownerColor:"#1D4ED8", created:"15 May 2026", modified:"28 May 2026", emailOptOut:false, description:"High-value lead via Apex Solutions." },
  11: { id:11, salutation:"Ms.",  firstName:"Sara",      lastName:"Kim",     company:"TechFlow Ltd",      title:"CTO",       email:"sara.kim@techflow.io",   phone:"",            mobile:"8765432109",     fax:"", website:"www.techflow.io",       status:"In Progress",  leadSource:"Trade Show",  industry:"Technology",    rating:"Warm", noOfEmployees:"51–200", annualRevenue:"5000000",  owner:"SE User 1", ownerInitials:"SU", ownerColor:"#3B82F6", created:"10 Apr 2026", modified:"20 May 2026", emailOptOut:false, description:"Met at TechSummit 2026. Needs platform demo." },
  12: { id:12, salutation:"Mr.",  firstName:"Raj",       lastName:"Mehta",   company:"Apex Group",        title:"MD",        email:"raj@apex.in",            phone:"08033445566", mobile:"9845123456",     fax:"", website:"www.apexgroup.in",      status:"New",          leadSource:"Web",         industry:"Manufacturing", rating:"Hot",  noOfEmployees:"200+",   annualRevenue:"50000000", owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"08 Mar 2026", modified:"08 Mar 2026", emailOptOut:false, description:"" },
};

const STATUS_CFG: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  "New":         { bg:"var(--surface)", text:"var(--ink)", dot:"#1D4ED8" },
  "Contacted":   { bg:"var(--tint)", text:"var(--link)", dot:"#3B82F6" },
  "In Progress": { bg:"var(--tint)", text:"var(--ink)", dot:"#60A5FA" },
  "Qualified":   { bg:"var(--st-green-bg)", text:"var(--st-green-fg)", dot:"#16A34A" },
  "Lost":        { bg:"var(--st-red-bg)", text:"var(--st-red-fg)", dot:"#EF4444" },
  "Unqualified": { bg:"var(--surface-subtle)", text:"var(--fg-2)", dot:"#94A3B8" },
};

const PIPELINE: LeadStatus[] = ["New", "Contacted", "In Progress", "Qualified"];

const AVATAR_PAL = ["#0C2472","#1D4ED8","#3B82F6","#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_PAL.length];
const initials = (n: string) => { const p = n.trim().split(/\s+/); return p.length>=2?(p[0][0]+p[1][0]).toUpperCase():n.substring(0,2).toUpperCase(); };

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

// Tinted icon tile. color-mix keeps this working with theme tokens (var(--…)), unlike hex+alpha suffixes.
const tileBg = (color: string, pct = 14) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card rounded-2xl border border-line shadow-card overflow-hidden">
      <header className="flex items-center gap-2.5 px-5 py-3.5 border-b border-line-soft">
        <span className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center">
          <Icon size={15} color="var(--link)" weight="duotone" />
        </span>
        <h2 className="font-heading text-[13px] font-bold text-fg">{title}</h2>
      </header>
      <dl className="px-5 py-2 grid grid-cols-2 gap-x-8">{children}</dl>
    </section>
  );
}

// Label/value row. `href` turns the value into a real link (email / website).
function KV({ label, value, href, external }: { label: string; value?: string; href?: string; external?: boolean }) {
  return (
    <div className="py-3 border-b border-line-soft">
      <dt className="text-[11px] font-semibold text-fg-3 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-[13.5px] font-medium text-fg break-words">
        {!value ? (
          <span className="text-fg-3 font-normal">Not set</span>
        ) : href ? (
          <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-link hover:text-link-hover hover:underline underline-offset-2 rounded outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
            {value}
          </a>
        ) : value}
      </dd>
    </div>
  );
}

type RelatedItem = { icon: React.ElementType; label: string; count: number; color: string; tab: "overview" | "activity" | "notes" };

// Shared side panel (was duplicated per tab). Highlights the row matching the open tab.
function RelatedList({ items, activeTab, onOpen }: { items: RelatedItem[]; activeTab: string; onOpen: (t: RelatedItem["tab"]) => void }) {
  return (
    <section className="bg-card rounded-2xl border border-line shadow-card overflow-hidden">
      <header className="px-4 py-3.5 border-b border-line-soft">
        <h2 className="font-heading text-[13px] font-bold text-fg">Related</h2>
      </header>
      <ul className="p-2 space-y-0.5">
        {items.map(({ icon: Icon, label, count, color, tab }) => {
          const current = activeTab === "notes" && label === "Notes";
          return (
            <li key={label}>
              <button onClick={() => onOpen(tab)} aria-current={current ? "true" : undefined}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl group transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] ${current ? "bg-surface" : "hover:bg-surface"}`}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tileBg(color) }}>
                  <Icon size={15} color={color} weight="duotone" />
                </span>
                <span className="flex-1 text-left text-[13px] font-medium text-fg group-hover:text-link transition-colors">{label}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums ${count > 0 ? "bg-tint text-link" : "text-fg-3"}`}>{count}</span>
                <CaretRight size={14} weight="bold" className="text-fg-3 group-hover:text-link transition-colors" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────
export default function LeadDetail({ leadId }: { leadId: number }) {
  const router = useRouter();
  const lead = LEADS[leadId];

  // ── UI state ──
  const [activeTab, setActiveTab]         = useState<"overview"|"activity"|"notes">("overview");
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead?.status ?? "New");
  const [editOpen, setEditOpen]           = useState(false);
  const [convertOpen, setConvertOpen]     = useState(false);
  const [moreAnchor, setMoreAnchor]       = useState<null|HTMLElement>(null);
  const [newNoteText, setNewNoteText]     = useState("");
  const [addingNote, setAddingNote]       = useState(false);
  const [notes, setNotes]                 = useState([
    { id:1, text:"Initial contact made. Interested in residential properties.", author:"PM SDL", initials:"PM", color:"#1D4ED8", date:"27 May 2026, 3:54 PM" },
    { id:2, text:"Sent property listings via email. Will follow up next week.", author:"PM SDL", initials:"PM", color:"#1D4ED8", date:"27 May 2026, 4:20 PM" },
    { id:3, text:"Meeting tentatively scheduled for June.", author:"SE User 1", initials:"SU", color:"#3B82F6", date:"28 May 2026, 10:00 AM" },
  ]);

  if (!lead) {
    return (
      <div className="flex h-screen bg-page"><Sidebar />
        <div className="ml-[230px] flex-1 flex items-center justify-center bg-canvas">
          <div className="bg-card border border-line rounded-2xl shadow-card px-10 py-10 text-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-surface ring-1 ring-line flex items-center justify-center mx-auto mb-4">
              <User size={24} color="var(--link)" weight="duotone" />
            </div>
            <h1 className="font-heading text-[16px] font-bold text-fg">Lead not found</h1>
            <p className="text-[13px] text-fg-3 mt-1 mb-5">It may have been deleted, or the link is incorrect.</p>
            <Button variant="contained" startIcon={<ArrowLeft size={15} weight="bold" />} onClick={() => router.push("/leads")}
              sx={{ borderRadius:"10px", fontWeight:700, fontSize:"0.8rem", px:2 }}>
              Back to Leads
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const fullName  = [lead.salutation, lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const avColor   = avatarColor(fullName);
  const avInit    = initials(fullName || "?");
  const pipelineIdx = PIPELINE.indexOf(currentStatus);
  const cfg       = STATUS_CFG[currentStatus];
  const phoneNo   = lead.mobile || lead.phone;
  const websiteHref = lead.website ? (/^https?:\/\//.test(lead.website) ? lead.website : `https://${lead.website}`) : undefined;

  const addNote = () => {
    if (!newNoteText.trim()) return;
    setNotes(prev => [...prev, {
      id: Date.now(), text: newNoteText,
      author: "PM SDL", initials: "PM", color: "#1D4ED8",
      date: "Just now",
    }]);
    setNewNoteText(""); setAddingNote(false);
  };

  // Activity timeline items
  const activityFeed = [
    { icon: UserPlus,            color:"var(--link)", text:`Lead created by ${lead.owner}`,          time:lead.created  },
    { icon: TrendUp,             color:"#3B82F6",     text:`Status set to "${lead.status}"`,         time:lead.created  },
    { icon: Note,                color:"#60A5FA",     text:"Note added: Initial contact made…",      time:lead.modified },
    { icon: Envelope,            color:"var(--ink)",  text:"Email sent to lead",                     time:lead.modified },
    { icon: Phone,               color:"#60A5FA",     text:"Call logged — 5 min, no answer",         time:lead.modified },
  ];

  // More menu options
  const moreOptions = [
    { icon: Envelope,       label:"Send Email",      color:"#3B82F6" },
    { icon: Users,          label:"Assign to Team",  color:"var(--link)" },
    { icon: Copy,           label:"Duplicate Lead",  color:"#60A5FA" },
    { icon: DownloadSimple, label:"Export as PDF",   color:"var(--fg-3)" },
    { type:"divider" as const },
    { icon: Trash,          label:"Delete Lead",     color:"#EF4444" },
  ];

  // Related list → tab mapping
  const relatedItems: RelatedItem[] = [
    { icon: Note,                 label:"Notes",         count:notes.length, color:"var(--link)", tab:"notes"    },
    { icon: ClipboardText,        label:"Tasks",         count:2,            color:"#3B82F6",     tab:"activity" },
    { icon: Phone,                label:"Calls",         count:1,            color:"#60A5FA",     tab:"activity" },
    { icon: Envelope,             label:"Emails",        count:0,            color:"#60A5FA",     tab:"activity" },
    { icon: Paperclip,            label:"Attachments",   count:0,            color:"var(--fg-3)", tab:"activity" },
    { icon: ClockCounterClockwise,label:"Stage History", count:1,            color:"var(--ink)",  tab:"activity" },
  ];

  const TABS = [
    { key:"overview" as const, label:"Overview" },
    { key:"activity" as const, label:"Activity", count: activityFeed.length },
    { key:"notes"    as const, label:"Notes",    count: notes.length },
  ];

  // Outlined header buttons share one look
  const outlineBtn = {
    height: 34, borderColor:"var(--line)", color:"var(--fg)", bgcolor:"var(--card)", borderRadius:"10px",
    textTransform:"none", fontWeight:600, fontSize:"0.78rem", px:1.5,
    "&:hover":{ borderColor:"var(--link)", color:"var(--link)", bgcolor:"var(--surface)" },
  } as const;

  const sidePanel = <RelatedList items={relatedItems} activeTab={activeTab} onOpen={setActiveTab} />;

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
            <Link href="/leads" className="hover:text-link transition-colors font-medium">Leads</Link>
            <CaretRight size={11} weight="bold" className="text-slate-300" />
            <span aria-current="page" className="text-fg-2 font-semibold truncate max-w-[280px]">{fullName}</span>
          </nav>

          {/* ══ Lead Header Card ══ */}
          <div className="bg-card rounded-2xl border border-line shadow-card">
            <div className="flex items-center gap-4 flex-wrap px-5 py-4">
              <div className="relative flex-shrink-0">
                <Avatar src={LEAD_AVATARS[leadId]}
                  sx={{ width:60, height:60, bgcolor:avColor, fontSize:"1.1rem", fontWeight:800, boxShadow:"0 4px 14px 0 rgba(12,36,114,0.2)" }}>
                  {avInit}
                </Avatar>
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-[3px] border-card" style={{ backgroundColor: cfg.dot }} aria-hidden />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-heading text-[20px] font-extrabold text-fg tracking-tight">{fullName}</h1>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ring-1 ring-inset ring-black/[0.04]" style={{ backgroundColor:cfg.bg, color:cfg.text }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:cfg.dot }} />
                    {currentStatus}
                  </span>
                </div>
                <p className="text-[13px] text-fg-2 font-medium flex items-center gap-1.5 mt-1 flex-wrap">
                  {lead.company ? (
                    <><Buildings size={14} color="#60A5FA" weight="duotone" />{lead.company}</>
                  ) : <span className="text-fg-3">No company</span>}
                  {lead.title && <><span className="text-slate-300">·</span><span>{lead.title}</span></>}
                  {lead.industry && <><span className="text-slate-300">·</span><span className="text-fg-3">{lead.industry}</span></>}
                </p>
                <p className="text-[12px] text-fg-3 mt-1 tabular-nums">
                  CRM-LEAD-{String(lead.id).padStart(4,"0")} · Created {lead.created}
                </p>
              </div>

              {/* Actions: contact shortcuts, then secondary, then primary */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {phoneNo && (
                  <Button component="a" href={`tel:${phoneNo}`} variant="outlined" size="small" startIcon={<Phone size={15} weight="duotone" />} sx={outlineBtn}>
                    Call
                  </Button>
                )}
                {lead.email && (
                  <Button component="a" href={`mailto:${lead.email}`} variant="outlined" size="small" startIcon={<Envelope size={15} weight="duotone" />} sx={outlineBtn}>
                    Email
                  </Button>
                )}
                <Button variant="outlined" size="small" startIcon={<ArrowsLeftRight size={15} weight="duotone" />}
                  onClick={() => setConvertOpen(true)}
                  sx={{ ...outlineBtn, color:"var(--link)", fontWeight:700 }}>
                  Convert to Deal
                </Button>
                <Button variant="contained" size="small" startIcon={<PencilSimple size={15} weight="bold" />}
                  onClick={() => setEditOpen(true)}
                  sx={{ height:34, bgcolor:"#1D4ED8", borderRadius:"10px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:1.75, boxShadow:"0 1px 8px 0 #1D4ED833", "&:hover":{ bgcolor:"#1E40AF", boxShadow:"0 2px 14px 0 #1D4ED844" }, "&:active":{ bgcolor:"#0C2472" } }}>
                  Edit
                </Button>

                <Tooltip title="More actions">
                  <IconButton size="small" aria-label="More actions" aria-haspopup="menu" aria-expanded={Boolean(moreAnchor)}
                    onClick={e => setMoreAnchor(e.currentTarget)}
                    sx={{ width:34, height:34, borderRadius:"10px", border:"1px solid var(--line)", bgcolor: moreAnchor ? "var(--surface)" : "var(--card)", "&:hover":{ bgcolor:"var(--surface)", borderColor:"var(--link)" } }}>
                    <DotsThreeVertical size={18} color="var(--fg-2)" weight="bold" />
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={moreAnchor}
                  open={Boolean(moreAnchor)}
                  onClose={() => setMoreAnchor(null)}
                  transformOrigin={{ horizontal:"right", vertical:"top" }}
                  anchorOrigin={{ horizontal:"right", vertical:"bottom" }}
                  slotProps={{ paper: { sx: { borderRadius:"14px", border:"1px solid var(--line)", boxShadow:"var(--shadow-card)", minWidth:210, mt:0.75 } } }}
                >
                  {moreOptions.map((opt, i) =>
                    opt.type === "divider"
                      ? <Divider key={i} sx={{ my:0.5, borderColor:"var(--line-soft)" }} />
                      : (
                        <MenuItem key={opt.label} onClick={() => setMoreAnchor(null)}
                          sx={{ mx:0.75, borderRadius:"8px", py:1, "&:hover":{ bgcolor: opt.color==="#EF4444" ? "var(--st-red-bg)" : "var(--surface)" } }}>
                          <ListItemIcon sx={{ minWidth:32 }}>
                            <opt.icon size={17} color={opt.color} weight="duotone" />
                          </ListItemIcon>
                          <ListItemText primaryTypographyProps={{ fontSize:"0.82rem", fontWeight:600, color: opt.color==="#EF4444" ? "#EF4444" : "var(--fg)" }}>
                            {opt.label}
                          </ListItemText>
                        </MenuItem>
                      )
                  )}
                </Menu>
              </div>
            </div>

            {/* Tabs live on the header card, so the record and its sections read as one unit */}
            <div role="tablist" aria-label="Lead sections" className="flex items-center gap-1 px-4 border-t border-line-soft">
              {TABS.map(({ key, label, count }) => {
                const on = activeTab === key;
                return (
                  <button key={key} role="tab" aria-selected={on} onClick={() => setActiveTab(key)}
                    className={`relative flex items-center gap-1.5 px-3 pt-3 pb-3 text-[13px] font-semibold transition-colors outline-none focus-visible:text-link ${on ? "text-link" : "text-fg-2 hover:text-fg"}`}>
                    {label}
                    {count !== undefined && (
                      <span className={`text-[10.5px] min-w-[20px] px-1.5 py-0.5 rounded-full font-bold leading-none tabular-nums ${on ? "bg-[#1D4ED8] text-white" : "bg-slate-100 text-fg-2"}`}>{count}</span>
                    )}
                    <span className={`absolute left-2 right-2 -bottom-px h-[2px] rounded-full ${on ? "bg-[#1D4ED8] dark:bg-[#8AB4FF]" : "bg-transparent"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════ OVERVIEW ══════════════════════════ */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-4 items-start">

              {/* Left 2/3 */}
              <div className="col-span-2 space-y-4">

                {/* ── Stage Pipeline (clickable) ── */}
                <section className="bg-card rounded-2xl border border-line shadow-card p-5">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div>
                      <h2 className="font-heading text-[13px] font-bold text-fg">Stage</h2>
                      <p className="text-[12px] text-fg-3 mt-0.5">Select a stage to update it · Started <span className="font-semibold text-fg-2">{lead.created}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-fg-3 uppercase tracking-wider">Last updated</p>
                      <p className="text-[12.5px] font-semibold text-fg-2 mt-0.5 tabular-nums">{lead.modified}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ol className="flex items-center gap-1 flex-1" aria-label="Lead stages">
                      {PIPELINE.map((stage, i) => {
                        const isDone    = pipelineIdx >= 0 && i < pipelineIdx;
                        const isActive  = i === pipelineIdx;
                        return (
                          <li key={stage} className="flex items-center flex-1 gap-1">
                            <button
                              onClick={() => setCurrentStatus(stage)}
                              aria-current={isActive ? "step" : undefined}
                              title={isDone ? "Completed — select to move back" : isActive ? "Current stage" : "Set as current stage"}
                              className={`flex items-center justify-center gap-1.5 flex-1 h-9 px-2 rounded-xl text-[12px] font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]
                                ${isActive ? "bg-[#1D4ED8] text-white shadow-md shadow-[#1D4ED8]/25" : ""}
                                ${isDone   ? "bg-tint text-link hover:bg-surface" : ""}
                                ${!isActive && !isDone ? "bg-surface-subtle text-fg-3 border border-dashed border-line-strong hover:text-link hover:border-link" : ""}
                              `}>
                              {isDone && <Check size={13} weight="bold" />}
                              <span className="truncate">{stage}</span>
                            </button>
                            {i < PIPELINE.length - 1 && (
                              <CaretRight size={14} weight="bold" className={isDone || isActive ? "text-[#60A5FA]" : "text-slate-300"} style={{ flexShrink:0 }} />
                            )}
                          </li>
                        );
                      })}
                    </ol>

                    {/* Outcome buttons — icons instead of emoji so they render the same everywhere */}
                    <div className="flex items-center gap-1.5 ml-2 flex-shrink-0 pl-3 border-l border-line-soft">
                      <Tooltip title="Mark as Qualified (won)">
                        <button onClick={() => setCurrentStatus("Qualified")} aria-label="Mark as Qualified" aria-pressed={currentStatus==="Qualified"}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]
                            ${currentStatus==="Qualified" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                          <ThumbsUp size={17} weight={currentStatus==="Qualified" ? "fill" : "duotone"} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Mark as Lost">
                        <button onClick={() => setCurrentStatus("Lost")} aria-label="Mark as Lost" aria-pressed={currentStatus==="Lost"}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]
                            ${currentStatus==="Lost" ? "bg-red-500 text-white" : "bg-red-50 text-red-500 hover:bg-red-100"}`}>
                          <ThumbsDown size={17} weight={currentStatus==="Lost" ? "fill" : "duotone"} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Unsaved stage change */}
                  {currentStatus !== lead.status && (
                    <div role="status" className="mt-4 flex items-center gap-2 bg-surface border border-line rounded-xl px-3.5 py-2.5 text-[12.5px] animate-slide-up">
                      <ArrowsClockwise size={15} color="var(--link)" weight="duotone" />
                      <span className="text-fg font-semibold">Stage changed to “{currentStatus}”</span>
                      <span className="text-fg-3">· not saved yet</span>
                      <button onClick={() => setCurrentStatus(lead.status)}
                        className="ml-auto text-link font-bold px-2.5 py-1 rounded-lg hover:bg-tint transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                        Undo
                      </button>
                    </div>
                  )}
                </section>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label:"Lead Source", value:lead.leadSource,    icon:TrendUp,   color:"var(--link)" },
                    { label:"Rating",      value:lead.rating,        icon:Star,      color:"#F59E0B"     },
                    { label:"Industry",    value:lead.industry,      icon:Buildings, color:"#3B82F6"     },
                    { label:"Employees",   value:lead.noOfEmployees, icon:User,      color:"#60A5FA"     },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-card rounded-xl border border-line shadow-card p-4 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tileBg(color, 16) }}>
                        <Icon size={17} color={color} weight="duotone" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-fg-3 uppercase tracking-wider">{label}</p>
                        <p className={`text-[13.5px] font-bold truncate ${value ? "text-fg" : "text-fg-3 font-medium"}`}>{value || "Not set"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Personal Info */}
                <SectionCard icon={User} title="Personal information">
                  <KV label="Salutation"    value={lead.salutation} />
                  <KV label="First name"    value={lead.firstName} />
                  <KV label="Last name"     value={lead.lastName} />
                  <KV label="Title"         value={lead.title} />
                  <KV label="Company"       value={lead.company} />
                  <KV label="Industry"      value={lead.industry} />
                  <KV label="Email opt out" value={lead.emailOptOut?"Yes":"No"} />
                  <KV label="Description"   value={lead.description} />
                </SectionCard>

                {/* Contact Details */}
                <SectionCard icon={AddressBook} title="Contact details">
                  <KV label="Email"   value={lead.email}   href={lead.email ? `mailto:${lead.email}` : undefined} />
                  <KV label="Phone"   value={lead.phone} />
                  <KV label="Mobile"  value={lead.mobile} />
                  <KV label="Fax"     value={lead.fax} />
                  <KV label="Website" value={lead.website} href={websiteHref} external />
                </SectionCard>

                {/* Lead Details */}
                <SectionCard icon={TrendUp} title="Lead details">
                  <KV label="Lead source"      value={lead.leadSource} />
                  <KV label="Lead status"      value={currentStatus} />
                  <KV label="Rating"           value={lead.rating} />
                  <KV label="No. of employees" value={lead.noOfEmployees} />
                  <KV label="Annual revenue"   value={lead.annualRevenue ? `₹${Number(lead.annualRevenue).toLocaleString("en-IN")}` : ""} />
                </SectionCard>
              </div>

              {/* Right 1/3 — sticks while the long left column scrolls */}
              <aside className="space-y-4 sticky top-[76px]">
                {sidePanel}

                {/* Ownership */}
                <section className="bg-card rounded-2xl border border-line shadow-card p-4 space-y-3">
                  <h2 className="font-heading text-[13px] font-bold text-fg">Ownership</h2>
                  <div className="flex items-center gap-3">
                    <Avatar src={OWNER_AVATARS[lead.owner]} sx={{ width:36, height:36, bgcolor:lead.ownerColor, fontSize:"0.65rem", fontWeight:800 }}>
                      {lead.ownerInitials}
                    </Avatar>
                    <div>
                      <p className="text-[13px] font-semibold text-fg">{lead.owner}</p>
                      <p className="text-[11.5px] text-fg-3">Lead owner</p>
                    </div>
                  </div>
                  <dl className="space-y-2 pt-3 border-t border-line-soft text-[12px]">
                    <div className="flex justify-between"><dt className="text-fg-3 font-medium">Created</dt><dd className="text-fg-2 font-semibold tabular-nums">{lead.created}</dd></div>
                    <div className="flex justify-between"><dt className="text-fg-3 font-medium">Modified</dt><dd className="text-fg-2 font-semibold tabular-nums">{lead.modified}</dd></div>
                  </dl>
                </section>
              </aside>
            </div>
          )}

          {/* ══════════════════════════ ACTIVITY ══════════════════════════ */}
          {activeTab === "activity" && (
            <div className="grid grid-cols-3 gap-4 items-start">
              <section className="col-span-2 bg-card rounded-2xl border border-line shadow-card">
                <header className="flex items-center justify-between px-5 py-4 border-b border-line-soft">
                  <h2 className="font-heading text-[14px] font-bold text-fg">Activity timeline</h2>
                  <span className="text-[11px] font-semibold text-fg-2 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">{activityFeed.length} events</span>
                </header>
                <ol className="px-5 py-4">
                  {activityFeed.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={i} className="flex gap-4">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: tileBg(item.color) }}>
                            <Icon size={16} color={item.color} weight="duotone" />
                          </span>
                          {i < activityFeed.length-1 && <span className="w-px flex-1 bg-line my-1 min-h-[20px]" />}
                        </div>
                        <div className="flex-1 pb-5">
                          <p className="text-[13px] font-medium text-fg mt-1.5">{item.text}</p>
                          <p className="text-[11.5px] text-fg-3 mt-0.5 flex items-center gap-1 tabular-nums">
                            <Clock size={12} weight="duotone" />{item.time}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
              <aside className="sticky top-[76px]">{sidePanel}</aside>
            </div>
          )}

          {/* ══════════════════════════ NOTES ══════════════════════════ */}
          {activeTab === "notes" && (
            <div className="grid grid-cols-3 gap-4 items-start">
              <div className="col-span-2 space-y-3">

                {/* Add note */}
                {addingNote ? (
                  <div className="bg-card rounded-2xl border-2 border-[#1D4ED8] shadow-card p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar sx={{ width:30, height:30, bgcolor:"#1D4ED8", fontSize:"0.6rem", fontWeight:800 }}>PM</Avatar>
                      <p className="text-[12.5px] font-semibold text-fg">PM SDL <span className="text-fg-3 font-normal">· New note</span></p>
                    </div>
                    <InputBase
                      multiline minRows={3} fullWidth autoFocus
                      placeholder="Write a note about this lead…"
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) addNote(); }}
                      inputProps={{ "aria-label": "Note text" }}
                      sx={{ fontSize:"0.86rem", color:"var(--fg)", lineHeight:1.6, "& textarea::placeholder":{ color:"var(--fg-3)", opacity:1 } }}
                    />
                    <div className="flex items-center gap-2 pt-3 border-t border-line-soft">
                      <span className="text-[11.5px] text-fg-3">Ctrl + Enter to add</span>
                      <button onClick={() => { setAddingNote(false); setNewNoteText(""); }}
                        className="ml-auto text-[12.5px] font-semibold text-fg-2 hover:text-fg px-3 py-1.5 rounded-lg hover:bg-surface transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                        Cancel
                      </button>
                      <Button variant="contained" size="small" endIcon={<PaperPlaneTilt size={14} weight="bold" />}
                        onClick={addNote} disabled={!newNoteText.trim()}
                        sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", "&:hover":{ bgcolor:"#1E40AF" }, "&:active":{ bgcolor:"#0C2472" }, "&.Mui-disabled":{ bgcolor:"var(--tint)", color:"var(--fg-3)" } }}>
                        Add note
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingNote(true)}
                    className="w-full flex items-center gap-3 bg-card border border-line hover:border-link rounded-2xl px-4 py-3.5 text-left shadow-card group transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                    <Avatar sx={{ width:30, height:30, bgcolor:"#1D4ED8", fontSize:"0.6rem", fontWeight:800 }}>PM</Avatar>
                    <span className="text-[13px] text-fg-3 group-hover:text-fg-2 transition-colors">Write a note about this lead…</span>
                    <span className="ml-auto flex items-center gap-1 text-[12px] font-bold text-link">
                      <Plus size={14} weight="bold" /> Add note
                    </span>
                  </button>
                )}

                {/* Existing notes */}
                {notes.map(note => (
                  <article key={note.id} className="bg-card rounded-2xl border border-line shadow-card p-4 group hover:border-line-strong transition-colors">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar sx={{ width:30, height:30, bgcolor:note.color, fontSize:"0.6rem", fontWeight:800 }}>
                          {note.initials}
                        </Avatar>
                        <div>
                          <p className="text-[12.5px] font-semibold text-fg">{note.author}</p>
                          <p className="text-[11px] text-fg-3 tabular-nums">{note.date}</p>
                        </div>
                      </div>
                      {/* Revealed on hover and on keyboard focus */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <Tooltip title="Edit note">
                          <IconButton size="small" aria-label="Edit note" sx={{ borderRadius:"8px", p:0.6, "&:hover":{ bgcolor:"var(--surface)" } }}>
                            <PencilSimple size={15} color="var(--fg-2)" weight="duotone" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete note">
                          <IconButton size="small" aria-label="Delete note"
                            onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                            sx={{ borderRadius:"8px", p:0.6, "&:hover":{ bgcolor:"var(--st-red-bg)", "& svg":{ color:"#EF4444" } } }}>
                            <Trash size={15} color="var(--fg-2)" weight="duotone" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                    <p className="text-[13.5px] text-fg leading-relaxed">{note.text}</p>
                  </article>
                ))}

                {notes.length === 0 && !addingNote && (
                  <div className="bg-card rounded-2xl border border-line p-10 text-center shadow-card">
                    <div className="w-12 h-12 rounded-2xl bg-surface ring-1 ring-line flex items-center justify-center mx-auto mb-3">
                      <Note size={22} color="var(--link)" weight="duotone" />
                    </div>
                    <p className="text-fg font-semibold text-[13.5px]">No notes yet</p>
                    <p className="text-fg-3 text-[12.5px] mt-0.5">Notes you add will appear here.</p>
                  </div>
                )}
              </div>

              <aside className="sticky top-[76px]">{sidePanel}</aside>
            </div>
          )}

        </main>
      </div>

      {/* ══ Drawers ══ */}
      <NewLeadDrawer
        key={editOpen ? "edit" : "closed"}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initialData={{
          salutation: lead.salutation, firstName: lead.firstName,
          lastName: lead.lastName, company: lead.company, title: lead.title,
          email: lead.email, phone: lead.phone, mobile: lead.mobile,
          fax: lead.fax, website: lead.website, leadSource: lead.leadSource,
          leadStatus: currentStatus, industry: lead.industry,
          noOfEmployees: lead.noOfEmployees, annualRevenue: lead.annualRevenue,
          rating: lead.rating, emailOptOut: lead.emailOptOut,
        }}
      />

      <ConvertToDealDrawer
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        leadName={fullName}
        leadCompany={lead.company}
        leadOwner={lead.owner}
        leadOwnerInitials={lead.ownerInitials}
        leadOwnerColor={lead.ownerColor}
        leadAvatarColor={avColor}
        leadInitials={avInit}
      />
    </div>
  );
}
