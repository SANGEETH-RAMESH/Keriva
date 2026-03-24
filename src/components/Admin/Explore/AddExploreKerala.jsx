import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Save, Globe, Sparkles, MapPin, Lightbulb,
  Upload, X, ImagePlus, AlertCircle, Bell, Plus, CheckCircle, XCircle,
  BookOpen, Star,
} from "lucide-react";

import { addExplore } from '../../../services/adminService';

const SECTION_TYPES = [
  { key: "region",     label: "Region",      icon: MapPin,    color: "from-green-500 to-emerald-600",  desc: "Add a geographical region (North/Central/South Kerala)" },
  { key: "place",      label: "Top Place",   icon: Globe,     color: "from-teal-500 to-green-600",     desc: "Add a destination to the 'Top Places to Visit' tags" },
  { key: "experience", label: "Experience",  icon: Sparkles,  color: "from-emerald-500 to-teal-600",   desc: "Add an activity or experience card" },
  { key: "tip",        label: "Travel Tip",  icon: Lightbulb, color: "from-green-600 to-emerald-700",  desc: "Add a travel tip (best time, visa info, etc.)" },
  { key: "history",    label: "History",     icon: BookOpen,  color: "from-amber-500 to-orange-600",   desc: "Add or update the History of Kerala section" },
  { key: "hero",       label: "Hero Banner", icon: Star,      color: "from-sky-500 to-indigo-600",     desc: "Add or update the hero banner (title & tagline)" },
];

const MAX_IMAGE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function validateImage(file) {
  if (!file) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG, WEBP or GIF images are allowed.";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `Image must be smaller than ${MAX_IMAGE_MB} MB.`;
  return null;
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
      bar: "bg-emerald-500",
    },
    error: {
      wrapper: "bg-white border border-red-200 shadow-lg",
      icon: <XCircle size={15} className="text-red-500 shrink-0" />,
      text: "text-red-700",
      bar: "bg-red-500",
    },
  };

  const { wrapper, icon, text, bar } = config[type] || config.success;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]"
      style={{ animation: "slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both" }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl min-w-[260px] max-w-sm overflow-hidden ${wrapper}`}>
        <span className={`absolute bottom-0 left-0 h-0.5 rounded-full ${bar}`}
          style={{ animation: "shrink 3s linear forwards" }} />
        {icon}
        <p className={`text-sm font-semibold flex-1 ${text}`}>{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors ml-1 flex-shrink-0">
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1.5">
      <AlertCircle size={11} className="flex-shrink-0" />{msg}
    </p>
  );
}

function Field({ label, required, hint, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error ? <ErrorMsg msg={error} /> : hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ hasError, ...props }) {
  return (
    <input
      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300
        focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white
        ${hasError ? "border-red-300 focus:ring-red-300 bg-red-50/30" : "border-gray-200 focus:ring-green-400"}`}
      {...props}
    />
  );
}

function Textarea({ hasError, ...props }) {
  return (
    <textarea
      rows={4}
      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300
        focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white resize-none
        ${hasError ? "border-red-300 focus:ring-red-300 bg-red-50/30" : "border-gray-200 focus:ring-green-400"}`}
      {...props}
    />
  );
}

function ImageUpload({ value, onChange, hasError }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    onChange(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange(null); setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (!preview) {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed
          rounded-2xl p-8 cursor-pointer transition-all
          ${hasError ? "border-red-300 bg-red-50/40"
            : dragging ? "border-green-400 bg-green-50 scale-[1.01]"
            : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50"}`}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasError ? "bg-red-100" : "bg-green-100"}`}>
          <ImagePlus size={22} className={hasError ? "text-red-500" : "text-green-600"} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            Drop image here or{" "}
            <span className={`underline underline-offset-2 ${hasError ? "text-red-500" : "text-green-600"}`}>browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5 MB</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border shadow-sm ${hasError ? "border-red-300" : "border-green-100"}`}>
      <img src={preview} alt="preview" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 flex items-center justify-between">
        <span className="text-white text-xs font-medium truncate max-w-[65%]">{value?.name}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors">
            <Upload size={11} /> Replace
          </button>
          <button type="button" onClick={handleClear}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}

function SubmitError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
      <p className="text-sm text-red-600 font-medium">{msg}</p>
    </div>
  );
}

function FormActions({ onCancel, loading }) {
  return (
    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
      <button type="button" onClick={onCancel}
        className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
        Cancel
      </button>
      <button type="submit" disabled={loading}
        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700
          disabled:opacity-60 text-white text-sm font-semibold shadow-md shadow-green-200 transition-colors cursor-pointer">
        {loading
          ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
          : <><Save size={14} />Save</>}
      </button>
    </div>
  );
}

// ─── Region Form ──────────────────────────────────────────────────────────────
function RegionForm({ onSave, onCancel, showToast }) {
  const [form, setForm] = useState({ name: "", desc: "" });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: "" })); };

  const validate = () => {
    const e = {};
    const name = form.name.trim(); const desc = form.desc.trim();
    if (!name)                e.name = "Region name is required.";
    else if (name.length < 3)  e.name = "Name must be at least 3 characters.";
    else if (name.length > 80) e.name = "Name must be 80 characters or less.";
    if (!desc)                e.desc = "Description is required.";
    else if (desc.length < 10)  e.desc = "Description must be at least 10 characters.";
    else if (desc.length > 200) e.desc = "Description must be 200 characters or less.";
    if (!imageFile)            e.image = "A region image is required.";
    else { const imgErr = validateImage(imageFile); if (imgErr) e.image = imgErr; }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const fd = new FormData();
    fd.append("type", "region"); fd.append("title", form.name.trim());
    fd.append("description", form.desc.trim()); fd.append("image", imageFile);
    setLoading(true);
    try {
      const response = await addExplore(fd);
      const { message } = response.data;
      if (message === "Explore Kerala Created") { showToast("Region added successfully!", "success"); onSave(); }
    } catch (err) {
      console.error(err);
      showToast("Failed to save. Please try again.", "error");
      setErrors({ submit: "Failed to save. Please try again." });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Region Name" required error={errors.name}>
        <Input value={form.name} onChange={set("name")} placeholder="e.g. North Kerala" hasError={!!errors.name} maxLength={80} />
      </Field>
      <Field label="Description" required error={errors.desc} hint="Shown below the region card image">
        <Input value={form.desc} onChange={set("desc")} placeholder="e.g. Wayanad, Kannur — misty hills and pristine beaches." hasError={!!errors.desc} maxLength={200} />
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${form.desc.length > 180 ? "text-red-400" : "text-gray-300"}`}>{form.desc.length}/200</span>
        </div>
      </Field>
      <Field label="Region Image" required error={errors.image} hint="Landscape photo, min 800×500px, max 5 MB">
        <ImageUpload value={imageFile} onChange={(f) => { setImageFile(f); setErrors((err) => ({ ...err, image: "" })); }} hasError={!!errors.image} />
        {errors.image && <ErrorMsg msg={errors.image} />}
      </Field>
      <FormActions onCancel={onCancel} loading={loading} />
    </form>
  );
}

// ─── Place Form ───────────────────────────────────────────────────────────────
function PlaceForm({ onSave, onCancel, showToast }) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {}; const n = name.trim();
    if (!n)                e.name = "Place name is required.";
    else if (n.length < 2)  e.name = "Name must be at least 2 characters.";
    else if (n.length > 50) e.name = "Name must be 50 characters or less.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const fd = new FormData(); fd.append("type", "place"); fd.append("title", name.trim());
    setLoading(true);
    try {
      const response = await addExplore(fd);
      const { message } = response.data;
      if (message === "Explore Kerala Created") { showToast("Place added successfully!", "success"); onSave(); }
    } catch (err) {
      console.error(err);
      showToast("Failed to save. Please try again.", "error");
      setErrors({ submit: "Failed to save. Please try again." });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Place Name" required error={errors.name} hint="Displayed as a pill tag on the user page">
        <Input value={name} onChange={(e) => { setName(e.target.value); setErrors({}); }} placeholder="e.g. Munnar" hasError={!!errors.name} maxLength={50} />
      </Field>
      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-green-700 mb-2">Preview</p>
        <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-1.5 w-fit">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-green-800 text-sm font-medium">{name || "Place Name"}</span>
        </div>
      </div>
      <FormActions onCancel={onCancel} loading={loading} />
    </form>
  );
}

// ─── Experience Form ──────────────────────────────────────────────────────────
function ExperienceForm({ onSave, onCancel, showToast }) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {}; const n = name.trim();
    if (!n)                e.name = "Experience title is required.";
    else if (n.length < 3)  e.name = "Title must be at least 3 characters.";
    else if (n.length > 60) e.name = "Title must be 60 characters or less.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const fd = new FormData(); fd.append("type", "experience"); fd.append("title", name.trim());
    setLoading(true);
    try {
      const response = await addExplore(fd);
      const { message } = response.data;
      if (message === "Explore Kerala Created") { showToast("Experience added successfully!", "success"); onSave(); }
    } catch (err) {
      console.error(err);
      showToast("Failed to save. Please try again.", "error");
      setErrors({ submit: "Failed to save. Please try again." });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Experience Title" required error={errors.name} hint="Displayed as a card on the experiences grid">
        <Input value={name} onChange={(e) => { setName(e.target.value); setErrors((err) => ({ ...err, name: "" })); }} placeholder="e.g. Houseboats" hasError={!!errors.name} maxLength={60} />
      </Field>
      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-green-700 mb-2">Preview</p>
        <div className="inline-flex flex-col items-center bg-white rounded-xl border border-green-100 px-5 py-4 w-36 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-green-900">{name || "Experience"}</span>
        </div>
      </div>
      <FormActions onCancel={onCancel} loading={loading} />
    </form>
  );
}

// ─── Tip Form ─────────────────────────────────────────────────────────────────
function TipForm({ onSave, onCancel, showToast }) {
  const [form, setForm] = useState({ icon: "☀", title: "", text: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const ICONS = ["☀", "✈", "🌿", "🏛", "🍛", "💡", "📍", "⛵"];
  const TEXT_MAX = 500;
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: "" })); };

  const validate = () => {
    const e = {}; const title = form.title.trim(); const text = form.text.trim();
    if (!title)                e.title = "Tip title is required.";
    else if (title.length < 3)  e.title = "Title must be at least 3 characters.";
    else if (title.length > 80) e.title = "Title must be 80 characters or less.";
    if (!text)                 e.text = "Tip content is required.";
    else if (text.length < 20)  e.text = "Content must be at least 20 characters.";
    else if (text.length > TEXT_MAX) e.text = `Content must be ${TEXT_MAX} characters or less.`;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const fd = new FormData();
    fd.append("type", "tip"); fd.append("title", form.title.trim());
    fd.append("description", form.text.trim()); fd.append("icon", form.icon);
    setLoading(true);
    try {
      const response = await addExplore(fd);
      const { message } = response.data;
      if (message === "Explore Kerala Created") { showToast("Travel tip added successfully!", "success"); onSave(); }
    } catch (err) {
      console.error(err);
      showToast("Failed to save. Please try again.", "error");
      setErrors({ submit: "Failed to save. Please try again." });
    } finally { setLoading(false); }
  };

  const remaining = TEXT_MAX - form.text.length;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Icon" hint="Pick an emoji for the tip icon">
        <div className="flex flex-wrap gap-2">
          {ICONS.map((ic) => (
            <button key={ic} type="button" onClick={() => setForm((f) => ({ ...f, icon: ic }))}
              className={`w-10 h-10 rounded-xl border text-lg transition-all
                ${form.icon === ic ? "border-green-500 bg-green-50 shadow-sm" : "border-gray-200 bg-white hover:border-green-300"}`}>
              {ic}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Tip Title" required error={errors.title}>
        <Input value={form.title} onChange={set("title")} placeholder="e.g. Best Time to Visit" hasError={!!errors.title} maxLength={80} />
      </Field>
      <Field label="Tip Content" required error={errors.text}>
        <Textarea value={form.text} onChange={set("text")} placeholder="Describe the travel tip in detail (min 20 characters)..." hasError={!!errors.text} maxLength={TEXT_MAX} />
        <div className="flex justify-end mt-1">
          <span className={`text-xs font-medium ${remaining < 50 ? "text-red-400" : remaining < 100 ? "text-amber-400" : "text-gray-300"}`}>
            {remaining} chars left
          </span>
        </div>
      </Field>
      <FormActions onCancel={onCancel} loading={loading} />
    </form>
  );
}

// ─── History Form ─────────────────────────────────────────────────────────────
function HistoryForm({ onSave, onCancel, showToast }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const DESC_MAX = 2000;
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: "" })); };

  const validate = () => {
    const e = {};
    const title = form.title.trim();
    const description = form.description.trim();
    if (!title)                  e.title = "Title is required.";
    else if (title.length < 3)   e.title = "Title must be at least 3 characters.";
    else if (title.length > 100) e.title = "Title must be 100 characters or less.";
    if (!description)                       e.description = "History content is required.";
    else if (description.length < 20)       e.description = "Content must be at least 20 characters.";
    else if (description.length > DESC_MAX) e.description = `Content must be ${DESC_MAX} characters or less.`;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const fd = new FormData();
    fd.append("type", "history");
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    setLoading(true);
    try {
      const response = await addExplore(fd);
      const { message } = response.data;
      if (message === "Explore Kerala Created") { showToast("History section added successfully!", "success"); onSave(); }
    } catch (err) {
      console.error(err);
      showToast("Failed to save. Please try again.", "error");
      setErrors({ submit: "Failed to save. Please try again." });
    } finally { setLoading(false); }
  };

  const remaining = DESC_MAX - form.description.length;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <BookOpen size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          This content appears in the <span className="font-semibold">"History of Kerala"</span> section on the Explore page. Keep it informative and engaging.
        </p>
      </div>
      <Field label="Section Title" required error={errors.title} hint='e.g. "History of Kerala"'>
        <Input value={form.title} onChange={set("title")} placeholder="e.g. History of Kerala" hasError={!!errors.title} maxLength={100} />
      </Field>
      <Field label="History Content" required error={errors.description} hint="Rich narrative text about Kerala's history (min 20 chars)">
        <Textarea value={form.description} onChange={set("description")}
          placeholder="Kerala's history is a tapestry woven from ancient trade routes, spice kingdoms, colonial encounters, and a rich cultural renaissance…"
          hasError={!!errors.description} maxLength={DESC_MAX} rows={8} />
        <div className="flex justify-end mt-1">
          <span className={`text-xs font-medium ${remaining < 100 ? "text-red-400" : remaining < 200 ? "text-amber-400" : "text-gray-300"}`}>
            {remaining} chars left
          </span>
        </div>
      </Field>
      <FormActions onCancel={onCancel} loading={loading} />
    </form>
  );
}

// ─── Hero Form ────────────────────────────────────────────────────────────────
function HeroForm({ onSave, onCancel, showToast }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const DESC_MAX = 300;
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: "" })); };

  const validate = () => {
    const e = {};
    const title = form.title.trim();
    const description = form.description.trim();
    if (!title)                  e.title = "Hero title is required.";
    else if (title.length < 3)   e.title = "Title must be at least 3 characters.";
    else if (title.length > 80)  e.title = "Title must be 80 characters or less.";
    if (!description)                       e.description = "Tagline / description is required.";
    else if (description.length < 10)       e.description = "Description must be at least 10 characters.";
    else if (description.length > DESC_MAX) e.description = `Description must be ${DESC_MAX} characters or less.`;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const fd = new FormData();
    fd.append("type", "hero");
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    setLoading(true);
    try {
      const response = await addExplore(fd);
      const { message } = response.data;
      if (message === "Explore Kerala Created") { showToast("Hero banner added successfully!", "success"); onSave(); }
    } catch (err) {
      console.error(err);
      showToast("Failed to save. Please try again.", "error");
      setErrors({ submit: "Failed to save. Please try again." });
    } finally { setLoading(false); }
  };

  const remaining = DESC_MAX - form.description.length;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
        <Star size={14} className="text-sky-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sky-700 leading-relaxed">
          This is the <span className="font-semibold">hero banner</span> shown at the top of the Explore Kerala page. Keep the title short and punchy, and the tagline evocative.
        </p>
      </div>
      <Field label="Hero Title" required error={errors.title} hint='e.g. "Discover Kerala"'>
        <Input value={form.title} onChange={set("title")} placeholder="e.g. Discover Kerala" hasError={!!errors.title} maxLength={80} />
      </Field>
      <Field label="Tagline / Description" required error={errors.description} hint="Short, evocative subtitle shown under the hero title">
        <Textarea value={form.description} onChange={set("description")}
          placeholder="e.g. God's Own Country — where emerald backwaters meet misty mountains…"
          hasError={!!errors.description} maxLength={DESC_MAX} rows={4} />
        <div className="flex justify-end mt-1">
          <span className={`text-xs font-medium ${remaining < 30 ? "text-red-400" : remaining < 80 ? "text-amber-400" : "text-gray-300"}`}>
            {remaining} chars left
          </span>
        </div>
      </Field>
      <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-2xl p-6 text-white">
        <p className="text-xs font-semibold text-sky-200 uppercase tracking-widest mb-3">Preview</p>
        <h2 className="text-2xl font-bold leading-tight mb-2">{form.title || "Discover Kerala"}</h2>
        <p className="text-sm text-sky-100 leading-relaxed opacity-90">
          {form.description || "God's Own Country — where emerald backwaters meet misty mountains…"}
        </p>
      </div>
      <FormActions onCancel={onCancel} loading={loading} />
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AddExploreKerala() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If ?type= is present (from per-tab Add buttons), jump straight to that form.
  // If no param (navbar Add button), start at null → shows Step 1 type selector.
  const validTypes = SECTION_TYPES.map(s => s.key);
  const paramType = searchParams.get("type");
  const [selectedType, setSelectedType] = useState(
    validTypes.includes(paramType) ? paramType : null
  );

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const handleSave = () => { setTimeout(() => navigate("/admin/explore-kerala"), 1800); };
  const handleCancel = () => navigate("/admin/explore-kerala");

  return (
    <div className="min-h-screen bg-green-50/30">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap'); * { font-family: 'DM Sans', sans-serif; }`}</style>

      {/* ── Navbar — always static ── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <button onClick={handleCancel}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-green-200 bg-white text-green-700 hover:bg-green-50 transition-colors shadow-sm">
            <ArrowLeft size={15} />
          </button>
          <div className="w-px h-5 bg-green-100 mx-1" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Plus size={15} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Add to Explore Kerala</h1>
              <p className="text-xs text-gray-400 mt-0.5">Choose a section type and fill in the details</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">A</div>
        </div>
      </header>

      <div className="p-6">
        {/* ── Step 1: Pick a type (only shown when no ?type= param) ── */}
        {!selectedType && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Step 1 — Choose section type
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECTION_TYPES.map(({ key, label, icon: Icon, color, desc }) => (
                <button key={key} onClick={() => setSelectedType(key)}
                  className="group text-left bg-white rounded-2xl border border-green-100 p-5 hover:border-green-300 hover:shadow-md transition-all shadow-sm cursor-pointer">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <p className="font-bold text-green-900 text-sm mb-1">{label}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2 / Direct form (shown when type is selected or passed via ?type=) ── */}
        {selectedType && (
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setSelectedType(null)}
                className="text-xs text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 cursor-pointer">
                ← Change type
              </button>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Adding: {SECTION_TYPES.find((s) => s.key === selectedType)?.label}
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
              {selectedType === "region"     && <RegionForm     onSave={handleSave} onCancel={handleCancel} showToast={showToast} />}
              {selectedType === "place"      && <PlaceForm      onSave={handleSave} onCancel={handleCancel} showToast={showToast} />}
              {selectedType === "experience" && <ExperienceForm onSave={handleSave} onCancel={handleCancel} showToast={showToast} />}
              {selectedType === "tip"        && <TipForm        onSave={handleSave} onCancel={handleCancel} showToast={showToast} />}
              {selectedType === "history"    && <HistoryForm    onSave={handleSave} onCancel={handleCancel} showToast={showToast} />}
              {selectedType === "hero"       && <HeroForm       onSave={handleSave} onCancel={handleCancel} showToast={showToast} />}
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}