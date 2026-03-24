import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Pencil, Trash2, Sparkles,
  Globe,  MapPin, Lightbulb, BookOpen, Star,
} from "lucide-react";

import { getExploreKerala, deleteExploreKerala } from '../../../services/adminService';

function StatPill({ label, value, color, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 min-w-[110px]">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.bg}`}>
        <Icon size={14} className={color.icon} />
      </div>
      <div>
        <p className={`text-xl font-bold leading-none ${color.text}`}>{value ?? "—"}</p>
        <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-green-100/70 rounded-xl ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
      <Skeleton className="w-full h-36 rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, label, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-green-100 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
        <Icon size={24} className="text-green-400" />
      </div>
      <p className="text-sm font-semibold text-gray-400">{label}</p>
      <button onClick={action}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors cursor-pointer shadow-sm">
        <Plus size={13} /> {actionLabel}
      </button>
    </div>
  );
}

export default function AdminExploreKerala() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    hero: [],
    history: [],
    regions: [],
    places: [],
    experiences: [],
    tips: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const confirm = (message, onConfirm) => setConfirmModal({ message, onConfirm });

  const tabs = [
    { key: "hero",        label: "Hero",        icon: Star },
    { key: "history",     label: "History",     icon: BookOpen },
    { key: "regions",     label: "Regions",     icon: MapPin },
    { key: "places",      label: "Places",      icon: Globe },
    { key: "experiences", label: "Experiences", icon: Sparkles },
    { key: "tips",        label: "Travel Tips", icon: Lightbulb },
  ];

  useEffect(() => {
    const fetchExploreKerala = async () => {
      setLoading(true);
      try {
        const response = await getExploreKerala();
        const { explorekerala } = response.data;

        const hero = explorekerala
          .filter(item => item.type === "hero")
          .map(item => ({ id: item._id, title: item.title, description: item.description, is_active: item.is_active }));

        const history = explorekerala
          .filter(item => item.type === "history")
          .map(item => ({ id: item._id, title: item.title, description: item.description, is_active: item.is_active }));

        const regions = explorekerala
          .filter(item => item.type === "region")
          .map(item => ({ id: item._id, name: item.title, desc: item.description, img: item.image }));

        const places = explorekerala
          .filter(item => item.type === "place")
          .map(item => ({ id: item._id, name: item.title }));

        const experiences = explorekerala
          .filter(item => item.type === "experience")
          .map(item => ({ id: item._id, name: item.title }));

        const tips = explorekerala
          .filter(item => item.type === "tip")
          .map(item => ({ id: item._id, title: item.title, text: item.description, icon: item.icon }));

        setData({ hero, history, regions, places, experiences, tips });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreKerala();
  }, []);

  const makeDeleter = (dataKey, label) => (id, name) =>
    confirm(`Delete ${label} "${name}"?`, async () => {
      setConfirmModal(null);
      setDeleting(true);
      try {
        const response = await deleteExploreKerala(id);
        const { message } = response.data;
        if (message === "Explore Kerala Deleted") {
          showToast(`${label.charAt(0).toUpperCase() + label.slice(1)} deleted successfully`);
          setData(d => ({ ...d, [dataKey]: d[dataKey].filter(item => item.id !== id) }));
        }
      } catch {
        showToast(`Failed to delete ${label}`, "error");
      } finally {
        setDeleting(false);
      }
    });

  const handleDeleteHero      = makeDeleter("hero",        "hero");
  const handleDeleteHistory   = makeDeleter("history",     "history");
  const handleDeleteRegion    = makeDeleter("regions",     "region");
  const handleDeletePlace     = makeDeleter("places",      "place");
  const handleDeleteExperience= makeDeleter("experiences", "experience");
  const handleDeleteTip       = makeDeleter("tips",        "tip");

  return (
    <div className="relative min-h-screen bg-green-50/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <Globe size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Explore Kerala</h1>
            <p className="text-xs text-gray-400 mt-0.5">Content management for the Explore Kerala page</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/add-explore")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={13} /> Add
          </button>
 
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            A
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">

        <div className="flex flex-wrap gap-3">
          <StatPill label="Hero"        value={data.hero.length}        icon={Star}      color={{ bg: "bg-sky-50",     icon: "text-sky-600",     text: "text-sky-700" }} />
          <StatPill label="History"     value={data.history.length}     icon={BookOpen}  color={{ bg: "bg-amber-50",   icon: "text-amber-600",   text: "text-amber-700" }} />
          <StatPill label="Regions"     value={data.regions.length}     icon={MapPin}    color={{ bg: "bg-green-50",   icon: "text-green-600",   text: "text-green-700" }} />
          <StatPill label="Places"      value={data.places.length}      icon={Globe}     color={{ bg: "bg-teal-50",    icon: "text-teal-600",    text: "text-teal-700" }} />
          <StatPill label="Experiences" value={data.experiences.length} icon={Sparkles}  color={{ bg: "bg-emerald-50", icon: "text-emerald-600", text: "text-emerald-700" }} />
          <StatPill label="Travel Tips" value={data.tips.length}        icon={Lightbulb} color={{ bg: "bg-cyan-50",    icon: "text-cyan-600",    text: "text-cyan-700" }} />
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer
                ${activeTab === key
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-600 border-green-100 hover:bg-green-50 hover:text-green-700"}`}
            >
              <Icon size={13} />
              {label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${activeTab === key ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>
                {data[key]?.length ?? 0}
              </span>
            </button>
          ))}
        </div>

        {activeTab === "hero" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-500">
                {data.hero.length} hero banner{data.hero.length !== 1 ? "s" : ""}
              </p>
              <button onClick={() => navigate("/admin/add-explore?type=hero")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors cursor-pointer">
                <Plus size={13} /> Add Hero Banner
              </button>
            </div>

            {loading ? (
              <Skeleton className="h-32" />
            ) : data.hero.length === 0 ? (
              <EmptyState icon={Star} label="No hero banner yet" action={() => navigate("/admin/add-explore")} actionLabel="Add hero banner" />
            ) : (
              <div className="space-y-4">
                {data.hero.map(h => (
                  <div key={h.id} className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button onClick={() => navigate(`/admin/edit-explore/hero/${h.id}`)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => handleDeleteHero(h.id, h.title)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-red-500/80 text-white transition-colors cursor-pointer">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-sky-200 uppercase tracking-widest mb-2">Hero Banner</p>
                    <h2 className="text-2xl font-bold leading-tight mb-2">{h.title}</h2>
                    <p className="text-sm text-sky-100 leading-relaxed opacity-90 max-w-xl">{h.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-500">
                {data.history.length} history section{data.history.length !== 1 ? "s" : ""}
              </p>
              <button onClick={() => navigate("/admin/add-explore?type=history")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors cursor-pointer">
                <Plus size={13} /> Add History
              </button>
            </div>

            {loading ? (
              <Skeleton className="h-40" />
            ) : data.history.length === 0 ? (
              <EmptyState icon={BookOpen} label="No history section yet" action={() => navigate("/admin/add-explore")} actionLabel="Add history" />
            ) : (
              <div className="space-y-4">
                {data.history.map(h => (
                  <div key={h.id} className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={16} className="text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-bold text-sm mb-2">{h.title}</p>
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-4">{h.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => navigate(`/admin/edit-explore/history/${h.id}`)}
                          className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors cursor-pointer">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => handleDeleteHistory(h.id, h.title)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "regions" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-500">
                {data.regions.length} region{data.regions.length !== 1 ? "s" : ""}
              </p>
              <button onClick={() => navigate("/admin/add-explore?type=region")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors cursor-pointer">
                <Plus size={13} /> Add Region
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : data.regions.length === 0 ? (
              <EmptyState icon={MapPin} label="No regions yet" action={() => navigate("/admin/add-explore")} actionLabel="Add first region" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.regions.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="relative">
                      <img src={r.img} alt={r.name} className="w-full h-36 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <h3 className="absolute bottom-3 left-3 text-white font-bold text-sm">{r.name}</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{r.desc}</p>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/admin/edit-explore/region/${r.id}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-green-200 text-green-700 text-xs font-medium hover:bg-green-50 transition-colors cursor-pointer">
                          <Pencil size={11} /> Edit
                        </button>
                        <button onClick={() => handleDeleteRegion(r.id, r.name)}
                          className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-red-100 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors cursor-pointer">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "places" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-500">{data.places.length} places</p>
              <button onClick={() => navigate("/admin/add-explore?type=place")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors cursor-pointer">
                <Plus size={13} /> Add Place
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
                </div>
              </div>
            ) : data.places.length === 0 ? (
              <EmptyState icon={Globe} label="No places yet" action={() => navigate("/admin/add-explore")} actionLabel="Add first place" />
            ) : (
              <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  {data.places.map(p => (
                    <div key={p.id}
                      className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 group hover:border-green-400 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-green-800 text-sm font-medium">{p.name}</span>
                      <div className="hidden group-hover:flex items-center gap-1 ml-1">
                        <button onClick={() => navigate(`/admin/edit-explore/place/${p.id}`)}
                          className="text-green-500 hover:text-green-700 transition-colors cursor-pointer">
                          <Pencil size={11} />
                        </button>
                        <button onClick={() => handleDeletePlace(p.id, p.name)}
                          className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "experiences" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-500">{data.experiences.length} experiences</p>
              <button onClick={() => navigate("/admin/add-explore?type=experience")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors cursor-pointer">
                <Plus size={13} /> Add Experience
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : data.experiences.length === 0 ? (
              <EmptyState icon={Sparkles} label="No experiences yet" action={() => navigate("/admin/add-explore")} actionLabel="Add first experience" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.experiences.map(e => (
                  <div key={e.id}
                    className="bg-white rounded-xl border border-green-100 p-4 flex items-center justify-between group hover:border-green-300 transition-colors shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
                        <Sparkles size={13} className="text-green-600" />
                      </div>
                      <span className="text-green-900 font-medium text-sm">{e.name}</span>
                    </div>
                    <div className="hidden group-hover:flex items-center gap-1.5">
                      <button onClick={() => navigate(`/admin/edit-explore/experience/${e.id}`)}
                        className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors cursor-pointer">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => handleDeleteExperience(e.id, e.name)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "tips" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-500">{data.tips.length} tips</p>
              <button onClick={() => navigate("/admin/add-explore?type=tip")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors cursor-pointer">
                <Plus size={13} /> Add Tip
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : data.tips.length === 0 ? (
              <EmptyState icon={Lightbulb} label="No travel tips yet" action={() => navigate("/admin/add-explore")} actionLabel="Add first tip" />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.tips.map(tip => (
                  <div key={tip.id} className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-lg flex-shrink-0">
                        {tip.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-green-900 font-bold text-sm">{tip.title}</p>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => navigate(`/admin/edit-explore/tip/${tip.id}`)}
                              className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors cursor-pointer">
                              <Pencil size={12} />
                            </button>
                            <button onClick={() => handleDeleteTip(tip.id, tip.title)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed">{tip.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {(loading || deleting) && (
        <div className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-sm"
          style={{ top: '57px' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-green-100 shadow-sm flex items-center justify-center">
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#d1fae5" strokeWidth="2.5" />
                <path d="M10 2a8 8 0 0 1 8 8" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-gray-400">{deleting ? "Deleting..." : "Loading..."}</p>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium transition-all
          ${toast.type === "success" ? "bg-white border-green-200 text-green-800" : "bg-white border-red-200 text-red-700"}`}>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
            ${toast.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
            {toast.type === "success" ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 4L10 10M10 4L4 10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-1 text-gray-300 hover:text-gray-500 cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setConfirmModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 w-full max-w-sm mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 pt-5 pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Confirm delete</p>
                <p className="text-xs text-gray-400 mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <p className="text-sm text-gray-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                {confirmModal.message}
              </p>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button onClick={() => setConfirmModal(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={() => confirmModal.onConfirm()}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}