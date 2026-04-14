import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Demo data ─────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id:1, first:"Julius",  last:"Smagayon", email:"julius@lfc.com",  role:"admin",      dept:"IT",         status:"Active",   lastLogin:"Apr 13, 2026, 8:00 AM"  },
  { id:2, first:"Jomar",   last:"Requirme",  email:"jomar@lfc.com",   role:"technician", dept:"IT",         status:"Active",   lastLogin:"Apr 13, 2026, 8:30 AM"  },
  { id:3, first:"Maria",   last:"Reyes",     email:"maria@lfc.com",   role:"technician", dept:"IT",         status:"Active",   lastLogin:"Apr 12, 2026, 9:10 AM"  },
  { id:4, first:"Juan",    last:"dela Cruz", email:"juan@lfc.com",    role:"technician", dept:"QA",         status:"Active",   lastLogin:"Apr 12, 2026, 10:45 AM" },
  { id:5, first:"Ana",     last:"Santos",    email:"ana@lfc.com",     role:"technician", dept:"Operations", status:"Active",   lastLogin:"Apr 11, 2026, 2:00 PM"  },
  { id:6, first:"Roberto", last:"Lim",       email:"roberto@lfc.com", role:"viewer",     dept:"Management", status:"Active",   lastLogin:"Apr 10, 2026, 11:30 AM" },
  { id:7, first:"Carmen",  last:"Torres",    email:"carmen@lfc.com",  role:"viewer",     dept:"HR",         status:"Active",   lastLogin:"Apr 9, 2026, 3:15 PM"   },
  { id:8, first:"Eduardo", last:"Flores",    email:"eduardo@lfc.com", role:"admin",      dept:"IT",         status:"Inactive", lastLogin:"Mar 20, 2026, 9:00 AM"  },
];

const ROLE_FILTERS = ["All", "admin", "technician", "viewer"];
const AVATAR_COLORS = [
  { bg:"#e6f1fb", color:"#185fa5" },
  { bg:"#eaf3de", color:"#3b6d11" },
  { bg:"#faeeda", color:"#854f0b" },
  { bg:"#fbeaf0", color:"#993556" },
  { bg:"#f1efe8", color:"#5f5e5a" },
];

const ROLE_STYLE = {
  admin:      "bg-blue-50 text-blue-700",
  technician: "bg-green-50 text-green-700",
  viewer:     "bg-gray-100 text-gray-500",
};
const ROLE_LABEL = { admin:"Administrator", technician:"Technician", viewer:"Viewer" };

const EMPTY_FORM = { first:"", last:"", email:"", role:"technician", dept:"", password:"", status:"Active" };

const NAV = [
  { label:"Dashboard",       path:"/dashboard"  },
  { label:"Assets",          path:"/assets"     },
  { label:"Scheduling",      path:"/scheduling" },
  { label:"My Tasks",        path:"/tasks"      },
  { label:"Logs",            path:"/logs"       },
  { label:"Reports",         path:"/reports"    },
  { label:"User Management", path:"/users"      },
];

function getInitials(u) { return ((u.first?.[0] || "") + (u.last?.[0] || "")).toUpperCase(); }
function getAvatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

export default function UserManagementPage() {
  const navigate = useNavigate();

  const [users, setUsers]         = useState(INITIAL_USERS);
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState(false);       // add/edit modal
  const [editId, setEditId]       = useState(null);        // null = add mode
  const [form, setForm]           = useState(EMPTY_FORM);
  const [confirmId, setConfirmId] = useState(null);        // deactivate confirm

  // ── Filter ────────────────────────────────────────────────────────────────
  const visible = users.filter(u => {
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchSearch = !search ||
      `${u.first} ${u.last}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.dept.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setModal(true);
  }

  function openEdit(user) {
    setEditId(user.id);
    setForm({ first: user.first, last: user.last, email: user.email, role: user.role, dept: user.dept, password: "", status: user.status });
    setModal(true);
  }

  function saveUser() {
    if (!form.first || !form.last || !form.email) return alert("Please fill in first name, last name, and email.");
    if (editId) {
      setUsers(prev => prev.map(u => u.id === editId ? { ...u, ...form } : u));
    } else {
      setUsers(prev => [...prev, { ...form, id: Date.now(), lastLogin: "—" }]);
    }
    setModal(false);
  }

  function deactivateUser() {
    setUsers(prev => prev.map(u => u.id === confirmId ? { ...u, status: "Inactive" } : u));
    setConfirmId(null);
  }

  const stats = [
    { val: users.length,                                          lbl: "Total users",     color: "text-[#0f2744]" },
    { val: users.filter(u => u.role === "admin").length,         lbl: "Administrators",  color: "text-blue-700"  },
    { val: users.filter(u => u.role === "technician").length,    lbl: "Technicians",     color: "text-green-700" },
    { val: users.filter(u => u.role === "viewer").length,        lbl: "Viewers",         color: "text-gray-500"  },
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
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 uppercase tracking-widest">Admin</p>
          <button onClick={() => navigate("/users")}
            className="w-full text-left px-4 py-2 text-sm bg-[#2980B9]/20 text-white border-l-2 border-[#2980B9]">
            User Management
          </button>
          <p className="text-[10px] font-semibold text-[#4a6a8a] px-4 py-1 mt-2 uppercase tracking-widest">Main</p>
          {NAV.slice(0,3).map(n => (
            <button key={n.label} onClick={() => navigate(n.path)}
              className="w-full text-left px-4 py-2 text-sm text-[#93b5d8] border-l-2 border-transparent hover:bg-white/5 hover:text-white transition-all">
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
          <h1 className="text-[#0f2744] font-bold text-lg">User Management</h1>
          <button onClick={openAdd}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a3a5c] transition-all">
            + Add User
          </button>
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
            {ROLE_FILTERS.map(f => (
              <button key={f} onClick={() => setRoleFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                  ${roleFilter === f ? "bg-[#0f2744] text-white border-[#0f2744]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                {f === "All" ? "All" : ROLE_LABEL[f]}
              </button>
            ))}
            <div className="relative ml-auto">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white outline-none focus:border-[#2980B9] w-52"/>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["User","Role","Department","Last Login","Status","Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visible.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-400">No users found.</td></tr>
                  )}
                  {visible.map(u => {
                    const c = getAvatarColor(u.id);
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: c.bg, color: c.color }}>
                              {getInitials(u)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{u.first} {u.last}</p>
                              <p className="text-[10px] text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ROLE_STYLE[u.role]}`}>{ROLE_LABEL[u.role]}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">{u.dept}</td>
                        <td className="px-4 py-2.5 text-gray-400 text-[11px]">{u.lastLogin}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}></span>
                            <span className={u.status === "Active" ? "text-green-700" : "text-gray-400"}>{u.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(u)} title="Edit"
                              className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors">
                              <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button onClick={() => setConfirmId(u.id)} title="Deactivate"
                              className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                              <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
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
              <p className="text-[11px] text-gray-400">Showing 1–{visible.length} of {visible.length} users</p>
              <div className="flex gap-1">
                {["‹","1","›"].map((p,i) => (
                  <button key={i} className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center
                    ${p==="1" ? "bg-[#0f2744] text-white border-[#0f2744]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl w-[440px] max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#0f2744]">{editId ? "Edit User" : "Add New User"}</h2>
              <button onClick={() => setModal(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
            </div>
            <div className="px-5 py-4">
              {/* Avatar preview */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-700">
                  {((form.first?.[0] || "") + (form.last?.[0] || "")).toUpperCase() || "?"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[["First name","first","text","Juan"],["Last name","last","text","Dela Cruz"]].map(([label,field,type,ph])=>(
                  <div key={field}>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</label>
                    <input type={type} value={form[field]} onChange={e => setForm(p=>({...p,[field]:e.target.value}))}
                      placeholder={ph} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Email address</label>
                <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))}
                  placeholder="juan@lfc.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Role</label>
                  <select value={form.role} onChange={e => setForm(p=>({...p,role:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                    <option value="admin">Administrator</option>
                    <option value="technician">Technician</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Department</label>
                  <input value={form.dept} onChange={e => setForm(p=>({...p,dept:e.target.value}))}
                    placeholder="IT, QA, Operations..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    {editId ? "New password (optional)" : "Password"}
                  </label>
                  <input type="password" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))}
                    placeholder="••••••••" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]"/>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#2980B9]">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveUser} className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a3a5c]">Save user</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Deactivate Modal ── */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl w-80 p-6 shadow-xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </div>
            <h3 className="font-bold text-[#0f2744] mb-2">Deactivate user?</h3>
            <p className="text-xs text-gray-500 mb-5">
              This will deactivate {users.find(u => u.id === confirmId)?.first}'s account. They will no longer be able to log in.
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setConfirmId(null)} className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={deactivateUser} className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600">Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
