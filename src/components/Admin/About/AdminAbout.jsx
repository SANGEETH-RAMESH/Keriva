import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Info,
  Filter,
  Edit3,
  BookOpen,
  Lightbulb,
  Target,
  AlertTriangle,
} from "lucide-react";

import { deleteAbout, getAllAbout } from '../../../services/adminService';

const MOCK_ABOUT_DATA = [
  {
    id: 1,
    section: "hero",
    title: "Why Kerivaa Exists",
    subtitle: "Our Story",
    body: "Kerivaa was born to redefine Kerala travel. We believe no two travelers are the same — so no two Kerala journeys should be the same. We exist to craft deeply personal, beautifully executed experiences in God's Own Country.",
    is_active: true,
    updated_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    section: "way_card",
    title: "Deep Personalization",
    subtitle: "🤍",
    body: "Every journey is built from scratch based on your unique desires.",
    is_active: true,
    updated_at: "2025-01-14T08:15:00Z",
  },
  {
    id: 3,
    section: "way_card",
    title: "Local Partnerships",
    subtitle: "🤝",
    body: "We work with Kerala's finest hosts, guides, and artisans.",
    is_active: true,
    updated_at: "2025-01-13T14:20:00Z",
  },
  {
    id: 4,
    section: "way_card",
    title: "Seamless Planning",
    subtitle: "🧭",
    body: "From first message to farewell, every detail is handled.",
    is_active: true,
    updated_at: "2025-01-12T09:45:00Z",
  },
  {
    id: 5,
    section: "way_card",
    title: "Thoughtful Storytelling",
    subtitle: "📖",
    body: "We weave narrative into travel — every stop has meaning.",
    is_active: true,
    updated_at: "2025-01-11T16:00:00Z",
  },
  {
    id: 6,
    section: "vision",
    title: "Our Vision",
    subtitle: "",
    body: "To make Kerivaa the digital and physical gateway to Kerala — the first name travelers think of when they imagine exploring God's Own Country.",
    is_active: true,
    updated_at: "2025-01-10T11:30:00Z",
  },
  {
    id: 7,
    section: "vision",
    title: "Long-Term Ambition",
    subtitle: "",
    body: "To build a landmark tourism experience center in Kochi — a physical space where travelers begin their Kerala journey with immersive storytelling, AI-powered planning, and cultural immersion.",
    is_active: true,
    updated_at: "2025-01-09T09:00:00Z",
  },
];

const SECTION_CONFIG = {
  hero: {
    label: "Hero",
    badge: "bg-purple-50 text-purple-700 border border-purple-200",
    dot: "bg-purple-500",
    icon: BookOpen,
  },
  way_card: {
    label: "Way Card",
    badge: "bg-sky-50 text-sky-700 border border-sky-200",
    dot: "bg-sky-500",
    icon: Lightbulb,
  },
  vision: {
    label: "Vision",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    icon: Target,
  },
};

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SectionBadge({ section }) {
  const cfg = SECTION_CONFIG[section] || SECTION_CONFIG.hero;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function DeleteConfirmModal({ item, onConfirm, onCancel, deleting }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-400" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Delete Entry?
        </h2>
        <p className="text-sm text-gray-400 mb-1 leading-relaxed">
          You're about to permanently delete:
        </p>
        <p className="text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 mb-6">
          "{item.title}"
        </p>
        <p className="text-xs text-gray-400 mb-7 leading-relaxed">
          This action cannot be undone. The entry will be removed from the About page permanently.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item._id)}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm shadow-red-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ item, onClose, onRequestDelete }) {
  if (!item) return null;
  const cfg = SECTION_CONFIG[item.section] || SECTION_CONFIG.hero;
  const Icon = cfg.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shrink-0">
              <Icon size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                {item.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Updated {formatDate(item.updated_at)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Section", val: <SectionBadge section={item.section} /> },
              {
                label: "Status",
                val: (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${item.is_active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-slate-400"}`}
                    />
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                ),
              },
              { label: "Title", val: item.title },
              { label: "Subtitle / Icon", val: item.subtitle || "—" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {label}
                </p>
                {typeof val === "string" ? (
                  <p className="text-sm font-semibold text-slate-700 leading-tight">{val}</p>
                ) : val}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Body Content
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestDelete(item);
              }}
              className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-500 hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAbout() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAbout = useCallback(async (searchValue = "") => {
    setLoading(true);
    try {
      const response = await getAllAbout(searchValue);
      setItems(response.data.about);
      await new Promise((r) => setTimeout(r, 600));
    } catch {
      setItems(MOCK_ABOUT_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    console.log(id, 'Idd');
    try {
      setDeleting(true);
      const response = await deleteAbout(id);
      const { message } = response.data;
      if (message == 'About Deleted') {
        setItems((prev) => prev.filter((i) => i._id !== id));
        setDeleteTarget(null);
        showToast("Entry deleted successfully.", "error");
        await fetchAbout();
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to delete. Please try again.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = (id) => {
    console.log(id, 'Oooi')
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, is_active: !i.is_active } : i))
    );
  }


  const filtered = items;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statCards = [
    { label: "Total Entries", val: items.length, icon: Info, iconBg: "bg-green-50", iconColor: "text-green-600" },
    { label: "Hero", val: items.filter((i) => i.section === "hero").length, icon: BookOpen, iconBg: "bg-purple-50", iconColor: "text-purple-500" },
    { label: "Way Cards", val: items.filter((i) => i.section === "way_card").length, icon: Lightbulb, iconBg: "bg-sky-50", iconColor: "text-sky-500" },
    { label: "Vision", val: items.filter((i) => i.section === "vision").length, icon: Target, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  const TABLE_HEADS = ["Title", "Section", "Subtitle / Icon", "Body Preview", "Status", "Updated", "Actions"];

  return (
    <div className="min-h-screen bg-green-50/30">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <Info size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">About Page</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage About section content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/admin/add-about"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
          >
            <Plus size={13} />
            Add Entry
          </a>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            A
          </div>
        </div>
      </header>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, val, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-4 border border-green-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
            >
              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={19} className={iconColor} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 leading-none">{val}</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">All Entries</span>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full">
                {filtered.length}
              </span>
              <div className="flex gap-1 ml-1">
                {["all", "hero", "way_card", "vision"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setFilterSection(s); setCurrentPage(1); }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors capitalize ${filterSection === s
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                  >
                    {s === "all" ? "All" : s === "way_card" ? "Way Card" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or body…"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  setCurrentPage(1);
                  fetchAbout(value);
                }}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition w-64 placeholder-gray-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading content…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Info size={26} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No entries found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filter</p>
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
                  {paginated.map((item) => (
                    <tr key={item._id} className="hover:bg-green-50/40 transition-colors duration-150">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {item.title.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-700 text-sm">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <SectionBadge section={item.section} />
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-sm whitespace-nowrap">
                        {item.subtitle || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="text-gray-400 truncate text-xs">
                          {item.body.slice(0, 60)}{item.body.length > 60 ? "…" : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(item._id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${item.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {item.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition-all flex items-center justify-center"
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <a
                            href={`/admin/edit-about/${item._id}`}
                            className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 hover:scale-105 transition-all flex items-center justify-center"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </a>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
                results
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:border-green-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${n === currentPage
                      ? "bg-green-600 text-white shadow-sm shadow-green-300"
                      : "text-gray-500 hover:bg-gray-100"
                      }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:border-green-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <ViewModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRequestDelete={(item) => setDeleteTarget(item)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white animate-bounce-in
      ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}
          style={{ animation: "fadeUp 0.3s ease" }}
        >
          {toast.type === "error" ? (
            <Trash2 size={15} className="shrink-0" />
          ) : (
            <Info size={15} className="shrink-0" />
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}