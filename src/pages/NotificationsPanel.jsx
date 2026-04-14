import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Notification data ──────────────────────────────────────────────────────────
export const INITIAL_NOTIFICATIONS = [
  // Overdue
  { id:1,  type:"overdue", title:"Overdue maintenance task",    body:"Server Room — UPS check assigned to R. Santos is overdue.",             time:"Today, 5:00 PM",     read:false, link:"/tasks"      },
  { id:2,  type:"overdue", title:"Overdue maintenance task",    body:"WKSTN-QA-003 monthly health check has passed its due date.",             time:"Today, 4:30 PM",     read:false, link:"/tasks"      },
  // Due today
  { id:3,  type:"due",     title:"Task due today",              body:"Network switch — firmware update for Cisco Catalyst 2960 is due today.", time:"Today, 8:00 AM",     read:false, link:"/tasks"      },
  { id:4,  type:"due",     title:"Task due today",              body:"Weekly workstation check for Lenovo ThinkCentre M70 is due today.",      time:"Today, 8:00 AM",     read:false, link:"/scheduling" },
  // Hardware tamper
  { id:5,  type:"tamper",  title:"Hardware mismatch detected",  body:"WKSTN-IT-001: RAM reduced from 16 GB to 8 GB — possible removal.",       time:"Today, 9:12 AM",     read:false, link:"/monitoring" },
  { id:6,  type:"tamper",  title:"Hardware mismatch detected",  body:"WKSTN-QA-003: CPU downgraded from Ryzen 5 5600G to Ryzen 3 3200G.",      time:"Today, 9:12 AM",     read:false, link:"/monitoring" },
  { id:7,  type:"tamper",  title:"Hardware mismatch detected",  body:"WKSTN-MGMT-005: Storage capacity reduced from 1 TB to 512 GB.",          time:"Today, 9:12 AM",     read:false, link:"/monitoring" },
  // Asset alerts
  { id:8,  type:"asset",   title:"Asset under maintenance",     body:"APC Smart-UPS 1500 (LFC-UP-00012) status changed to Under Maintenance.", time:"Yesterday, 2:15 PM", read:true,  link:"/assets"     },
  { id:9,  type:"asset",   title:"New asset registered",        body:"Lenovo ThinkCentre M70 (LFC-WS-00088) has been added to the registry.",  time:"Yesterday, 2:45 PM", read:true,  link:"/assets"     },
  // System
  { id:10, type:"system",  title:"Machine offline for 3+ days", body:"WKSTN-HR-010 (192.168.1.110) has not been seen since Apr 11, 2026.",     time:"Today, 6:00 AM",     read:true,  link:"/monitoring" },
  { id:11, type:"system",  title:"Scheduled report generated",  body:"Monthly maintenance completion report for March 2026 is ready.",         time:"Apr 1, 2026",        read:true,  link:"/reports"    },
];

const TYPE_CONFIG = {
  overdue: { label:"Overdue",   icon:"⏰", bg:"bg-red-100",   text:"text-red-600",   dot:"bg-red-500",   filter:"Overdue"   },
  due:     { label:"Due Today", icon:"📅", bg:"bg-amber-100", text:"text-amber-600", dot:"bg-amber-400", filter:"Due Today"  },
  tamper:  { label:"Tamper",    icon:"🔓", bg:"bg-red-100",   text:"text-red-700",   dot:"bg-red-600",   filter:"Tamper"    },
  asset:   { label:"Asset",     icon:"📦", bg:"bg-blue-100",  text:"text-blue-600",  dot:"bg-blue-500",  filter:"Asset"     },
  system:  { label:"System",    icon:"⚙️", bg:"bg-gray-100",  text:"text-gray-600",  dot:"bg-gray-400",  filter:"System"    },
};

const FILTERS = ["All", "Overdue", "Due Today", "Tamper", "Asset", "System"];

// ── Component ──────────────────────────────────────────────────────────────────
export default function NotificationsPanel({ notifications, setNotifications }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [open, setOpen]     = useState(false);
  const [filter, setFilter] = useState("All");

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handle(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }
  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }
  function dismiss(id, e) {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  }
  function handleClick(notif) {
    markRead(notif.id);
    setOpen(false);
    navigate(notif.link);
  }

  const visible = notifications.filter(n =>
    filter === "All" || TYPE_CONFIG[n.type]?.filter === filter
  );

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`relative w-8 h-8 border rounded-lg flex items-center justify-center transition-all
          ${open ? "bg-[#0f2744] border-[#0f2744]" : "border-gray-200 hover:bg-gray-50"}`}>
        <svg className={`w-4 h-4 ${open ? "text-white" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-0.5">
            <span className="text-white text-[9px] font-bold leading-none">{unread > 9 ? "9+" : unread}</span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
          style={{ maxHeight:"540px" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0f2744]">Notifications</h3>
              {unread > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">{unread}</span>}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-semibold text-[#2980B9] hover:underline">
                Mark all read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 px-3 py-2 border-b border-gray-50 overflow-x-auto flex-shrink-0">
            {FILTERS.map(f => {
              const count = f === "All"
                ? notifications.filter(n => !n.read).length
                : notifications.filter(n => !n.read && TYPE_CONFIG[n.type]?.filter === f).length;
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg whitespace-nowrap flex items-center gap-1 transition-all
                    ${filter === f ? "bg-[#0f2744] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  {f}
                  {count > 0 && (
                    <span className={`text-[9px] font-bold px-1 rounded-full ${filter === f ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p className="text-xs font-medium">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {visible.map(n => {
                  const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                  return (
                    <div key={n.id} onClick={() => handleClick(n)}
                      className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${!n.read ? "bg-blue-50/40" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                        <span className="text-sm leading-none">{cfg.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold leading-snug ${!n.read ? "text-[#0f2744]" : "text-gray-600"}`}>{n.title}</p>
                          <button onClick={e => dismiss(n.id, e)} className="text-gray-300 hover:text-gray-500 text-xs flex-shrink-0 mt-0.5">✕</button>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{n.body}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                            {cfg.label}
                          </span>
                          <span className="text-[10px] text-gray-400">{n.time}</span>
                          {!n.read && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2980B9] flex-shrink-0"></span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between flex-shrink-0 bg-gray-50">
            <span className="text-[10px] text-gray-400">{notifications.length} total · {unread} unread</span>
            <button onClick={() => setNotifications([])} className="text-[10px] font-semibold text-gray-400 hover:text-red-500 transition-colors">
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}