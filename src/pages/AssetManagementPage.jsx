import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Demo data ─────────────────────────────────────────────────────────────────
const INITIAL_ASSETS = [
  { id:1,  name:"Dell PowerEdge R740",    tag:"LFC-SV-00064", cat:"Server",  serial:"SN-DL7400064", location:"Server Room",  dept:"IT",   company:"LFC", tech:"R. Santos",    acquired:"Jan 15, 2021", status:"Active",           notes:"Primary application server." },
  { id:2,  name:"Cisco Catalyst 2960",    tag:"LFC-NW-00021", cat:"Network", serial:"SN-CC2960021", location:"Network Room", dept:"IT",   company:"LFC", tech:"M. Reyes",     acquired:"Mar 10, 2020", status:"Under Maintenance", notes:"Firmware update pending." },
  { id:3,  name:"HP LaserJet Pro M404",   tag:"LFC-PR-00033", cat:"Printer", serial:"SN-HP4040033", location:"QA Office",    dept:"QA",   company:"LFC", tech:"J. dela Cruz", acquired:"Jun 5, 2022",  status:"Active",           notes:"Monthly cartridge replacement." },
  { id:4,  name:"APC Smart-UPS 1500",     tag:"LFC-UP-00012", cat:"UPS",     serial:"SN-APC150012", location:"Server Room",  dept:"IT",   company:"LFC", tech:"R. Santos",    acquired:"Feb 20, 2019", status:"Under Maintenance", notes:"Battery is defective." },
  { id:5,  name:"Lenovo ThinkCentre M70", tag:"LFC-WS-00088", cat:"Desktop", serial:"SN-LN7000088", location:"Tadeco Wharf", dept:"QA",   company:"LFC", tech:"M. Reyes",     acquired:"Aug 12, 2022", status:"Active",           notes:"Assigned to QA team." },
  { id:6,  name:"Dell OptiPlex 7080",     tag:"LFC-WS-00045", cat:"Desktop", serial:"SN-DL7080045", location:"IT Office",    dept:"IT",   company:"LFC", tech:"J. dela Cruz", acquired:"Apr 1, 2021",  status:"Active",           notes:"" },
  { id:7,  name:"HP ProBook 450 G8",      tag:"LFC-LT-00007", cat:"Laptop",  serial:"SN-HP4500007", location:"Management",   dept:"Mgmt", company:"LFC", tech:"R. Santos",    acquired:"Sep 3, 2021",  status:"Active",           notes:"Management laptop." },
  { id:8,  name:"TP-Link TL-SG1024",     tag:"LFC-NW-00055", cat:"Network", serial:"SN-TP1024055", location:"Lab B",         dept:"QA",   company:"LFC", tech:"M. Reyes",     acquired:"Nov 8, 2020",  status:"Decommissioned",   notes:"Replaced by newer switch." },
  { id:9,  name:"Canon LBP6030",         tag:"LFC-PR-00018", cat:"Printer", serial:"SN-CN6030018", location:"HR Office",    dept:"HR",   company:"LFC", tech:"J. dela Cruz", acquired:"Jul 14, 2019", status:"Active",           notes:"" },
  { id:10, name:"CyberPower CP1500",     tag:"LFC-UP-00009", cat:"UPS",     serial:"SN-CP1500009", location:"Lab A",         dept:"IT",   company:"LFC", tech:"R. Santos",    acquired:"Dec 22, 2020", status:"Active",           notes:"" },
];

const MOCK_HISTORY = [
  { text:"Monthly health check completed", date:"Apr 13, 2026", color:"bg-green-500" },
  { text:"Firmware updated to v4.2.1",     date:"Mar 5, 2026",  color:"bg-blue-500"  },
  { text:"Added to asset registry",        date:"Jan 15, 2021", color:"bg-[#0f2744]" },
];

const CATEGORIES   = ["All","Server","Desktop","Network","Printer","UPS","Laptop","Other"];
const TECHNICIANS  = ["R. Santos","M. Reyes","J. dela Cruz"];
const STATUSES     = ["Active","Under Maintenance","Decommissioned"];

const CAT_STYLE = {
  Server:  { bg:"bg-blue-50",   text:"text-blue-700"  },
  Desktop: { bg:"bg-green-50",  text:"text-green-700" },
  Network: { bg:"bg-amber-50",  text:"text-amber-700" },
  Printer: { bg:"bg-pink-50",   text:"text-pink-700"  },
  UPS:     { bg:"bg-gray-100",  text:"text-gray-500"  },
  Laptop:  { bg:"bg-teal-50",   text:"text-teal-700"  },
  Other:   { bg:"bg-gray-100",  text:"text-gray-400"  },
};

const STATUS_STYLE = {
  "Active":           "bg-green-50 text-green-700",
  "Under Maintenance":"bg-amber-50 text-amber-700",
  "Decommissioned":   "bg-gray-100 text-gray-400",
};
const STATUS_DOT = {
  "Active":"bg-green-500","Under Maintenance":"bg-amber-400","Decommissioned":"bg-gray-300"
};

const EMPTY_FORM = { name:"", tag:"", cat:"Server", serial:"", location:"", dept:"", company:"LFC", tech:TECHNICIANS[0], acquired:"", status:"Active", notes:"" };

const NAV = [
  { label:"Dashboard",  path:"/dashboard"  },
  { label:"Assets",     path:"/assets"     },
  { label:"Scheduling", path:"/scheduling" },
  { label:"My Tasks",   path:"/tasks"      },
  { label:"Logs",       path:"/logs"       },
  { label:"Reports",    path:"/reports"    },
];

export default function AssetManagementPage() {
  const navigate = useNavigate();

  const [assets, setAssets]     = useState(INITIAL_ASSETS);
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch]     = useState("");
  const [view, setView]         = useState("table");  // "table" | "grid"
  const [modal, setModal]       = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [drawer, setDrawer]     = useState(null);     // selected asset for drawer

  // ── Filter ────────────────────────────────────────────────────────────────
  const visible = assets.filter(a => {
    const matchCat = catFilter === "All" || a.cat === catFilter;
    const matchSearch = !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tag.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  function openAdd() { setEditId(null); setForm(EMPTY_FORM); setModal(true); }

  function openEdit(asset) {
    setEditId(asset.id);
    setForm({ name:asset.name, tag:asset.tag, cat:asset.cat, serial:asset.serial,
      location:asset.location, dept:asset.dept, company:asset.company,
      tech:asset.tech, acquired:asset.acquired, status:asset.status, notes:asset.notes });
    setModal(true);
  }

  function saveAsset() {
    if (!form.name || !form.tag) return alert("Asset name and tag are required.");
    if (editId) setAssets(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a));
    else setAssets(prev => [...prev, { ...form, id: Date.now() }]);
    setModal(false);
  }

  const catStyle = a => CAT_STYLE[a.cat] || CAT_STYLE.Other;

  const stats = [
    { val: assets.length,                                              lbl:"Total assets",       color:"text-[#0f2744]" },
    { val: assets.filter(a=>a.status==="Active").length,              lbl:"Active",              color:"text-green-700" },
    { val: assets.filter(a=>a.status==="Under Maintenance").length,   lbl:"Under maintenance",   color:"text-amber-700" },
    { val: assets.filter(a=>a.status==="Decommissioned").length,      lbl:"Decommissioned",      color:"text-gray-400"  },
  ];

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
                ${n.path==="/assets" ? "bg-[#2980B9]/20 text-white border-[#2980B9]"
                  : "text-[#93b5d8] border-transparent hover:bg-white/5 hover:text-white"}`}>
              {n.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 mt-2 uppercase tracking-widest">Work</p>
          {NAV.slice(3,5).map(n => (
            <button key={n.label} onClick={() => navigate(n.path)}
              className="w-full text-left px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
              {n.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 mt-2 uppercase tracking-widest">Insights</p>
          <button onClick={() => navigate("/reports")}
            className="w-full text-left px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
            Reports
          </button>
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
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="text-[#0f2744] font-bold text-lg">Asset Management</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Import CSV
            </button>
            <button onClick={openAdd}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a3a5c] transition-all">
              + Add Asset
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.lbl} className="bg-white rounded-xl border border-gray-100 p-3">
                <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.lbl}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                  ${catFilter===c ? "bg-[#0f2744] text-white border-[#0f2744]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                {c}
              </button>
            ))}
            {/* View toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              {[["table","list"],["grid","grid"]].map(([v, icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-2.5 py-1.5 flex items-center transition-all ${view===v ? "bg-[#0f2744] text-white" : "bg-white text-gray-400 hover:bg-gray-50"}`}>
                  {icon === "list"
                    ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  }
                </button>
              ))}
            </div>
            <div className="relative ml-auto">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search assets..."
                className="pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white outline-none focus:border-[#2980B9] w-48"/>
            </div>
          </div>

          {/* TABLE VIEW */}
          {view === "table" && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Asset","Category","Location","Technician","Acquired","Status","Actions"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {visible.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-10 text-gray-400">No assets found.</td></tr>
                    )}
                    {visible.map(a => {
                      const cs = catStyle(a);
                      return (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cs.bg}`}>
                                <svg className={`w-4 h-4 ${cs.text}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{a.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{a.tag}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">{a.cat}</td>
                          <td className="px-4 py-2.5 text-gray-600">{a.location}</td>
                          <td className="px-4 py-2.5 text-gray-600">{a.tech}</td>
                          <td className="px-4 py-2.5 text-gray-400 text-[11px]">{a.acquired}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_STYLE[a.status]}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[a.status]}`}></span>
                              {a.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex gap-1">
                              <button onClick={() => setDrawer(a)} title="View"
                                className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors">
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                </svg>
                              </button>
                              <button onClick={() => openEdit(a)} title="Edit"
                                className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors">
                                <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                              <button title="Delete"
                                className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                                <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100">
                <p className="text-[11px] text-gray-400">Showing 1–{Math.min(10,visible.length)} of {visible.length} assets</p>
                <div className="flex gap-1">
                  {["‹","1","2","›"].map((p,i) => (
                    <button key={i} className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center
                      ${p==="1" ? "bg-[#0f2744] text-white border-[#0f2744]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GRID VIEW */}
          {view === "grid" && (
            <div className="grid grid-cols-3 gap-3">
              {visible.map(a => {
                const cs = catStyle(a);
                return (
                  <div key={a.id} onClick={() => setDrawer(a)}
                    className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:border-[#2980B9] transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cs.bg}`}>
                        <svg className={`w-4 h-4 ${cs.text}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                        </svg>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_STYLE[a.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[a.status]}`}></span>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">{a.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono mb-3">{a.tag}</p>
                    <div className="space-y-1">
                      {[["Category",a.cat],["Location",a.location],["Technician",a.tech]].map(([l,v])=>(
                        <div key={l} className="flex justify-between text-xs">
                          <span className="text-gray-400">{l}</span>
                          <span className="text-gray-600 font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl w-[480px] max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#0f2744]">{editId ? "Edit Asset" : "Add New Asset"}</h2>
              <button onClick={() => setModal(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[["Asset name","name","text","Dell PowerEdge R740"],["Asset tag / CPU","tag","text","LFC-SV-00001"]].map(([l,f,t,p])=>(
                  <div key={f}>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{l}</label>
                    <input type={t} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} placeholder={p}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Category</label>
                  <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                    {["Server","Desktop","Network","Printer","UPS","Laptop","Other"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Serial number</label>
                  <input value={form.serial} onChange={e=>setForm(p=>({...p,serial:e.target.value}))} placeholder="SN-XXXXXXX"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["Location / Area","location","Server Room, Lab A..."],["Department","dept","IT, QA, Operations..."],["Company","company","LFC"]].map(([l,f,p])=>(
                  <div key={f}>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{l}</label>
                    <input value={form[f]} onChange={e=>setForm(prev=>({...prev,[f]:e.target.value}))} placeholder={p}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Acquisition date</label>
                  <input type="date" value={form.acquired} onChange={e=>setForm(p=>({...p,acquired:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Assigned technician</label>
                  <select value={form.tech} onChange={e=>setForm(p=>({...p,tech:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                    {TECHNICIANS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</label>
                  <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Remarks / Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                  rows={2} placeholder="Additional notes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9] resize-none"/>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={()=>setModal(false)} className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveAsset} className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a3a5c]">Save asset</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {drawer && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawer(null)}/>
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#0f2744]">Asset Details</h2>
              <button onClick={() => setDrawer(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${catStyle(drawer).bg}`}>
                  <svg className={`w-6 h-6 ${catStyle(drawer).text}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f2744]">{drawer.name}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{drawer.tag}</p>
                </div>
              </div>
              {/* Info */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Asset Info</p>
              <div className="space-y-0 divide-y divide-gray-50 mb-5">
                {[["Category",drawer.cat],["Serial Number",drawer.serial],["Location",drawer.location],["Department",drawer.dept],["Company",drawer.company],["Acquired",drawer.acquired],["Technician",drawer.tech]].map(([l,v])=>(
                  <div key={l} className="flex justify-between py-2 text-xs">
                    <span className="text-gray-400">{l}</span>
                    <span className="text-gray-700 font-medium">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_STYLE[drawer.status]}`}>{drawer.status}</span>
                </div>
              </div>
              {/* Notes */}
              {drawer.notes && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed">{drawer.notes}</div>
                </div>
              )}
              {/* History */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Maintenance History</p>
              <div className="space-y-0 divide-y divide-gray-50">
                {MOCK_HISTORY.map((h,i) => (
                  <div key={i} className="flex gap-2.5 py-2.5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${h.color}`}></div>
                    <div>
                      <p className="text-xs text-gray-600">{h.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{h.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
