"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { ArrowSquareOut, TrendUp } from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

type Deal = {
  id: string; name: string; amount: number;
  stage: string; stageBg: string; stageFg: string;
  owner: string; initials: string; avatarBg: string;
  closeDate: string; change: "up" | "same" | "down";
};

const deals: Deal[] = [
  { id:"CRM-2026-0013", name:"Sweany Inc",     amount:29999,  stage:"Qualification",  stageBg:"#EFF6FF", stageFg:"#0C2472", owner:"PM SDL",   initials:"PM", avatarBg:"#1D4ED8", closeDate:"15 May", change:"same" },
  { id:"CRM-2026-0012", name:"TechFlow Ltd",   amount:85000,  stage:"Proposal",       stageBg:"#E3ECFC", stageFg:"#1D4ED8", owner:"Sarah K",  initials:"SK", avatarBg:"#3B82F6", closeDate:"12 May", change:"up"   },
  { id:"CRM-2026-0011", name:"Apex Solutions", amount:42500,  stage:"Needs Analysis", stageBg:"#EFF6FF", stageFg:"#1D4ED8", owner:"John D",   initials:"JD", avatarBg:"#60A5FA", closeDate:"10 May", change:"up"   },
  { id:"CRM-2026-0010", name:"Matrix Corp",    amount:120000, stage:"Negotiation",    stageBg:"#E3ECFC", stageFg:"#0C2472", owner:"PM SDL",   initials:"PM", avatarBg:"#1D4ED8", closeDate:"08 May", change:"up"   },
  { id:"CRM-2026-0009", name:"Pixel Studios",  amount:18750,  stage:"Qualification",  stageBg:"#EFF6FF", stageFg:"#0C2472", owner:"Ria M",    initials:"RM", avatarBg:"#0C2472", closeDate:"05 May", change:"down" },
];

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function RecentDeals() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-[14px] border-b border-slate-100">
        <div>
          <h3 className="text-[14px] font-bold text-slate-900">Recent Deals</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">5 latest active deals</p>
        </div>
        <Button
          size="small"
          endIcon={<ArrowSquareOut size={12} weight="duotone" />}
          sx={{ textTransform:"none", fontSize:"0.72rem", color:"#1D4ED8", fontWeight:700, borderRadius:"8px", "&:hover":{ bgcolor:"#EFF6FF" } }}
        >
          View All
        </Button>
      </div>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Deal", "Amount", "Stage", "Owner", "Close Date"].map(h => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map(deal => (
              <TableRow key={deal.id} hover sx={{ "&:hover":{ bgcolor:"rgba(96,165,250,0.04)" }, cursor:"pointer", "& td":{ borderBottom:"1px solid #E3ECFC" } }}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {deal.change === "up" && <TrendUp size={13} color="#10B981" weight="duotone" />}
                    <div>
                      <p className="text-[12px] font-semibold text-slate-800 leading-tight">{deal.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{deal.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] font-bold text-slate-800">{fmt(deal.amount)}</span>
                </TableCell>
                <TableCell>
                  <Chip label={deal.stage} size="small" sx={{ bgcolor:deal.stageBg, color:deal.stageFg, fontWeight:700, fontSize:"0.65rem", height:20, borderRadius:"5px" }} />
                </TableCell>
                <TableCell>
                  <Tooltip title={deal.owner}>
                    <div className="flex items-center gap-1.5">
                      <Avatar
                        src={OWNER_AVATARS[deal.owner]}
                        sx={{ width:22, height:22, bgcolor:deal.avatarBg, fontSize:"0.58rem", fontWeight:700 }}
                      >
                        {deal.initials}
                      </Avatar>
                      <span className="text-[11.5px] text-slate-600 font-medium">{deal.owner}</span>
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] text-slate-400 font-medium">{deal.closeDate}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
