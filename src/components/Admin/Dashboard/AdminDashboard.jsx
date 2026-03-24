import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Compass,
  BookOpen,
  Map,
  TrendingUp,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ChevronRight,
  Sparkles,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getContact,
  getJourneySubmissions,
  getAllExperiences,
  getAllAbout,
  getExploreKerala,
} from "../../../services/adminService";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatCard({ icon: Icon, label, value, iconBg, iconColor, change, changeUp }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-green-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 leading-none">{value ?? "—"}</p>
        <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
        {change && (
          <p className={`text-[10px] font-semibold mt-0.5 ${changeUp ? "text-green-600" : "text-gray-400"}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    new: "bg-emerald-50 text-emerald-700 border-emerald-200",
    contacted: "bg-sky-50 text-sky-700 border-sky-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const dot = {
    new: "bg-emerald-500",
    contacted: "bg-sky-500",
    closed: "bg-slate-400",
  };
  const label = { new: "New", contacted: "Contacted", closed: "Closed" };
  const cls = map[status] || map.new;
  const d = dot[status] || dot.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${d}`} />
      {label[status] || "New"}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [aboutEntries, setAboutEntries] = useState([]);
  const [exploreItems, setExploreItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, j, e, a, ex] = await Promise.allSettled([
        getContact(),
        getJourneySubmissions(),
        getAllExperiences(),
        getAllAbout(),
        getExploreKerala(),
      ]);

      if (c.status === "fulfilled") setContacts(c.value.data?.contact ?? []);
      if (j.status === "fulfilled") setJourneys(j.value.data?.journey ?? []);
      if (e.status === "fulfilled") setExperiences(e.value.data?.experiences ?? []);
      if (a.status === "fulfilled") setAboutEntries(a.value.data?.about ?? []);
      if (ex.status === "fulfilled") setExploreItems(ex.value.data?.explorekerala ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const newContacts = contacts.filter((c) => c.status === "new").length;
  const contactedContacts = contacts.filter((c) => c.status === "contacted").length;
  const closedContacts = contacts.filter((c) => c.status === "closed").length;

  const newJourneys = journeys.filter((j) => j.status === "new").length;
  const contactedJourneys = journeys.filter((j) => j.status === "contacted").length;
  const closedJourneys = journeys.filter((j) => j.status === "closed").length;

  const totalNew = newContacts + newJourneys;
  const totalContacted = contactedContacts + contactedJourneys;
  const totalClosed = closedContacts + closedJourneys;
  const totalSubmissions = contacts.length + journeys.length;

  const allSubmissions = [
    ...contacts.map((c) => ({
      id: c._id,
      name: c.name,
      type: "Contact",
      status: c.status,
      date: c.createdAt,
    })),
    ...journeys.map((j) => ({
      id: j._id,
      name: j.name,
      type: "Journey",
      status: j.status,
      date: j.created_at || j.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const sections = [
    {
      label: "About Page",
      sub: "Hero, Way Cards, Vision",
      count: aboutEntries.length,
      tag: "entries",
      bg: "bg-purple-50",
      color: "text-purple-600",
      icon: BookOpen,
      path: "/admin/about",
    },
    {
      label: "Experiences",
      sub: "Signature experience cards",
      count: experiences.length,
      tag: "cards",
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      icon: Sparkles,
      path: "/admin/experience",
    },
    {
      label: "Explore Kerala",
      sub: "Regions, places, tips…",
      count: exploreItems.length,
      tag: "items",
      bg: "bg-amber-50",
      color: "text-amber-600",
      icon: Map,
      path: "/admin/explore-kerala",
    },
    {
      label: "Contact Messages",
      sub: "General contact form",
      count: contacts.length,
      tag: "messages",
      bg: "bg-sky-50",
      color: "text-sky-600",
      icon: Inbox,
      path: "/admin/contact",
    },
    {
      label: "Journey Requests",
      sub: "Shape Your Journey form",
      count: journeys.length,
      tag: "submissions",
      bg: "bg-green-50",
      color: "text-green-600",
      icon: Compass,
      path: "/admin/journey",
    },
  ];

  const quickActions = [
    { label: "Add Experience", sub: "New signature card", icon: Sparkles, bg: "bg-emerald-50", color: "text-emerald-600", path: "/admin/add-experience" },
    { label: "Add About Entry", sub: "Hero, Way Card or Vision", icon: BookOpen, bg: "bg-purple-50", color: "text-purple-600", path: "/admin/add-about" },
    { label: "Add Journal Post", sub: "New travel article", icon: FileText, bg: "bg-amber-50", color: "text-amber-600", path: "/admin/add-journal" },
    { label: "Add Explore Kerala", sub: "Region, place or tip", icon: Map, bg: "bg-sky-50", color: "text-sky-600", path: "/admin/add-explore" },
  ];

  const statusBars = [
    { label: "New", val: totalNew, color: "bg-emerald-500", dot: "bg-emerald-500", pct: totalSubmissions ? Math.round((totalNew / totalSubmissions) * 100) : 0 },
    { label: "Contacted", val: totalContacted, color: "bg-sky-500", dot: "bg-sky-500", pct: totalSubmissions ? Math.round((totalContacted / totalSubmissions) * 100) : 0 },
    { label: "Closed", val: totalClosed, color: "bg-slate-400", dot: "bg-slate-400", pct: totalSubmissions ? Math.round((totalClosed / totalSubmissions) * 100) : 0 },
  ];

  const TABLE_HEADS = ["Name", "Type", "Status", "Date", ""];

  return (
    <div className="min-h-screen bg-green-50/30">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <LayoutDashboard size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">{todayStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            A
          </div>
        </div>
      </header>

      <div className="p-6 space-y-5">

        <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-16 -bottom-12 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-white mb-1">Welcome back, Admin 👋</h2>
            <p className="text-sm text-green-100">Here's what's happening across Kerivaa today.</p>
          </div>
          <button
            onClick={() => navigate("/admin/contact")}
            className="relative z-10 flex items-center gap-2 bg-white/15 border border-white/25 hover:bg-white/25 transition-colors text-white text-xs font-semibold px-4 py-2.5 rounded-xl shrink-0"
          >
            <Eye size={13} /> View Submissions
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Inbox} label="Contact Messages" value={contacts.length} iconBg="bg-green-50" iconColor="text-green-600" change={`${newContacts} new`} changeUp={newContacts > 0} />
          <StatCard icon={Compass} label="Journey Requests" value={journeys.length} iconBg="bg-sky-50" iconColor="text-sky-500" change={`${newJourneys} new`} changeUp={newJourneys > 0} />
          <StatCard icon={Sparkles} label="Experiences" value={experiences.length} iconBg="bg-emerald-50" iconColor="text-emerald-500" />
          <StatCard icon={BookOpen} label="About Entries" value={aboutEntries.length} iconBg="bg-purple-50" iconColor="text-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div>
                <p className="text-sm font-bold text-gray-800">Submission Status</p>
                <p className="text-xs text-gray-400 mt-0.5">All forms combined</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">
                {totalSubmissions} total
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {statusBars.map((s) => (
                <div key={s.label} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className="text-xs font-semibold text-gray-600">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{s.val}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color} transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-50 border-t border-gray-50">
              {[
                { label: "New", val: totalNew, icon: CheckCircle, color: "text-emerald-500" },
                { label: "Contacted", val: totalContacted, icon: Clock, color: "text-sky-500" },
                { label: "Closed", val: totalClosed, icon: XCircle, color: "text-slate-400" },
              ].map(({ label, val, icon: Icon, color }) => (
                <div key={label} className="flex flex-col items-center py-3 gap-1">
                  <Icon size={14} className={color} />
                  <p className="text-base font-bold text-gray-800 leading-none">{val}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div>
                <p className="text-sm font-bold text-gray-800">Content Overview</p>
                <p className="text-xs text-gray-400 mt-0.5">Entries across all pages</p>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => navigate(s.path)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-green-50/40 transition-colors text-left"
                  >
                    <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={s.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700">{s.label}</p>
                      <p className="text-xs text-gray-400 truncate">{s.sub}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-gray-800 leading-none">{loading ? "—" : s.count}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{s.tag}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div>
                <p className="text-sm font-bold text-gray-800">Recent Submissions</p>
                <p className="text-xs text-gray-400 mt-0.5">Latest across all forms</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate("/admin/contact")} className="text-xs text-green-600 font-semibold hover:underline">
                  Contacts
                </button>
                <span className="text-gray-300">·</span>
                <button onClick={() => navigate("/admin/journey")} className="text-xs text-green-600 font-semibold hover:underline">
                  Journeys
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
              </div>
            ) : allSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Inbox size={24} className="text-gray-300" />
                <p className="text-sm text-gray-400">No submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100">
                      {TABLE_HEADS.map((h) => (
                        <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allSubmissions.map((sub) => (
                      <tr key={`${sub.type}-${sub.id}`} className="hover:bg-green-50/40 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {sub.name?.charAt(0) ?? "?"}
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">{sub.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sub.type === "Contact" ? "bg-sky-50 text-sky-700" : "bg-emerald-50 text-emerald-700"}`}>
                            {sub.type === "Contact" ? <Inbox size={9} /> : <Compass size={9} />}
                            {sub.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {timeAgo(sub.date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => navigate(sub.type === "Contact" ? "/admin/contact" : "/admin/journey")}
                            className="w-6 h-6 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                          >
                            <Eye size={11} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-sm font-bold text-gray-800">Quick Actions</p>
              <p className="text-xs text-gray-400 mt-0.5">Create new content</p>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.path)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl border border-gray-100 hover:bg-green-50/50 hover:border-green-200 hover:-translate-y-0.5 transition-all text-left"
                  >
                    <div className={`w-9 h-9 rounded-xl ${a.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={a.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700">{a.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.sub}</p>
                    </div>
                    <Plus size={13} className="text-gray-300 shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="mx-3 mb-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <p className="text-[9px] font-bold text-green-700 uppercase tracking-widest mb-2">Platform Stats</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Journal", val: "—", icon: TrendingUp },
                  { label: "Explore", val: exploreItems.length, icon: Map },
                  { label: "Experiences", val: experiences.length, icon: Sparkles },
                  { label: "About", val: aboutEntries.length, icon: BookOpen },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-lg px-2.5 py-2 flex items-center gap-2 border border-green-50">
                    <Icon size={11} className="text-green-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-800 leading-none">{val}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}