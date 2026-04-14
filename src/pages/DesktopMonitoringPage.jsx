import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Demo client data ───────────────────────────────────────────────────────────
const INITIAL_CLIENTS = [
  { id:1,  name:"WKSTN-IT-001",   user:"R. Santos",    ip:"192.168.1.101", mac:"A1:B2:C3:D4:E5:F6", os:"Windows 10 Pro",     dept:"IT",   location:"IT Office",    cpu:72, ram:65, disk:48, status:"Online",  lastSeen:"Just now",        uptime:"3d 4h 12m",  alerts:1 },
  { id:2,  name:"WKSTN-QA-002",   user:"M. Reyes",     ip:"192.168.1.102", mac:"A1:B2:C3:D4:E5:F7", os:"Windows 10 Pro",     dept:"QA",   location:"QA Office",    cpu:34, ram:52, disk:61, status:"Online",  lastSeen:"2 min ago",       uptime:"1d 9h 5m",   alerts:0 },
  { id:3,  name:"WKSTN-QA-003",   user:"J. dela Cruz", ip:"192.168.1.103", mac:"A1:B2:C3:D4:E5:F8", os:"Windows 11 Pro",     dept:"QA",   location:"QA Office",    cpu:88, ram:91, disk:77, status:"Online",  lastSeen:"Just now",        uptime:"6h 40m",     alerts:2 },
  { id:4,  name:"WKSTN-HR-004",   user:"C. Bautista",  ip:"192.168.1.104", mac:"A1:B2:C3:D4:E5:F9", os:"Windows 10 Home",    dept:"HR",   location:"HR Office",    cpu:0,  ram:0,  disk:55, status:"Offline", lastSeen:"2 hours ago",     uptime:"—",          alerts:0 },
  { id:5,  name:"WKSTN-MGMT-005", user:"A. Villanueva",ip:"192.168.1.105", mac:"A1:B2:C3:D4:E5:FA", os:"Windows 11 Pro",     dept:"Mgmt", location:"Management",   cpu:19, ram:41, disk:33, status:"Online",  lastSeen:"Just now",        uptime:"5d 2h",      alerts:0 },
  { id:6,  name:"WKSTN-IT-006",   user:"B. Gomez",     ip:"192.168.1.106", mac:"A1:B2:C3:D4:E5:FB", os:"Windows 10 Pro",     dept:"IT",   location:"IT Office",    cpu:55, ram:70, disk:82, status:"Online",  lastSeen:"Just now",        uptime:"2d 11h",     alerts:1 },
  { id:7,  name:"WKSTN-QA-007",   user:"Unassigned",   ip:"192.168.1.107", mac:"A1:B2:C3:D4:E5:FC", os:"Windows 10 Pro",     dept:"QA",   location:"Lab B",        cpu:0,  ram:0,  disk:29, status:"Offline", lastSeen:"1 day ago",       uptime:"—",          alerts:0 },
  { id:8,  name:"WKSTN-IT-008",   user:"K. Peralta",   ip:"192.168.1.108", mac:"A1:B2:C3:D4:E5:FD", os:"Windows 11 Home",    dept:"IT",   location:"Server Room",  cpu:41, ram:58, disk:44, status:"Online",  lastSeen:"5 min ago",       uptime:"8h 22m",     alerts:0 },
  { id:9,  name:"WKSTN-QA-009",   user:"L. Soriano",   ip:"192.168.1.109", mac:"A1:B2:C3:D4:E5:FE", os:"Windows 10 Pro",     dept:"QA",   location:"Tadeco Wharf", cpu:62, ram:74, disk:68, status:"Online",  lastSeen:"1 min ago",       uptime:"1d 3h",      alerts:0 },
  { id:10, name:"WKSTN-HR-010",   user:"D. Navarro",   ip:"192.168.1.110", mac:"A1:B2:C3:D4:E5:FF", os:"Windows 10 Home",    dept:"HR",   location:"HR Office",    cpu:0,  ram:0,  disk:41, status:"Offline", lastSeen:"3 days ago",      uptime:"—",          alerts:1 },
];

const ALERT_MESSAGES = {
  1:  ["High CPU usage (72%) — monitor workload"],
  3:  ["CPU usage critical (88%)", "RAM near capacity (91%) — consider upgrade"],
  6:  ["Disk usage high (82%) — clean up recommended"],
  10: ["Machine offline for 3+ days — check if decommissioned"],
};

const MOCK_HISTORY = [
  { text:"CPU spike detected — 94% for 5 min", time:"Today, 8:45 AM",    color:"bg-red-500"   },
  { text:"Scheduled maintenance completed",    time:"Apr 10, 2026",      color:"bg-green-500" },
  { text:"OS update applied — KB5034765",      time:"Apr 1, 2026",       color:"bg-blue-500"  },
  { text:"Added to monitoring registry",       time:"Jan 15, 2021",      color:"bg-[#0f2744]" },
];

const DEPT_FILTERS = ["All","IT","QA","HR","Mgmt"];
const STATUS_FILTERS = ["All","Online","Offline"];

const NAV = [
  { label:"Dashboard",   path:"/dashboard"   },
  { label:"Assets",      path:"/assets"      },
  { label:"Scheduling",  path:"/scheduling"  },
  { label:"My Tasks",    path:"/tasks"       },
  { label:"Logs",        path:"/logs"        },
  { label:"Monitoring",  path:"/monitoring"  },
  { label:"Reports",     path:"/reports"     },
];

// ── Metric bar ─────────────────────────────────────────────────────────────────
function MetricBar({ value, warn = 70, crit = 85 }) {
  const color = value >= crit ? "bg-red-500" : value >= warn ? "bg-amber-400" : "bg-[#2980B9]";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[10px] font-semibold w-7 text-right
        ${value >= crit ? "text-red-600" : value >= warn ? "text-amber-600" : "text-gray-500"}`}>
        {value > 0 ? `${value}%` : "—"}
      </span>
    </div>
  );
}

// ── Pulsing dot ────────────────────────────────────────────────────────────────
function StatusDot({ status }) {
  return status === "Online"
    ? <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </span>
    : <span className="inline-flex rounded-full h-2.5 w-2.5 bg-gray-300"></span>;
}

export default function DesktopMonitoringPage() {
  const navigate = useNavigate();

  const [clients, setClients]       = useState(INITIAL_CLIENTS);
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate live CPU/RAM fluctuation every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setClients(prev => prev.map(c => {
        if (c.status === "Offline") return c;
        const jitter = v => Math.min(99, Math.max(1, v + Math.floor(Math.random() * 11) - 5));
        return { ...c, cpu: jitter(c.cpu), ram: jitter(c.ram) };
      }));
      setLastRefresh(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const visible = clients.filter(c => {
    const matchDept   = deptFilter === "All"   || c.dept === deptFilter;
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchSearch = !search
      || c.name.toLowerCase().includes(search.toLowerCase())
      || c.user.toLowerCase().includes(search.toLowerCase())
      || c.ip.includes(search)
      || c.location.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchStatus && matchSearch;
  });

  const totalOnline  = clients.filter(c => c.status === "Online").length;
  const totalOffline = clients.filter(c => c.status === "Offline").length;
  const totalAlerts  = clients.reduce((sum, c) => sum + c.alerts, 0);
  const avgCpu       = Math.round(clients.filter(c=>c.status==="Online").reduce((s,c)=>s+c.cpu,0) / totalOnline);

  const stats = [
    { label:"Total Clients",  value: clients.length, sub:"Registered machines",  color:"text-[#2980B9]", bar:"bg-[#2980B9]", pct:`${Math.round(clients.length/clients.length*100)}%` },
    { label:"Online",         value: totalOnline,    sub:"Currently active",      color:"text-green-700", bar:"bg-green-500", pct:`${Math.round(totalOnline/clients.length*100)}%`   },
    { label:"Offline",        value: totalOffline,   sub:"Not responding",        color:"text-gray-500",  bar:"bg-gray-400",  pct:`${Math.round(totalOffline/clients.length*100)}%`  },
    { label:"Alerts",         value: totalAlerts,    sub:"Need attention",        color:"text-red-700",   bar:"bg-red-500",   pct:`${Math.round(totalAlerts/clients.length*100)}%`   },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">

      {/* ── Sidebar ── */}
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
              className="w-full text-left px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
              {n.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 mt-2 uppercase tracking-widest">Work</p>
          {NAV.slice(3,6).map(n => (
            <button key={n.label} onClick={() => navigate(n.path)}
              className={`w-full text-left px-4 py-2 text-sm border-l-2 transition-all
                ${n.path === "/monitoring"
                  ? "bg-[#2980B9]/20 text-white border-[#2980B9]"
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
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2980B9] flex items-center justify-center text-white text-xs font-semibold">JM</div>
            <div>
              <p className="text-white text-xs font-medium">J. Smagayon</p>
              <p className="text-[#93b5d8] text-[10px]">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[#0f2744] font-bold text-lg">Desktop Monitoring</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Last refreshed: {lastRefresh.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit" })}
              &nbsp;·&nbsp;Auto-updates every 5s
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setLastRefresh(new Date()); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Refresh
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
                <p className={`text-xs font-semibold mb-1.5 ${s.color}`}>{s.label}</p>
                <p className="text-3xl font-bold text-[#0f2744]">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                <div className="h-1 bg-gray-100 rounded-full mt-3">
                  <div className={`h-full rounded-full ${s.bar}`} style={{ width: s.pct }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Avg CPU Banner ── */}
          <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-[#0f2744] font-semibold">
              <svg className="w-4 h-4 text-[#2980B9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>
              </svg>
              Live Network Overview
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-semibold text-gray-700">{totalOnline}</span> online
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span className="font-semibold text-gray-700">{totalOffline}</span> offline
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              Avg CPU (online):
              <span className={`font-semibold ${avgCpu >= 85 ? "text-red-600" : avgCpu >= 70 ? "text-amber-600" : "text-gray-700"}`}>{avgCpu}%</span>
            </div>
            {totalAlerts > 0 && (
              <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                {totalAlerts} alert{totalAlerts > 1 ? "s" : ""} require attention
              </div>
            )}
          </div>

          {/* ── Filters + Search ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, user, IP, or location..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-xs text-gray-700 outline-none focus:border-[#2980B9]"/>
            </div>
            <div className="flex gap-1.5">
              {STATUS_FILTERS.map(f => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
                    ${statusFilter === f ? "bg-[#0f2744] text-white border-[#0f2744]" : "bg-white text-gray-500 border-gray-200 hover:border-[#2980B9]"}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {DEPT_FILTERS.map(f => (
                <button key={f} onClick={() => setDeptFilter(f)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
                    ${deptFilter === f ? "bg-[#2980B9] text-white border-[#2980B9]" : "bg-white text-gray-500 border-gray-200 hover:border-[#2980B9]"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Client Table ── */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Machine / User</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">IP Address</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-28">CPU</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-28">RAM</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-28">Disk</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Uptime</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Alerts</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map(c => (
                  <tr key={c.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === c.id ? "bg-blue-50" : ""}`}
                    onClick={() => setSelected(c)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={c.status} />
                        <span className={`text-[10px] font-semibold ${c.status === "Online" ? "text-green-700" : "text-gray-400"}`}>
                          {c.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 font-mono text-[11px]">{c.name}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">{c.user} · {c.dept}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono">{c.ip}</td>
                    <td className="px-4 py-3 text-gray-500">{c.location}</td>
                    <td className="px-4 py-3"><MetricBar value={c.cpu} /></td>
                    <td className="px-4 py-3"><MetricBar value={c.ram} warn={75} crit={90} /></td>
                    <td className="px-4 py-3"><MetricBar value={c.disk} warn={70} crit={85} /></td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">{c.uptime}</td>
                    <td className="px-4 py-3">
                      {c.alerts > 0
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-semibold">
                            ⚠ {c.alerts}
                          </span>
                        : <span className="text-gray-300 text-[10px]">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-[10px] text-[#2980B9] hover:underline font-semibold">Details</button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">No clients match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* ── Detail Drawer ── */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <StatusDot status={selected.status} />
                <h2 className="text-base font-bold text-[#0f2744]">{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

              {/* Alerts */}
              {selected.alerts > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1.5">⚠ Active Alerts</p>
                  {(ALERT_MESSAGES[selected.id] || []).map((msg, i) => (
                    <p key={i} className="text-xs text-red-700">{msg}</p>
                  ))}
                </div>
              )}

              {/* Live Metrics */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Live Metrics</p>
                <div className="space-y-3">
                  {[["CPU Usage", selected.cpu, 70, 85], ["RAM Usage", selected.ram, 75, 90], ["Disk Usage", selected.disk, 70, 85]].map(([label, val, w, c]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 font-medium">{label}</span>
                        <span className={`font-bold ${val >= c ? "text-red-600" : val >= w ? "text-amber-600" : "text-[#2980B9]"}`}>
                          {val > 0 ? `${val}%` : "—"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${val >= c ? "bg-red-500" : val >= w ? "bg-amber-400" : "bg-[#2980B9]"}`}
                          style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Info */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">System Info</p>
                <div className="divide-y divide-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                  {[
                    ["OS",          selected.os],
                    ["IP Address",  selected.ip],
                    ["MAC Address", selected.mac],
                    ["Location",    selected.location],
                    ["Department",  selected.dept],
                    ["User",        selected.user],
                    ["Last Seen",   selected.lastSeen],
                    ["Uptime",      selected.uptime],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between px-3 py-2 text-xs">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-gray-700 font-medium font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event History */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Event History</p>
                <div className="space-y-0 divide-y divide-gray-50">
                  {MOCK_HISTORY.map((h, i) => (
                    <div key={i} className="flex gap-2.5 py-2.5">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${h.color}`}></div>
                      <div>
                        <p className="text-xs text-gray-600">{h.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{h.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
              <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a3a5c]">
                Schedule Maintenance
              </button>
              <button className="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                Export
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
