import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  MessageSquare,
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Inbox,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  MapPin,
  MessageCircle,
  Settings,
  Save,
  Edit3,
  ExternalLink,
  Info,
} from "lucide-react";
import { getContactInfo, getContact, updateContactInfo, updateContactStatus, deleteContact } from "../../../services/adminService";

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

const MOCK_DATA = [
  {
    id: 1,
    name: "Arjun Menon",
    email: "arjun.menon@gmail.com",
    phone: "+91 98765 43210",
    country: "India",
    travel_month: "March 2025",
    budget: "$2,000",
    message:
      "Hi, I am planning a family trip to Europe in March. We are a family of 4. Could you please help us with a customized itinerary including flights and hotels?",
    status: "new",
    created_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Sofia Andersen",
    email: "sofia.andersen@outlook.com",
    phone: "+45 12 34 56 78",
    country: "Denmark",
    travel_month: "June 2025",
    budget: "$5,000",
    message:
      "Looking for a luxury honeymoon package to the Maldives. We would prefer an overwater bungalow with all-inclusive options for 10 nights.",
    status: "contacted",
    created_at: "2025-01-14T08:15:00Z",
  },
  {
    id: 3,
    name: "James Carter",
    email: "j.carter@company.co.uk",
    phone: "+44 7911 123456",
    country: "United Kingdom",
    travel_month: "August 2025",
    budget: "$3,500",
    message:
      "Interested in a safari package to Kenya. Looking for 7 nights with guided game drives and comfortable lodges. Please share available packages.",
    status: "closed",
    created_at: "2025-01-13T14:20:00Z",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@yahoo.in",
    phone: "+91 87654 32109",
    country: "India",
    travel_month: "April 2025",
    budget: "$1,200",
    message:
      "Solo backpacking trip through Southeast Asia. Interested in Thailand, Vietnam, and Cambodia. Need budget accommodation recommendations.",
    status: "new",
    created_at: "2025-01-12T09:45:00Z",
  },
  {
    id: 5,
    name: "Marco Rossi",
    email: "marco.rossi@libero.it",
    phone: "+39 02 1234567",
    country: "Italy",
    travel_month: "July 2025",
    budget: "$4,000",
    message:
      "Planning a road trip across the American West Coast. Need help with car rental, Route 66, national parks, and accommodation bookings.",
    status: "contacted",
    created_at: "2025-01-11T16:00:00Z",
  },
  {
    id: 6,
    name: "Yuki Tanaka",
    email: "yuki.tanaka@docomo.ne.jp",
    phone: "+81 90-1234-5678",
    country: "Japan",
    travel_month: "October 2025",
    budget: "$2,800",
    message:
      "Looking for an autumn foliage tour in Japan for 2 people. We would like to visit Kyoto, Nikko, and Hakone during peak koyo season.",
    status: "new",
    created_at: "2025-01-10T11:30:00Z",
  },
];

const DEFAULT_CONTACT_INFO = {
  location: "Kochi, Kerala, India",
  email: "hello@kerivaa.com",
  whatsapp: "919876543210",
  phone: "+91 98765 43210",
};

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr) {
  console.log(dateStr,'hhy')
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

  const config = {
    success: {
      wrapper: "bg-white border border-emerald-200 shadow-lg",
      icon: <CheckCircle size={15} className="text-emerald-500 shrink-0" />,
      text: "text-emerald-700",
    },
    error: {
      wrapper: "bg-white border border-red-200 shadow-lg",
      icon: <XCircle size={15} className="text-red-500 shrink-0" />,
      text: "text-red-700",
    },
  };

  const { wrapper, icon, text } = config[type];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl ${wrapper}`}>
        {icon}
        <p className={`text-sm font-semibold ${text}`}>{message}</p>
        <button
          onClick={onClose}
          className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ViewModal({ contact, onClose, onStatusChange }) {
  if (!contact) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {contact?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                {contact.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submitted {formatDate(contact.created_at)}
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
              { icon: Users, label: "Full Name", val: contact.name },
              { icon: Mail, label: "Email", val: contact.email },
              { icon: Phone, label: "Phone", val: contact.phone },
              { icon: Globe, label: "Country", val: contact.country },
              { icon: Calendar, label: "Travel Month", val: contact.month },
              { icon: DollarSign, label: "Budget", val: contact.budget },
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
              <MessageSquare size={11} className="text-green-500" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Full Message
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {contact.message}
            </p>
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-slate-500">Status</p>
              <StatusBadge status={contact.status} />
            </div>
            <select
              value={contact.status}
              onChange={(e) => onStatusChange(contact.id, e.target.value)}
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

function ContactInfoPanel() {
  const [info, setInfo] = useState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState();
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);

  const handleEdit = () => {
    setDraft({ ...info });
    setEditing(true);
    setSaved(false);
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await getContactInfo();
        const { contact } = response.data;
        console.log(contact, 'heyyy')
        setInfo(contact[0])
      } catch (error) {
        console.log(error);
      }
    }
    fetchContactInfo()
  }, [])

  const handleSave = async () => {
    try {
      const response = await updateContactInfo(draft);
      console.log(response.data, 'Reee')
      const { message } = response.data;
      if (message == "Contact Info Updated Succesfull") {
        console.log("ooi")
        setInfo({ ...draft });
        setEditing(false);
        setToast({ message: "Contact info saved successfully!", type: "success" });
      }
    } catch {
      setToast({ message: "Failed to save. Please try again.", type: "error" });
    }
  };

  const handleCancel = () => {
    setDraft({ ...info });
    setEditing(false);
  };

  const waLink = `https://wa.me/${info?.whatsapp?.replace(/\D/g, "")}`;
  const mailLink = `mailto:${info?.email}`;
  const telLink = `tel:${info?.phone?.replace(/\s/g, "")}`;

  const fieldClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition placeholder-gray-400";

  const readClass =
    "w-full border border-gray-100 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 bg-gray-50/60 cursor-default";

  return (
    <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2 ">
          <Settings size={14} className="text-green-600" />
          <span className="text-sm font-bold text-gray-800 ">Contact Info</span>
          <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-100">
            User-facing
          </span>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold animate-pulse">
              <CheckCircle size={12} /> Saved
            </span>
          )}
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition font-semibold"
              >
                <X size={11} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center cursor-pointer gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold shadow-sm"
              >
                <Save size={11} /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition font-semibold"
            >
              <Edit3 size={11} /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="mx-5 mt-4 mb-1 flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-xl px-3.5 py-2.5">
        <Info size={13} className="text-sky-500 mt-0.5 shrink-0" />
        <p className="text-xs text-sky-700 leading-relaxed">
          These details are displayed on the public <strong>Contact</strong> page. Any changes here will reflect directly on the website.
        </p>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <MapPin size={10} className="text-green-500" /> Office Location
          </label>
          {editing ? (
            <input
              className={fieldClass}
              value={draft.location}
              onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Kochi, Kerala, India"
            />
          ) : (
            <div className={readClass}>{info?.location}</div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Mail size={10} className="text-green-500" /> Email Address
          </label>
          {editing ? (
            <input
              className={fieldClass}
              type="email"
              value={draft?.email}
              onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
              placeholder="e.g. hello@kerivaa.com"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className={`${readClass} flex-1`}>{info?.email}</div>
              <a
                href={mailLink}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition shrink-0"
                title="Send email"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <MessageCircle size={10} className="text-green-500" /> WhatsApp Number
          </label>
          {editing ? (
            <div className="space-y-1">
              <input
                className={fieldClass}
                value={draft.whatsapp}
                onChange={(e) => setDraft((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="Digits only, e.g. 919876543210"
              />
              <p className="text-[10px] text-gray-400 pl-1">
                Enter country code + number without spaces or +. Used for wa.me link.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className={`${readClass} flex-1`}>+{info?.whatsapp}</div>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition shrink-0"
                title="Open WhatsApp"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Phone size={10} className="text-green-500" /> Call Number
          </label>
          {editing ? (
            <input
              className={fieldClass}
              type="tel"
              value={draft.phone}
              onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
              placeholder="e.g. +91 98765 43210"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className={`${readClass} flex-1`}>{info?.phone}</div>
              <a
                href={telLink}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition shrink-0"
                title="Call"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mx-5 mb-5 rounded-xl border border-gray-100 bg-gray-50/60 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-1.5">
          <Eye size={11} className="text-gray-400" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Live Preview — User Sees
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-gray-100">
          {[
            {
              icon: MapPin,
              label: "Location",
              val: editing ? draft?.location : info?.location,
              href: null,
            },
            {
              icon: Mail,
              label: "Email",
              val: editing ? draft?.email : info?.email,
              href: `mailto:${editing ? draft?.email : info?.email}`,
            },
            {
              icon: MessageCircle,
              label: "WhatsApp",
              val: "Chat with us",
              href: `https://wa.me/${(editing ? draft?.whatsapp : info?.whatsapp)?.replace(/\D/g, "")}`,
            },
            {
              icon: Phone,
              label: "Call Us",
              val: editing ? draft?.phone : info?.phone,
              href: `tel:${(editing ? draft?.phone : info?.phone)?.replace(/\s/g, "")}`,
            },
          ].map(({ icon: Icon, label, val, href }) => (
            <div key={label} className="px-4 py-3 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#e8f0ec] flex items-center justify-center text-[#2d6a4f] shrink-0 mt-0.5">
                <Icon size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 mb-0.5">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="text-[#2d6a4f] text-xs font-medium hover:underline truncate block"
                  >
                    {val}
                  </a>
                ) : (
                  <p className="text-gray-600 text-xs truncate">{val}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function Contact() {
  const [activeTab, setActiveTab] = useState("messages");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);



  const fetchContacts = useCallback(async (searchValue = "") => {
    setLoading(true);
    try {
      const response = await getContact(searchValue);
      const { contact } = response.data;
      setContacts(contact);
    } catch {
      setContacts(MOCK_DATA);
      setLoading(false);
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);


  const handleDelete = async (id) => {
    try {
      const response = await deleteContact(id);
      const { message } = response.data;
      if (message === "Contact Deleted") {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        setToast({ message: "Contact deleted successfully.", type: "error" });
      }
    } catch (error) {
      console.log(error);
      setToast({ message: "Failed to delete contact.", type: "error" });
    } finally {
      setDeleteConfirmId(null);
    }
  };


  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateContactStatus(id, status);
      const { message } = response.data;
      if (message === 'Contact Status Updated') {
        setContacts((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status } : c))
        );
        setSelectedContact((prev) =>
          prev?._id === id ? { ...prev, status } : prev
        );
        setToast({ message: "Status updated successfully!", type: "success" });
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      if (
        errMsg === "Cannot change status once it is closed" ||
        errMsg === "Cannot change status from contacted to new"
      ) {
        setToast({ message: errMsg, type: "error" });
      } else {
        setToast({ message: "Failed to update status.", type: "error" });
      }
    }
  };

  const filtered = contacts;
  const totalPages = Math.ceil(filtered?.length / ITEMS_PER_PAGE);
  const paginated = filtered?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statCards = [
    {
      label: "Total Messages",
      val: contacts?.length,
      icon: Inbox,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "New",
      val: contacts.filter((c) => c.status === "new").length,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Contacted",
      val: contacts.filter((c) => c.status === "contacted").length,
      icon: Clock,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
    },
    {
      label: "Closed",
      val: contacts.filter((c) => c.status === "closed").length,
      icon: XCircle,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-400",
    },
  ];

  const TABLE_HEADS = [
    "Name", "Email", "Phone", "Country", "Travel Month",
    "Budget", "Message", "Status", "Date", "Actions",
  ];

  return (
    <div className="min-h-screen bg-green-50/30">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <Inbox size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">
              Contact
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Messages &amp; contact info management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            A
          </div>
        </div>
      </header>

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-1 bg-white border border-green-100 rounded-xl p-1 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "messages"
              ? "bg-green-600 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-50"
              }
              cursor-pointer`}
          >
            <Inbox size={13} />
            Messages
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === "messages"
                ? "bg-white/20 text-white"
                : "bg-green-100 text-green-700"
                }
                `}
            >
              {contacts.filter((c) => c.status === "new").length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "info"
              ? "bg-green-600 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-50"
              }
              cursor-pointer`}
          >
            <Settings size={13} />
            Contact Info
          </button>
        </div>

        {activeTab === "messages" && (
          <>
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
                    All Submissions
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full">
                    {filtered.length}
                  </span>
                </div>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by name, email, country…"
                    value={search}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearch(value);
                      setCurrentPage(1);
                      fetchContacts(value);
                    }}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition w-64 placeholder-gray-400"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-400 font-medium">
                    Loading messages…
                  </p>
                </div>
              ) : paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Inbox size={26} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500">
                    No messages found
                  </p>
                  <p className="text-xs text-gray-400">
                    Try adjusting your search query
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
                      {paginated.map((c) => (
                        <tr
                          key={c._id}
                          className="hover:bg-green-50/40 transition-colors duration-150"
                        >
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">

                              <span className="font-semibold text-gray-700 text-sm">
                                {c?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                            {c.email}
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                            {c.phone}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
                              <Globe size={11} className="text-gray-400" />
                              {c.country}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                            {c.month}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="font-semibold text-gray-700 text-sm">
                              {c.budget}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 max-w-[180px]">
                            <p className="text-gray-400 truncate text-xs">
                              {c?.message?.slice(0, 55)}
                              {c?.message?.length > 55 ? "…" : ""}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <StatusBadge status={c.status} />
                          </td>
                          <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                            {formatDate(c.createdAt)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setSelectedContact(c)}
                                className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition-all flex items-center justify-center"
                                title="View"
                              >
                                <Eye size={13} />
                              </button>
                              <select
                                value={c.status}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(c._id, e.target.value);
                                }}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition cursor-pointer"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="closed">Closed</option>
                              </select>
                              <button
                                onClick={() => setDeleteConfirmId(c._id)}
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
                          className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${n === currentPage
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
          </>

        )}

        {activeTab === "info" && <ContactInfoPanel />}
      </div>

      {selectedContact && (
        <ViewModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusChange={handleStatusChange}
        />
      )}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Contact?</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              This will permanently remove the contact and all their details. This action cannot be undone.
            </p>
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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}