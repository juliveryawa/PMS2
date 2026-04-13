import { useNavigate } from "react-router-dom";

const kpis = [
  { label: "Total Assets",   value: "148", sub: "+6 this month",    color: "text-[#2980B9]", bar: "bg-[#2980B9]", pct: "74%" },
  { label: "Pending Tasks",  value: "23",  sub: "8 due today",      color: "text-amber-700",  bar: "bg-amber-400",  pct: "40%" },
  { label: "Overdue",        value: "5",   sub: "Needs attention",  color: "text-red-700",    bar: "bg-red-500",    pct: "15%" },
  { label: "Completed",      value: "91",  sub: "This month",       color: "text-green-700",  bar: "bg-green-500",  pct: "88%" },
];

const upcomingTasks = [
  { name: "Server Room — UPS check",          meta: "Assigned: R. Santos", badge: "Overdue",   badgeColor: "bg-red-50 text-red-700",    dot: "bg-red-500"   },
  { name: "Network switch — firmware update", meta: "Due today",           badge: "Due today", badgeColor: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  { name: "Printer fleet — cartridge replace",meta: "Due Apr 15",          badge: "Upcoming",  badgeColor: "bg-blue-50 text-blue-700",   dot: "bg-blue-500"  },
  { name: "Workstation cluster B — disk check",meta: "Due Apr 18",         badge: "Upcoming",  badgeColor: "bg-blue-50 text-blue-700",   dot: "bg-blue-500"  },
];

const assets = [
  { name: "Dell PowerEdge R740",       cat: "Server",  status: "Active",      statusColor: "bg-green-50 text-green-700" },
  { name: "Cisco Catalyst 2960",       cat: "Network", status: "Maintenance", statusColor: "bg-amber-50 text-amber-700" },
  { name: "HP LaserJet Pro M404",      cat: "Printer", status: "Active",      statusColor: "bg-green-50 text-green-700" },
  { name: "Lenovo ThinkCentre M70",    cat: "Desktop", status: "Active",      statusColor: "bg-green-50 text-green-700" },
];

const activity = [
  { text: "UPS maintenance completed by R. Santos",     time: "Today, 9:14 AM",      iconBg: "bg-green-600"  },
  { text: "Ticket #042 opened — Monitor flickering, Lab B", time: "Today, 8:30 AM",  iconBg: "bg-[#2980B9]"  },
  { text: "Server Room UPS task is now overdue",        time: "Yesterday, 5:00 PM",  iconBg: "bg-amber-500"  },
  { text: "New asset added — Lenovo ThinkCentre M70",  time: "Yesterday, 2:45 PM",  iconBg: "bg-[#0f2744]"  },
];

const navItems = [
  { label: "Dashboard",   path: "/dashboard",  active: true  },
  { label: "Assets",      path: "/assets",     active: false },
  { label: "Scheduling",  path: "/scheduling", active: false },
  { label: "My Tasks",    path: "/tasks",      active: false },
  { label: "Logs",        path: "/logs",       active: false },
  { label: "Tickets",     path: "/tickets",    active: false },
  { label: "Reports",     path: "/reports",    active: false },
];

const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const completedBars = [55, 68, 75, 80, 88, 91];
const missedBars    = [28, 20, 14, 18, 10,  5];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-52 bg-[#0f2744] flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
          <div className="w-8 h-8 bg-[#2980B9] rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-wide">PMS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 pb-1 pt-2 uppercase tracking-widest">Main</p>
          {navItems.slice(0, 3).map(item => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm border-l-2 transition-all
                ${item.active ? "bg-[#2980B9]/20 text-white border-[#2980B9]" : "text-[#93b5d8] border-transparent hover:bg-white/5 hover:text-white"}`}>
              {item.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 pb-1 pt-3 uppercase tracking-widest">Work</p>
          {navItems.slice(3, 6).map(item => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
              {item.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 pb-1 pt-3 uppercase tracking-widest">Insights</p>
          {navItems.slice(6).map(item => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
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
          <h1 className="text-[#0f2744] font-bold text-lg">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-gray-100 rounded-md px-3 py-1">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <button className="relative w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-3">
            {kpis.map(k => (
              <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4">
                <p className={`text-xs font-semibold mb-1.5 ${k.color}`}>{k.label}</p>
                <p className="text-3xl font-bold text-[#0f2744]">{k.value}</p>
                <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
                <div className="h-1 bg-gray-100 rounded-full mt-3">
                  <div className={`h-full rounded-full ${k.bar}`} style={{ width: k.pct }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Upcoming Tasks */}
          <div className="grid grid-cols-3 gap-3">
            {/* Bar Chart */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[#0f2744]">Maintenance completion — last 6 months</h2>
                <button className="text-xs text-[#2980B9] hover:underline">Export</button>
              </div>
              <div className="flex items-end gap-2 h-32">
                {months.map((m, i) => (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "112px" }}>
                      <div className="w-full rounded-t bg-red-400" style={{ height: `${missedBars[i]}px` }}></div>
                      <div className="w-full rounded-t bg-[#2980B9]" style={{ height: `${completedBars[i]}px` }}></div>
                    </div>
                    <span className="text-[9px] text-gray-400">{m}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#2980B9]"></div>Completed
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-sm bg-red-400"></div>Missed
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#0f2744]">Upcoming tasks</h2>
                <button className="text-xs text-[#2980B9] hover:underline" onClick={() => navigate("/tasks")}>View all</button>
              </div>
              <div className="space-y-2">
                {upcomingTasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{t.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t.meta}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${t.badgeColor} whitespace-nowrap`}>{t.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assets + Activity */}
          <div className="grid grid-cols-2 gap-3">
            {/* Recent Assets */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#0f2744]">Recent assets</h2>
                <button className="text-xs text-[#2980B9] hover:underline" onClick={() => navigate("/assets")}>Manage assets</button>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="text-left pb-2 font-semibold">Asset</th>
                    <th className="text-left pb-2 font-semibold">Category</th>
                    <th className="text-left pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="py-2 text-gray-700 font-medium">{a.name}</td>
                      <td className="py-2 text-gray-400">{a.cat}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${a.statusColor}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#0f2744]">Recent activity</h2>
                <button className="text-xs text-[#2980B9] hover:underline" onClick={() => navigate("/logs")}>View logs</button>
              </div>
              <div className="space-y-0 divide-y divide-gray-50">
                {activity.map((a, i) => (
                  <div key={i} className="flex gap-2.5 py-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${a.iconBg}`}>
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 leading-snug">{a.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
