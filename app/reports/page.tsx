"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Star, ChartBar } from "@phosphor-icons/react";
import {
  PageHeader, PrimaryButton, ListCard, TabBar, Toolbar, SearchBox, ResultCount,
  TableHeader, TableRow, EmptyState, Pagination, Pill, Empty, gridTemplate, scopedSelection,
} from "@/components/list/ListParts";

// ─────────────────────────────────────────────
//  Data — exact from screenshot
// ─────────────────────────────────────────────
interface Report {
  id: number; name: string; description: string;
  collection: string; lastAccessed: string; createdBy: string;
  isFavorite: boolean;
}

const ALL_REPORTS: Report[] = [
  { id:1,  name:"compoent 1",                description:"",                         collection:"",            lastAccessed:"Now",              createdBy:"PM SDL",       isFavorite:false },
  { id:2,  name:"Account Wise Deal Summary", description:"Account Wise Deal Summary", collection:"Deal Reports", lastAccessed:"18 minutes ago",   createdBy:"Administrator",isFavorite:false },
  { id:3,  name:"Pie chart test 1",          description:"",                         collection:"",            lastAccessed:"18 minutes ago",   createdBy:"PM SDL",       isFavorite:false },
  { id:4,  name:"1231123",                   description:"afsdsdf",                  collection:"Deal Reports", lastAccessed:"about 2 hours ago", createdBy:"PM SDL",       isFavorite:false },
  { id:5,  name:"stage pie chart",           description:"",                         collection:"",            lastAccessed:"—",                 createdBy:"PM SDL",       isFavorite:false },
  { id:6,  name:"Pie Chart",                 description:"",                         collection:"",            lastAccessed:"—",                 createdBy:"PM SDL",       isFavorite:false },
  { id:7,  name:"Untitled Report",           description:"",                         collection:"",            lastAccessed:"May 18, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:8,  name:"Deal with Stage",           description:"Deal with Stage",          collection:"Deal Reports", lastAccessed:"May 19, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:9,  name:"Deal with Filter",          description:"",                         collection:"Deal Reports", lastAccessed:"May 21, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:10, name:"Lead Summary",              description:"Monthly lead summary",     collection:"Lead Reports", lastAccessed:"May 20, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:11, name:"Contact Activity",          description:"",                         collection:"",            lastAccessed:"May 15, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:12, name:"Revenue by Month",          description:"Monthly revenue breakdown",collection:"Deal Reports", lastAccessed:"May 10, 2026",     createdBy:"Administrator",isFavorite:false },
];

const COLLECTIONS = ["All Reports", "Deal Reports", "Lead Reports", "Contact Reports", "Account Reports"];

const COLS = [
  { label: "",              width: "36px"                },  // favourite
  { label: "Report Name",   width: "minmax(180px,1.4fr)" },
  { label: "Description",   width: "minmax(160px,1.4fr)" },
  { label: "Collection",    width: "140px"               },
  { label: "Last Accessed", width: "140px"               },
  { label: "Created By",    width: "minmax(120px,0.8fr)" },
];

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports]       = useState<Report[]>(ALL_REPORTS);
  const [selected, setSelected]     = useState<number[]>([]);
  const [collection, setCollection] = useState("All Reports");
  const [search, setSearch]         = useState("");

  const counts: Record<string, number> = { "All Reports": reports.length };
  reports.forEach(r => { if (r.collection) counts[r.collection] = (counts[r.collection] ?? 0) + 1; });

  const filtered = reports.filter(r => {
    const matchCol = collection === "All Reports" || r.collection === collection;
    const q        = search.toLowerCase();
    const matchQ   = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    return matchCol && matchQ;
  });

  const sel = scopedSelection(selected, setSelected, filtered.map(r => r.id));
  const isFiltered = collection !== "All Reports" || !!search;
  const template = gridTemplate(COLS.map(c => c.width));

  const toggleFav = (id: number) =>
    setReports(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));

  return (
    <div className="flex h-screen bg-page font-sans">
      <Sidebar />

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen overflow-auto bg-canvas">
        <TopBar />

        <main className="flex-1 px-6 py-5 space-y-4 animate-fade-in">
          <PageHeader title="Reports" count={ALL_REPORTS.length}
            actions={<PrimaryButton onClick={() => router.push("/reports/create")}>Create Report</PrimaryButton>} />

          <ListCard>
            <TabBar label="Report collection" value={collection} onChange={setCollection}
              tabs={COLLECTIONS.filter(c => c === "All Reports" || (counts[c] ?? 0) > 0).map(c => ({ key: c, label: c, count: counts[c] ?? 0 }))} />

            <Toolbar>
              <SearchBox value={search} onChange={setSearch} label="Search reports" placeholder="Search by report name or description" />
              {isFiltered && <span className="ml-auto"><ResultCount shown={filtered.length} total={reports.length} noun="reports" /></span>}
            </Toolbar>

            <TableHeader template={template} labels={COLS.map(c => c.label)}
              allChecked={sel.allChecked} someChecked={sel.someChecked} onToggleAll={sel.toggleAll} selectAllLabel="Select all reports" />

            <div className="divide-y divide-line-soft">
              {filtered.map(report => (
                <TableRow key={report.id} template={template} name={report.name}
                  selected={selected.includes(report.id)} onToggle={() => sel.toggleOne(report.id)}
                  onOpen={() => router.push(`/reports/${report.id}`)}>

                  {/* Favourite — its own click target, never opens the report */}
                  <div onClick={e => e.stopPropagation()}>
                    <Tooltip title={report.isFavorite ? "Remove from favourites" : "Add to favourites"}>
                      <IconButton size="small" onClick={() => toggleFav(report.id)}
                        aria-label={report.isFavorite ? `Remove ${report.name} from favourites` : `Add ${report.name} to favourites`}
                        aria-pressed={report.isFavorite}
                        sx={{ p: 0.5, borderRadius: "8px", "&:hover": { bgcolor: "var(--surface)" } }}>
                        <Star size={16} weight={report.isFavorite ? "fill" : "regular"} color={report.isFavorite ? "#F59E0B" : "var(--fg-3)"} />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                      <ChartBar size={16} color="var(--link)" weight="duotone" />
                    </span>
                    <span className="font-heading text-[13px] font-semibold text-fg truncate group-hover:text-link transition-colors">{report.name}</span>
                  </div>

                  <p className="text-[12.5px] text-fg-2 truncate pr-3">{report.description || <Empty />}</p>

                  <div className="pr-3">
                    {report.collection ? <Pill bg="var(--tint)" text="var(--link)">{report.collection}</Pill> : <Empty />}
                  </div>

                  <p className="text-[12px] text-fg-3 tabular-nums truncate pr-3">
                    {report.lastAccessed === "—" ? <Empty /> : report.lastAccessed}
                  </p>

                  <p className="text-[12.5px] text-fg-2 truncate">{report.createdBy}</p>
                </TableRow>
              ))}
            </div>

            {filtered.length === 0 && <EmptyState title="No reports match" hint="Try a different search term or collection." />}
            <Pagination shown={filtered.length} noun={["report", "reports"]} />
          </ListCard>
        </main>
      </div>
    </div>
  );
}
