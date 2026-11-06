"use client";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Buildings, User, TrendUp, DotsThreeVertical } from "@phosphor-icons/react";

type DealStage = "Qualification" | "Needs Analysis" | "Value Proposition" |
  "Identify Decision Makers" | "Proposal/Price Quote" | "Negotiation/Review" |
  "Closed Won" | "Closed Lost";

interface Deal {
  id: number; name: string; amount: number; account: string; stage: DealStage;
  probability: number; contactName: string; owner: string; ownerInitials: string;
  creation: string;
}

const STAGE_CFG: Record<DealStage, { bg: string; text: string; dot: string }> = {
  "Qualification":            { bg: "#EFF6FF", text: "#0C2472", dot: "#1D4ED8" },
  "Needs Analysis":           { bg: "#E3ECFC", text: "#1D4ED8", dot: "#3B82F6" },
  "Value Proposition":        { bg: "#E3ECFC", text: "#0C2472", dot: "#60A5FA" },
  "Identify Decision Makers": { bg: "#E3ECFC", text: "#1D4ED8", dot: "#0C2472" },
  "Proposal/Price Quote":     { bg: "#EFF6FF", text: "#0C2472", dot: "#0C2472" },
  "Negotiation/Review":       { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  "Closed Won":               { bg: "#DCFCE7", text: "#166534", dot: "#10B981" },
  "Closed Lost":              { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
};

const AVATAR_PAL = ["#0C2472", "#1D4ED8", "#3B82F6", "#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];
const initials    = (n: string) => { const p = n.trim().split(/\s+/); return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : n.substring(0, 2).toUpperCase(); };
const fmt         = (n: number) => n === 0 ? "₹0" : `₹${n.toLocaleString("en-IN")}`;

interface Props { deals: Deal[] }

export default function DealGridView({ deals }: Props) {
  const router = useRouter();

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="font-heading text-sm font-semibold">No deals found</p>
        <p className="text-xs mt-1">Adjust filters or create a new deal</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {deals.map(deal => {
        const cfg    = STAGE_CFG[deal.stage] ?? STAGE_CFG["Qualification"];
        const owCol  = avatarColor(deal.owner);
        const owInit = initials(deal.ownerInitials);

        return (
          <div
            key={deal.id}
            onClick={() => router.push(`/deals/${deal.id}`)}
            className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden"
          >
            {/* Stage top accent */}
            <div className="h-[3px] w-full" style={{ backgroundColor: cfg.dot }} />

            <div className="p-4">
              {/* Deal name + menu */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-heading text-[13.5px] font-bold text-slate-900 truncate group-hover:text-[#1D4ED8] transition-colors leading-tight flex-1">
                  {deal.name}
                </h3>
                <button onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[#EFF6FF]">
                  <DotsThreeVertical size={15} color="#94A3B8" weight="duotone" />
                </button>
              </div>

              {/* Amount — prominent */}
              <p className="font-heading text-[22px] font-extrabold text-[#0C2472] tracking-tight mb-3">
                {fmt(deal.amount)}
              </p>

              {/* Stage + Probability */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cfg.bg, color: cfg.text }}
                >
                  <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: cfg.dot }} />
                  {deal.stage}
                </span>
                {deal.probability > 0 && (
                  <span className="text-[10.5px] font-semibold text-slate-400">{deal.probability}%</span>
                )}
              </div>

              {/* Probability bar */}
              <div className="w-full h-1 bg-[#E3ECFC] rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${deal.probability}%`, backgroundColor: cfg.dot }}
                />
              </div>

              {/* Account + Contact */}
              <div className="space-y-1.5">
                {deal.account && (
                  <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                    <Buildings size={11} color="#93C5FD" weight="duotone" className="flex-shrink-0" />
                    <span className="truncate">{deal.account}</span>
                  </div>
                )}
                {deal.contactName && (
                  <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                    <User size={11} color="#93C5FD" weight="duotone" className="flex-shrink-0" />
                    <span className="truncate">{deal.contactName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#EFF6FF] bg-[#EFF6FF]/50">
              <Tooltip title={deal.owner}>
                <div className="flex items-center gap-1.5">
                  <Avatar sx={{ width: 20, height: 20, bgcolor: owCol, fontSize: "0.48rem", fontWeight: 800 }}>{owInit}</Avatar>
                  <span className="text-[10.5px] text-slate-400 font-medium">{deal.owner}</span>
                </div>
              </Tooltip>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <TrendUp size={10} color="#93C5FD" weight="duotone" />
                {deal.creation}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
