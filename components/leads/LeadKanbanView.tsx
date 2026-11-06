"use client";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Plus, Phone, Envelope, Buildings, DotsThreeVertical } from "@phosphor-icons/react";
import { LEAD_AVATARS, OWNER_AVATARS } from "@/lib/avatars";

type LeadStatus = "New" | "Contacted" | "In Progress" | "Qualified" | "Lost" | "Unqualified";

interface Lead {
  id: number; name: string; company: string; email: string; mobile: string;
  status: LeadStatus; owner: string; ownerInitials: string;
}

const STATUSES: { key: LeadStatus; label: string; color: string; bg: string; dot: string; headerBg: string }[] = [
  { key: "New",         label: "New",          color: "#0C2472", bg: "#EFF6FF", dot: "#1D4ED8", headerBg: "#0C2472" },
  { key: "Contacted",   label: "Contacted",    color: "#1D4ED8", bg: "#E3ECFC", dot: "#3B82F6", headerBg: "#1D4ED8" },
  { key: "In Progress", label: "In Progress",  color: "#0C2472", bg: "#E3ECFC", dot: "#60A5FA", headerBg: "#3B82F6" },
  { key: "Qualified",   label: "Qualified",    color: "#166534", bg: "#DCFCE7", dot: "#16A34A", headerBg: "#16A34A" },
  { key: "Lost",        label: "Lost",         color: "#991B1B", bg: "#FEF2F2", dot: "#EF4444", headerBg: "#EF4444" },
  { key: "Unqualified", label: "Unqualified",  color: "#475569", bg: "#F1F5F9", dot: "#94A3B8", headerBg: "#64748B" },
];

const AVATAR_PAL = ["#0C2472", "#1D4ED8", "#3B82F6", "#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];
const initials    = (n: string) => { const p = n.trim().split(/\s+/); return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : n.substring(0, 2).toUpperCase(); };

interface Props { leads: Lead[] }

export default function LeadKanbanView({ leads }: Props) {
  const router = useRouter();
  const byStatus = Object.fromEntries(STATUSES.map(s => [s.key, leads.filter(l => l.status === s.key)]));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-280px)]" style={{ scrollbarWidth: "thin" }}>
      {STATUSES.map(col => {
        const colLeads = byStatus[col.key] || [];

        return (
          <div key={col.key} className="flex-shrink-0 w-[240px] flex flex-col">
            {/* Column header */}
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 text-white"
              style={{ backgroundColor: col.headerBg }}
            >
              <div className="flex items-center gap-2">
                <span className="font-heading text-[12px] font-bold">{col.label}</span>
                <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full leading-none">
                  {colLeads.length}
                </span>
              </div>
              <Tooltip title={`Add lead to ${col.label}`}>
                <button
                  onClick={e => e.stopPropagation()}
                  className="w-6 h-6 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <Plus size={13} color="white" weight="duotone" />
                </button>
              </Tooltip>
            </div>

            {/* Lead cards */}
            <div className="flex-1 space-y-2.5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
              {colLeads.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed text-slate-300 text-[11px] text-center"
                  style={{ borderColor: col.dot + "60" }}
                >
                  <Plus size={20} color={col.dot} weight="duotone" className="mb-1 opacity-40" />
                  No {col.label.toLowerCase()} leads
                </div>
              ) : colLeads.map(lead => {
                const avCol  = avatarColor(lead.name);
                const avInit = initials(lead.name);
                const owCol  = avatarColor(lead.owner);

                return (
                  <div
                    key={lead.id}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className="bg-white rounded-xl border border-[#E3ECFC] p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#60A5FA] transition-all cursor-pointer group"
                  >
                    {/* Lead header */}
                    <div className="flex items-start gap-2 mb-2">
                      <Avatar
                        src={LEAD_AVATARS[lead.id]}
                        sx={{ width: 32, height: 32, bgcolor: avCol, fontSize: "0.62rem", fontWeight: 800, flexShrink: 0 }}
                      >
                        {avInit}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-[12px] font-bold text-slate-800 truncate group-hover:text-[#1D4ED8] transition-colors leading-tight">
                          {lead.name}
                        </p>
                        {lead.company && (
                          <p className="text-[10.5px] text-slate-400 truncate flex items-center gap-0.5 mt-0.5">
                            <Buildings size={10} color="#CBD5E1" weight="duotone" />
                            {lead.company}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-[#EFF6FF]"
                      >
                        <DotsThreeVertical size={13} color="#94A3B8" weight="duotone" />
                      </button>
                    </div>

                    {/* Contact */}
                    <div className="space-y-1 mb-2.5">
                      {lead.email && (
                        <div className="flex items-center gap-1.5 text-[10.5px] text-[#3B82F6] truncate">
                          <Envelope size={10} color="#93C5FD" weight="duotone" className="flex-shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.mobile && (
                        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 font-mono">
                          <Phone size={10} color="#93C5FD" weight="duotone" className="flex-shrink-0" />
                          <span>{lead.mobile}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#EFF6FF]">
                      <Tooltip title={lead.owner}>
                        <Avatar src={OWNER_AVATARS[lead.owner]} sx={{ width: 16, height: 16, bgcolor: owCol, fontSize: "0.45rem", fontWeight: 800 }}>
                          {lead.ownerInitials}
                        </Avatar>
                      </Tooltip>
                      <span className="text-[10px] text-slate-400 truncate">{lead.owner}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column footer — add lead */}
            <button
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 mt-3 px-2 py-2 rounded-xl border border-dashed text-[11.5px] font-medium w-full transition-all"
              style={{ borderColor: col.dot + "60", color: col.color + "99" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = col.bg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              <Plus size={13} weight="duotone" />
              Add lead
            </button>
          </div>
        );
      })}
    </div>
  );
}
