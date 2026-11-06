"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import {
  SquaresFour, Lightning, Handshake, AddressBook,
  Buildings, CheckCircle, ChatTeardropText, ChartBar, Gear,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

const navItems = [
  { label: "Dashboard",      Icon: SquaresFour,       href: "/"        },
  { label: "Leads",          Icon: Lightning,         href: "/leads"   },
  { label: "Deals",          Icon: Handshake,         href: "/deals"   },
  { label: "Contacts",       Icon: AddressBook,       href: "/contacts"},
  { label: "Accounts",       Icon: Buildings,         href: "/accounts"},
  { label: "Tasks",          Icon: CheckCircle,       href: "/tasks"   },
  { label: "Customer Comms", Icon: ChatTeardropText,  href: "/comms"   },
  { label: "Reports",        Icon: ChartBar,          href: "/reports" },
];

function NavBadge({ count }: { count: number }) {
  return (
    <span className="ml-auto text-[10px] font-bold bg-[#3B82F6]/20 text-[#93C5FD] px-1.5 py-0.5 rounded-full leading-none">
      {count}
    </span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[230px] bg-[#0C2472] flex flex-col z-50 select-none">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-5 py-[18px] border-b border-white/5">
        <div className="relative w-7 h-7 flex-shrink-0">
          <div className="absolute top-0 left-0 w-[14px] h-[14px] bg-[#3B82F6] rounded-[3px]" />
          <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-emerald-400 rounded-[3px]" />
        </div>
        <div className="leading-tight">
          <p className="font-heading text-white text-[13px] font-bold tracking-tight">Social DNA</p>
          <p className="font-heading text-slate-500 text-[10px] font-medium tracking-widest uppercase">Labs CRM</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium
                transition-all duration-150 group
                ${active
                  ? "text-[#1D4ED8]"           /* Active: Primary text — bg via style prop below */
                  : "text-[#D1D5DB] hover:text-[#E5E7EB]" /* Inactive: Gray-300 */
                }
              `}
              style={active
                ? { backgroundColor: "rgba(29,78,216,0.12)" }   /* Primary @ 12% opacity */
                : undefined
              }
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(96,165,250,0.08)"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ""; }}
            >
              <Icon
                size={17}
                weight="duotone"
                className={active ? "text-[#1D4ED8]" : "text-[#D1D5DB] group-hover:text-[#E5E7EB] transition-colors"}
              />
              <span className="flex-1 truncate">{label}</span>
              {label === "Leads" && !active && <NavBadge count={14} />}
              {label === "Tasks" && !active && <NavBadge count={7} />}
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium text-[#D1D5DB] hover:bg-[#60A5FA]/8 hover:text-[#E5E7EB] transition-all duration-150"
        >
          <Gear size={17} weight="duotone" className="text-slate-500" />
          Settings
        </Link>

        {/* User profile */}
        <div className="flex items-center gap-2.5 mt-2 px-2 py-2 rounded-xl bg-white/[0.04] border border-white/5">
          <Avatar
            src={OWNER_AVATARS["PM SDL"]}
            sx={{ width: 32, height: 32, bgcolor: "#1D4ED8", fontSize: "0.6rem", fontWeight: 800 }}
          >
            PM
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-slate-200 truncate">PM SDL</p>
            <p className="text-[10px] text-slate-500 truncate">Admin · dmops@socialdnalabs.com</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 ring-2 ring-[#0C2472]" />
        </div>
      </div>
    </aside>
  );
}
