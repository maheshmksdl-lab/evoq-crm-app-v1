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
  Trash, Users, Plus, PaperPlaneTilt, CheckCircle,
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
  "New":         { bg:"#EFF6FF", text:"#0C2472", dot:"#1D4ED8" },
  "Contacted":   { bg:"#E3ECFC", text:"#1D4ED8", dot:"#3B82F6" },
  "In Progress": { bg:"#E3ECFC", text:"#0C2472", dot:"#60A5FA" },
  "Qualified":   { bg:"#DCFCE7", text:"#166534", dot:"#16A34A" },
  "Lost":        { bg:"#FEF2F2", text:"#991B1B", dot:"#EF4444" },
  "Unqualified": { bg:"#F1F5F9", text:"#475569", dot:"#94A3B8" },
};

const PIPELINE: LeadStatus[] = ["New", "Contacted", "In Progress", "Qualified"];

const AVATAR_PAL = ["#0C2472","#1D4ED8","#3B82F6","#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_PAL.length];
const initials = (n: string) => { const p = n.trim().split(/\s+/); return p.length>=2?(p[0][0]+p[1][0]).toUpperCase():n.substring(0,2).toUpperCase(); };

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────
function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#EFF6FF]">
        <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
          <Icon sx={{ fontSize: 13, color: "#1D4ED8" }} />
        </div>
        <p className="font-heading text-[11px] font-bold text-[#1D4ED8] uppercase tracking-[0.12em]">{title}</p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function KV({ label, value, blue }: { label: string; value?: string; blue?: boolean }) {
  return (
    <div className="py-2 border-b border-[#EFF6FF] last:border-0">
      <p className="font-heading text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-[13px] font-medium ${blue?"text-[#3B82F6]":"text-slate-800"} ${!value?"text-slate-300 italic":""}`}>
        {value || "—"}
      </p>
    </div>
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
      <div className="flex h-screen bg-[#EFF6FF]"><Sidebar />
        <div className="ml-[230px] flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-slate-500 font-semibold">Lead not found</p>
          <button onClick={() => router.push("/leads")} className="text-[#1D4ED8] text-sm font-bold hover:underline">← Back to Leads</button>
        </div>
      </div>
    );
  }

  const fullName  = [lead.salutation, lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const avColor   = avatarColor(fullName);
  const avInit    = initials(fullName || "?");
  const pipelineIdx = PIPELINE.indexOf(currentStatus);
  const cfg       = STATUS_CFG[currentStatus];

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
    { icon: UserPlus,            color:"#1D4ED8", bg:"#EFF6FF", text:`Lead created by ${lead.owner}`,          time:lead.created  },
    { icon: TrendUp,             color:"#3B82F6", bg:"#EFF6FF", text:`Status set to "${lead.status}"`,         time:lead.created  },
    { icon: Note,                color:"#60A5FA", bg:"#EFF6FF", text:"Note added: Initial contact made…",      time:lead.modified },
    { icon: Envelope,            color:"#0C2472", bg:"#E3ECFC", text:"Email sent to lead",                     time:lead.modified },
    { icon: Phone,               color:"#93C5FD", bg:"#EFF6FF", text:"Call logged — 5 min, no answer",         time:lead.modified },
  ];

  // More menu options
  const moreOptions = [
    { icon: Envelope,       label:"Send Email",      color:"#3B82F6" },
    { icon: Users,          label:"Assign to Team",  color:"#1D4ED8" },
    { icon: Copy,           label:"Duplicate Lead",  color:"#60A5FA" },
    { icon: DownloadSimple, label:"Export as PDF",   color:"#94A3B8" },
    { type:"divider" as const },
    { icon: Trash,          label:"Delete Lead",     color:"#EF4444" },
  ];

  // Related list → tab mapping
  const relatedItems = [
    { icon: Note,                label:"Notes",         count:notes.length, color:"#1D4ED8", tab:"notes"    as const },
    { icon: ClipboardText,       label:"Tasks",         count:2,            color:"#3B82F6", tab:"activity" as const },
    { icon: Phone,               label:"Calls",         count:1,            color:"#60A5FA", tab:"activity" as const },
    { icon: Envelope,            label:"Emails",        count:0,            color:"#93C5FD", tab:"activity" as const },
    { icon: Paperclip,           label:"Attachments",   count:0,            color:"#94A3B8", tab:"activity" as const },
    { icon: ClockCounterClockwise,label:"Stage History", count:1,           color:"#0C2472", tab:"activity" as const },
  ];

  return (
    <div className="flex h-screen bg-[#EFF6FF] font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">

          {/* ══ Breadcrumb ══ */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <House size={12} weight="duotone" />
            <CaretRight size={11} weight="duotone" />
            <Link href="/leads" className="hover:text-[#1D4ED8] transition-colors font-medium">Leads</Link>
            <CaretRight size={11} weight="duotone" />
            <span className="text-[#1D4ED8] font-semibold truncate max-w-[240px]">{fullName}</span>
          </div>

          {/* ══ Lead Header Card ══ */}
          <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm px-5 py-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-shrink-0">
                <Avatar
                  src={LEAD_AVATARS[leadId]}
                  sx={{ width:56, height:56, bgcolor:avColor, fontSize:"1.1rem", fontWeight:800, boxShadow:"0 4px 14px 0 rgba(12,36,114,0.2)" }}
                >
                  {avInit}
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: cfg.dot }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-0.5 flex-wrap">
                  <h1 className="text-[18px] font-extrabold text-slate-900 tracking-tight">{fullName}</h1>
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor:cfg.bg, color:cfg.text }}>
                    <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor:cfg.dot }} />
                    {currentStatus}
                  </span>
                </div>
                {lead.company && (
                  <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
                    <Buildings size={13} color="#93C5FD" weight="duotone" />
                    {lead.company}
                    {lead.industry && <><span className="text-slate-300">·</span><span className="text-slate-400">{lead.industry}</span></>}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Lead ID: CRM-LEAD-{String(lead.id).padStart(4,"0")} · Created {lead.created}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {(lead.phone || lead.mobile) && (
                  <Button variant="outlined" size="small" startIcon={<Phone size={14} weight="duotone" />}
                    sx={{ borderColor:"#E3ECFC", color:"#475569", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.74rem", "&:hover":{ borderColor:"#60A5FA", color:"#1D4ED8", bgcolor:"#EFF6FF" } }}>
                    Call
                  </Button>
                )}
                {lead.email && (
                  <Button variant="outlined" size="small" startIcon={<Envelope size={14} weight="duotone" />}
                    sx={{ borderColor:"#E3ECFC", color:"#475569", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.74rem", "&:hover":{ borderColor:"#60A5FA", color:"#1D4ED8", bgcolor:"#EFF6FF" } }}>
                    Email
                  </Button>
                )}

                {/* Convert to Deal */}
                <Button variant="outlined" size="small" startIcon={<ArrowsLeftRight size={14} weight="duotone" />}
                  onClick={() => setConvertOpen(true)}
                  sx={{ borderColor:"#E3ECFC", color:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.74rem", "&:hover":{ borderColor:"#1D4ED8", bgcolor:"#EFF6FF" } }}>
                  Convert
                </Button>

                {/* Edit */}
                <Button variant="contained" size="small" startIcon={<PencilSimple size={14} weight="duotone" />}
                  onClick={() => setEditOpen(true)}
                  sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.74rem", boxShadow:"0 1px 8px 0 #1D4ED833", "&:hover":{ bgcolor:"#60A5FA", boxShadow:"0 2px 14px 0 #60A5FA55" }, "&:active":{ bgcolor:"#0C2472" } }}>
                  Edit
                </Button>

                {/* Three-dot menu */}
                <IconButton size="small"
                  onClick={e => setMoreAnchor(e.currentTarget)}
                  sx={{ borderRadius:"8px", border:"1.5px solid #E3ECFC", bgcolor: moreAnchor ? "#EFF6FF" : "transparent", "&:hover":{ bgcolor:"#EFF6FF" } }}>
                  <DotsThreeVertical size={17} color="#94A3B8" weight="duotone" />
                </IconButton>

                {/* MUI Menu */}
                <Menu
                  anchorEl={moreAnchor}
                  open={Boolean(moreAnchor)}
                  onClose={() => setMoreAnchor(null)}
                  transformOrigin={{ horizontal:"right", vertical:"top" }}
                  anchorOrigin={{ horizontal:"right", vertical:"bottom" }}
                  PaperProps={{ sx: { borderRadius:"14px", border:"1.5px solid #E3ECFC", boxShadow:"0 8px 32px 0 rgba(12,36,114,0.12)", minWidth:200, mt:0.5 } }}
                >
                  {moreOptions.map((opt, i) =>
                    opt.type === "divider"
                      ? <Divider key={i} sx={{ my:0.5, borderColor:"#EFF6FF" }} />
                      : (
                        <MenuItem key={opt.label} onClick={() => setMoreAnchor(null)}
                          sx={{ mx:0.5, borderRadius:"8px", py:1, "&:hover":{ bgcolor:"#EFF6FF" } }}>
                          <ListItemIcon sx={{ minWidth:30 }}>
                            <opt.icon size={16} color={opt.color} weight="duotone" />
                          </ListItemIcon>
                          <ListItemText primaryTypographyProps={{ fontSize:"0.8rem", fontWeight:600, color: opt.color==="#EF4444"?"#EF4444":"#334155" }}>
                            {opt.label}
                          </ListItemText>
                        </MenuItem>
                      )
                  )}
                </Menu>
              </div>
            </div>
          </div>

          {/* ══ Tab Bar ══ */}
          <div className="flex items-center gap-1 bg-white border border-[#E3ECFC] rounded-xl p-1 w-fit shadow-sm">
            {(["overview","activity","notes"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-lg text-[12.5px] font-semibold capitalize transition-all ${
                  activeTab===t ? "bg-[#1D4ED8] text-white shadow-sm" : "text-[#0C2472] bg-[#E3ECFC] hover:bg-[#1D4ED8]/10 hover:text-[#1D4ED8]"
                }`}>
                {t}
                {t==="notes" && notes.length > 0 && (
                  <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded-full font-bold ${activeTab===t ? "bg-white/20 text-white" : "bg-[#E3ECFC] text-[#1D4ED8]"}`}>
                    {notes.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ══════════════════════════ OVERVIEW ══════════════════════════ */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-4 items-start">

              {/* Left 2/3 */}
              <div className="col-span-2 space-y-4">

                {/* ── Stage Pipeline (clickable) ── */}
                <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-heading text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stage Progress</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Click a stage to update · Started <span className="font-semibold text-slate-700">{lead.created}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
                      <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{lead.modified}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {PIPELINE.map((stage, i) => {
                      const isDone    = i < pipelineIdx;
                      const isActive  = i === pipelineIdx;
                      const isPending = i > pipelineIdx;
                      return (
                        <div key={stage} className="flex items-center flex-1 gap-1">
                          <Tooltip title={isDone ? "Completed" : isActive ? "Current stage" : "Click to set stage"}>
                            <button
                              onClick={() => setCurrentStatus(stage)}
                              className={`flex items-center justify-center gap-1.5 flex-1 py-2 px-2 rounded-xl text-[11.5px] font-bold transition-all
                                ${isActive  ? "bg-[#0C2472] text-white shadow-md shadow-[#0C2472]/25 scale-[1.02]" : ""}
                                ${isDone    ? "bg-[#E3ECFC] text-[#1D4ED8] hover:bg-[#DBEAFE]" : ""}
                                ${isPending ? "bg-slate-50 text-slate-400 hover:bg-[#EFF6FF] hover:text-[#1D4ED8]" : ""}
                              `}
                            >
                              {isDone && <Check size={12} weight="duotone" />}
                              <span className="truncate">{stage}</span>
                            </button>
                          </Tooltip>
                          {i < PIPELINE.length - 1 && (
                            <CaretRight size={16} color={isDone||isActive?"#93C5FD":"#E2E8F0"} weight="duotone" style={{ flexShrink:0 }} />
                          )}
                        </div>
                      );
                    })}

                    {/* Won / Lost buttons */}
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <Tooltip title="Mark as Qualified / Won">
                        <button onClick={() => setCurrentStatus("Qualified")}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm
                            ${currentStatus==="Qualified" ? "bg-emerald-500 scale-110" : "bg-emerald-50 hover:bg-emerald-100"}`}>
                          👍
                        </button>
                      </Tooltip>
                      <Tooltip title="Mark as Lost">
                        <button onClick={() => setCurrentStatus("Lost")}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm
                            ${currentStatus==="Lost" ? "bg-red-500 scale-110" : "bg-red-50 hover:bg-red-100"}`}>
                          👎
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Status changed banner */}
                  {currentStatus !== lead.status && (
                    <div className="mt-3 flex items-center gap-2 bg-[#EFF6FF] border border-[#E3ECFC] rounded-xl px-3 py-2 text-[11.5px] animate-slide-up">
                      <span className="text-[#1D4ED8] font-semibold">Stage updated to "{currentStatus}"</span>
                      <span className="text-slate-400">— not saved yet</span>
                      <button onClick={() => setCurrentStatus(lead.status)} className="ml-auto text-[#3B82F6] font-bold hover:text-[#0C2472] transition-colors">Undo</button>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label:"Lead Source", value:lead.leadSource||"—",    icon:TrendUp,   color:"#1D4ED8", bg:"#EFF6FF" },
                    { label:"Rating",      value:lead.rating||"—",        icon:Star,      color:"#F59E0B", bg:"#FFFBEB" },
                    { label:"Industry",    value:lead.industry||"—",      icon:Buildings, color:"#3B82F6", bg:"#EFF6FF" },
                    { label:"Employees",   value:lead.noOfEmployees||"—", icon:User,      color:"#60A5FA", bg:"#EFF6FF" },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-white rounded-xl border border-[#E3ECFC] shadow-sm p-3.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor:bg }}>
                        <Icon size={15} color={color} weight="duotone" />
                      </div>
                      <p className="font-heading text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-[12.5px] font-bold text-slate-800 truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Personal Info */}
                <SectionCard icon={User} title="Personal Information">
                  <div className="grid grid-cols-2 gap-x-8">
                    <KV label="Salutation"   value={lead.salutation} />
                    <KV label="First Name"   value={lead.firstName} />
                    <KV label="Last Name"    value={lead.lastName} />
                    <KV label="Title"        value={lead.title} />
                    <KV label="Company"      value={lead.company} />
                    <KV label="Industry"     value={lead.industry} />
                    <KV label="Email Opt Out" value={lead.emailOptOut?"Yes":"No"} />
                    <KV label="Description"  value={lead.description} />
                  </div>
                </SectionCard>

                {/* Contact Details */}
                <SectionCard icon={AddressBook} title="Contact Details">
                  <div className="grid grid-cols-2 gap-x-8">
                    <KV label="Email"   value={lead.email}   blue={!!lead.email} />
                    <KV label="Phone"   value={lead.phone} />
                    <KV label="Mobile"  value={lead.mobile} />
                    <KV label="Fax"     value={lead.fax} />
                    <KV label="Website" value={lead.website} blue={!!lead.website} />
                  </div>
                </SectionCard>

                {/* Lead Details */}
                <SectionCard icon={TrendUp} title="Lead Details">
                  <div className="grid grid-cols-2 gap-x-8">
                    <KV label="Lead Source"       value={lead.leadSource} />
                    <KV label="Lead Status"       value={currentStatus} />
                    <KV label="Rating"            value={lead.rating} />
                    <KV label="No. of Employees"  value={lead.noOfEmployees} />
                    <KV label="Annual Revenue"    value={lead.annualRevenue ? `₹${Number(lead.annualRevenue).toLocaleString("en-IN")}` : ""} />
                  </div>
                </SectionCard>
              </div>

              {/* Right 1/3 */}
              <div className="space-y-4">

                {/* Related List */}
                <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-[#EFF6FF]">
                    <p className="font-heading text-[11px] font-bold text-slate-500 uppercase tracking-wider">Related List</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {relatedItems.map(({ icon: Icon, label, count, color, tab }) => (
                      <button key={label}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#EFF6FF] group transition-colors`}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor:color+"20" }}>
                          <Icon size={14} color={color} weight="duotone" />
                        </div>
                        <span className="flex-1 text-left text-[12.5px] font-medium text-slate-700 group-hover:text-[#1D4ED8] transition-colors">{label}</span>
                        {count > 0 && (
                          <span className="text-[10px] font-bold bg-[#E3ECFC] text-[#1D4ED8] px-1.5 py-0.5 rounded-full">{count}</span>
                        )}
                        <CaretRight size={14} color="#CBD5E1" weight="duotone" className="group-hover:text-[#60A5FA] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lead Owner */}
                <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm p-4 space-y-3">
                  <p className="font-heading text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ownership</p>
                  <div className="flex items-center gap-2.5">
                    <Avatar src={OWNER_AVATARS[lead.owner]} sx={{ width:32, height:32, bgcolor:lead.ownerColor, fontSize:"0.62rem", fontWeight:800 }}>
                      {lead.ownerInitials}
                    </Avatar>
                    <div>
                      <p className="text-[12.5px] font-semibold text-slate-800">{lead.owner}</p>
                      <p className="text-[10.5px] text-slate-400">Lead Owner</p>
                    </div>
                  </div>
                  <Divider sx={{ borderColor:"#EFF6FF" }} />
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Created</span>
                      <span className="text-slate-700 font-semibold">{lead.created}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Modified</span>
                      <span className="text-slate-700 font-semibold">{lead.modified}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════ ACTIVITY ══════════════════════════ */}
          {activeTab === "activity" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white rounded-2xl border border-[#E3ECFC] shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#EFF6FF]">
                  <p className="font-heading text-[13px] font-bold text-slate-900">Activity Timeline</p>
                  <span className="text-[10.5px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{activityFeed.length} events</span>
                </div>
                <div className="px-5 py-4 space-y-0">
                  {activityFeed.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex gap-4 group">
                        {/* Timeline line + dot */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center z-10" style={{ backgroundColor:item.bg }}>
                            <Icon size={15} color={item.color} weight="duotone" />
                          </div>
                          {i < activityFeed.length-1 && <div className="w-px flex-1 bg-[#E3ECFC] my-1 min-h-[20px]" />}
                        </div>
                        {/* Content */}
                        <div className="flex-1 pb-4">
                          <p className="text-[12.5px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors mt-1">{item.text}</p>
                          <p className="text-[10.5px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock size={11} weight="duotone" />{item.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side: related list still visible */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-[#EFF6FF]">
                    <p className="font-heading text-[11px] font-bold text-slate-500 uppercase tracking-wider">Related List</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {relatedItems.map(({ icon: Icon, label, count, color, tab }) => (
                      <button key={label} onClick={() => setActiveTab(tab)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#EFF6FF] group transition-colors">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:color+"20" }}>
                          <Icon size={14} color={color} weight="duotone" />
                        </div>
                        <span className="flex-1 text-left text-[12.5px] font-medium text-slate-700 group-hover:text-[#1D4ED8]">{label}</span>
                        {count>0 && <span className="text-[10px] font-bold bg-[#E3ECFC] text-[#1D4ED8] px-1.5 py-0.5 rounded-full">{count}</span>}
                        <CaretRight size={14} color="#CBD5E1" weight="duotone" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════ NOTES ══════════════════════════ */}
          {activeTab === "notes" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-3">

                {/* Add note area */}
                {addingNote ? (
                  <div className="bg-white rounded-2xl border border-[#1D4ED8] shadow-sm p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar sx={{ width:28, height:28, bgcolor:"#1D4ED8", fontSize:"0.58rem", fontWeight:800 }}>PM</Avatar>
                      <p className="text-[12px] font-semibold text-slate-700">PM SDL · Just now</p>
                    </div>
                    <InputBase
                      multiline
                      minRows={3}
                      fullWidth
                      autoFocus
                      placeholder="Write a note about this lead…"
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      sx={{ fontSize:"0.82rem", color:"#334155", lineHeight:1.6, "& textarea::placeholder":{ color:"#CBD5E1" } }}
                    />
                    <div className="flex items-center gap-2 justify-end pt-1 border-t border-[#EFF6FF]">
                      <button onClick={() => { setAddingNote(false); setNewNoteText(""); }}
                        className="text-[12px] font-semibold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                        Cancel
                      </button>
                      <Button variant="contained" size="small" endIcon={<PaperPlaneTilt size={13} weight="duotone" />}
                        onClick={addNote} disabled={!newNoteText.trim()}
                        sx={{ bgcolor:"#1D4ED8", borderRadius:"8px", textTransform:"none", fontWeight:700, fontSize:"0.75rem", "&:hover":{ bgcolor:"#60A5FA" }, "&:active":{ bgcolor:"#0C2472" }, "&.Mui-disabled":{ bgcolor:"#E3ECFC", color:"#9CA3AF" } }}>
                        Add Note
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingNote(true)}
                    className="w-full flex items-center gap-3 bg-white border border-[#E3ECFC] hover:border-[#1D4ED8] rounded-2xl px-4 py-3.5 text-left shadow-sm group transition-all">
                    <Avatar sx={{ width:28, height:28, bgcolor:"#1D4ED8", fontSize:"0.58rem", fontWeight:800 }}>PM</Avatar>
                    <span className="text-[12.5px] text-slate-400 group-hover:text-slate-600 transition-colors">Write a note about this lead…</span>
                    <Plus size={16} color="#CBD5E1" weight="duotone" style={{ marginLeft:"auto" }} className="group-hover:text-[#1D4ED8]" />
                  </button>
                )}

                {/* Existing notes */}
                {notes.map(note => (
                  <div key={note.id} className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm p-4 group hover:border-[#E3ECFC] transition-all">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar sx={{ width:28, height:28, bgcolor:note.color, fontSize:"0.58rem", fontWeight:800 }}>
                          {note.initials}
                        </Avatar>
                        <div>
                          <p className="text-[12px] font-semibold text-slate-800">{note.author}</p>
                          <p className="text-[10px] text-slate-400">{note.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip title="Edit note">
                          <IconButton size="small" sx={{ borderRadius:"6px", p:0.5, "&:hover":{ bgcolor:"#EFF6FF" } }}>
                            <PencilSimple size={13} color="#94A3B8" weight="duotone" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete note">
                          <IconButton size="small"
                            onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                            sx={{ borderRadius:"6px", p:0.5, "&:hover":{ bgcolor:"#FEF2F2" } }}>
                            <Trash size={13} color="#94A3B8" weight="duotone" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed">{note.text}</p>
                  </div>
                ))}

                {notes.length === 0 && !addingNote && (
                  <div className="bg-white rounded-2xl border border-[#E3ECFC] p-10 text-center shadow-sm">
                    <Note size={28} color="#93C5FD" weight="duotone" style={{ marginBottom:4 }} />
                    <p className="text-slate-400 text-sm font-medium">No notes yet. Add one above.</p>
                  </div>
                )}
              </div>

              {/* Side: related */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-[#EFF6FF]">
                    <p className="font-heading text-[11px] font-bold text-slate-500 uppercase tracking-wider">Related List</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {relatedItems.map(({ icon: Icon, label, count, color, tab }) => (
                      <button key={label} onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#EFF6FF] group transition-colors ${tab==="notes"&&label==="Notes"?"bg-[#EFF6FF]":""}`}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:color+"20" }}>
                          <Icon size={14} color={color} weight="duotone" />
                        </div>
                        <span className="flex-1 text-left text-[12.5px] font-medium text-slate-700 group-hover:text-[#1D4ED8]">{label}</span>
                        {count>0 && <span className="text-[10px] font-bold bg-[#E3ECFC] text-[#1D4ED8] px-1.5 py-0.5 rounded-full">{count}</span>}
                        <CaretRight size={14} color="#CBD5E1" weight="duotone" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
