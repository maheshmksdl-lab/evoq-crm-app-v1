"use client";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import {
  X, ArrowsLeftRight, Buildings, User,
  Handshake, CheckCircle, Bell,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
const SALUTATIONS = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];

const stripSalutation = (name: string) => {
  for (const s of SALUTATIONS) {
    if (name.startsWith(s + " ")) return name.slice(s.length + 1).trim();
  }
  return name.trim();
};

const getLastName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] || name;
};

const DEAL_STAGES = [
  "Qualification",
  "Needs Analysis",
  "Value Proposition",
  "Identify Decision Makers",
  "Proposal/Price Quote",
  "Negotiation/Review",
  "Closed Won",
];

// ─────────────────────────────────────────────
//  Shared input styling (brand palette)
// ─────────────────────────────────────────────
const FX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#EFF6FF",           // Surface
    fontSize: "0.82rem",
    "& fieldset": { borderColor: "#E3ECFC", borderWidth: 1.5 },
    "&:hover fieldset": { borderColor: "#60A5FA" },
    "&.Mui-focused fieldset": { borderColor: "#1D4ED8", borderWidth: 2 },
    "&.Mui-focused": { boxShadow: "0 0 0 2px #93C5FD" },
    "& input": { padding: "10px 14px" },
  },
  "& .MuiInputLabel-root":          { fontSize: "0.79rem", color: "#6B7280" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1D4ED8" },
  "& .MuiSelect-select":            { fontSize: "0.82rem", padding: "10px 14px", backgroundColor: "#EFF6FF" },
};

const CHECKBOX_SX = {
  p: 0.5,
  color: "#CBD5E1",
  "&.Mui-checked": { color: "#1D4ED8" },
  flexShrink: 0,
};

// ─────────────────────────────────────────────
//  Section card with toggle checkbox
// ─────────────────────────────────────────────
function SectionToggle({
  checked, onToggle, icon: Icon, iconColor, title, children,
}: {
  checked: boolean;
  onToggle: (v: boolean) => void;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
      <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#EFF6FF]/60 transition-colors select-none">
        <Checkbox
          checked={checked}
          onChange={e => onToggle(e.target.checked)}
          size="small"
          sx={CHECKBOX_SX}
        />
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconColor + "18" }}
          >
            <Icon size={15} color={iconColor} weight="duotone" />
          </div>
          <span className="font-heading text-[13px] font-bold text-slate-800 truncate">{title}</span>
        </div>
      </label>

      {checked && children && (
        <div className="px-4 pb-4 pt-2 border-t border-[#EFF6FF]">
          {children}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Props
// ─────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  leadName: string;
  leadCompany: string;
  leadOwner: string;
  leadOwnerInitials: string;
  leadOwnerColor: string;
  leadAvatarColor: string;
  leadInitials: string;
}

// ─────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────
export default function ConvertToDealDrawer({
  open, onClose, leadName, leadCompany,
  leadOwner, leadOwnerInitials, leadOwnerColor,
}: Props) {
  const shortName = stripSalutation(leadName);
  const lastName  = getLastName(shortName);

  // Only Deal has a toggle checkbox — Account and Contact are always created
  const [createDeal,  setCreateDeal]  = useState(false);
  const [notifyOwner, setNotifyOwner] = useState(false);

  // Field values
  const [accountName,   setAccountName]   = useState(leadCompany || shortName);
  const [contactName,   setContactName]   = useState(shortName);
  const [dealName,      setDealName]      = useState(lastName);
  const [dealAmount,    setDealAmount]    = useState("0");
  const [dealCloseDate, setDealCloseDate] = useState("");
  const [dealStage,     setDealStage]     = useState("Qualification");

  const [converted, setConverted] = useState(false);

  // Account and Contact are always created; Deal requires fields if toggled
  const canConvert = !createDeal || (dealName.trim() && !!dealCloseDate);

  const handleConvert = () => setConverted(true);
  const handleClose   = () => { setConverted(false); onClose(); };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 520 },
          display: "flex",
          flexDirection: "column",
          bgcolor: "#F8FAFF",
          boxShadow: "-12px 0 48px rgba(12,36,114,0.12)",
        },
      }}
    >
      {/* ══ Header ══ */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E3ECFC] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <ArrowsLeftRight size={18} color="#1D4ED8" weight="duotone" />
          </div>
          <div>
            <h2 className="font-heading text-[15px] font-bold text-slate-900 tracking-tight">
              Convert Lead
            </h2>
            <p className="text-[11.5px] text-slate-400 font-medium">
              ({shortName}{leadCompany ? ` – ${leadCompany}` : ""})
            </p>
          </div>
        </div>
        <Tooltip title="Close">
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ borderRadius: "9px", border: "1.5px solid #E3ECFC", "&:hover": { bgcolor: "#EFF6FF" } }}
          >
            <X size={17} color="#64748B" weight="duotone" />
          </IconButton>
        </Tooltip>
      </div>

      {/* ══ Body ══ */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">

        {!converted ? (
          <>
            {/* ── Create New Account (always created, no checkbox) ── */}
            <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#EFF6FF]">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF6FF]">
                  <Buildings size={15} color="#1D4ED8" weight="duotone" />
                </div>
                <span className="font-heading text-[13px] font-bold text-slate-800">Create New Account</span>
              </div>
              <div className="px-4 py-3">
                <TextField
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Account name"
                  sx={FX}
                />
              </div>
            </div>

            {/* ── Create New Contact (always created, no checkbox) ── */}
            <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#EFF6FF]">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF6FF]">
                  <User size={15} color="#1D4ED8" weight="duotone" />
                </div>
                <span className="font-heading text-[13px] font-bold text-slate-800">Create New Contact</span>
              </div>
              <div className="px-4 py-3">
                <TextField
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Contact name"
                  sx={FX}
                />
              </div>
            </div>

            {/* ── Create a new Deal ── */}
            <SectionToggle
              checked={createDeal}
              onToggle={setCreateDeal}
              icon={Handshake}
              iconColor="#1D4ED8"
              title="Create a new Deal for this Account"
            >
              <div className="space-y-3">
                {/* Deal Name + Amount */}
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Deal Name *"
                    value={dealName}
                    onChange={e => setDealName(e.target.value)}
                    size="small"
                    fullWidth
                    sx={FX}
                  />
                  <TextField
                    label="Amount *"
                    value={dealAmount}
                    onChange={e => setDealAmount(e.target.value)}
                    size="small"
                    fullWidth
                    sx={FX}
                    InputProps={{
                      startAdornment: (
                        <span className="text-slate-400 text-sm mr-1 font-medium">₹</span>
                      ),
                    }}
                  />
                </div>

                {/* Closing Date + Stage */}
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Closing Date *"
                    type="date"
                    value={dealCloseDate}
                    onChange={e => setDealCloseDate(e.target.value)}
                    size="small"
                    fullWidth
                    sx={FX}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl size="small" fullWidth sx={FX}>
                    <InputLabel>Stage *</InputLabel>
                    <Select
                      label="Stage *"
                      value={dealStage}
                      onChange={e => setDealStage(e.target.value)}
                    >
                      {DEAL_STAGES.map(s => (
                        <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem" }}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </SectionToggle>

            {/* ── Owner of the New Records ── */}
            <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm p-4">
              <p className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-widest mb-3">
                Owner of the New Records
              </p>
              <div className="flex items-center gap-3">
                <Avatar
                  src={OWNER_AVATARS[leadOwner]}
                  sx={{
                    width: 36, height: 36, bgcolor: leadOwnerColor,
                    fontSize: "0.65rem", fontWeight: 800,
                  }}
                >
                  {leadOwnerInitials}
                </Avatar>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{leadOwner}</p>
                  <p className="text-[11px] text-slate-400">Record Owner</p>
                </div>
              </div>
            </div>

            {/* ── Notify record owner ── */}
            <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#EFF6FF]/60 transition-colors select-none">
                <Checkbox
                  checked={notifyOwner}
                  onChange={e => setNotifyOwner(e.target.checked)}
                  size="small"
                  sx={CHECKBOX_SX}
                />
                <Bell size={15} color="#3B82F6" weight="duotone" className="flex-shrink-0" />
                <span className="text-[13px] font-medium text-slate-700">
                  Notify record owner (Account and Contact).
                </span>
              </label>
            </div>
          </>
        ) : (
          /* ── Success state ── */
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle size={38} color="#10B981" weight="duotone" />
            </div>
            <h3 className="font-heading text-[18px] font-extrabold text-slate-900 mb-2 tracking-tight">
              Lead Converted!
            </h3>
            <p className="text-[12.5px] text-slate-500 mb-4">
              <span className="font-semibold text-slate-700">{shortName}</span> has been successfully converted.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {/* Account and Contact are always created */}
              <span className="text-[11px] bg-[#EFF6FF] text-[#1D4ED8] font-semibold px-3 py-1 rounded-full border border-[#E3ECFC]">
                ✓ Account created
              </span>
              <span className="text-[11px] bg-[#EFF6FF] text-[#1D4ED8] font-semibold px-3 py-1 rounded-full border border-[#E3ECFC]">
                ✓ Contact created
              </span>
              {createDeal && (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-3 py-1 rounded-full border border-emerald-100">
                  ✓ Deal created
                </span>
              )}
            </div>
            <Button
              variant="contained"
              size="small"
              onClick={handleClose}
              sx={{
                mt: 4,
                bgcolor: "#1D4ED8",
                borderRadius: "9px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.78rem",
                px: 4,
                "&:hover":  { bgcolor: "#60A5FA" },
                "&:active": { bgcolor: "#0C2472" },
              }}
            >
              Done
            </Button>
          </div>
        )}
      </div>

      {/* ══ Footer ══ */}
      {!converted && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#E3ECFC] flex-shrink-0">
          <Button
            variant="outlined"
            size="small"
            onClick={handleClose}
            sx={{
              borderColor: "#E3ECFC",
              color: "#475569",
              borderRadius: "9px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.78rem",
              px: 2.5,
              "&:hover": { borderColor: "#60A5FA", color: "#1D4ED8", bgcolor: "#EFF6FF" },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={handleConvert}
            disabled={!canConvert}
            sx={{
              bgcolor: "#059669",
              borderRadius: "9px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.78rem",
              px: 3,
              py: 0.9,
              boxShadow: "0 2px 12px rgba(5,150,105,0.25)",
              "&:hover":  { bgcolor: "#047857", boxShadow: "0 4px 16px rgba(5,150,105,0.35)" },
              "&:active": { bgcolor: "#065F46" },
              "&.Mui-disabled": { bgcolor: "#E3ECFC", color: "#9CA3AF", boxShadow: "none" },
            }}
          >
            Convert
          </Button>
        </div>
      )}
    </Drawer>
  );
}
