import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, ChevronLeft, ChevronRight, X, Inbox,
    CheckCircle, XCircle, Filter, Trash2, Edit3, Plus,
    MessageSquareQuote, User, MapPin, Quote
} from "lucide-react";
// Import your actual services here
import {getReviews} from '../../../services/adminService';
// import { getReviews, deleteReview, updateReviewStatus } from "../../../services/adminService";

const MOCK_REVIEWS = [
    { _id: "1", authorName: "Sarah Jenkins", quote: "The best trip of my life! The itinerary was flawless and the hotels were top notch.", authorCountry: "United Kingdom", isActive: true, createdAt: "2025-01-15T10:30:00Z" },
    { _id: "2", authorName: "Raj Patel", quote: "Kerala truly is God's Own Country. Thank you for making our family vacation so memorable.", authorCountry: "India", isActive: true, createdAt: "2025-01-14T08:15:00Z" },
    { _id: "3", authorName: "Elena Rodriguez", quote: "A bit rushed on day 3, but overall a fantastic experience. Highly recommend the houseboat.", authorCountry: "Spain", isActive: false, createdAt: "2025-01-10T11:30:00Z" },
];

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const config = {
        success: { wrapper: "bg-white border border-emerald-200 shadow-lg", icon: <CheckCircle size={15} className="text-emerald-500 shrink-0" />, text: "text-emerald-700" },
        error: { wrapper: "bg-white border border-red-200 shadow-lg", icon: <XCircle size={15} className="text-red-500 shrink-0" />, text: "text-red-700" },
    };

    const { wrapper, icon, text } = config[type];

    return (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl ${wrapper}`}>
                {icon}
                <p className={`text-sm font-semibold ${text}`}>{message}</p>
                <button onClick={onClose} className="ml-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={13} />
                </button>
            </div>
        </div>
    );
}

function StatusBadge({ isActive }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

export default function AdminReview() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fetchReviews = useCallback(async (searchValue = "") => {
        setLoading(true);
        try {
            const response = await getReviews();
            const {review} = response.data;
            console.log(review,'Review')
            setReviews(review);

            // MOCK DATA LOGIC
            // setTimeout(() => {
            //     const filtered = MOCK_REVIEWS.filter(r =>
            //         r.authorName.toLowerCase().includes(searchValue.toLowerCase()) ||
            //         r.authorCountry.toLowerCase().includes(searchValue.toLowerCase())
            //     );
            //     setReviews(filtered);
            //     setLoading(false);
            // }, 500);
        } catch {
            setToast({ message: "Failed to fetch reviews.", type: "error" });
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleDelete = async (id) => {
        try {
            // await deleteReview(id);
            setReviews((prev) => prev.filter((r) => r._id !== id));
            setToast({ message: "Review deleted successfully.", type: "error" });
        } catch (error) {
            setToast({ message: "Failed to delete review.", type: "error" });
        } finally {
            setDeleteConfirmId(null);
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            // await updateReviewStatus(id, !currentStatus);
            setReviews((prev) => prev.map((r) => r._id === id ? { ...r, isActive: !currentStatus } : r));
            setToast({ message: "Review status updated!", type: "success" });
        } catch (error) {
            setToast({ message: "Failed to update status.", type: "error" });
        }
    };

    const filtered = reviews;
    const totalPages = Math.ceil(filtered?.length / ITEMS_PER_PAGE);
    const paginated = filtered?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const statCards = [
        { label: "Total Reviews", val: reviews.length, icon: MessageSquareQuote, iconBg: "bg-green-50", iconColor: "text-green-600" },
        { label: "Active", val: reviews.filter(r => r.isActive).length, icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
        { label: "Inactive", val: reviews.filter(r => !r.isActive).length, icon: XCircle, iconBg: "bg-slate-50", iconColor: "text-slate-400" },
    ];

    const TABLE_HEADS = ["Author", "Quote", "Country", "Status", "Date", "Actions"];

    return (
        <div className="min-h-screen bg-green-50/30 pb-10">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
                        <Quote size={16} className="text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Client Reviews</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Manage user testimonials and feedback</p>
                    </div>
                </div>
            </header>

            <div className="p-6 space-y-5">
                {/* Top Actions & Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-4">
                        {statCards.map(({ label, val, icon: Icon, iconBg, iconColor }) => (
                            <div key={label} className="bg-white rounded-2xl px-5 py-4 border border-green-50 shadow-sm flex items-center gap-3 min-w-[160px]">
                                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                                    <Icon size={18} className={iconColor} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-800 leading-none">{val}</p>
                                    <p className="text-[11px] text-gray-400 mt-1 font-semibold uppercase tracking-wide">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/admin/add-review')}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition shadow-sm shadow-green-200 cursor-pointer"
                    >
                        <Plus size={16} /> Add New Review
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700">All Reviews</span>
                            <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full">{filtered.length}</span>
                        </div>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search author or country…"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                    fetchReviews(e.target.value);
                                }}
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition w-64 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
                            <p className="text-sm text-gray-400 font-medium">Loading reviews…</p>
                        </div>
                    ) : paginated.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                                <Quote size={26} className="text-gray-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-500">No reviews found</p>
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
                                    {paginated.map((r) => (
                                        <tr key={r._id} className="hover:bg-green-50/40 transition-colors duration-150">
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
                                                        {r.authorName.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-700 text-sm">{r.authorName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 max-w-[250px]">
                                                <p className="text-gray-500 truncate text-xs" title={r.quote}>"{r.quote}"</p>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs font-medium">
                                                    <MapPin size={12} className="text-gray-400" /> {r.authorCountry}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <button onClick={() => handleStatusToggle(r._id, r.isActive)} className="cursor-pointer hover:opacity-80 transition-opacity">
                                                    <StatusBadge isActive={r.isActive} />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                                {formatDate(r.createdAt)}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => navigate(`/admin/edit-review/${r._id}`)}
                                                        className="w-7 h-7 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(r._id)}
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

                    {/* Pagination */}
                    {!loading && filtered.length > ITEMS_PER_PAGE && (
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
                            <p className="text-xs text-gray-400">
                                Showing <span className="font-semibold text-gray-600">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-gray-600">{filtered.length}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                    <ChevronLeft size={15} />
                                </button>
                                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => setDeleteConfirmId(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={22} className="text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Review?</h3>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">This will permanently remove the review from the website. This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm shadow-red-200 cursor-pointer">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}