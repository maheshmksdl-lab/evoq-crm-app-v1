"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import InputBase from "@mui/material/InputBase";
import {
  Plus, PencilSimple, CaretDown, Play, FloppyDisk, X,
  ChartBar, Info, Check, MagnifyingGlass, FunnelSimple,
} from "@phosphor-icons/react";

// ─────────────────────────────────────────────
//  Module field definitions
// ─────────────────────────────────────────────
const MODULE_FIELDS: Record<string, string[]> = {
  Deals:    ["Deal Name","Amount","Stage","Probability (%)","Account Name","Contact Name","Owner","Closing Date","Lead Source","Created","Modified"],
  Leads:    ["Lead Name","Company","Email","Mobile","Status","Lead Source","Rating","Owner","Created","Modified"],
  Contacts: ["First Name","Last Name","Email","Phone","Mobile","Account Name","Owner","Created","Modified"],
  Accounts: ["Account Name","Phone","Account Type","Industry","Annual Revenue","Owner","Created","Modified"],
};

type FilterTabType = "Columns" | "Filters";

interface ColumnItem { field: string; selected: boolean; }

// ─────────────────────────────────────────────
//  Editable section row
// ─────────────────────────────────────────────
function SectionRow({ title, subtitle, onEdit, children }: {
  title: string; subtitle?: string;
  onEdit?: () => void; children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#EFF6FF] last:border-0">
      <div className="flex items-start justify-between py-3 px-1">
        <div className="flex-1 min-w-0">
          <p className="font-heading text-[12.5px] font-bold text-slate-800">{title}</p>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{subtitle}</p>}
          {children}
        </div>
        {onEdit && (
          <IconButton size="small" onClick={onEdit}
            sx={{ flexShrink:0, ml:1, borderRadius:"6px", p:0.5, color:"#94A3B8", "&:hover":{ bgcolor:"#EFF6FF", color:"#1D4ED8" } }}>
            <PencilSimple size={14} weight="duotone" />
          </IconButton>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function CreateReportPage() {
  const router = useRouter();

  const [reportName, setReportName]     = useState("Untitled Report");
  const [editingName, setEditingName]   = useState(false);
  const [primaryModule, setPrimaryModule] = useState("");
  const [relatedModules, setRelatedModules] = useState<string[]>([]);
  const [filterTab, setFilterTab]       = useState<FilterTabType>("Columns");
  const [columns, setColumns]           = useState<ColumnItem[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [hasResults, setHasResults]     = useState(false);
  const [showColPicker, setShowColPicker] = useState(false);
  const [colSearch, setColSearch]       = useState("");
  const [isRunning, setIsRunning]       = useState(false);

  const handleModuleChange = (mod: string) => {
    setPrimaryModule(mod);
    setColumns((MODULE_FIELDS[mod] || []).map(f => ({ field: f, selected: false })));
    setSelectedColumns([]);
    setHasResults(false);
    setShowColPicker(false);
  };

  const toggleColumn = (field: string) => {
    setSelectedColumns(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleRun = () => {
    if (!primaryModule || selectedColumns.length === 0) return;
    setIsRunning(true);
    setTimeout(() => { setIsRunning(false); setHasResults(true); }, 800);
  };

  const handleSave = () => {
    if (!primaryModule) return;
    router.push("/reports");
  };

  // Sample results data
  const sampleRows = primaryModule === "Deals"
    ? [["New","Proposal/Price Quote","₹29,999"], ["testing","Needs Analysis","₹500,000"], ["Smith","Value Proposition","₹100,000"]]
    : primaryModule === "Leads"
    ? [["Mrs. Shobha R","Shobha Realty","New"], ["Priya Nair","Nair & Co","Contacted"]]
    : [["—"]];

  const visibleCols = selectedColumns.slice(0, 5);
  const filteredFields = (MODULE_FIELDS[primaryModule] || []).filter(f =>
    f.toLowerCase().includes(colSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#EFF6FF] font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* ══ Builder header ══ */}
        <div className="flex items-start justify-between px-6 py-4 bg-white border-b border-[#E3ECFC] flex-shrink-0">
          <div>
            <h2 className="font-heading text-[18px] font-extrabold text-slate-900 tracking-tight">Create Report</h2>
            {editingName ? (
              <div className="flex items-center gap-2 mt-0.5">
                <InputBase value={reportName} onChange={e => setReportName(e.target.value)}
                  autoFocus onBlur={() => setEditingName(false)}
                  sx={{ fontSize:"0.78rem", color:"#1D4ED8", fontWeight:600, borderBottom:"1.5px solid #1D4ED8", px:0.5 }}
                />
                <IconButton size="small" onClick={() => setEditingName(false)} sx={{ p:0.25 }}>
                  <Check size={12} color="#1D4ED8" weight="duotone" />
                </IconButton>
              </div>
            ) : (
              <button onClick={() => setEditingName(true)}
                className="text-[12px] text-[#1D4ED8] font-medium hover:underline mt-0.5 block text-left">
                {reportName}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Button variant="outlined" size="small" onClick={() => router.push("/reports")}
              sx={{ borderColor:"#E3ECFC", color:"#475569", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.78rem", px:2, "&:hover":{ borderColor:"#60A5FA", color:"#1D4ED8", bgcolor:"#EFF6FF" } }}>
              Cancel
            </Button>
            <Button variant="outlined" size="small"
              startIcon={isRunning ? undefined : <Play size={13} weight="duotone" />}
              onClick={handleRun}
              disabled={!primaryModule || selectedColumns.length === 0}
              sx={{ borderColor:"#E3ECFC", color:"#475569", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.78rem", px:2, "&:hover":{ borderColor:"#60A5FA", color:"#1D4ED8", bgcolor:"#EFF6FF" }, "&.Mui-disabled":{ borderColor:"#E3ECFC", color:"#9CA3AF" } }}>
              {isRunning ? "Running…" : "Run"}
            </Button>
            <Button variant="contained" size="small"
              startIcon={<FloppyDisk size={13} weight="duotone" />}
              onClick={handleSave}
              disabled={!primaryModule}
              sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:2, boxShadow:"0 1px 8px #1D4ED833", "&:hover":{ bgcolor:"#60A5FA" }, "&:active":{ bgcolor:"#0C2472" }, "&.Mui-disabled":{ bgcolor:"#E3ECFC", color:"#9CA3AF" } }}>
              Save
            </Button>
          </div>
        </div>

        {/* ══ Two-panel layout ══ */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── LEFT: Builder panel ── */}
          <div className="w-[420px] flex-shrink-0 bg-white border-r border-[#E3ECFC] overflow-y-auto p-5 space-y-5">

            {/* Step 1: Primary Module */}
            <div>
              <p className="font-heading text-[11px] font-bold text-[#0C2472] uppercase tracking-wider mb-2">
                1. Primary Module
              </p>
              <FormControl size="small" fullWidth>
                <Select
                  value={primaryModule}
                  onChange={e => handleModuleChange(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius:"10px", bgcolor:"#EFF6FF", fontSize:"0.82rem", "& .MuiOutlinedInput-notchedOutline":{ borderColor:"#E3ECFC", borderWidth:1.5 }, "&:hover .MuiOutlinedInput-notchedOutline":{ borderColor:"#60A5FA" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline":{ borderColor:"#1D4ED8", borderWidth:2 }, "& .MuiSelect-select":{ py:"9px", px:"12px", color: primaryModule ? "#1D4ED8" : "#9CA3AF" } }}
                  renderValue={v => v || "Select primary module"}
                >
                  {Object.keys(MODULE_FIELDS).map(m => (
                    <MenuItem key={m} value={m} sx={{ fontSize:"0.82rem" }}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Step 2: Related Modules */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <p className="font-heading text-[11px] font-bold text-[#0C2472] uppercase tracking-wider">
                    2. Related Modules
                  </p>
                  <Tooltip title="Add related modules to include data from connected CRM objects">
                    <Info size={13} color="#94A3B8" weight="duotone" className="cursor-pointer" />
                  </Tooltip>
                </div>
                <Tooltip title={primaryModule ? "Add related module" : "Select a primary module first"}>
                  <span>
                    <IconButton size="small" disabled={!primaryModule}
                      sx={{ border:"1.5px solid #E3ECFC", borderRadius:"7px", p:0.4, color:"#1D4ED8", "&:hover":{ bgcolor:"#EFF6FF" }, "&.Mui-disabled":{ color:"#CBD5E1", borderColor:"#E3ECFC" } }}>
                      <Plus size={13} weight="duotone" />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
              {!primaryModule && (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Select a primary module above, then use + to add related modules.
                </p>
              )}
              {relatedModules.length === 0 && primaryModule && (
                <p className="text-[11px] text-slate-400">No related modules added yet.</p>
              )}
            </div>

            {/* Step 3: Fields & Filters */}
            <div>
              <p className="font-heading text-[11px] font-bold text-[#0C2472] uppercase tracking-wider mb-3">
                3. Fields & Filters
              </p>

              {/* Tab bar */}
              <div className="flex border-b border-[#E3ECFC] mb-4">
                {(["Columns", "Filters"] as FilterTabType[]).map(tab => (
                  <button key={tab} onClick={() => setFilterTab(tab)}
                    className={`px-4 py-2 text-[12px] font-semibold transition-all border-b-2 -mb-px ${
                      filterTab === tab
                        ? "text-[#1D4ED8] border-[#1D4ED8]"
                        : "text-slate-400 border-transparent hover:text-slate-600"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {filterTab === "Columns" && (
                <div className="space-y-1">
                  {/* Columns */}
                  <SectionRow
                    title="Columns"
                    subtitle={primaryModule
                      ? selectedColumns.length > 0
                        ? `${selectedColumns.length} column${selectedColumns.length > 1 ? "s" : ""} selected`
                        : "Click edit to select columns"
                      : "Select a primary module to load columns."}
                    onEdit={primaryModule ? () => setShowColPicker(v => !v) : undefined}
                  >
                    {showColPicker && primaryModule && (
                      <div className="mt-2 bg-[#EFF6FF] rounded-xl border border-[#E3ECFC] p-3 space-y-2">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-white border border-[#E3ECFC] rounded-lg px-2 py-1 focus-within:border-[#1D4ED8]">
                          <MagnifyingGlass size={12} color="#94A3B8" weight="duotone" />
                          <InputBase placeholder="Search fields…" value={colSearch}
                            onChange={e => setColSearch(e.target.value)}
                            sx={{ flex:1, fontSize:"0.75rem", "& input::placeholder":{ color:"#94A3B8", opacity:1 } }} />
                        </div>
                        {/* Field list */}
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {filteredFields.map(field => (
                            <label key={field} className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-white cursor-pointer transition-colors">
                              <Checkbox size="small" checked={selectedColumns.includes(field)}
                                onChange={() => toggleColumn(field)}
                                sx={{ p:0.25, color:"#CBD5E1", "&.Mui-checked":{ color:"#1D4ED8" } }} />
                              <span className="text-[12px] text-slate-700">{field}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button size="small" onClick={() => setShowColPicker(false)}
                            sx={{ textTransform:"none", fontSize:"0.73rem", color:"#1D4ED8", fontWeight:600, "&:hover":{ bgcolor:"#EFF6FF" } }}>
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedColumns.length > 0 && !showColPicker && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedColumns.map(col => (
                          <span key={col} className="flex items-center gap-1 text-[10.5px] font-semibold bg-[#E3ECFC] text-[#1D4ED8] px-2 py-0.5 rounded-full">
                            {col}
                            <button onClick={() => toggleColumn(col)} className="hover:text-[#0C2472]">
                              <X size={10} weight="bold" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </SectionRow>

                  <SectionRow
                    title="Row Groups"
                    subtitle={selectedColumns.length === 0 ? "Add columns first to configure row groups" : "Click to configure row grouping"}
                    onEdit={selectedColumns.length > 0 ? () => {} : undefined}
                  />
                  <SectionRow
                    title="Column Groups"
                    subtitle={selectedColumns.length === 0 ? "Add columns first to configure column groups" : "Click to configure column grouping"}
                    onEdit={selectedColumns.length > 0 ? () => {} : undefined}
                  />
                  <SectionRow
                    title="Aggregate Columns"
                    subtitle="No aggregate column added"
                    onEdit={selectedColumns.length > 0 ? () => {} : undefined}
                  />
                </div>
              )}

              {filterTab === "Filters" && (
                <div className="py-4 text-center text-slate-400">
                  <FunnelSimple size={24} color="#93C5FD" weight="duotone" className="mx-auto mb-2" />
                  <p className="text-[12px] font-medium text-slate-500">No filters added</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Click + to add filter conditions</p>
                  <Button size="small" startIcon={<Plus size={12} weight="duotone" />}
                    disabled={!primaryModule}
                    sx={{ mt:2, textTransform:"none", fontSize:"0.75rem", color:"#1D4ED8", fontWeight:600, borderRadius:"8px", "&:hover":{ bgcolor:"#EFF6FF" }, "&.Mui-disabled":{ color:"#CBD5E1" } }}>
                    Add Filter
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Results preview ── */}
          <div className="flex-1 bg-[#F8FAFF] overflow-auto flex flex-col">
            {/* Results header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#E3ECFC] bg-white">
              <p className="font-heading text-[13px] font-bold text-slate-700">Results</p>
              <div className="flex items-center gap-2">
                {!hasResults && (
                  <p className="text-[11.5px] text-slate-400 max-w-xs">
                    Saving runs the query automatically. Use Run to refresh after you change the report.
                  </p>
                )}
                <button className="flex items-center gap-1 text-[11.5px] font-semibold text-slate-400 hover:text-[#1D4ED8] transition-colors ml-4">
                  Show Details <CaretDown size={11} weight="duotone" />
                </button>
              </div>
            </div>

            {/* Results body */}
            <div className="flex-1 flex items-center justify-center p-8">
              {!primaryModule && (
                <div className="text-center text-slate-400 max-w-xs">
                  <ChartBar size={40} color="#E3ECFC" weight="duotone" className="mx-auto mb-4" />
                  <p className="font-heading text-[14px] font-semibold text-slate-500 mb-1">No module selected</p>
                  <p className="text-[12px] text-slate-400">Select a primary module on the left to start building your report.</p>
                </div>
              )}

              {primaryModule && selectedColumns.length === 0 && !hasResults && (
                <div className="text-center text-slate-400 max-w-sm">
                  <ChartBar size={40} color="#E3ECFC" weight="duotone" className="mx-auto mb-4" />
                  <p className="font-heading text-[14px] font-semibold text-slate-500 mb-1">
                    Add columns, then save the report to see query results here.
                  </p>
                  <p className="text-[12px] text-slate-400 mt-1">
                    You've selected <span className="font-semibold text-[#1D4ED8]">{primaryModule}</span> as your primary module. Now select columns to include.
                  </p>
                </div>
              )}

              {primaryModule && selectedColumns.length > 0 && !hasResults && !isRunning && (
                <div className="text-center text-slate-400 max-w-sm">
                  <Play size={40} color="#E3ECFC" weight="duotone" className="mx-auto mb-4" />
                  <p className="font-heading text-[14px] font-semibold text-slate-500 mb-2">Ready to run</p>
                  <p className="text-[12px] text-slate-400 mb-4">{selectedColumns.length} column{selectedColumns.length > 1 ? "s" : ""} selected from <span className="font-semibold text-[#1D4ED8]">{primaryModule}</span></p>
                  <Button variant="contained" size="small" onClick={handleRun}
                    startIcon={<Play size={14} weight="duotone" />}
                    sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:3, "&:hover":{ bgcolor:"#60A5FA" } }}>
                    Run Report
                  </Button>
                </div>
              )}

              {isRunning && (
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-[#E3ECFC] border-t-[#1D4ED8] rounded-full animate-spin mx-auto mb-3" style={{ borderWidth:3 }} />
                  <p className="text-[12px] text-slate-400 font-medium">Running query…</p>
                </div>
              )}

              {hasResults && !isRunning && (
                <div className="w-full max-w-2xl">
                  <div className="bg-white rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
                    {/* Results header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#E3ECFC] border-b border-[#E3ECFC]">
                      <span className="font-heading text-[11px] font-bold text-[#0C2472] uppercase tracking-wider">
                        {primaryModule} · {selectedColumns.length} columns
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{sampleRows.length} records</span>
                    </div>
                    {/* Column headers */}
                    <div className="grid px-4 py-2 border-b border-[#EFF6FF]"
                      style={{ gridTemplateColumns: `repeat(${Math.min(visibleCols.length, 5)}, 1fr)` }}>
                      {visibleCols.map(col => (
                        <p key={col} className="font-heading text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider truncate pr-2">{col}</p>
                      ))}
                    </div>
                    {/* Sample rows */}
                    {sampleRows.map((row, i) => (
                      <div key={i} className="grid px-4 py-2.5 border-b border-[#EFF6FF] last:border-0 hover:bg-[#60A5FA]/[0.04]"
                        style={{ gridTemplateColumns: `repeat(${Math.min(visibleCols.length, 5)}, 1fr)` }}>
                        {row.slice(0, Math.min(visibleCols.length, 5)).map((cell, j) => (
                          <p key={j} className="text-[12px] text-slate-700 truncate pr-2">{cell}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-slate-400 mt-3">
                    Preview · Save the report to see full results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
