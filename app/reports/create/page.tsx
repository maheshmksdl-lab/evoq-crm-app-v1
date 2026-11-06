"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
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
  ChartBar, Info, Check, MagnifyingGlass, FunnelSimple, House, CaretRight,
} from "@phosphor-icons/react";

// Numbered step badge used for the builder steps
function Step({ n, children, extra }: { n: number; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white text-[10.5px] font-extrabold flex items-center justify-center flex-shrink-0">{n}</span>
      <h2 className="font-heading text-[13px] font-bold text-fg">{children}</h2>
      {extra}
    </div>
  );
}

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
    <div className="border-b border-line-soft last:border-0">
      <div className="flex items-start justify-between py-3 px-1">
        <div className="flex-1 min-w-0">
          <p className="font-heading text-[13px] font-bold text-fg">{title}</p>
          {subtitle && <p className="text-[12px] text-fg-3 mt-0.5 leading-snug">{subtitle}</p>}
          {children}
        </div>
        {onEdit && (
          <IconButton size="small" onClick={onEdit} aria-label={`Edit ${title.toLowerCase()}`}
            sx={{ flexShrink:0, ml:1, borderRadius:"8px", p:0.6, color:"var(--fg-2)", "&:hover":{ bgcolor:"var(--surface)", color:"var(--link)" } }}>
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
    <div className="flex h-screen bg-page font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-hidden bg-canvas">
        <TopBar />

        {/* ══ Builder header ══ */}
        <div className="flex items-start justify-between px-6 py-4 bg-card border-b border-line flex-shrink-0">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-fg-3 mb-1">
              <Link href="/" aria-label="Dashboard" className="hover:text-link transition-colors"><House size={13} weight="duotone" /></Link>
              <CaretRight size={11} weight="bold" className="text-slate-300" />
              <Link href="/reports" className="hover:text-link transition-colors font-medium">Reports</Link>
              <CaretRight size={11} weight="bold" className="text-slate-300" />
              <span aria-current="page" className="text-fg-2 font-semibold">Create</span>
            </nav>
            <h1 className="font-heading text-[20px] font-extrabold text-fg tracking-tight">Create Report</h1>
            {editingName ? (
              <div className="flex items-center gap-2 mt-0.5">
                <InputBase value={reportName} onChange={e => setReportName(e.target.value)}
                  autoFocus onBlur={() => setEditingName(false)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditingName(false); }}
                  inputProps={{ "aria-label": "Report name" }}
                  sx={{ fontSize:"0.78rem", color:"var(--link)", fontWeight:600, borderBottom:"1.5px solid #1D4ED8", px:0.5 }}
                />
                <IconButton size="small" aria-label="Done editing name" onClick={() => setEditingName(false)} sx={{ p:0.25 }}>
                  <Check size={12} color="var(--link)" weight="duotone" />
                </IconButton>
              </div>
            ) : (
              <button onClick={() => setEditingName(true)} aria-label={"Rename report: " + reportName}
                className="group flex items-center gap-1.5 text-[13px] text-link font-semibold mt-0.5 text-left rounded outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                {reportName}
                <PencilSimple size={13} weight="duotone" className="opacity-60 group-hover:opacity-100" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Button variant="outlined" size="small" onClick={() => router.push("/reports")}
              sx={{ borderColor:"var(--line)", color:"var(--fg-2)", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.78rem", px:2, "&:hover":{ borderColor:"#60A5FA", color:"var(--link)", bgcolor:"var(--surface)" } }}>
              Cancel
            </Button>
            <Button variant="outlined" size="small"
              startIcon={isRunning ? undefined : <Play size={13} weight="duotone" />}
              onClick={handleRun}
              disabled={!primaryModule || selectedColumns.length === 0}
              sx={{ borderColor:"var(--line)", color:"var(--fg-2)", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.78rem", px:2, "&:hover":{ borderColor:"#60A5FA", color:"var(--link)", bgcolor:"var(--surface)" }, "&.Mui-disabled":{ borderColor:"var(--line)", color:"var(--fg-3)" } }}>
              {isRunning ? "Running…" : "Run"}
            </Button>
            <Button variant="contained" size="small"
              startIcon={<FloppyDisk size={13} weight="duotone" />}
              onClick={handleSave}
              disabled={!primaryModule}
              sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:2, boxShadow:"0 1px 8px #1D4ED833", "&:hover":{ bgcolor:"#1E40AF" }, "&:active":{ bgcolor:"#0C2472" }, "&.Mui-disabled":{ bgcolor:"var(--tint)", color:"var(--fg-3)" } }}>
              Save
            </Button>
          </div>
        </div>

        {/* ══ Two-panel layout ══ */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── LEFT: Builder panel ── */}
          <div className="w-[420px] flex-shrink-0 bg-card border-r border-line overflow-y-auto p-5 space-y-5">

            {/* Step 1: Primary Module */}
            <div>
              <div className="mb-2.5"><Step n={1}>Primary module</Step></div>
              <FormControl size="small" fullWidth>
                <Select
                  value={primaryModule}
                  onChange={e => handleModuleChange(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Primary module" }}
                  sx={{ borderRadius:"10px", bgcolor:"var(--surface)", fontSize:"0.82rem", "& .MuiOutlinedInput-notchedOutline":{ borderColor:"var(--line)", borderWidth:1.5 }, "&:hover .MuiOutlinedInput-notchedOutline":{ borderColor:"var(--line-strong)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline":{ borderColor:"#1D4ED8", borderWidth:2 }, "& .MuiSelect-select":{ py:"9px", px:"12px", color: primaryModule ? "var(--fg)" : "var(--fg-3)", fontWeight: primaryModule ? 600 : 400 } }}
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
                <Step n={2} extra={
                  <Tooltip title="Add related modules to include data from connected CRM objects">
                    <button aria-label="About related modules" className="text-fg-3 hover:text-link rounded outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                      <Info size={14} weight="duotone" />
                    </button>
                  </Tooltip>
                }>Related modules</Step>
                <Tooltip title={primaryModule ? "Add related module" : "Select a primary module first"}>
                  <span>
                    <IconButton size="small" disabled={!primaryModule} aria-label="Add related module"
                      sx={{ border:"1px solid var(--line)", borderRadius:"7px", p:0.4, color:"var(--link)", "&:hover":{ bgcolor:"var(--surface)" }, "&.Mui-disabled":{ color:"var(--fg-3)", opacity:0.6, borderColor:"var(--line)" } }}>
                      <Plus size={13} weight="duotone" />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
              {!primaryModule && (
                <p className="text-[12px] text-fg-3 leading-relaxed">
                  Select a primary module above, then use + to add related modules.
                </p>
              )}
              {relatedModules.length === 0 && primaryModule && (
                <p className="text-[12px] text-fg-3">No related modules added yet.</p>
              )}
            </div>

            {/* Step 3: Fields & Filters */}
            <div>
              <div className="mb-3"><Step n={3}>Fields &amp; filters</Step></div>

              {/* Tab bar */}
              <div className="flex border-b border-line mb-4">
                {(["Columns", "Filters"] as FilterTabType[]).map(tab => (
                  <button key={tab} onClick={() => setFilterTab(tab)}
                    className={`px-4 py-2 text-[12px] font-semibold transition-all border-b-2 -mb-px ${
                      filterTab === tab
                        ? "text-link border-[#1D4ED8] dark:border-[#8AB4FF]"
                        : "text-fg-2 border-transparent hover:text-fg"
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
                      <div className="mt-2 bg-surface rounded-xl border border-line p-3 space-y-2">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-card border border-line rounded-lg px-2 py-1 focus-within:border-[#1D4ED8]">
                          <MagnifyingGlass size={12} color="#94A3B8" weight="duotone" />
                          <InputBase placeholder="Search fields…" value={colSearch}
                            onChange={e => setColSearch(e.target.value)} inputProps={{ "aria-label": "Search fields" }}
                            sx={{ flex:1, fontSize:"0.78rem", "& input::placeholder":{ color:"var(--fg-3)", opacity:1 } }} />
                        </div>
                        {/* Field list */}
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {filteredFields.map(field => (
                            <label key={field} className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-card cursor-pointer transition-colors">
                              <Checkbox size="small" checked={selectedColumns.includes(field)}
                                onChange={() => toggleColumn(field)}
                                sx={{ p:0.25, color:"#CBD5E1", "&.Mui-checked":{ color:"var(--link)" } }} />
                              <span className="text-[12.5px] text-fg">{field}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button size="small" onClick={() => setShowColPicker(false)}
                            sx={{ textTransform:"none", fontSize:"0.73rem", color:"var(--link)", fontWeight:600, "&:hover":{ bgcolor:"var(--surface)" } }}>
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedColumns.length > 0 && !showColPicker && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedColumns.map(col => (
                          <span key={col} className="flex items-center gap-1 text-[11.5px] font-semibold bg-tint text-link px-2.5 py-1 rounded-full">
                            {col}
                            <button onClick={() => toggleColumn(col)} aria-label={`Remove ${col}`} className="hover:text-ink rounded-full">
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
                <div className="py-4 text-center">
                  <FunnelSimple size={24} color="#60A5FA" weight="duotone" className="mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-fg">No filters added</p>
                  <p className="text-[11px] text-fg-3 mt-0.5">Click + to add filter conditions</p>
                  <Button size="small" startIcon={<Plus size={12} weight="duotone" />}
                    disabled={!primaryModule}
                    sx={{ mt:2, textTransform:"none", fontSize:"0.75rem", color:"var(--link)", fontWeight:600, borderRadius:"8px", "&:hover":{ bgcolor:"var(--surface)" }, "&.Mui-disabled":{ color:"var(--fg-3)", opacity:0.6 } }}>
                    Add Filter
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Results preview ── */}
          <div className="flex-1 bg-surface-subtle overflow-auto flex flex-col">
            {/* Results header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-line bg-card">
              <p className="font-heading text-[14px] font-bold text-fg">Results</p>
              <div className="flex items-center gap-2">
                {!hasResults && (
                  <p className="text-[12px] text-fg-3 max-w-xs">
                    Saving runs the query automatically. Use Run to refresh after you change the report.
                  </p>
                )}
                <button className="flex items-center gap-1 text-[12px] font-semibold text-fg-2 hover:text-link transition-colors ml-4 px-2 py-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]">
                  Show Details <CaretDown size={11} weight="duotone" />
                </button>
              </div>
            </div>

            {/* Results body */}
            <div className="flex-1 flex items-center justify-center p-8">
              {!primaryModule && (
                <div className="text-center max-w-xs">
                  <ChartBar size={40} color="#60A5FA" weight="duotone" className="mx-auto mb-4" />
                  <p className="font-heading text-[14px] font-bold text-fg mb-1">No module selected</p>
                  <p className="text-[12.5px] text-fg-3">Select a primary module on the left to start building your report.</p>
                </div>
              )}

              {primaryModule && selectedColumns.length === 0 && !hasResults && (
                <div className="text-center max-w-sm">
                  <ChartBar size={40} color="#60A5FA" weight="duotone" className="mx-auto mb-4" />
                  <p className="font-heading text-[14px] font-bold text-fg mb-1">
                    Add columns, then save the report to see query results here.
                  </p>
                  <p className="text-[12.5px] text-fg-3 mt-1">
                    You've selected <span className="font-semibold text-link">{primaryModule}</span> as your primary module. Now select columns to include.
                  </p>
                </div>
              )}

              {primaryModule && selectedColumns.length > 0 && !hasResults && !isRunning && (
                <div className="text-center max-w-sm">
                  <Play size={40} color="#60A5FA" weight="duotone" className="mx-auto mb-4" />
                  <p className="font-heading text-[14px] font-bold text-fg mb-2">Ready to run</p>
                  <p className="text-[12.5px] text-fg-3 mb-4">{selectedColumns.length} column{selectedColumns.length > 1 ? "s" : ""} selected from <span className="font-semibold text-link">{primaryModule}</span></p>
                  <Button variant="contained" size="small" onClick={handleRun}
                    startIcon={<Play size={14} weight="duotone" />}
                    sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:3, "&:hover":{ bgcolor:"#1E40AF" } }}>
                    Run Report
                  </Button>
                </div>
              )}

              {isRunning && (
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-line border-t-[#1D4ED8] rounded-full animate-spin mx-auto mb-3" style={{ borderWidth:3 }} />
                  <p className="text-[12.5px] text-fg-3 font-medium">Running query…</p>
                </div>
              )}

              {hasResults && !isRunning && (
                <div className="w-full max-w-2xl">
                  <div className="bg-card rounded-2xl border border-line shadow-sm overflow-hidden">
                    {/* Results header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-tint border-b border-line">
                      <span className="font-heading text-[11px] font-bold text-ink uppercase tracking-wider">
                        {primaryModule} · {selectedColumns.length} columns
                      </span>
                      <span className="text-[12px] text-fg-2 font-medium tabular-nums">{sampleRows.length} records</span>
                    </div>
                    {/* Column headers */}
                    <div className="grid px-4 py-2 border-b border-line-soft"
                      style={{ gridTemplateColumns: `repeat(${Math.min(visibleCols.length, 5)}, 1fr)` }}>
                      {visibleCols.map(col => (
                        <p key={col} className="font-heading text-[10.5px] font-bold text-ink uppercase tracking-wider truncate pr-2">{col}</p>
                      ))}
                    </div>
                    {/* Sample rows */}
                    {sampleRows.map((row, i) => (
                      <div key={i} className="grid px-4 py-2.5 border-b border-line-soft last:border-0 hover:bg-[#60A5FA]/[0.04]"
                        style={{ gridTemplateColumns: `repeat(${Math.min(visibleCols.length, 5)}, 1fr)` }}>
                        {row.slice(0, Math.min(visibleCols.length, 5)).map((cell, j) => (
                          <p key={j} className="text-[12.5px] text-fg truncate pr-2">{cell}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-[12px] text-fg-3 mt-3">
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
