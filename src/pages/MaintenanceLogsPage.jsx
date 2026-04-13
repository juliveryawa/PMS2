import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Demo data ─────────────────────────────────────────────────────────────────
const LOGS = [
  { id:"LOG-001", asset:"Dell PowerEdge R740",    tech:"R. Santos",    initials:"RS", date:"Apr 13, 2026", start:"09:00 AM", end:"10:15 AM", duration:"1h 15m", status:"Completed",  notes:"Full health check completed. No issues found. RAID array healthy." },
  { id:"LOG-002", asset:"Cisco Catalyst 2960",     tech:"M. Reyes",     initials:"MR", date:"Apr 13, 2026", start:"08:30 AM", end:"—",         duration:"—",     status:"In Progress", notes:"Firmware update in progress. Switch rebooted once." },
  { id:"LOG-003", asset:"HP LaserJet Pro M404",    tech:"J. dela Cruz", initials:"JC", date:"Apr 12, 2026", start:"02:00 PM", end:"02:45 PM", duration:"45m",   status:"Completed",  notes:"Replaced toner cartridge and cleaned paper feed rollers." },
  { id:"LOG-004", asset:"APC Smart-UPS 1500",      tech:"R. Santos",    initials:"RS", date:"Apr 12, 2026", start:"11:00 AM", end:"—",         duration:"—",     status:"Pending",    notes:"Battery test scheduled but technician unavailable." },
  { id:"LOG-005", asset:"Lenovo ThinkCentre M70",  tech:"M. Reyes",     initials:"MR", date:"Apr 11, 2026", start:"10:00 AM", end:"10:30 AM", duration:"30m",   status:"Completed",  notes:"Disk check passed. Cleaned dust from vents and fans." },
  { id:"LOG-006", asset:"Dell PowerEdge R740",     tech:"R. Santos",    initials:"RS", date:"Apr 10, 2026", start:"03:00 PM", end:"04:00 PM", duration:"1h",    status:"Completed",  notes:"Backup verification successful. All snapshots intact." },
  { id:"LOG-007", asset:"Cisco Catalyst 2960",     tech:"J. dela Cruz", initials:"JC", date:"Apr 9, 2026",  start:"09:30 AM", end:"—",         duration:"—",     status:"Deferred",   notes:"Deferred due to network downtime window conflict." },
  { id:"LOG-008", asset:"HP LaserJet Pro M404",    tech:"M. Reyes",     initials:"MR", date:"Apr 8, 2026",  start:"01:00 PM", end:"01:30 PM", duration:"30m",   status:"Completed",  notes:"Monthly maintenance done. Cartridge levels normal." },
  { id:"LOG-009", asset:"Lenovo ThinkCentre M70",  tech:"J. dela Cruz", initials:"JC", date:"Apr 7, 2026",  start:"11:30 AM", end:"12:00 PM", duration:"30m",   status:"Completed",  notes:"Windows updates applied. System restarted cleanly." },
  { id:"LOG-010", asset:"APC Smart-UPS 1500",      tech:"R. Santos",    initials:"RS", date:"Apr 5, 2026",  start:"02:30 PM", end:"03:00 PM", duration:"30m",   status:"In Progress", notes:"Battery replacement ongoing. Parts ordered." },
];

const STATUS_FILTERS = ["All", "Completed", "In Progress", "Pending", "Deferred"];

const STATUS_STYLE = {
  "Completed":   { pill: "bg-green-50 text-green-700",  dot: "bg-green-600"  },
  "In Progress": { pill: "bg-blue-50 text-blue-700",    dot: "bg-blue-500"   },
  "Pending":     { pill: "bg-amber-50 text-amber-700",  dot: "bg-amber-400"  },
  "Deferred":    { pill: "bg-gray-100 text-gray-500",   dot: "bg-gray-400"   },
};

const NAV = [
  { label:"Dashboard",  path:"/dashboard"  },
  { label:"Assets",     path:"/assets"     },
  { label:"Scheduling", path:"/scheduling" },
  { label:"My Tasks",   path:"/tasks"      },
  { label:"Logs",       path:"/logs"       },
  { label:"Tickets",    path:"/tickets"    },
  { label:"Reports",    path:"/reports"    },
];

export default function MaintenanceLogsPage() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch]             = useState("");
  const [dateFrom, setDateFrom]         = useState("2026-04-01");
  const [dateTo, setDateTo]             = useState("2026-04-13");
  const [selected, setSelected]         = useState(null); // drawer log

  // ── Filter ────────────────────────────────────────────────────────────────
  const visible = LOGS.filter(l => {
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchSearch = !search ||
      l.asset.toLowerCase().includes(search.toLowerCase()) ||
      l.tech.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">

      {/* Sidebar */}
      <aside className="w-52 bg-[#0f2744] flex flex-col flex-shrink-0">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
          <div className="w-8 h-8 bg-[#2980B9] rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-white font-bold text-base">PMS</span>
        </div>
        <nav className="flex-1 py-3">
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 uppercase tracking-widest">Main</p>
          {NAV.slice(0,3).map(n => (
            <button key={n.label} onClick={() => navigate(n.path)}
              className={`w-full text-left px-4 py-2 text-sm border-l-2 transition-all
                ${n.path === "/logs" ? "bg-[#2980B9]/20 text-white border-[#2980B9]"
                  : "text-[#93b5d8] border-transparent hover:bg-white/5 hover:text-white"}`}>
              {n.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 mt-2 uppercase tracking-widest">Work</p>
          {NAV.slice(3,6).map(n => (
            <button key={n.label} onClick={() => navigate(n.path)}
              className={`w-full text-left px-4 py-2 text-sm border-l-2 transition-all
                ${n.path === "/logs" ? "bg-[#2980B9]/20 text-white border-[#2980B9]"
                  : "text-[#93b5d8] border-transparent hover:bg-white/5 hover:text-white"}`}>
              {n.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 mt-2 uppercase tracking-widest">Insights</p>
          {NAV.slice(6).map(n => (
            <button key={n.label} onClick={() => navigate(n.path)}
              className="w-full text-left px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
              {n.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2980B9] flex items-center justify-center text-white text-xs font-semibold">JM</div>
          <div>
            <p className="text-white text-xs font-medium">J. Smagayon</p>
            <p className="text-[#93b5d8] text-[10px]">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="text-[#0f2744] font-bold text-lg">Maintenance Logs</h1>
          <div className="flex gap-2">
            {["Export CSV", "Export PDF"].map(label => (
              <button key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* KPI stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { val:"247", lbl:"Total logs",   color:"text-[#0f2744]" },
              { val:"91",  lbl:"Completed",    color:"text-green-700" },
              { val:"12",  lbl:"In progress",  color:"text-blue-700"  },
              { val:"8",   lbl:"Pending",      color:"text-amber-700" },
            ].map(s => (
              <div key={s.lbl} className="bg-white rounded-xl border border-gray-100 p-3">
                <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.lbl}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                  ${statusFilter === f ? "bg-[#0f2744] text-white border-[#0f2744]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                {f}
              </button>
            ))}
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 bg-white outline-none focus:border-[#2980B9]"/>
            <span className="text-xs text-gray-400">to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 bg-white outline-none focus:border-[#2980B9]"/>
            <div className="relative ml-auto">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search logs..."
                className="pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white outline-none focus:border-[#2980B9] w-48"/>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Log ID","Asset","Technician","Date","Duration","Status","Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visible.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-400">No logs found.</td></tr>
                  )}
                  {visible.map(log => {
                    const s = STATUS_STYLE[log.status] || STATUS_STYLE["Deferred"];
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 font-mono text-[11px] text-gray-400">{log.id}</td>
                        <td className="px-4 py-2.5 font-medium text-gray-800">{log.asset}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[9px] font-bold text-blue-700 flex-shrink-0">{log.initials}</div>
                            <span className="text-gray-600">{log.tech}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="text-gray-600">{log.date}</p>
                          <p className="text-[10px] text-gray-400">{log.start}</p>
                        </td>
                        <td className="px-4 py-2.5 text-gray-500">{log.duration}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold ${s.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <button onClick={() => setSelected(log)}
                            className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100">
              <p className="text-[11px] text-gray-400">Showing 1–{Math.min(10, visible.length)} of {visible.length} entries</p>
              <div className="flex gap-1">
                {["‹","1","2","3","›"].map((p,i) => (
                  <button key={i}
                    className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center transition-all
                      ${p === "1" ? "bg-[#0f2744] text-white border-[#0f2744]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Detail Drawer ── */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelected(null)}/>
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#0f2744]">Log Details</h2>
              <button onClick={() => setSelected(null)}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-3">
                <p className="text-[10px] text-gray-400 mb-1">Log ID</p>
                <p className="font-mono text-sm font-semibold text-[#0f2744]">{selected.id}</p>
              </div>
              <div className="mb-4">
                {(() => { const s = STATUS_STYLE[selected.status] || STATUS_STYLE["Deferred"]; return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${s.pill}`}>
                    <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                    {selected.status}
                  </span>
                ); })()}
              </div>
              {[
                ["Asset",      selected.asset],
                ["Technician", selected.tech],
                ["Date",       selected.date],
                ["Start time", selected.start],
                ["End time",   selected.end],
                ["Duration",   selected.duration],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-700 text-right max-w-[180px]">{value}</span>
                </div>
              ))}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Technician Notes</p>
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed">{selected.notes}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
