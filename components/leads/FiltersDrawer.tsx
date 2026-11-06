"use client";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import { X, Plus, Trash, SlidersHorizontal, FunnelSimple } from "@phosphor-icons/react";

// ── Types ─────────────────────────────────────────
export type FilterOperator =
  | "contains" | "does_not_contain" | "equals" | "does_not_equal"
  | "starts_with" | "ends_with" | "is_empty" | "is_not_empty";

export type FilterLogic = "AND" | "OR";

export interface FilterRow {
  id: string;
  column: string;
  operator: FilterOperator;
  value: string;
  logic: FilterLogic;
}

const FILTER_COLUMNS = [
  { value: "name",       label: "CRM Lead · Lead Name"   },
  { value: "company",    label: "CRM Lead · Company"      },
  { value: "email",      label: "CRM Lead · Email"        },
  { value: "mobile",     label: "CRM Lead · Mobile"       },
  { value: "phone",      label: "CRM Lead · Phone"        },
  { value: "leadStatus", label: "CRM Lead · Lead Status"  },
  { value: "leadSource", label: "CRM Lead · Lead Source"  },
  { value: "industry",   label: "CRM Lead · Industry"     },
  { value: "rating",     label: "CRM Lead · Rating"       },
  { value: "leadOwner",  label: "CRM Lead · Lead Owner"   },
  { value: "creation",   label: "CRM Lead · Created"      },
  { value: "modified",   label: "CRM Lead · Modified"     },
];

const OPERATORS: { value: FilterOperator; label: string; noValue?: boolean }[] = [
  { value: "contains",          label: "contains"         },
  { value: "does_not_contain",  label: "doesn't contain"  },
  { value: "equals",            label: "equals"           },
  { value: "does_not_equal",    label: "doesn't equal"    },
  { value: "starts_with",       label: "starts with"      },
  { value: "ends_with",         label: "ends with"        },
  { value: "is_empty",          label: "is empty",        noValue: true },
  { value: "is_not_empty",      label: "is not empty",    noValue: true },
];

const SELECT_SX = {
  fontSize: "0.78rem",
  bgcolor: "#EFF6FF",                   /* Surface bg */
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E3ECFC", borderWidth: 1.5 },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60A5FA" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1D4ED8", borderWidth: 2 },
  "&.Mui-focused": { boxShadow: "0 0 0 2px #93C5FD" },
  "& .MuiSelect-select": { py: "7px", px: "10px" },
};

const uid = () => Math.random().toString(36).slice(2, 8);

const DEFAULT_ROW: Omit<FilterRow, "id"> = {
  column: "name", operator: "contains", value: "", logic: "AND",
};

interface Props {
  open: boolean;
  onClose: () => void;
  filters: FilterRow[];
  onChange: (filters: FilterRow[]) => void;
}

export default function FiltersDrawer({ open, onClose, filters, onChange }: Props) {
  const [local, setLocal] = useState<FilterRow[]>(
    filters.length ? filters : [{ id: uid(), ...DEFAULT_ROW }]
  );

  const update = (id: string, patch: Partial<FilterRow>) =>
    setLocal(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));

  const addRow = () =>
    setLocal(prev => [...prev, { id: uid(), ...DEFAULT_ROW, logic: "AND" }]);

  const removeRow = (id: string) =>
    setLocal(prev => prev.length === 1 ? prev : prev.filter(r => r.id !== id));

  const handleApply = () => { onChange(local.filter(r => r.value || OPERATORS.find(o => o.value === r.operator)?.noValue)); onClose(); };
  const handleClear = () => { setLocal([{ id: uid(), ...DEFAULT_ROW }]); onChange([]); };

  const activeCount = filters.filter(r => r.value || OPERATORS.find(o => o.value === r.operator)?.noValue).length;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{ sx: { width: 560, display: "flex", flexDirection: "column", bgcolor: "#F8FAFF", boxShadow: "-12px 0 48px rgba(12,36,114,0.12)" } }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E3ECFC] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <FunnelSimple size={18} color="#1D4ED8" weight="duotone" />
          </div>
          <div>
            <h2 className="font-heading text-[15px] font-bold text-slate-900 tracking-tight">Filters</h2>
            <p className="text-[11px] text-slate-400">Narrow down leads by conditions</p>
          </div>
        </div>
        <Tooltip title="Close">
          <IconButton size="small" onClick={onClose}
            sx={{ borderRadius: "9px", border: "1.5px solid #E3ECFC", "&:hover": { bgcolor: "#EFF6FF" } }}>
            <X size={17} color="#64748B" weight="duotone" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        {local.map((row, idx) => {
          const noValue = OPERATORS.find(o => o.value === row.operator)?.noValue;
          return (
            <div key={row.id}>
              {/* AND/OR logic badge between rows */}
              {idx > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  {(["AND", "OR"] as FilterLogic[]).map(l => (
                    <button key={l} onClick={() => update(row.id, { logic: l })}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${
                        row.logic === l
                          ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                          : "bg-[#E3ECFC] text-[#0C2472] border-[#E3ECFC] hover:bg-[#1D4ED8]/10 hover:text-[#1D4ED8]"
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              )}

              {/* Filter row */}
              <div className="bg-white rounded-2xl border border-[#E3ECFC] p-4 shadow-sm">
                {idx === 0 && (
                  <p className="font-heading text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Where</p>
                )}

                <div className="flex items-start gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {/* Column */}
                    <FormControl size="small" fullWidth>
                      <Select value={row.column} onChange={e => update(row.id, { column: e.target.value })} sx={SELECT_SX}>
                        {FILTER_COLUMNS.map(c => (
                          <MenuItem key={c.value} value={c.value} sx={{ fontSize: "0.78rem" }}>{c.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Operator */}
                    <FormControl size="small" fullWidth>
                      <Select value={row.operator} onChange={e => update(row.id, { operator: e.target.value as FilterOperator })} sx={SELECT_SX}>
                        {OPERATORS.map(o => (
                          <MenuItem key={o.value} value={o.value} sx={{ fontSize: "0.78rem" }}>{o.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Value */}
                    {!noValue && (
                      <div className="col-span-2 flex items-center gap-2 bg-[#EFF6FF] border border-[#E3ECFC] rounded-xl px-3 py-1.5 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
                        <InputBase
                          fullWidth
                          placeholder="Enter value…"
                          value={row.value}
                          onChange={e => update(row.id, { value: e.target.value })}
                          sx={{ fontSize: "0.78rem", color: "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
                        />
                      </div>
                    )}
                    {noValue && (
                      <div className="col-span-2 flex items-center justify-center py-2 rounded-xl bg-[#EFF6FF] border border-[#E3ECFC]">
                        <p className="text-[11.5px] text-slate-400 italic">No value needed for this condition</p>
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <Tooltip title="Remove filter">
                    <IconButton size="small" onClick={() => removeRow(row.id)}
                      sx={{ borderRadius: "8px", mt: 0.5, flexShrink: 0, "&:hover": { bgcolor: "#FEF2F2" } }}>
                      <Trash size={15} color="#EF4444" weight="duotone" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add row */}
        <button onClick={addRow}
          className="flex items-center gap-2 text-[12.5px] font-semibold text-[#1D4ED8] hover:text-[#0C2472] py-2 px-3 rounded-xl hover:bg-[#EFF6FF] transition-all w-full">
          <Plus size={14} weight="duotone" />
          Add filter row
        </button>

        {/* Empty / tip */}
        <div className="bg-white rounded-2xl border border-[#E3ECFC] p-4 shadow-sm">
          <div className="flex items-start gap-2.5">
            <SlidersHorizontal size={16} color="#93C5FD" weight="duotone" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-slate-700 mb-0.5">How filters work</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Rows joined by <span className="font-bold text-slate-600">AND</span> must all match.
                Rows joined by <span className="font-bold text-slate-600">OR</span> match if any condition is true.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#E3ECFC] flex-shrink-0">
        <button onClick={handleClear}
          className="text-[13px] font-semibold text-slate-400 hover:text-slate-600 px-3 py-2 rounded-xl hover:bg-[#EFF6FF] transition-colors">
          Clear All
        </button>
        <Button variant="contained" size="small" startIcon={<FunnelSimple size={14} weight="duotone" />}
          onClick={handleApply}
          sx={{ bgcolor: "#1D4ED8", borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: "0.78rem", px: 2.5, py: 0.9, boxShadow: "0 2px 12px #1D4ED833", "&:hover": { bgcolor: "#60A5FA", boxShadow: "0 2px 14px #60A5FA55" }, "&:active": { bgcolor: "#0C2472" } }}>
          Apply{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </div>
    </Drawer>
  );
}
