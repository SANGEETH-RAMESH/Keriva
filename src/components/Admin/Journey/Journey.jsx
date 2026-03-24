import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  CheckCircle,
  XCircle,
  Filter,
  Globe,
  Phone,
  Mail,
  Compass,
  Sparkles,
  Tag,
} from "lucide-react";
import { getJourneySubmissions } from "../../../services/adminService";

const MOCK_DATA = [
  {
    id: 1,
    name: "Arjun Menon",
    email: "arjun.menon@gmail.com",
    whatsapp: "+91 98765 43210",
    country: "India",
    dream: "I imagine waking to mist over tea gardens, spending afternoons on quiet backwaters, and evenings with nothing but the sound of rain on a wooden houseboat.",
    selected: ["Nature & Hills", "Ayurveda & Wellness", "Family Trip"],
    budget: "Premium",
    month: "March",
    duration: "7–8 Days",
    status: "new",
    created_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Sofia Andersen",
    email: "sofia.andersen@outlook.com",
    whatsapp: "+45 12 34 56 78",
    country: "Denmark",
    dream: "We want a slow, romantic journey — Kerala's backwaters, candlelit dinners by the water, Ayurveda sessions, and waking up to birdsong in a treehouse resort.",
    selected: ["Honeymoon", "Luxury & Private Tours", "Ayurveda & Wellness"],
    budget: "Luxury",
    month: "June",
    duration: "9–10 Days",
    status: "contacted",
    created_at: "2025-01-14T08:15:00Z",
  },
  {
    id: 3,
    name: "James Carter",
    email: "j.carter@company.co.uk",
    whatsapp: "+44 7911 123456",
    country: "United Kingdom",
    dream: "A cultural deep-dive — temples, spice markets, Kathakali performances, and village homestays. I want to feel the real Kerala, not a tourist version.",
    selected: ["Culture & Heritage", "Food & Culinary Trail"],
    budget: "Comfortable",
    month: "August",
    duration: "5–6 Days",
    status: "closed",
    created_at: "2025-01-13T14:20:00Z",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@yahoo.in",
    whatsapp: "+91 87654 32109",
    country: "India",
    dream: "A girls trip — beaches, seafood, sunsets, and laughing too loud. Varkala cliffs, maybe Kovalam. Somewhere we can be loud and free.",
    selected: ["Beaches & Relaxation", "Friends Getaway", "Food & Culinary Trail"],
    budget: "Comfortable",
    month: "April",
    duration: "3–4 Days",
    status: "new",
    created_at: "2025-01-12T09:45:00Z",
  },
  {
    id: 5,
    name: "Marco Rossi",
    email: "marco.rossi@libero.it",
    whatsapp: "+39 02 1234567",
    country: "Italy",
    dream: "Trekking the Western Ghats, wild camping if possible, rafting, and zip-lining. I'm here for the adrenaline, not the spas.",
    selected: ["Adventure & Trekking", "Nature & Hills"],
    budget: "Premium",
    month: "July",
    duration: "7–8 Days",
    status: "contacted",
    created_at: "2025-01-11T16:00:00Z",
  },
  {
    id: 6,
    name: "Yuki Tanaka",
    email: "yuki.tanaka@docomo.ne.jp",
    whatsapp: "+81 90-1234-5678",
    country: "Japan",
    dream: "Something ultra private — a boutique villa, personalized chef, private boat, no crowds. Budget is not a concern. Experience is everything.",
    selected: ["Luxury & Private Tours", "Beaches & Relaxation", "Ayurveda & Wellness"],
    budget: "Ultra Luxury",
    month: "October",
    duration: "11–14 Days",
    status: "new",
    created_at: "2025-01-10T11:30:00Z",
  },
];

const ITEMS_PER_PAGE = 5;

const STATUS_CONFIG = {
  new: {
    label: "New",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  contacted: {
    label: "Contacted",
    badge: "bg-sky-50 text-sky-700 border border-sky-200",
    dot: "bg-sky-500",
  },
  closed: {
    label: "Closed",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
};

const BUDGET_CONFIG = {
  Comfortable: "bg-blue-50 text-blue-700 border border-blue-200",
  Premium: "bg-violet-50 text-violet-700 border border-violet-200",
  Luxury: "bg-amber-50 text-amber-700 border border-amber-200",
  "Ultra Luxury": "bg-rose-50 text-rose-700 border border-rose-200",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function BudgetBadge({ budget }) {
  const cls = BUDGET_CONFIG[budget] || "bg-gray-50 text-gray-600 border border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <DollarSign size={9} />
      {budget}
    </span>
  );
}

function InterestTags({ tags }) {
  if (!tags?.length) return <span className="text-xs text-gray-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 2).map((t) => (
        <span key={t} className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
          <Tag size={8} />{t}
        </span>
      ))}
      {tags.length > 2 && (
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
          +{tags.length - 2}
        </span>
      )}
    </div>
  );
}

function ViewModal({ journey, onClose, onStatusChange }) {
  if (!journey) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {journey.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">{journey.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Submitted {formatDate(journey.created_at)}</p>
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
              { icon: Users, label: "Full Name", val: journey.name },
              { icon: Mail, label: "Email", val: journey.email },
              { icon: Phone, label: "WhatsApp", val: journey.whatsapp },
              { icon: Globe, label: "Country", val: journey.country },
              { icon: Calendar, label: "Travel Month", val: journey.month },
              { icon: Clock, label: "Duration", val: journey.duration },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={11} className="text-green-500" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700 leading-tight">{val}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <DollarSign size={11} className="text-green-500" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Travel Style / Budget</p>
            </div>
            <BudgetBadge budget={journey.budget} />
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Compass size={11} className="text-green-500" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Interests</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {journey.selected?.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-semibold">
                  <Tag size={9} />{t}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles size={11} className="text-green-500" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dream Journey</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-green-200 pl-3">
              "{journey.dream}"
            </p>
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-slate-500">Status</p>
              <StatusBadge status={journey.status} />
            </div>
            <select
              value={journey.status}
              onChange={(e) => onStatusChange(journey.id, e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition cursor-pointer"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JourneySubmissions() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJourneys = useCallback(async (query="") => {
    setLoading(true);
    try {
      const response = await getJourneySubmissions(query);
      if (response.data.journey) {
        setJourneys(response.data.journey);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJourneys(); }, [fetchJourneys]);

  useEffect(() => {
  const delay = setTimeout(() => {
    fetchJourneys(search);
  }, 400);

  return () => clearTimeout(delay);
}, [search, fetchJourneys]);

  const handleDelete = (id) => setJourneys((prev) => prev.filter((j) => j.id !== id));

  const handleStatusChange = (id, status) => {
    setJourneys((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    setSelectedJourney((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const filtered = journeys;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statCards = [
    { label: "Total Journeys", val: journeys.length, icon: Compass, iconBg: "bg-green-50", iconColor: "text-green-600" },
    { label: "New", val: journeys.filter((j) => j.status === "new").length, icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Contacted", val: journeys.filter((j) => j.status === "contacted").length, icon: MessageSquare, iconBg: "bg-sky-50", iconColor: "text-sky-500" },
    { label: "Closed", val: journeys.filter((j) => j.status === "closed").length, icon: XCircle, iconBg: "bg-slate-50", iconColor: "text-slate-400" },
  ];

  const TABLE_HEADS = ["Traveller", "Contact", "Country", "Interests", "Budget", "Month", "Duration", "Dream", "Status", "Date", "Actions"];

  return (
    <div className="min-h-screen bg-green-50/30">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <Compass size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Journey Submissions</h1>
            <p className="text-xs text-gray-400 mt-0.5">Custom trip requests from Shape Your Journey</p>
          </div>
        </div>
        <div className="flex items-center gap-2">

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            A
          </div>
        </div>
      </header>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, val, icon: Icon, iconBg, iconColor }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-green-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3">
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
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">All Submissions</span>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, country, interest…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition w-64 placeholder-gray-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading journeys…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Compass size={26} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No journeys found</p>
              <p className="text-xs text-gray-400">Try adjusting your search query</p>
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
                  {paginated.map((j) => (
                    <tr key={j.id} className="hover:bg-green-50/40 transition-colors duration-150">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {j.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-700 text-sm">{j.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-gray-500 text-xs whitespace-nowrap">{j.email}</p>
                        <p className="text-gray-400 text-xs whitespace-nowrap mt-0.5">{j.whatsapp}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
                          <Globe size={11} className="text-gray-400" />{j.country}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <InterestTags tags={j.selected} />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <BudgetBadge budget={j.budget} />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                          <Calendar size={10} className="text-gray-400" />{j.month}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                          <Clock size={10} className="text-gray-400" />{j.duration}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-[170px]">
                        <p className="text-gray-400 text-xs italic truncate">
                          {j.dream.slice(0, 50)}{j.dream.length > 50 ? "…" : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={j.status} />
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(j.created_at)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedJourney(j)}
                            className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition-all flex items-center justify-center"
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <select
                            value={j.status}
                            onChange={(e) => handleStatusChange(j.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button
                            onClick={() => handleDelete(j.id)}
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
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      n === currentPage
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

      {selectedJourney && (
        <ViewModal
          journey={selectedJourney}
          onClose={() => setSelectedJourney(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}