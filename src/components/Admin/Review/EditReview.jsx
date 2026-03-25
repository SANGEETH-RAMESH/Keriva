import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Quote, Save, ArrowLeft, User, MapPin, MessageSquareQuote, Info, CheckCircle, XCircle, X } from "lucide-react";
// Import your service functions here
import { getReviewById, updateReview } from "../../../services/adminService";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const config = {
    success: { wrapper: "bg-white border border-emerald-200", icon: <CheckCircle size={15} className="text-emerald-500" />, text: "text-emerald-700" },
    error: { wrapper: "bg-white border border-red-200", icon: <XCircle size={15} className="text-red-500" />, text: "text-red-700" },
  };

  const { wrapper, icon, text } = config[type];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg ${wrapper}`}>
        {icon} <p className={`text-sm font-semibold ${text}`}>{message}</p>
        <button onClick={onClose} className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"><X size={13} /></button>
      </div>
    </div>
  );
}

export default function EditReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    authorName: "",
    quote: "",
    authorCountry: "",
    isActive: true
  });

  // Fetch the existing review data
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await getReviewById(id);
        console.log(response.data, 'Ldflsdfldsjfsdlfj')
        setFormData(response.data.review);

        // // MOCK DATA FETCH
        // await new Promise(res => setTimeout(res, 800)); // Simulate network delay
        // setFormData({
        //   authorName: "Sarah Jenkins",
        //   quote: "The best trip of my life! The itinerary was flawless and the hotels were top notch.",
        //   authorCountry: "United Kingdom",
        //   isActive: true
        // });
      } catch (error) {
        setToast({ message: "Failed to load review data.", type: "error" });
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchReviewData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.authorName.trim()) {
      newErrors.authorName = "Author name is required";
    }

    if (!formData.authorCountry.trim()) {
      newErrors.authorCountry = "Country is required";
    }

    if (!formData.quote.trim()) {
      newErrors.quote = "Review cannot be empty";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      setTimeout(() => {
        setErrors({});
      }, 5000);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const data = {
        authorName: formData.authorName,
        quote: formData.quote,
        authorCountry: formData.authorCountry,
        isActive: formData.isActive,
      };

      const response = await updateReview(id, data);
      const { message } = response.data;
      if (message === "Review Updated") {
        setToast({ message: "Review updated successfully!", type: "success" });
        setTimeout(() => navigate('/admin/review'), 1500);
      } else {
        setToast({ message: message || "Unexpected response from server.", type: "error" });
      }

      
    } catch (error) {
      setToast({ message: "Failed to update review.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition placeholder-gray-400";

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-green-50/30 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading review data…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50/30 pb-10">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/review')}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200 transition mr-1 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center">
            <Quote size={16} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Edit Review</h1>
            <p className="text-xs text-gray-400 mt-0.5">Update client testimonial details</p>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-800">Review Details</h2>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-100">
                <span className="text-xs font-semibold text-gray-600">Active / Published</span>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer transition-all"
                />
              </label>
            </div>
          </div>

          <div className="mx-5 mt-4 mb-2 flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-xl px-3.5 py-2.5">
            <Info size={13} className="text-sky-500 mt-0.5 shrink-0" />
            <p className="text-xs text-sky-700 leading-relaxed">
              Unchecking the <strong>Active</strong> box will hide this review from the public website without deleting it.
            </p>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Author Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <User size={10} className="text-green-500" /> Author Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="e.g. John Doe"
                />
                {errors.authorName && (
                  <p className="text-xs text-red-500 mt-1">{errors.authorName}</p>
                )}
              </div>

              {/* Author Country */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <MapPin size={10} className="text-green-500" /> Country <span className="text-red-400">*</span>
                </label>
                <input
                  name="authorCountry"
                  value={formData.authorCountry}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="e.g. United States"
                />
                {errors.authorCountry && (
                  <p className="text-xs text-red-500 mt-1">{errors.authorCountry}</p>
                )}
              </div>
            </div>

            {/* Quote */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <MessageSquareQuote size={10} className="text-green-500" /> Review / Quote <span className="text-red-400">*</span>
              </label>
              <textarea
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                className={`${fieldClass} resize-none min-h-[120px]`}
                placeholder="Write the customer's testimonial here..."
              />
              {errors.quote && (
                <p className="text-xs text-red-500 mt-1">{errors.quote}</p>
              )}
              <p className="text-[10px] text-gray-400 pl-1">Keep it concise for better layout on the website.</p>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/review')}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm shadow-green-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Updating..." : "Update Review"}
            </button>
          </div>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}