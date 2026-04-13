import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Data ──────────────────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  { id:1, name:"Monthly server health check",       asset:"Dell PowerEdge R740",    assetTag:"LFC-SV-00064", company:"LFC", area:"Server Room",  dept:"IT", due:"Apr 15, 2026", status:"Overdue"     },
  { id:2, name:"Weekly network switch inspection",  asset:"Cisco Catalyst 2960",    assetTag:"LFC-NW-00021", company:"LFC", area:"Network Room", dept:"IT", due:"Apr 14, 2026", status:"In Progress"  },
  { id:3, name:"Quarterly UPS battery test",        asset:"APC Smart-UPS 1500",     assetTag:"LFC-UP-00012", company:"LFC", area:"Server Room",  dept:"IT", due:"Apr 20, 2026", status:"Pending"      },
  { id:4, name:"Monthly workstation check",         asset:"Lenovo ThinkCentre M70", assetTag:"LFC-WS-00088", company:"LFC", area:"Tadeco Wharf", dept:"QA", due:"Apr 22, 2026", status:"Pending"      },
  { id:5, name:"Daily backup verification",         asset:"Dell PowerEdge R740",    assetTag:"LFC-SV-00064", company:"LFC", area:"Server Room",  dept:"IT", due:"Apr 13, 2026", status:"Completed"    },
];

const CPU_TASKS = [
  "Blower / Vacuum / Cleaned",
  "Power Supply",
  "Mother Board",
  "Processor",
  "RAM",
  "Drive",
  "LAN Port",
  "USB Port",
  "CPU Fan",
  "CMOS Battery",
  "Installed Application Audit",
];

const PERIPHERALS = ["Monitor", "UPS", "Keyboard", "Printer", "AVR", "Mouse"];
const STATUS_FILTERS = ["All", "Pending", "In Progress", "Completed"];

const STATUS_STYLE = {
  "Overdue":     "bg-red-50 text-red-700",
  "In Progress": "bg-blue-50 text-blue-700",
  "Pending":     "bg-amber-50 text-amber-700",
  "Completed":   "bg-green-50 text-green-700",
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

// ── Default checklist state ───────────────────────────────────────────────────
function defaultChecklist() {
  return {
    assignee:   "Rosario, Julius Jose G.",
    date:       "2026-04-13",
    technician: "Jomar Rhey D. Requirme",
    cpuItems: CPU_TASKS.map((task, i) => ({ task, status: i < 9 ? "ok" : "", remarks: task === "Power Supply" ? "11/14/2022" : "" })),
    peripherals: {
      Monitor:  { name: "DELL MFG DATE: JULY 2019", assetTag: "9S-00233",  remarks: "" },
      UPS:      { name: "APC",                       assetTag: "9S04835",   remarks: "DEFECTIVE" },
      Keyboard: { name: "Genius",                    assetTag: "",          remarks: "" },
      Printer:  { name: "",                          assetTag: "",          remarks: "" },
      AVR:      { name: "",                          assetTag: "",          remarks: "" },
      Mouse:    { name: "Optical Mouse",             assetTag: "",          remarks: "Personal" },
    },
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MyTasksPage() {
  const navigate = useNavigate();

  const [tasks, setTasks]           = useState(INITIAL_TASKS);
  const [filter, setFilter]         = useState("All");
  const [selected, setSelected]     = useState(null);
  const [checklist, setChecklist]   = useState(null);

  const visible = tasks.filter(t => filter === "All" || t.status === filter);

  function selectTask(task) {
    setSelected(task);
    setChecklist(defaultChecklist());
  }

  function updateCpuItem(index, field, value) {
    setChecklist(prev => {
      const cpuItems = [...prev.cpuItems];
      cpuItems[index] = { ...cpuItems[index], [field]: value };
      return { ...prev, cpuItems };
    });
  }

  function updatePeripheral(name, field, value) {
    setChecklist(prev => ({
      ...prev,
      peripherals: { ...prev.peripherals, [name]: { ...prev.peripherals[name], [field]: value } },
    }));
  }

  function saveProgress() {
    setTasks(prev => prev.map(t => t.id === selected.id ? { ...t, status: "In Progress" } : t));
    setSelected(prev => ({ ...prev, status: "In Progress" }));
    alert("Progress saved!");
  }

  function markComplete() {
    setTasks(prev => prev.map(t => t.id === selected.id ? { ...t, status: "Completed" } : t));
    setSelected(prev => ({ ...prev, status: "Completed" }));
  }

  const StatusBar = ({ status, due }) => {
    const styles = {
      "Overdue":     "bg-red-50 text-red-700",
      "In Progress": "bg-blue-50 text-blue-700",
      "Pending":     "bg-amber-50 text-amber-700",
      "Completed":   "bg-green-50 text-green-700",
    };
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-4 ${styles[status] || styles["Pending"]}`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        Status: <strong>{status}</strong> &nbsp;·&nbsp; Due: {due}
      </div>
    );
  };

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
              className="w-full text-left px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
              {n.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 mt-2 uppercase tracking-widest">Work</p>
          {NAV.slice(3,6).map(n => (
            <button key={n.label} onClick={() => navigate(n.path)}
              className={`w-full text-left px-4 py-2 text-sm border-l-2 transition-all
                ${n.path === "/tasks" ? "bg-[#2980B9]/20 text-white border-[#2980B9]"
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
          <div className="w-8 h-8 rounded-full bg-[#2980B9] flex items-center justify-center text-white text-xs font-semibold">JR</div>
          <div>
            <p className="text-white text-xs font-medium">J. Requirme</p>
            <p className="text-[#93b5d8] text-[10px]">IT Technician</p>
          </div>
        </div>
      </aside>

      {/* Task list panel */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-bold text-sm text-[#0f2744] mb-2">My Tasks</h2>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold border transition-all
                  ${filter === f ? "bg-[#0f2744] text-white border-[#0f2744]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                {f === "In Progress" ? "Active" : f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {visible.map(t => (
            <div key={t.id} onClick={() => selectTask(t)}
              className={`border rounded-lg p-3 cursor-pointer transition-all
                ${selected?.id === t.id ? "border-[#2980B9] bg-blue-50" : "border-gray-200 hover:border-[#2980B9] hover:bg-blue-50/30"}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-semibold text-gray-800 leading-snug">{t.name}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${STATUS_STYLE[t.status]}`}>{t.status}</span>
              </div>
              <p className="text-[10px] text-gray-500 mb-0.5">{t.asset}</p>
              <p className="text-[10px] text-gray-400">Due: {t.due}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="font-bold text-sm text-[#0f2744]">
            {selected ? selected.name : "Select a task"}
          </h1>
          {selected && selected.status !== "Completed" && (
            <div className="flex gap-2">
              <button onClick={saveProgress}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
                Save progress
              </button>
              <button onClick={markComplete}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-700 text-white hover:bg-green-800">
                Mark complete
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3 pt-24">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              <p className="text-sm">Select a task to open the checklist</p>
            </div>
          ) : (
            <>
              <StatusBar status={selected.status} due={selected.due} />

              {/* ── Task Information ── */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-[#0f2744] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#2980B9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
                  </svg>
                  Task Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Name / Assignee", "assignee"],
                    ["Date",            "date"],
                  ].map(([label, field]) => (
                    <div key={field}>
                      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</label>
                      <input value={checklist[field]} onChange={e => setChecklist(p => ({ ...p, [field]: e.target.value }))}
                        type={field === "date" ? "date" : "text"}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#2980B9]"/>
                    </div>
                  ))}
                  {[
                    ["Asset Tag / CPU",    selected.assetTag],
                    ["Company",           selected.company],
                    ["IT Technician",     checklist.technician],
                    ["Area",              selected.area],
                    ["Asset / Equipment", selected.asset],
                    ["Department",        selected.dept],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</label>
                      <input defaultValue={value}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#2980B9]"/>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CPU Task Checklist ── */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-[#0f2744] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#2980B9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                  CPU Task List
                </h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[42%]">Task to be performed</th>
                      <th className="text-left py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[28%]">Status</th>
                      <th className="text-left py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {checklist.cpuItems.map((item, i) => (
                      <tr key={i}>
                        <td className="py-2 text-gray-700">{item.task}</td>
                        <td className="py-2">
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1 cursor-pointer text-green-700 font-medium">
                              <input type="radio" name={`cpu_${i}_${selected.id}`} value="ok"
                                checked={item.status === "ok"}
                                onChange={() => updateCpuItem(i, "status", "ok")}
                                className="accent-green-700"/>
                              OK
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer text-red-700 font-medium">
                              <input type="radio" name={`cpu_${i}_${selected.id}`} value="not"
                                checked={item.status === "not"}
                                onChange={() => updateCpuItem(i, "status", "not")}
                                className="accent-red-700"/>
                              NOT
                            </label>
                          </div>
                        </td>
                        <td className="py-2">
                          <input value={item.remarks}
                            onChange={e => updateCpuItem(i, "remarks", e.target.value)}
                            placeholder="Remarks..."
                            className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-[#2980B9]"/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Peripherals ── */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-[#0f2744] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#2980B9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  Peripherals
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {PERIPHERALS.map(name => {
                    const p = checklist.peripherals[name];
                    return (
                      <div key={name} className="border border-gray-200 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-[#0f2744] uppercase tracking-wider mb-2 pb-1.5 border-b border-gray-100">{name}</p>
                        {[["Name", "name"], ["Asset Tag #", "assetTag"], ["Remarks", "remarks"]].map(([label, field]) => (
                          <div key={field} className="mb-1.5">
                            <label className="block text-[9px] text-gray-400 font-medium mb-0.5">{label}</label>
                            <input value={p[field]}
                              onChange={e => updatePeripheral(name, field, e.target.value)}
                              placeholder={`${label}...`}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-[#2980B9]"/>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Signatures ── */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-[#0f2744] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#2980B9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                  </svg>
                  Signatures
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    ["ASSIGNEE NAME AND SIGNATURE",     checklist.assignee],
                    ["IT TECHNICIAN NAME AND SIGNATURE",checklist.technician],
                  ].map(([label, value]) => (
                    <div key={label} className="text-center">
                      <div className="h-12 border-b border-gray-300 flex items-end justify-center pb-1">
                        <span className="text-xs text-gray-300 italic">Signature</span>
                      </div>
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mt-1 mb-2">{label}</p>
                      <input defaultValue={value}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#2980B9] text-center"/>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
