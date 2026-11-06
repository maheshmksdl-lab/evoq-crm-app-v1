"use client";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Buildings, Phone, Globe, DotsThreeVertical } from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

interface Account {
  id: number; name: string; ownerName: string; ownerInitials: string;
  phone: string; accountType: string; website?: string; creation: string;
}

const TYPE_CFG: Record<string, { bg: string; text: string }> = {
  "Individual": { bg: "#EFF6FF", text: "#0C2472" },
  "Customer":   { bg: "#DCFCE7", text: "#166534" },
  "Partner":    { bg: "#E3ECFC", text: "#1D4ED8" },
  "Prospect":   { bg: "#FEF3C7", text: "#92400E" },
  "Vendor":     { bg: "#E3ECFC", text: "#0C2472" },
};

const AVATAR_PAL = ["#0C2472", "#1D4ED8", "#3B82F6", "#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];
const initials    = (n: string) => n.substring(0, 2).toUpperCase();

interface Props { accounts: Account[] }

export default function AccountGridView({ accounts }: Props) {
  const router = useRouter();

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="font-heading text-sm font-semibold">No accounts found</p>
        <p className="text-xs mt-1">Adjust filters or add a new account</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {accounts.map(acc => {
        const avCol  = avatarColor(acc.name);
        const owCol  = avatarColor(acc.ownerName);
        const typeCfg = TYPE_CFG[acc.accountType] || { bg: "#F1F5F9", text: "#475569" };

        return (
          <div key={acc.id}
            onClick={() => router.push(`/accounts/${acc.id}`)}
            className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden">

            {/* Top accent */}
            <div className="h-[3px] w-full bg-[#1D4ED8]" />

            <div className="p-4">
              {/* Icon + Name + Menu */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-extrabold text-[13px] shadow-sm"
                  style={{ backgroundColor: avCol }}>
                  {initials(acc.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-[13.5px] font-bold text-slate-900 truncate group-hover:text-[#1D4ED8] transition-colors">
                    {acc.name}
                  </p>
                  {acc.accountType && (
                    <span className="inline-flex items-center text-[10.5px] font-bold px-2 py-0.5 rounded-full mt-1"
                      style={{ backgroundColor: typeCfg.bg, color: typeCfg.text }}>
                      {acc.accountType}
                    </span>
                  )}
                </div>
                <button onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[#EFF6FF]">
                  <DotsThreeVertical size={15} color="#94A3B8" weight="duotone" />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                {acc.phone && (
                  <div className="flex items-center gap-2 text-[11.5px] text-slate-500 font-mono">
                    <Phone size={11} color="#93C5FD" weight="duotone" className="flex-shrink-0" />
                    <span>{acc.phone}</span>
                  </div>
                )}
                {acc.website && (
                  <div className="flex items-center gap-2 text-[11.5px] text-[#3B82F6] truncate">
                    <Globe size={11} color="#93C5FD" weight="duotone" className="flex-shrink-0" />
                    <span className="truncate">{acc.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#EFF6FF] bg-[#EFF6FF]/50">
              <Tooltip title={acc.ownerName}>
                <div className="flex items-center gap-1.5">
                  <Avatar src={OWNER_AVATARS[acc.ownerName]} sx={{ width: 20, height: 20, bgcolor: owCol, fontSize: "0.48rem", fontWeight: 800 }}>
                    {acc.ownerInitials}
                  </Avatar>
                  <span className="text-[10.5px] text-slate-400 font-medium">{acc.ownerName}</span>
                </div>
              </Tooltip>
              <span className="text-[10px] text-slate-300">{acc.creation.split(",")[0]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
