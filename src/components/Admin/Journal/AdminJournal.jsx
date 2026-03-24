import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Search,
  Eye,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getJournal, updateJournalStatus } from "../../../services/adminService";

const STATUS_CONFIG = {
  published: {
    label: "Published",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  draft: {
    label: "Draft",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  archived: {
    label: "Archived",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
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

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Toast({ toast }) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <>
      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .toast-enter {
          animation: toastSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div
        className="toast-enter fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl shadow-black/10 text-sm font-semibold"
        style={{
          background: isError ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${isError ? "#fecaca" : "#bbf7d0"}`,
          color: isError ? "#b91c1c" : "#15803d",
          minWidth: 220,
        }}
      >
        <span
          className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold shrink-0"
          style={{ background: isError ? "#ef4444" : "#22c55e" }}
        >
          {isError ? "✕" : "✓"}
        </span>
        {toast.msg}
      </div>
    </>
  );
}

function ViewModal({ post, onClose, onStatusChange }) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight line-clamp-1">
                {post.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Created {formatDate(post.createdAt)}
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
          <div
            className="rounded-2xl overflow-hidden border border-slate-100"
            style={{ aspectRatio: "16/9" }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FileText, label: "Title", val: post.title },
              { icon: Calendar, label: "Date", val: formatDate(post.createdAt) },
            ].map(({ icon: Icon, label, val }) => (
              <div
                key={label}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-3"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={11} className="text-green-500" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {label}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  {val}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <FileText size={11} className="text-green-500" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Description
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{post.desc}</p>
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-slate-500">Status</p>
              <StatusBadge status={post.status} />
            </div>
            <select
              value={post.status}
              onChange={(e) => onStatusChange(post._id, e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition cursor-pointer"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminJournal() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getJournal();
      const { journal } = response.data;
      await new Promise((r) => setTimeout(r, 600));
      setPosts(journal);
    } catch (error){
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = (id) =>
    setPosts((prev) => prev.filter((p) => p._id !== id));

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateJournalStatus(id, status);
      const { message } = response.data;
      if (message === "Journal Status Updated") {
        showToast("Status updated successfully");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to update status", "error");
    }

    setPosts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p))
    );
    setSelectedPost((prev) =>
      prev?._id === id ? { ...prev, status } : prev
    );
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statCards = [
    {
      label: "Total Posts",
      val: posts.length,
      icon: Layers,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Published",
      val: posts.filter((p) => p.status === "published").length,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Drafts",
      val: posts.filter((p) => p.status === "draft").length,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "Archived",
      val: posts.filter((p) => p.status === "archived").length,
      icon: XCircle,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-400",
    },
  ];

  const TABLE_HEADS = ["Post", "Description", "Image", "Status", "Date", "Actions"];

  return (
    <div className="min-h-screen bg-green-50/30">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <BookOpen size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">
              Journal Posts
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage Kerala journal articles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/add-journal")}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-green-200 cursor-pointer"
          >
            <Plus size={13} />
            Add Post
          </button>

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
              <div
                className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon size={19} className={iconColor} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 leading-none">
                  {val}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                All Posts
              </span>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by title or description…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition w-64 placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => navigate("/admin/add-journal")}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px whitespace-nowrap cursor-pointer"
              >
                <Plus size={13} />
                New Post
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-medium">
                Loading posts…
              </p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                <BookOpen size={26} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No posts found
              </p>
              <p className="text-xs text-gray-400">
                Try adjusting your search or add a new post
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    {TABLE_HEADS.map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-green-50/40 transition-colors duration-150"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold shrink-0">
                            {p.title.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-700 text-sm">
                            {p.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="text-gray-400 truncate text-xs">
                          {p.desc.slice(0, 60)}
                          {p.desc.length > 60 ? "…" : ""}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="w-14 h-9 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          <img
                            src={p.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={p.status} />
                      </td>

                      <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedPost(p)}
                            className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition-all flex items-center justify-center"
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <select
                            value={p.status}
                            onChange={(e) =>
                              handleStatusChange(p._id, e.target.value)
                            }
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition cursor-pointer"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:scale-105 transition-all flex items-center justify-center"
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
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">
                  {filtered.length}
                </span>{" "}
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                        n === currentPage
                          ? "bg-green-600 text-white shadow-sm shadow-green-300"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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

      {selectedPost && (
        <ViewModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}