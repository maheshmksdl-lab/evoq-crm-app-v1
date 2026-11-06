"use client";
import { useState, useMemo } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import { X, Columns, MagnifyingGlass } from "@phosphor-icons/react";

// ── Column definitions grouped (from user spec) ──────────────────
export const COLUMN_GROUPS = [
  {
    group: "Name",
    cols: [
      { key: "leadName",   label: "Lead Name",   locked: true  },
      { key: "company",    label: "Company"                     },
      { key: "firstName",  label: "First Name"                  },
      { key: "lastName",   label: "Last Name"                   },
      { key: "title",      label: "Title"                       },
    ],
  },
  {
    group: "Contact Details",
    cols: [
      { key: "email",          label: "Email"           },
      { key: "phone",          label: "Phone"           },
      { key: "fax",            label: "Fax"             },
      { key: "mobile",         label: "Mobile"          },
      { key: "website",        label: "Website"         },
      { key: "skypeId",        label: "Skype ID"        },
      { key: "secondaryEmail", label: "Secondary Email" },
      { key: "twitter",        label: "Twitter"         },
    ],
  },
  {
    group: "Lead Information",
    cols: [
      { key: "leadSource",    label: "Lead Source"      },
      { key: "leadStatus",    label: "Lead Status"      },
      { key: "industry",      label: "Industry"         },
      { key: "noOfEmployees", label: "No of Employees"  },
      { key: "annualRevenue", label: "Annual Revenue"   },
      { key: "rating",        label: "Rating"           },
      { key: "emailOptOut",   label: "Email Opt out"    },
      { key: "description",   label: "Description"      },
    ],
  },
  {
    group: "Address",
    cols: [
      { key: "country",   label: "Country / Region"                                            },
      { key: "building",  label: "Flat / House No. / Building / Apartment Name"                },
      { key: "address1",  label: "Address Line 1"                                              },
      { key: "city",      label: "City"                                                        },
      { key: "state",     label: "State / Province"                                            },
      { key: "pincode",   label: "Pincode / Zip / Postal Code"                                 },
      { key: "latitude",  label: "Latitude"                                                    },
      { key: "longitude", label: "Longitude"                                                   },
    ],
  },
  {
    group: "System Fields",
    cols: [
      { key: "leadOwner",  label: "Lead Owner"  },
      { key: "createdBy",  label: "Created By"  },
      { key: "modifiedBy", label: "Modified By" },
      { key: "creation",   label: "Creation"    },
      { key: "modified",   label: "Modified"    },
      { key: "actions",    label: "Actions",    locked: true },
    ],
  },
] as const;

// Default columns visible in the table
export const DEFAULT_COLUMNS = new Set([
  "leadName", "company", "email", "mobile", "leadStatus", "leadOwner", "creation", "actions",
]);

const ALL_KEYS = COLUMN_GROUPS.flatMap(g => g.cols.map(c => c.key));
const TOTAL    = ALL_KEYS.length;

interface Props {
  open: boolean;
  onClose: () => void;
  selected: Set<string>;
  onChange: (cols: Set<string>) => void;
}

export default function ColumnsDrawer({ open, onClose, selected, onChange }: Props) {
  const [local, setLocal]   = useState<Set<string>>(new Set(selected));
  const [search, setSearch] = useState("");

  const toggle = (key: string, locked?: boolean) => {
    if (locked) return;
    setLocal(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleGroup = (keys: string[]) => {
    const unlocked = keys.filter(k => !(COLUMN_GROUPS.flatMap(g => g.cols as readonly { key: string; locked?: boolean }[])).find(c => c.key === k && c.locked));
    const allOn = unlocked.every(k => local.has(k));
    setLocal(prev => {
      const next = new Set(prev);
      unlocked.forEach(k => allOn ? next.delete(k) : next.add(k));
      return next;
    });
  };

  const selectAll  = () => setLocal(new Set(ALL_KEYS));
  const clearAll   = () => setLocal(new Set(COLUMN_GROUPS.flatMap(g => g.cols.filter(c => (c as { locked?: boolean }).locked).map(c => c.key))));
  const resetDefault = () => setLocal(new Set(DEFAULT_COLUMNS));

  const handleApply = () => { onChange(new Set(local)); onClose(); };

  const filtered = useMemo(() =>
    search ? COLUMN_GROUPS.map(g => ({
      ...g,
      cols: g.cols.filter(c => c.label.toLowerCase().includes(search.toLowerCase())),
    })).filter(g => g.cols.length > 0)
    : COLUMN_GROUPS,
  [search]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{ sx: { width: 420, display: "flex", flexDirection: "column", bgcolor: "var(--surface-subtle)", boxShadow: "-12px 0 48px rgba(12,36,114,0.12)" } }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-line flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center">
            <Columns size={18} color="var(--link)" weight="duotone" />
          </div>
          <div>
            <h2 className="font-heading text-[15px] font-bold text-slate-900 tracking-tight">Configure Columns</h2>
            <p className="text-[11px] text-slate-400">{local.size} of {TOTAL} columns selected</p>
          </div>
        </div>
        <Tooltip title="Close">
          <IconButton size="small" onClick={onClose}
            sx={{ borderRadius: "9px", border: "1px solid var(--line)", "&:hover": { bgcolor: "var(--surface)" } }}>
            <X size={17} color="var(--fg-3)" weight="duotone" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Search + Select All / Clear */}
      <div className="px-5 pt-4 pb-2 bg-card border-b border-line-soft flex-shrink-0 space-y-3">
        <div className="flex items-center gap-2 bg-surface border border-line rounded-xl px-3 py-1.5">
          <MagnifyingGlass size={14} color="#94A3B8" weight="duotone" />
          <InputBase
            placeholder="Search columns…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1, fontSize: "0.77rem", color: "var(--fg)", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
          />
          {search && <button onClick={() => setSearch("")} className="text-fg-3 hover:text-fg text-sm" aria-label="Clear search">✕</button>}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={selectAll}
            className="text-[11.5px] font-semibold text-link hover:text-ink px-2.5 py-1 rounded-lg hover:bg-surface transition-colors">
            Select All
          </button>
          <span className="text-slate-200">·</span>
          <button onClick={clearAll}
            className="text-[11.5px] font-semibold text-slate-400 hover:text-slate-600 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors">
            Clear
          </button>
          <span className="text-slate-200">·</span>
          <button onClick={resetDefault}
            className="text-[11.5px] font-semibold text-slate-400 hover:text-link px-2.5 py-1 rounded-lg hover:bg-surface transition-colors">
            Reset Default
          </button>
        </div>
      </div>

      {/* Column groups */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.map(({ group, cols }) => {
          const keys      = cols.map(c => c.key as string);
          const unlocked  = cols.filter(c => !(c as { locked?: boolean }).locked).map(c => c.key as string);
          const allOn     = unlocked.every(k => local.has(k));
          const someOn    = unlocked.some(k => local.has(k));

          return (
            <div key={group} className="bg-card rounded-2xl border border-line overflow-hidden shadow-sm">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(keys)}
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-surface hover:bg-tint transition-colors border-b border-line"
              >
                <Checkbox
                  checked={allOn}
                  indeterminate={!allOn && someOn}
                  size="small"
                  onClick={e => { e.stopPropagation(); toggleGroup(keys); }}
                  sx={{ p: 0.25, color: "#CBD5E1", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "var(--link)" } }}
                />
                <span className="font-heading text-[11px] font-bold text-link uppercase tracking-wider">{group}</span>
                <span className="ml-auto text-[11px] text-slate-400 font-medium">
                  {unlocked.filter(k => local.has(k)).length} / {unlocked.length}
                </span>
              </button>

              {/* Columns */}
              <div className="divide-y divide-line-soft">
                {cols.map(col => {
                  const locked = (col as { locked?: boolean }).locked;
                  const checked = local.has(col.key as string);
                  return (
                    <label
                      key={col.key}
                      className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                        locked ? "cursor-default" : "cursor-pointer hover:bg-surface/60"
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={locked}
                        size="small"
                        onChange={() => toggle(col.key as string, locked)}
                        sx={{ p: 0.25, color: "#CBD5E1", "&.Mui-checked": { color: "var(--link)" }, "&.Mui-disabled": { color: "#CBD5E1" } }}
                      />
                      <span className={`text-[12.5px] flex-1 truncate ${locked ? "text-slate-400" : "text-slate-700"}`}>
                        {col.label}
                      </span>
                      {locked && (
                        <span className="text-[10.5px] font-bold text-fg-3 uppercase tracking-wider">Locked</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">No columns match "{search}"</div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-card border-t border-line flex-shrink-0">
        <button onClick={onClose}
          className="text-[13px] font-semibold text-slate-400 hover:text-slate-600 px-3 py-2 rounded-xl hover:bg-surface transition-colors">
          Cancel
        </button>
        <Button variant="contained" size="small" startIcon={<Columns size={14} weight="duotone" />}
          onClick={handleApply}
          sx={{ bgcolor: "#1D4ED8", borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: "0.78rem", px: 2.5, py: 0.9, boxShadow: "0 2px 12px #1D4ED833", "&:hover": { bgcolor: "#1E40AF", boxShadow: "0 2px 14px #60A5FA55" }, "&:active": { bgcolor: "#0C2472" } }}>
          Apply Columns
        </Button>
      </div>
    </Drawer>
  );
}
