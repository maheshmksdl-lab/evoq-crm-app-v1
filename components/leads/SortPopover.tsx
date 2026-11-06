"use client";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { ArrowUp, ArrowDown, Plus, Trash, SortAscending } from "@phosphor-icons/react";

export interface SortRow {
  id: string;
  column: string;
  dir: "asc" | "desc";
}

const SORT_COLUMNS = [
  { value: "name",          label: "Lead Name"      },
  { value: "company",       label: "Company"         },
  { value: "email",         label: "Email"           },
  { value: "leadStatus",    label: "Lead Status"     },
  { value: "leadSource",    label: "Lead Source"     },
  { value: "industry",      label: "Industry"        },
  { value: "rating",        label: "Rating"          },
  { value: "leadOwner",     label: "Lead Owner"      },
  { value: "creation",      label: "Created Date"    },
  { value: "modified",      label: "Modified Date"   },
  { value: "annualRevenue", label: "Annual Revenue"  },
];

const SELECT_SX = {
  fontSize: "0.78rem", bgcolor: "#EFF6FF", borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E3ECFC", borderWidth: 1.5 },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60A5FA" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1D4ED8", borderWidth: 2 },
  "&.Mui-focused": { boxShadow: "0 0 0 2px #93C5FD" },
  "& .MuiSelect-select": { py: "6px", px: "10px" },
};

const uid = () => Math.random().toString(36).slice(2, 8);

interface Props {
  anchor: HTMLElement | null;
  onClose: () => void;
  sorts: SortRow[];
  onChange: (sorts: SortRow[]) => void;
}

export default function SortPopover({ anchor, onClose, sorts, onChange }: Props) {
  const [local, setLocal] = useState<SortRow[]>(
    sorts.length ? sorts : [{ id: uid(), column: "name", dir: "asc" }]
  );

  const update = (id: string, patch: Partial<SortRow>) =>
    setLocal(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));

  const add = () => setLocal(prev => [...prev, { id: uid(), column: "creation", dir: "desc" }]);
  const remove = (id: string) => setLocal(prev => prev.filter(r => r.id !== id));

  const handleApply = () => { onChange(local); onClose(); };
  const handleClear = () => { setLocal([{ id: uid(), column: "name", dir: "asc" }]); onChange([]); onClose(); };

  return (
    <Popover
      open={Boolean(anchor)} anchorEl={anchor} onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ sx: { borderRadius: "14px", border: "1.5px solid #E3ECFC", boxShadow: "0 8px 32px rgba(12,36,114,0.14)", mt: 0.5, overflow: "hidden" } }}
    >
      <div className="w-[380px]">
        {/* Popover header */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#EFF6FF] border-b border-[#E3ECFC]">
          <SortAscending size={16} color="#1D4ED8" weight="duotone" />
          <p className="font-heading text-[12.5px] font-bold text-slate-800">Sort Records</p>
          <span className="ml-auto text-[11px] text-slate-400">{local.length} sort{local.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Sort rows */}
        <div className="p-3 space-y-2">
          {local.map((row, idx) => (
            <div key={row.id} className="flex items-center gap-2">
              {/* Priority label */}
              <span className="font-heading text-[10px] font-bold text-slate-400 uppercase tracking-wider w-10 flex-shrink-0">
                {idx === 0 ? "By" : "Then"}
              </span>

              {/* Column */}
              <FormControl size="small" sx={{ flex: 1 }}>
                <Select value={row.column} onChange={e => update(row.id, { column: e.target.value })} sx={SELECT_SX}>
                  {SORT_COLUMNS.map(c => (
                    <MenuItem key={c.value} value={c.value} sx={{ fontSize: "0.77rem" }}>{c.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Direction toggle */}
              <div className="flex items-center bg-[#EFF6FF] rounded-lg border border-[#E3ECFC] p-0.5 gap-0.5">
                {(["asc", "desc"] as const).map(dir => (
                  <Tooltip key={dir} title={dir === "asc" ? "Ascending A→Z / 0→9" : "Descending Z→A / 9→0"}>
                    <button
                      onClick={() => update(row.id, { dir })}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        row.dir === dir ? "bg-[#1D4ED8] text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                      }`}>
                      {dir === "asc"
                        ? <ArrowUp size={12} weight="duotone" />
                        : <ArrowDown size={12} weight="duotone" />
                      }
                      {dir === "asc" ? "Asc" : "Desc"}
                    </button>
                  </Tooltip>
                ))}
              </div>

              {/* Remove */}
              {local.length > 1 && (
                <IconButton size="small" onClick={() => remove(row.id)}
                  sx={{ borderRadius: "6px", p: 0.5, "&:hover": { bgcolor: "#FEF2F2" } }}>
                  <Trash size={13} color="#EF4444" weight="duotone" />
                </IconButton>
              )}
            </div>
          ))}

          {/* Add sort */}
          {local.length < 3 && (
            <button onClick={add}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1D4ED8] hover:text-[#0C2472] py-1.5 px-2 rounded-lg hover:bg-[#EFF6FF] transition-colors w-full">
              <Plus size={12} weight="duotone" />
              Add sort
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#EFF6FF] bg-white">
          <button onClick={handleClear}
            className="text-[12px] font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">
            Clear
          </button>
          <Button variant="contained" size="small" onClick={handleApply}
            sx={{ bgcolor: "#1D4ED8", borderRadius: "8px", textTransform: "none", fontWeight: 700, fontSize: "0.75rem", px: 2, "&:hover": { bgcolor: "#60A5FA" }, "&:active": { bgcolor: "#0C2472" } }}>
            Apply Sort
          </Button>
        </div>
      </div>
    </Popover>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Tooltip({ title, children }: { title: string; children: any }) {
  return <div title={title}>{children}</div>;
}
