import { useEffect, useState, useRef } from "react";
import AddExperience from "./AddExperience";
import EditExperience from "./EditExperience";
import { getAllExperiences, deleteExperience } from "../../../services/adminService";

export default function AdminExperience() {
  const [journeys, setJourneys] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    fetchAllExperiences();
  }, []);

  const fetchAllExperiences = async (search = "") => {
    try {
      const response = await getAllExperiences(search);
      const { experiences } = response.data;
      setJourneys(experiences);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        await fetchAllExperiences(query); 
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleClearSearch = async () => {
  setSearchQuery("");
  setIsSearching(true);
  try {
    await fetchAllExperiences(""); 
  } finally {
    setIsSearching(false);
  }
};

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = () => {
    fetchAllExperiences();
    setShowAdd(false);
    showToast("Experience added successfully.");
  };

  const handleEdit = (updated) => {
    setJourneys((prev) => prev.map((j) => (j._id === updated._id ? updated : j)));
    setEditTarget(null);
    showToast("Experience updated.");
  };

  const handleDelete = async (id) => {
    try {
      await deleteExperience(id);
      setJourneys((prev) => prev.filter((j) => j._id !== id));
      setDeleteConfirm(null);
      showToast("Experience deleted.", "error");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#eaf4ef] to-[#d4eddf] border border-[#b7dfc9] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-[#1a1a1a] leading-tight tracking-tight">
              Signature Experiences
            </div>
            <div className="text-xs text-gray-400 mt-0.5 font-normal">
              {journeys?.length} journeys listed
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="flex-1 max-w-xs mx-6 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {isSearching ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search experiences…"
            className="w-full pl-9 pr-8 py-2 text-[13px] bg-[#f5f5f3] border border-[#e8e8e8] rounded-full outline-none focus:border-[#2d6a4f] focus:bg-white transition-all duration-150 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-green-500/30">
            A
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[#2d6a4f] text-white border-none rounded-full px-5 py-2.5 text-[13px] font-semibold tracking-wide cursor-pointer hover:bg-[#235840] hover:-translate-y-px transition-all duration-150"
          >
            + Add Experience
          </button>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 py-9 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {journeys?.map((j) => (
          <div
            key={j._id}
            className="bg-white rounded-xl overflow-hidden border border-[#ececec] transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={j.image}
                alt={j.title}
                className="w-full h-full object-cover block"
              />
              {(j.duration || j.price) && (
                <span className="absolute bottom-2.5 left-2.5 bg-black/55 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md tracking-wide">
                  {[j.duration, j.price ? `Starting from ₹${j.price}` : null].filter(Boolean).join(" | ")}
                </span>
              )}
            </div>

            <div className="px-[18px] pt-4 pb-[18px]">
              <div className="text-xl font-semibold text-[#111] mb-1 leading-snug" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {j.title}
              </div>
              <div className="text-[13px] text-[#888] font-light leading-relaxed mb-3.5">
                {j.desc}
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setEditTarget(j)}
                  className="flex-1 bg-transparent text-[#555] border border-[#ddd] rounded-full px-5 py-2 text-[13px] font-medium cursor-pointer hover:border-[#999] hover:text-[#222] transition-colors duration-150"
                >
                  ✎ Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(j._id)}
                  title="Delete"
                  className="w-[34px] h-[34px] bg-white border border-[#e8e8e8] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#ffeaea] hover:border-[#f5c6cb] transition-colors duration-150"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {journeys?.length === 0 && (
          <div className="col-span-full text-center py-20 px-5 text-[#bbb]">
            <div className="text-5xl mb-4">{searchQuery ? "🔍" : "🏝️"}</div>
            <div className="text-2xl text-[#ccc]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {searchQuery ? `No results for "${searchQuery}"` : "No experiences yet"}
            </div>
            <div className="text-[13px] mt-2">
              {searchQuery ? "Try a different keyword." : `Click "Add Experience" to get started.`}
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-5">
          <AddExperience onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-5">
          <EditExperience
            initial={editTarget}
            onSave={handleEdit}
            onCancel={() => setEditTarget(null)}
            showToast={showToast}
          />
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl px-8 py-9 max-w-[420px] w-full shadow-2xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <div className="text-[22px] font-semibold text-[#111] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Delete Experience?
            </div>
            <div className="text-sm text-[#888] mb-7 leading-relaxed">
              This will permanently remove the experience from your listing. This action cannot be undone.
            </div>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-transparent text-[#555] border border-[#ddd] rounded-full px-5 py-2 text-[13px] font-medium cursor-pointer hover:border-[#999] hover:text-[#222] transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-[#c0392b] text-white border-none rounded-full px-[18px] py-2 text-[13px] font-semibold cursor-pointer hover:bg-[#a93226] transition-colors duration-150"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-7 right-7 z-[9999] px-5 py-3 rounded-xl text-sm font-medium shadow-lg animate-bounce-in
          ${toast.type === "success" ? "bg-[#2d6a4f] text-white" : "bg-[#c0392b] text-white"}`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}