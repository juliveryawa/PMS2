import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Static demo data ──────────────────────────────────────────────────────────
const SCHEDULES = [
  { id:1, name:"Monthly server health check",      asset:"Dell PowerEdge R740",    freq:"Monthly",   due:"Apr 15, 2026", tech:"R. Santos",    status:"Overdue",   priority:"High"    },
  { id:2, name:"Weekly network switch inspection", asset:"Cisco Catalyst 2960",    freq:"Weekly",    due:"Apr 14, 2026", tech:"M. Reyes",     status:"Due today", priority:"Medium"  },
  { id:3, name:"Quarterly UPS battery test",       asset:"APC Smart-UPS 1500",     freq:"Quarterly", due:"Apr 20, 2026", tech:"R. Santos",    status:"Upcoming",  priority:"High"    },
  { id:4, name:"Monthly printer maintenance",      asset:"HP LaserJet Pro M404",   freq:"Monthly",   due:"Apr 22, 2026", tech:"J. dela Cruz", status:"Upcoming",  priority:"Low"     },
  { id:5, name:"Weekly workstation check",         asset:"Lenovo ThinkCentre M70", freq:"Weekly",    due:"Apr 14, 2026", tech:"M. Reyes",     status:"Due today", priority:"Medium"  },
  { id:6, name:"Annual software audit",            asset:"All Workstations",       freq:"Annually",  due:"Jun 1, 2026",  tech:"J. dela Cruz", status:"Active",    priority:"Medium"  },
  { id:7, name:"Daily backup verification",        asset:"Dell PowerEdge R740",    freq:"Daily",     due:"Apr 13, 2026", tech:"R. Santos",    status:"Active",    priority:"Critical"},
  { id:8, name:"Monthly storage cleanup",          asset:"Lenovo ThinkCentre M70", freq:"Monthly",   due:"Apr 30, 2026", tech:"J. dela Cruz", status:"Active",    priority:"Low"     },
];

const ASSETS      = ["Dell PowerEdge R740","Cisco Catalyst 2960","HP LaserJet Pro M404","Lenovo ThinkCentre M70","APC Smart-UPS 1500"];
const TECHNICIANS = ["R. Santos","M. Reyes","J. dela Cruz"];
const FREQS       = ["Daily","Weekly","Monthly","Quarterly","Annually"];
const PRIORITIES  = ["Low","Medium","High","Critical"];
const FILTERS     = ["All","Daily","Weekly","Monthly","Quarterly","Annually"];

const STATUS_STYLE = {
  "Overdue":  "bg-red-50 text-red-700",
  "Due today":"bg-amber-50 text-amber-700",
  "Upcoming": "bg-blue-50 text-blue-700",
  "Active":   "bg-green-50 text-green-700",
};
const PRIORITY_STYLE = {
  "Critical":"bg-red-50 text-red-700",
  "High":    "bg-amber-50 text-amber-700",
  "Medium":  "bg-blue-50 text-blue-700",
  "Low":     "bg-gray-100 text-gray-500",
};

// ── Calendar events (day → list of tasks) ────────────────────────────────────
const CAL_EVENTS = {
  13:[{label:"Daily backup",   color:"bg-blue-100 text-blue-800"},{label:"Switch check",color:"bg-amber-100 text-amber-800"}],
  15:[{label:"Server health",  color:"bg-red-100 text-red-800"}],
  20:[{label:"UPS battery",    color:"bg-blue-100 text-blue-800"}],
  22:[{label:"Printer maint.", color:"bg-green-100 text-green-800"}],
  30:[{label:"Storage cleanup",color:"bg-blue-100 text-blue-800"}],
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV = [
  { label:"Dashboard",  path:"/dashboard"  },
  { label:"Assets",     path:"/assets"     },
  { label:"Scheduling", path:"/scheduling" },
  { label:"My Tasks",   path:"/tasks"      },
  { label:"Logs",       path:"/logs"       },
  { label:"Tickets",    path:"/tickets"    },
  { label:"Reports",    path:"/reports"    },
];

// ── Empty form state ──────────────────────────────────────────────────────────
const EMPTY_FORM = { asset:ASSETS[0], freq:"Monthly", due:"", tech:TECHNICIANS[0], description:"", priority:"Medium", status:"Active" };

export default function SchedulingPage() {
  const navigate = useNavigate();

  const [view, setView]         = useState("list");   // "list" | "cal"
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");
  const [schedules, setSchedules] = useState(SCHEDULES);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [calYear, setCalYear]   = useState(2026);
  const [calMonth, setCalMonth] = useState(3);         // 0-indexed

  // ── Filter logic ─────────────────────────────────────────────────────────
  const visible = schedules.filter(s => {
    const matchFreq = filter === "All" || s.freq === filter;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.asset.toLowerCase().includes(search.toLowerCase());
    return matchFreq && matchSearch;
  });

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const firstDay  = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevDays  = new Date(calYear, calMonth, 0).getDate();

  function changeMonth(delta) {
    let m = calMonth + delta, y = calYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setCalMonth(m); setCalYear(y);
  }

  // ── Form submit ───────────────────────────────────────────────────────────
  function handleSave() {
    if (!form.due) return alert("Please select a due date.");
    const newSched = {
      id: schedules.length + 1,
      name: `${form.freq} ${form.asset} maintenance`,
      asset: form.asset, freq: form.freq,
      due: new Date(form.due).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
      tech: form.tech, status: "Active", priority: form.priority,
    };
    setSchedules(prev => [newSched, ...prev]);
    setModal(false);
    setForm(EMPTY_FORM);
  }

  // ── Render ────────────────────────────────────────────────────────────────
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
                ${n.path === "/scheduling"
                  ? "bg-[#2980B9]/20 text-white border-[#2980B9]"
                  : "text-[#93b5d8] border-transparent hover:bg-white/5 hover:text-white"}`}>
              {n.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 mt-2 uppercase tracking-widest">Work</p>
          {NAV.slice(3,6).map(n => (
            <button key={n.label} onClick={() => navigate(n.path)}
              className="w-full text-left px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="text-[#0f2744] font-bold text-lg">Maintenance Scheduling</h1>
          <div className="flex gap-2">
            <button onClick={() => setView("list")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
                ${view === "list" ? "bg-[#0f2744] text-white border-[#0f2744]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              List view
            </button>
            <button onClick={() => setView("cal")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
                ${view === "cal" ? "bg-[#0f2744] text-white border-[#0f2744]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              Calendar view
            </button>
            <button onClick={() => setModal(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a3a5c] transition-all">
              + New Schedule
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[["34","Total schedules","text-[#0f2744]"],["8","Due this week","text-amber-700"],["3","Overdue","text-red-700"]].map(([val,lbl,cls])=>(
              <div key={lbl} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p className={`text-2xl font-bold ${cls}`}>{val}</p>
                <p className="text-xs text-gray-400 mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Filters + search */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                  ${filter === f ? "bg-[#0f2744] text-white border-[#0f2744]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                {f}
              </button>
            ))}
            <div className="relative ml-auto">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search schedules..."
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white outline-none focus:border-[#2980B9] w-52"/>
            </div>
          </div>

          {/* LIST VIEW */}
          {view === "list" && (
            <div className="space-y-2">
              {visible.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No schedules found.</div>
              )}
              {visible.map(s => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-[#2980B9] transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex-shrink-0 ${STATUS_STYLE[s.status] || "bg-gray-100 text-gray-500"}`}>{s.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{s.asset} · Technician: {s.tech}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">{s.freq}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${PRIORITY_STYLE[s.priority]}`}>{s.priority}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">Due: {s.due}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CALENDAR VIEW */}
          {view === "cal" && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => changeMonth(-1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg">‹</button>
                  <span className="text-sm font-semibold text-[#0f2744] w-32 text-center">{MONTH_NAMES[calMonth]} {calYear}</span>
                  <button onClick={() => changeMonth(1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg">›</button>
                </div>
                <div className="flex gap-3">
                  {[["bg-blue-100 text-blue-800","Scheduled"],["bg-red-100 text-red-800","Overdue"],["bg-green-100 text-green-800","Done"]].map(([cls,lbl])=>(
                    <div key={lbl} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className={`w-2.5 h-2.5 rounded-sm ${cls}`}></div>{lbl}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1 uppercase">{d}</div>
                ))}
                {/* Prev month filler */}
                {Array.from({length: firstDay}).map((_, i) => (
                  <div key={`p${i}`} className="min-h-16 rounded-lg p-1 opacity-30">
                    <p className="text-[11px] font-semibold text-gray-400">{prevDays - firstDay + 1 + i}</p>
                  </div>
                ))}
                {/* Current month days */}
                {Array.from({length: daysInMonth}).map((_, i) => {
                  const d = i + 1;
                  const isToday = d === 13 && calMonth === 3 && calYear === 2026;
                  const evs = CAL_EVENTS[d] || [];
                  return (
                    <div key={d} className={`min-h-16 rounded-lg p-1 border cursor-pointer transition-all hover:bg-gray-50
                      ${isToday ? "border-[#2980B9] bg-blue-50" : "border-transparent"}`}>
                      <p className={`text-[11px] font-semibold mb-0.5 ${isToday ? "text-[#2980B9]" : "text-gray-600"}`}>{d}</p>
                      {evs.map((e,j) => (
                        <div key={j} className={`text-[9px] rounded px-1 py-0.5 mb-0.5 truncate font-medium ${e.color}`}>{e.label}</div>
                      ))}
                    </div>
                  );
                })}
                {/* Next month filler */}
                {Array.from({length: 42 - firstDay - daysInMonth}).map((_, i) => (
                  <div key={`n${i}`} className="min-h-16 rounded-lg p-1 opacity-30">
                    <p className="text-[11px] font-semibold text-gray-400">{i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── New Schedule Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl w-[420px] max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#0f2744]">New Maintenance Schedule</h2>
              <button onClick={() => setModal(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Asset</label>
                <select value={form.asset} onChange={e => setForm(p=>({...p,asset:e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                  {ASSETS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Frequency</label>
                  <select value={form.freq} onChange={e => setForm(p=>({...p,freq:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                    {FREQS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Next due date</label>
                  <input type="date" value={form.due} onChange={e => setForm(p=>({...p,due:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Assigned technician</label>
                <select value={form.tech} onChange={e => setForm(p=>({...p,tech:e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                  {TECHNICIANS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Description / checklist</label>
                <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))}
                  rows={3} placeholder="Describe what needs to be done..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9] resize-none"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm(p=>({...p,priority:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                    <option>Active</option><option>Paused</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a3a5c]">Save schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
