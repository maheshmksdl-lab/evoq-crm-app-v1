"use client";
/**
 * Shared building blocks for the CRM list screens (Leads, Deals, Contacts, Accounts, Reports).
 * One implementation keeps layout, spacing, focus behaviour and dark-mode colours identical
 * across screens. All colours come from the theme tokens in app/globals.css.
 */
import Link from "next/link";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import {
  CaretDown, CaretLeft, CaretRight, DotsThreeVertical, House,
  List, GridFour, Kanban, MagnifyingGlass, Plus, X,
} from "@phosphor-icons/react";

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]";

// ── Small helpers ───────────────────────────────────────────

/** Tinted background for an icon tile; works with hex and var(--token) colours. */
export const tileBg = (color: string, pct = 14) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

/** Placeholder for a missing value in a table cell. */
export function Empty() {
  return <span className="text-slate-300" aria-label="Not set">—</span>;
}

/** Status / stage / type pill. Colours come from the screen's config (theme tokens). */
export function Pill({ bg, text, dot, children }: { bg: string; text: string; dot?: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 ring-inset ring-black/[0.04] whitespace-nowrap max-w-full"
      style={{ backgroundColor: bg, color: text }}>
      {dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />}
      <span className="truncate">{children}</span>
    </span>
  );
}

// ── Page header ─────────────────────────────────────────────

export function PageHeader({ title, count, badges, actions }: {
  title: string; count?: number; badges?: React.ReactNode; actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-fg-3 mb-1.5">
          <Link href="/" aria-label="Dashboard" className={`hover:text-link transition-colors rounded ${focusRing}`}><House size={13} weight="duotone" /></Link>
          <CaretRight size={11} weight="bold" className="text-slate-300" />
          <span aria-current="page" className="font-semibold text-fg-2">{title}</span>
        </nav>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="font-heading text-[22px] font-extrabold text-fg tracking-tight">{title}</h1>
          {count !== undefined && (
            <span className="text-[11px] font-bold text-link bg-card border border-line px-2 py-0.5 rounded-full shadow-sm tabular-nums">{count}</span>
          )}
          {badges}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export type ViewKey = "list" | "grid" | "kanban";
const VIEW_META: Record<ViewKey, { label: string; Icon: React.ElementType }> = {
  list:   { label: "List",   Icon: List     },
  grid:   { label: "Grid",   Icon: GridFour },
  kanban: { label: "Kanban", Icon: Kanban   },
};

export function ViewToggle({ value, onChange, views }: { value: ViewKey; onChange: (v: ViewKey) => void; views: ViewKey[] }) {
  return (
    <div role="group" aria-label="View" className="flex items-center bg-card border border-line rounded-xl p-1 gap-0.5 shadow-sm">
      {views.map(k => {
        const { label, Icon } = VIEW_META[k];
        const on = value === k;
        return (
          <button key={k} onClick={() => onChange(k)} aria-pressed={on}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${focusRing} ${
              on ? "bg-[#1D4ED8] text-white shadow-sm" : "text-fg-2 hover:text-link hover:bg-surface"
            }`}>
            <Icon size={14} weight={on ? "bold" : "duotone"} />{label}
          </button>
        );
      })}
    </div>
  );
}

export function PrimaryButton({ children, onClick, icon }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode }) {
  return (
    <Button variant="contained" startIcon={icon ?? <Plus size={16} weight="bold" />} onClick={onClick}
      sx={{ bgcolor:"#1D4ED8", color:"#fff", borderRadius:"10px", textTransform:"none", fontWeight:700, fontSize:"0.8rem", px:2.25, py:0.95,
            boxShadow:"0 2px 10px 0 #1D4ED833", "&:hover":{ bgcolor:"#1E40AF", boxShadow:"0 4px 14px 0 #1D4ED844" }, "&:active":{ bgcolor:"#0C2472" } }}>
      {children}
    </Button>
  );
}

// ── Card shell + tabs + toolbar ─────────────────────────────

/** The main list card. overflow-clip keeps rounded corners without breaking the sticky header;
 *  minWidth lets the page scroll sideways on narrow screens instead of clipping columns. */
export function ListCard({ children, minWidth = 970 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="bg-card rounded-2xl border border-line shadow-card overflow-clip" style={{ minWidth }}>
      {children}
    </div>
  );
}

export function TabBar<K extends string>({ tabs, value, onChange, label }: {
  tabs: { key: K; label: string; count?: number }[]; value: K; onChange: (k: K) => void; label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex items-center gap-1 px-4 border-b border-line-soft overflow-x-auto">
      {tabs.map(({ key, label: text, count }) => {
        const on = value === key;
        return (
          <button key={key} role="tab" aria-selected={on} onClick={() => onChange(key)}
            className={`relative flex items-center gap-1.5 px-3 pt-3.5 pb-3 text-[12.5px] font-semibold whitespace-nowrap transition-colors outline-none focus-visible:text-link ${
              on ? "text-link" : "text-fg-2 hover:text-fg"
            }`}>
            {text}
            {count !== undefined && (
              <span className={`text-[10.5px] min-w-[20px] px-1.5 py-0.5 rounded-full font-bold leading-none tabular-nums ${
                on ? "bg-[#1D4ED8] text-white" : "bg-slate-100 text-fg-2"
              }`}>{count}</span>
            )}
            <span className={`absolute left-2 right-2 -bottom-px h-[2px] rounded-full ${on ? "bg-[#1D4ED8] dark:bg-[#8AB4FF]" : "bg-transparent"}`} />
          </button>
        );
      })}
    </div>
  );
}

/** Fixed-height toolbar row; when `bulk` is given (rows selected) it replaces the controls so the table never jumps. */
export function Toolbar({ children, bulk }: { children: React.ReactNode; bulk?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 h-[60px] border-b border-line-soft">
      {bulk ?? children}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder, label, width = 320 }: {
  value: string; onChange: (v: string) => void; placeholder: string; label: string; width?: number;
}) {
  return (
    <div className="flex items-center gap-2 bg-card border border-line rounded-xl px-3 h-9 hover:border-line-strong focus-within:border-[#1D4ED8] focus-within:ring-[3px] focus-within:ring-[#93C5FD]/50 transition-all"
      style={{ width }}>
      <MagnifyingGlass size={15} color="var(--fg-3)" weight="bold" />
      <InputBase placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        inputProps={{ "aria-label": label }}
        sx={{ flex:1, fontSize:"0.8rem", color:"var(--fg)", "& input::placeholder":{ color:"var(--fg-3)", opacity:1 } }} />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search"
          className={`w-5 h-5 flex items-center justify-center rounded-full text-fg-3 hover:text-fg hover:bg-slate-100 transition-colors ${focusRing}`}>
          <X size={12} weight="bold" />
        </button>
      )}
    </div>
  );
}

export function ToolbarButton({ icon, label, active, count, onClick, caret }: {
  icon: React.ReactNode; label: string; active?: boolean; count?: number; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; caret?: boolean;
}) {
  return (
    <Button variant="outlined" size="small" onClick={onClick} startIcon={icon}
      endIcon={caret ? <CaretDown size={11} weight="bold" /> : undefined}
      sx={{
        height: 36, borderColor: active ? "#1D4ED8" : "var(--line)", color: active ? "var(--link)" : "var(--fg)",
        bgcolor: active ? "var(--surface)" : "var(--card)",
        borderRadius:"10px", textTransform:"none", fontWeight:600, fontSize:"0.78rem", px:1.5,
        "& .MuiButton-startIcon": { mr: 0.75 },
        "&:hover":{ borderColor:"var(--link)", color:"var(--link)", bgcolor:"var(--surface)" },
      }}>
      {label}
      {!!count && <span className="ml-1.5 text-[11px] font-bold bg-[#1D4ED8] text-white rounded-full px-1.5 py-px leading-none tabular-nums">{count}</span>}
    </Button>
  );
}

export function ResultCount({ shown, total, noun }: { shown: number; total: number; noun: string }) {
  return (
    <span className="text-[12px] text-fg-3 font-medium tabular-nums whitespace-nowrap">
      <span className="font-bold text-fg">{shown}</span> of {total} {noun}
    </span>
  );
}

export type BulkAction = { icon: React.ReactNode; label: string; danger?: boolean };

export function BulkBar({ count, actions, onClear }: { count: number; actions: BulkAction[]; onClear: () => void }) {
  return (
    <div className="flex items-center gap-2 w-full animate-fade-in" role="region" aria-label="Bulk actions">
      <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink mr-1">
        <span className="min-w-[22px] h-[22px] px-1.5 rounded-md bg-[#1D4ED8] text-white flex items-center justify-center text-[11px] font-extrabold tabular-nums">{count}</span>
        selected
      </span>
      <span className="w-px h-5 bg-line" />
      {actions.map(a => (
        <button key={a.label}
          className={`flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${focusRing} ${
            a.danger ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-fg-2 hover:text-link hover:bg-surface"
          }`}>
          {a.icon} {a.label}
        </button>
      ))}
      <button onClick={onClear} className={`ml-auto text-[12px] font-semibold text-fg-3 hover:text-fg px-2.5 py-1.5 rounded-lg hover:bg-surface transition-colors ${focusRing}`}>
        Clear selection
      </button>
    </div>
  );
}

// ── Table ───────────────────────────────────────────────────

/** Column template: checkbox · columns · row-action. */
export const gridTemplate = (widths: string[]) => ["40px", ...widths, "44px"].join(" ");

export function TableHeader({ template, labels, allChecked, someChecked, onToggleAll, selectAllLabel }: {
  template: string; labels: string[]; allChecked: boolean; someChecked: boolean; onToggleAll: () => void; selectAllLabel: string;
}) {
  return (
    // Sticks below the 60px top bar while the list scrolls
    <div className="sticky top-[60px] z-10 grid items-center px-4 h-10 bg-surface-subtle border-b border-line" style={{ gridTemplateColumns: template }}>
      <Checkbox size="small" checked={allChecked} indeterminate={someChecked} onChange={onToggleAll}
        inputProps={{ "aria-label": selectAllLabel }} sx={{ p: 0.5 }} />
      {labels.map(l => (
        <div key={l} className="font-heading text-[11px] font-bold text-fg-2 uppercase tracking-wider select-none truncate pr-3">{l}</div>
      ))}
      <div />
    </div>
  );
}

/** A clickable, keyboard-reachable row. The checkbox and the "more" button never trigger `onOpen`. */
export function TableRow({ template, selected, onToggle, onOpen, name, children }: {
  template: string; selected: boolean; onToggle: () => void; onOpen: () => void; name: string; children: React.ReactNode;
}) {
  return (
    <div role="link" tabIndex={0} aria-label={`Open ${name}`}
      onClick={onOpen} onKeyDown={e => { if (e.key === "Enter") onOpen(); }}
      className={`relative grid items-center px-4 min-h-[56px] cursor-pointer group outline-none transition-colors duration-100 focus-visible:bg-surface focus-visible:shadow-[inset_3px_0_0_#1D4ED8] ${
        selected ? "bg-surface shadow-[inset_3px_0_0_#1D4ED8]" : "hover:bg-surface-subtle"
      }`}
      style={{ gridTemplateColumns: template }}>
      <div className="self-stretch flex items-center" onClick={e => e.stopPropagation()}>
        <Checkbox size="small" checked={selected} onChange={onToggle} inputProps={{ "aria-label": `Select ${name}` }} sx={{ p: 0.5 }} />
      </div>
      {children}
      <div className="flex justify-end opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}>
        <Tooltip title="More actions">
          <IconButton size="small" aria-label={`More actions for ${name}`} sx={{ borderRadius:"8px", p:0.6, "&:hover":{ bgcolor:"var(--tint)" } }}>
            <DotsThreeVertical size={16} color="var(--fg-2)" weight="bold" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface ring-1 ring-line flex items-center justify-center mx-auto mb-4">
        <MagnifyingGlass size={24} color="#60A5FA" weight="duotone" />
      </div>
      <p className="font-heading text-fg text-[14px] font-bold">{title}</p>
      <p className="text-fg-3 text-[12.5px] mt-1">{hint}</p>
    </div>
  );
}

/** Footer. Counts reflect the filtered list; paging controls are display-only (single page of data). */
export function Pagination({ shown, noun, pageSize = 20 }: { shown: number; noun: [string, string]; pageSize?: number }) {
  const pageBtn = `w-7 h-7 flex items-center justify-center rounded-lg border border-line bg-card text-fg-2 hover:border-link hover:text-link disabled:opacity-40 disabled:pointer-events-none transition-colors ${focusRing}`;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-line-soft bg-surface-subtle">
      <p className="text-[12px] text-fg-3 font-medium tabular-nums">
        {shown === 0 ? "No records" : <>
          Showing <span className="text-fg font-bold">1–{shown}</span> of <span className="text-fg font-bold">{shown}</span> {shown === 1 ? noun[0] : noun[1]}
        </>}
      </p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[12px] text-fg-3">
          <span>Rows per page</span>
          <button className={`flex items-center gap-1 bg-card border border-line text-fg font-semibold px-2.5 h-7 rounded-lg hover:border-link hover:text-link transition-colors text-[12px] tabular-nums ${focusRing}`}>
            {pageSize} <CaretDown size={11} weight="bold" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button aria-label="Previous page" className={pageBtn} disabled><CaretLeft size={13} weight="bold" /></button>
          <button aria-current="page" className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1D4ED8] text-white text-[12px] font-bold shadow-sm tabular-nums">1</button>
          <button aria-label="Next page" className={pageBtn} disabled><CaretRight size={13} weight="bold" /></button>
        </div>
      </div>
    </div>
  );
}

/** Scoped selection: only rows currently visible count toward "select all" and the bulk bar. */
export function scopedSelection<T extends number | string>(selected: T[], setSelected: (fn: (p: T[]) => T[]) => void, visibleIds: T[]) {
  const visibleSel  = selected.filter(id => visibleIds.includes(id));
  const allChecked  = visibleIds.length > 0 && visibleSel.length === visibleIds.length;
  const someChecked = visibleSel.length > 0 && !allChecked;
  return {
    visibleSel, allChecked, someChecked,
    toggleAll: () => setSelected(p => allChecked ? p.filter(id => !visibleIds.includes(id)) : Array.from(new Set([...p, ...visibleIds]))),
    toggleOne: (id: T) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]),
    clear:     () => setSelected(p => p.filter(id => !visibleIds.includes(id))),
  };
}
