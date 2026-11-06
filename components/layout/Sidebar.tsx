"use client";
import Link from "next/link";
import Image from "next/image";
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
    <span className="ml-auto text-[11px] font-bold bg-[#3B82F6]/20 text-[#93C5FD] px-1.5 py-0.5 rounded-full leading-none">
      {count}
    </span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[230px] bg-[#0C2472] flex flex-col z-50 select-none">
      {/* ── Logo ── */}
      {/* The logo's wordmark is black, so it sits on a white panel to stay readable on the navy sidebar. */}
      <div className="px-4 py-[14px] border-b border-white/5">
        <Link href="/" aria-label="EVOQ CRM home" className="flex items-center bg-white rounded-lg px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
          <Image
            src="/evoq-crm-logo.png"
            alt="EVOQ CRM"
            width={238}
            height={55}
            priority
            className="h-7 w-auto"
          />
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, Icon, href }) => {
          const active = pathname === href;
          return (
            // The sidebar is navy in both colour schemes, so it uses fixed colours (not theme tokens).
            // Active item: white text on a lifted fill with an accent bar — readable at a glance.
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`
                relative flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px]
                transition-colors duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]
                ${active
                  ? "bg-white/[0.12] text-white font-semibold"
                  : "text-[#CBD5E1] font-medium hover:bg-white/[0.06] hover:text-white"
                }
              `}
            >
              {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#60A5FA]" />}
              <Icon
                size={17}
                weight={active ? "fill" : "duotone"}
                className={active ? "text-[#93C5FD]" : "text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors"}
              />
              <span className="flex-1 truncate">{label}</span>
              {label === "Leads" && !active && <NavBadge count={14} />}
              {label === "Tasks" && !active && <NavBadge count={7} />}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium text-[#CBD5E1] hover:bg-white/[0.06] hover:text-white transition-colors duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
        >
          <Gear size={17} weight="duotone" className="text-[#94A3B8] group-hover:text-[#CBD5E1]" />
          Settings
        </Link>

        {/* User profile */}
        <div className="flex items-center gap-2.5 mt-2 px-2 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]">
          <Avatar
            src={OWNER_AVATARS["PM SDL"]}
            sx={{ width: 32, height: 32, bgcolor: "#1D4ED8", fontSize: "0.6rem", fontWeight: 800 }}
          >
            PM
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-white truncate">PM SDL</p>
            <p className="text-[10.5px] text-[#94A3B8] truncate">Admin · dmops@socialdnalabs.com</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 ring-2 ring-[#0C2472]" />
        </div>
      </div>
    </aside>
  );
}
