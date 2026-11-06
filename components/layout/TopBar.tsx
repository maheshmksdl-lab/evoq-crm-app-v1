"use client";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import { MagnifyingGlass, Bell, Plus, Command } from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function TopBar({ title }: { title?: string }) {
  const [search, setSearch] = useState("");

  // Formatted manually: toLocaleDateString output differs between Node's ICU
  // and the browser's, which caused a hydration mismatch.
  const now = new Date();
  const today = `${WEEKDAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-slate-100 px-6 h-[60px] flex items-center gap-4">
      {/* Left */}
      <div className="flex-1">
        {title ? (
          <div className="flex items-baseline gap-2">
            <h1 className="text-[15px] font-bold text-slate-900">{title}</h1>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block">· {today}</span>
          </div>
        ) : (
          <p className="text-[12px] text-slate-400 font-medium hidden sm:block">{today}</p>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-surface border border-line rounded-xl px-3 py-1.5 w-60 group focus-within:border-[#1D4ED8] focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
        <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
        <InputBase
          placeholder="Search leads, deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            fontSize: "0.78rem",
            color: "var(--fg)",
            "& input::placeholder": { color: "#94A3B8", opacity: 1 },
          }}
        />
        <Tooltip title="⌘K">
          <Command size={13} color="var(--fg-3)" weight="duotone" />
        </Tooltip>
      </div>

      {/* New Deal */}
      <Button
        variant="contained"
        size="small"
        startIcon={<Plus size={16} weight="duotone" />}
        sx={{
          bgcolor: "#1D4ED8",
          borderRadius: "9px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.78rem",
          px: 2,
          py: 0.9,
          boxShadow: "0 1px 8px 0 #1D4ED833",
          "&:hover":  { bgcolor: "#1E40AF", boxShadow: "0 2px 14px 0 #1D4ED844" },
          "&:active": { bgcolor: "#0C2472" },
        }}
      >
        New Deal
      </Button>

      {/* Notifications */}
      <Tooltip title="3 unread notifications">
        <IconButton size="small" sx={{ borderRadius: "8px", "&:hover": { bgcolor: "var(--surface-subtle)" } }}>
          <Badge
            badgeContent={3}
            color="error"
            sx={{ "& .MuiBadge-badge": { fontSize: "0.58rem", height: 15, minWidth: 15, padding: "0 3px" } }}
          >
            <Bell size={20} color="var(--fg-3)" weight="duotone" />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Avatar */}
      <Tooltip title="PM SDL — Admin">
        <Avatar
          src={OWNER_AVATARS["PM SDL"]}
          sx={{ width: 32, height: 32, bgcolor: "#1D4ED8", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer", "&:hover": { ring: 2 } }}
          className="ring-2 ring-transparent hover:ring-[#93C5FD] transition-all"
        >
          PM
        </Avatar>
      </Tooltip>
    </header>
  );
}
