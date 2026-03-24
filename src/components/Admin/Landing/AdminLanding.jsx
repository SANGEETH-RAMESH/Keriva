import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ImageIcon,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  LayoutDashboard,
} from "lucide-react";

import { getLanding } from '../../../services/adminService';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SLIDES = [
  {
    _id: "1",
    title: "Alleppey Backwaters",
    location: "Alleppey, Kerala, India",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    isActive: true,
    order: 1,
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    _id: "2",
    title: "Munnar Tea Gardens",
    location: "Munnar, Kerala, India",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    isActive: true,
    order: 2,
    createdAt: "2025-01-11T12:00:00Z",
  },
  {
    _id: "3",
    title: "Kovalam Beach",
    location: "Kovalam, Thiruvananthapuram, India",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    isActive: false,
    order: 3,
    createdAt: "2025-01-12T08:30:00Z",
  },
  {
    _id: "4",
    title: "Wayanad Forest",
    location: "Wayanad, Kerala, India",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    isActive: true,
    order: 4,
    createdAt: "2025-01-13T15:00:00Z",
  },
  {
    _id: "5",
    title: "Thrissur Cultural Hub",
    location: "Thrissur, Kerala, India",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    isActive: false,
    order: 5,
    createdAt: "2025-01-14T09:45:00Z",
  },
  {
    _id: "6",
    title: "Varkala Cliff",
    location: "Varkala, Kerala, India",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    isActive: true,
    order: 6,
    createdAt: "2025-01-15T11:00:00Z",
  },
];

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const cfg = {
    success: {
      wrap: "bg-white border border-emerald-200 shadow-lg",
      icon: <CheckCircle size={15} className="text-emerald-500 shrink-0" />,
      text: "text-emerald-700",
    },
    error: {
      wrap: "bg-white border border-red-200 shadow-lg",
      icon: <XCircle size={15} className="text-red-500 shrink-0" />,
      text: "text-red-700",
    },
  };
  const { wrap, icon, text } = cfg[type];
  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl ${wrap}`}>
        {icon}
        <p className={`text-sm font-semibold ${text}`}>{message}</p>
        <button onClick={onClose} className="ml-1 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

function ViewModal({ slide, onClose }) {
  if (!slide) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative h-56">
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
          <div className="absolute bottom-4 left-4">
            <h2 className="text-lg font-bold text-white leading-tight">{slide.title}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-green-300" />
              <p className="text-xs text-green-200 font-medium">{slide.location}</p>
            </div>
          </div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3">
          {[
            { label: "Slide Order", val: `#${slide.order}` },
            { label: "Status", val: slide.isActive ? "Active" : "Inactive" },
            { label: "Added On", val: formatDate(slide.createdAt) },
          ].map(({ label, val }) => (
            <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
              <p className="text-sm font-semibold text-slate-700">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminLanding() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSlide, setViewSlide] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);


  useEffect(() => {
    const fetchLanding = async () => {
      try {
        setLoading(true);
        const response = await getLanding();
        const { landing } = response.data;
        if (landing) {
          setSlides(landing);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLanding();
  }, [])

  const handleToggleActive = async (id) => {
    // await updateSlideStatus(id, !slide.isActive)
    setSlides((prev) => prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s)));
    setToast({ message: "Visibility updated.", type: "success" });
  };

  const handleDelete = async (id) => {
    // await deleteSlide(id)
    setSlides((prev) => prev.filter((s) => s._id !== id));
    setDeleteConfirmId(null);
    setToast({ message: "Slide deleted.", type: "error" });
  };

  const filtered = slides?.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered?.length / ITEMS_PER_PAGE);
  const paginated = filtered?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statCards = [
    { label: "Total Slides", val: slides?.length, color: "bg-green-50", iconColor: "text-green-600", icon: ImageIcon },
    { label: "Active", val: slides?.filter((s) => s.isActive).length, color: "bg-emerald-50", iconColor: "text-emerald-500", icon: CheckCircle },
    { label: "Inactive", val: slides?.filter((s) => !s.isActive).length, color: "bg-slate-50", iconColor: "text-slate-400", icon: XCircle },
  ];

  const TABLE_HEADS = ["#", "Image", "Title", "Location", "Order", "Status", "Added On", "Actions"];

  return (
    <div className="min-h-screen bg-green-50/30">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <LayoutDashboard size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Landing Page</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage hero carousel slides</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/add-landing")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm shadow-green-300 cursor-pointer"
        >
          <Plus size={14} /> Add Slide
        </button>
      </header>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {statCards.map(({ label, val, color, iconColor, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-green-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
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
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">All Slides</span>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full">
                {filtered?.length}
              </span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or location…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition w-64 placeholder-gray-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading slides…</p>
            </div>
          ) : paginated?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                <ImageIcon size={26} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No slides found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or add a new slide</p>
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
                  {paginated?.map((slide, idx) => (
                    <tr key={slide._id} className="hover:bg-green-50/40 transition-colors duration-150">
                      <td className="px-4 py-3.5 text-xs text-gray-400 font-medium whitespace-nowrap">
                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="w-14 h-10 rounded-xl overflow-hidden border border-gray-100 bg-gray-100 shrink-0">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/56x40?text=img"; }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-semibold text-gray-700 text-sm">{slide.title}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs">
                          <MapPin size={11} className="text-green-500 shrink-0" />
                          {slide.location}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                          {slide.order}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(slide._id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${slide.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${slide.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {slide.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(slide.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewSlide(slide)}
                            className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/edit-landing/${slide._id}`)}
                            className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(slide._id)}
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

          {!loading && filtered?.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </span>{" "}
                of <span className="font-semibold text-gray-600">{filtered.length}</span> results
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
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${n === currentPage ? "bg-green-600 text-white shadow-sm shadow-green-300" : "text-gray-500 hover:bg-gray-100"
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

      {viewSlide && <ViewModal slide={viewSlide} onClose={() => setViewSlide(null)} />}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Slide?</h3>
            <p className="text-sm text-gray-400 mb-2 leading-relaxed">
              <span className="font-semibold text-gray-600">
                "{slides.find((s) => s._id === deleteConfirmId)?.title}"
              </span>{" "}
              will be permanently removed from the carousel.
            </p>
            <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm shadow-red-200 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}