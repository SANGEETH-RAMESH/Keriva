import { useState, useRef } from "react";
import {
  BookOpen,
  Bell,
  ChevronLeft,
  Image,
  FileText,
  AlignLeft,
  Link,
  Upload,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


import { addJournal } from '../../../services/adminService';

const STATUS_OPTIONS = [
  { value: "published", label: "Published", dot: "bg-emerald-500" },
  { value: "draft", label: "Draft", dot: "bg-amber-400" },
  { value: "archived", label: "Archived", dot: "bg-slate-400" },
];

function InputField({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <Icon size={11} className="text-green-500" />
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export default function AddJournal({ onBack, onSuccess }) {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    desc: "",
    image: "",
    status: "draft",
  });
  const [preview, setPreview] = useState(null);
  const [imageMode, setImageMode] = useState("url");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    set("image", file.name);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.desc.trim()) e.desc = "Description is required.";
    if (!form.image.trim() && !preview) e.image = "An image URL or upload is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("desc", form.desc);
      formData.append("status", form.status);

      if (imageMode === "upload") {
        const file = fileInputRef.current.files[0];
        if (file) formData.append("image", file);
      } else {
        formData.append("image", form.image);
      }

      const response = await addJournal(formData);
      const { message } = response.data;

      if (message == 'Journal Created') {
        setToast({ message: "Journal post created successfully!", type: "success" });
        setSubmitted(true);
        setTimeout(() => {
          navigate("/admin/journal");
        }, 1800);
      }

      setSubmitted(true);

      setTimeout(() => {
        navigate("/admin/journal");
      }, 1200);

    } catch (error) {
      console.log(error);
      setErrors({ submit: "Failed to save post. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const imagePreviewSrc = preview || (form.image.startsWith("http") ? form.image : null);

  return (
    <div className="min-h-screen bg-green-50/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/journal')}
            className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <BookOpen size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Add Journal Post</h1>
            <p className="text-xs text-gray-400 mt-0.5">Create a new Kerala journal article</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            A
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-3xl mx-auto">

          {/* Success State */}
          {submitted && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Post saved successfully!</p>
                <p className="text-xs text-emerald-500 mt-0.5">Redirecting back to journal list…</p>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
              <X size={16} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-600 font-medium">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Main Card */}
            <div className="bg-white rounded-2xl border border-green-50 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-50">
                <FileText size={14} className="text-green-500" />
                <h2 className="text-sm font-bold text-gray-700">Post Details</h2>
              </div>

              {/* Title */}
              <InputField label="Title" icon={FileText} error={errors.title}>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Best Time to Visit Kerala in 2026"
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition placeholder-gray-400 text-gray-700 ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                />
              </InputField>

              {/* Description */}
              <InputField label="Description" icon={AlignLeft} error={errors.desc}>
                <textarea
                  value={form.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  placeholder="Write a short, compelling description for this post…"
                  rows={4}
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition placeholder-gray-400 text-gray-700 resize-none ${errors.desc ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                />
                <p className="text-[10px] text-gray-400 text-right">{form.desc.length} characters</p>
              </InputField>
            </div>

            {/* Image Card */}
            <div className="bg-white rounded-2xl border border-green-50 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-50">
                <Image size={14} className="text-green-500" />
                <h2 className="text-sm font-bold text-gray-700">Cover Image</h2>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 w-fit">
                {["url", "upload"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setImageMode(mode); setPreview(null); set("image", ""); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${imageMode === mode
                      ? "bg-white text-green-700 shadow-sm border border-green-100"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {mode === "url" ? <Link size={11} /> : <Upload size={11} />}
                    {mode === "url" ? "Image URL" : "Upload File"}
                  </button>
                ))}
              </div>

              {imageMode === "url" ? (
                <InputField label="Image URL" icon={Link} error={errors.image}>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="https://images.unsplash.com/photo-…"
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition placeholder-gray-400 text-gray-700 ${errors.image ? "border-red-300 bg-red-50" : "border-gray-200"
                      }`}
                  />
                </InputField>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files?.[0]); }}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${dragOver
                      ? "border-green-400 bg-green-50"
                      : errors.image
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                      }`}
                  >
                    <Upload size={22} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-500">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  {errors.image && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.image}</p>}
                </div>
              )}

              {/* Image Preview */}
              {imagePreviewSrc && (
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={imagePreviewSrc}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => { setPreview(null); set("image", ""); setErrors((e) => ({ ...e, image: "Could not load image from this URL." })); }}
                  />
                  <button
                    type="button"
                    onClick={() => { setPreview(null); set("image", ""); }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                  >
                    <X size={13} />
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Cover Preview
                  </div>
                </div>
              )}
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-2xl border border-green-50 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-50">
                <CheckCircle size={14} className="text-green-500" />
                <h2 className="text-sm font-bold text-gray-700">Publish Settings</h2>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <CheckCircle size={11} className="text-green-500" />
                  Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {STATUS_OPTIONS.map(({ value, label, dot }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("status", value)}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${form.status === value
                        ? "border-green-400 bg-green-50 text-green-700 shadow-sm"
                        : "border-gray-200 text-gray-500 hover:border-green-200 hover:bg-green-50/50"
                        }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between bg-white rounded-2xl border border-green-50 shadow-sm px-5 py-4">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2 text-sm font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { set("status", "draft"); handleSubmit({ preventDefault: () => { } }); }}
                  disabled={submitting || submitted}
                  className="px-5 py-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={submitting || submitted}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving…
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle size={14} />
                      Saved!
                    </>
                  ) : (
                    "Publish Post"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg animate-fadeUp bg-[#2d6a4f] text-white shadow-[0_8px_24px_rgba(45,106,79,0.3)]">
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle size={13} />
          </span>
          <div>
            <p className="text-sm font-semibold">{toast.message}</p>
            <p className="text-[11px] text-white/70 mt-0.5">Redirecting to journal list…</p>
          </div>
        </div>
      )}
    </div>
  );
}