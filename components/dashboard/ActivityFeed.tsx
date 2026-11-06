"use client";
import Avatar from "@mui/material/Avatar";
import { TrendUp, UserPlus, PencilSimple, CheckCircle, CurrencyDollar } from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

type FeedItem = {
  id: number;
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  user: string;
  initials: string;
  avatarBg: string;
  ownerKey: string;
  time: string;
};

const feed: FeedItem[] = [
  { id:1, Icon:TrendUp,       iconColor:"#0C2472", iconBg:"#E3ECFC", title:"Matrix Corp moved to Negotiation",   user:"PM SDL",  initials:"PM", avatarBg:"#1D4ED8", ownerKey:"PM SDL",  time:"5m ago"  },
  { id:2, Icon:UserPlus,      iconColor:"#1D4ED8", iconBg:"#EFF6FF", title:"New lead added: James Wilson",        user:"Sarah K", initials:"SK", avatarBg:"#3B82F6", ownerKey:"Sarah K", time:"23m ago" },
  { id:3, Icon:PencilSimple,  iconColor:"#3B82F6", iconBg:"#EFF6FF", title:"Sweany Inc contact updated",          user:"PM SDL",  initials:"PM", avatarBg:"#1D4ED8", ownerKey:"PM SDL",  time:"1h ago"  },
  { id:4, Icon:CheckCircle,   iconColor:"#60A5FA", iconBg:"#E3ECFC", title:"Task: Follow up with Apex done",      user:"John D",  initials:"JD", avatarBg:"#60A5FA", ownerKey:"John D",  time:"2h ago"  },
  { id:5, Icon:CurrencyDollar,iconColor:"#1D4ED8", iconBg:"#EFF6FF", title:"New deal created: Pixel Studios",     user:"Ria M",   initials:"RM", avatarBg:"#0C2472", ownerKey:"Ria M",   time:"3h ago"  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-[14px] font-bold text-slate-900">Recent Activity</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Live team updates</p>
      </div>

      <div className="flex-1 space-y-3.5">
        {feed.map((item, idx) => {
          const { Icon } = item;
          return (
            <div key={item.id} className="flex items-start gap-3 group">
              <div className="relative flex flex-col items-center flex-shrink-0">
                <div className="w-7 h-7 rounded-[9px] flex items-center justify-center" style={{ backgroundColor: item.iconBg }}>
                  <Icon size={14} color={item.iconColor} weight="duotone" />
                </div>
                {idx < feed.length - 1 && (
                  <div className="w-px flex-1 bg-[#E3ECFC] mt-1 mb-0 h-[14px]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <p className="text-[12px] font-medium text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Avatar
                    src={OWNER_AVATARS[item.ownerKey]}
                    sx={{ width:14, height:14, bgcolor:item.avatarBg, fontSize:"0.48rem", fontWeight:700 }}
                  >
                    {item.initials}
                  </Avatar>
                  <span className="text-[10px] text-slate-400 font-medium">{item.user}</span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-4 w-full text-center text-[11.5px] text-[#1D4ED8] font-bold hover:text-[#0C2472] py-2 rounded-xl hover:bg-[#EFF6FF] transition-all duration-150">
        View all activity →
      </button>
    </div>
  );
}
