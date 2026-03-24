import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ImageIcon,
  MapPin,
  Save,
  X,
  Upload,
  Info,
  Star,
  Filter,
  Eye,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  Edit3,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { getLandingById, editLanding } from '../../../services/adminService';

const MOCK_SLIDES = {
  "1": { _id: "1", title: "Alleppey Backwaters", location: "Alleppey, Kerala, India", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80", isActive: true, order: 1 },
  "2": { _id: "2", title: "Munnar Tea Gardens", location: "Munnar, Kerala, India", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", isActive: true, order: 2 },
  "3": { _id: "3", title: "Kovalam Beach", location: "Kovalam, Thiruvananthapuram, India", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", isActive: false, order: 3 },
  "4": { _id: "4", title: "Wayanad Forest", location: "Wayanad, Kerala, India", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", isActive: true, order: 4 },
  "5": { _id: "5", title: "Thrissur Cultural Hub", location: "Thrissur, Kerala, India", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80", isActive: false, order: 5 },
  "6": { _id: "6", title: "Varkala Cliff", location: "Varkala, Kerala, India", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", isActive: true, order: 6 },
};

function ImageUploadField({ currentImage, onChange, preview, setPreview }) {
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const displaySrc = preview || currentImage;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className="relative w-full h-56 rounded-2xl border-2 border-dashed border-green-200 bg-green-50/40 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all group overflow-hidden"
    >
      {displaySrc ? (
        <>
          <img src={displaySrc} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
          <div className="absolute inset-0 bg-black/35 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Upload size={18} className="text-white" />
            </div>
            <p className="text-white text-sm font-semibold">Click to change image</p>
            {!preview && (
              <p className="text-white/70 text-xs">Current image will be kept if unchanged</p>
            )}
          </div>
          {preview && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <CheckCircle size={10} /> New image selected
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center">
            <ImageIcon size={26} className="text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">Click or drag & drop to upload</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5MB</p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

const fieldClass = (err) =>
  `w-full border ${err
    ? "border-red-300 focus:border-red-400 focus:ring-red-200/30"
    : "border-gray-200 focus:border-green-400 focus:ring-green-400/30"
  } rounded-xl px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 transition placeholder-gray-400`;

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

export default function EditLandingSlide() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState({ title: "", location: "", order: 1, isActive: true, image: null });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchSlide = async () => {
      setLoading(true);
      try {
   
        const response = await getLandingById(id);
        const { landing } = response.data;
        console.log(landing.image);

        await new Promise((r) => setTimeout(r, 400));
        setOriginal(landing)
        setForm({ title: landing.title, location: landing.location, order: landing.order, isActive: landing.isActive, image: landing.image });
      } finally {
        setLoading(false);
      }
    };
    fetchSlide();
  }, [id, navigate]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      formData.append("title", form.title);
      formData.append("location", form.location);
      formData.append("order", form.order);
      formData.append("isActive", form.isActive);

      console.log("📦 FormData content:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await editLanding(id, formData);
      const { message } = response.data;
      if (message == 'Landing Updated') {
        console.log('Data');
        setToast({ message: "Slide updated successfully!", type: "success" });
        setTimeout(() => navigate('/admin/landing'), 1500);
      }
    } catch {
      setToast({ message: "Failed to update slide. Please try again.", type: "error" });
      setSubmitting(false);
    }
  };

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: null }));
  };

  const previewSrc = preview || original?.image;

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading slide…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50/30">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/landing")}
            className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center">
            <Edit3 size={15} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Edit Slide</h1>
            <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">
              {original?.title || "Landing page → Carousel"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/landing")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X size={13} /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm shadow-green-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-5">
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            You're editing an existing slide. Leave the image unchanged to keep the current one. All other fields will be updated immediately on save.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-green-50 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <ImageIcon size={13} className="text-green-600" />
              <h2 className="text-sm font-bold text-gray-700">Slide Image</h2>
            </div>
            {!preview && (
              <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full font-semibold">
                Current image will be kept
              </span>
            )}
          </div>
          <ImageUploadField
            currentImage={original?.image}
            onChange={(file) => set("image", file)}
            preview={preview}
            setPreview={setPreview}
          />
        </div>

        <div className="bg-white rounded-2xl border border-green-50 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Star size={13} className="text-green-600" />
            <h2 className="text-sm font-bold text-gray-700">Slide Details</h2>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Star size={9} className="text-green-500" /> Title
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            <input
              className={fieldClass(errors.title)}
              placeholder="e.g. Alleppey Backwaters"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
            {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <MapPin size={9} className="text-green-500" /> Location
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            <input
              className={fieldClass(errors.location)}
              placeholder="e.g. Alleppey, Kerala, India"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
            {errors.location && <p className="text-xs text-red-500 font-medium">{errors.location}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Filter size={9} className="text-green-500" /> Display Order
              </label>
              <input
                type="number"
                min={1}
                className={fieldClass(false)}
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
              />
              <p className="text-[10px] text-gray-400 pl-0.5">Lower number = appears first</p>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Eye size={9} className="text-green-500" /> Visibility
              </label>
              <button
                type="button"
                onClick={() => set("isActive", !form.isActive)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${form.isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
              >
                {form.isActive
                  ? <ToggleRight size={17} className="text-emerald-500" />
                  : <ToggleLeft size={17} className="text-gray-400" />
                }
                {form.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
            <Eye size={13} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
            {preview && (
              <span className="ml-auto text-[10px] text-amber-600 bg-amber-50 border border-amber-100 font-bold px-2 py-0.5 rounded-full">
                New image
              </span>
            )}
          </div>
          <div className="relative h-44">
            <img
              src={form.image}
              alt="live preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/600x176?text=No+Image"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-base font-bold leading-tight">{form.title || "Slide Title"}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={11} className="text-green-300" />
                <p className="text-xs text-green-200 font-medium">{form.location || "Location"}</p>
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${form.isActive
                ? "bg-emerald-500/90 text-white border-emerald-400"
                : "bg-slate-700/80 text-white border-slate-500"
                }`}>
                {form.isActive ? "● Active" : "● Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1 pb-6">
          <button
            onClick={() => navigate("/admin/landing")}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm shadow-green-300 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}