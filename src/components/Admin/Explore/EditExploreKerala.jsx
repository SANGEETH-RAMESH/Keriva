import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Save, Trash2, Globe, MapPin, Sparkles, Lightbulb,
  Bell, Upload, X, ImagePlus, AlertCircle, BookOpen, Star,
} from "lucide-react";

import { getExploreKeralaById, updateExploreKerala } from '../../../services/adminService';
import { useEffect } from "react";

const MAX_IMAGE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
function validateImage(file) {
  if (!file) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG, WEBP or GIF images are allowed.";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `Image must be smaller than ${MAX_IMAGE_MB} MB.`;
  return null;
}

// ── Reusable is_active toggle ─────────────────────────────────────────────────
function ActiveToggle({ value, onChange }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
      <div>
        <p className="text-xs font-semibold text-gray-700">Visibility</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {value ? "Visible to users on the Explore page" : "Hidden from users"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
          ${value ? "bg-green-500" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
            ${value ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1.5"><AlertCircle size={11} className="flex-shrink-0" />{msg}</p>;
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

function Input({ hasError, className = "", ...props }) {
  return (
    <input
      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300
        focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white
        ${hasError ? "border-red-300 focus:ring-red-300 bg-red-50/30" : "border-gray-200 focus:ring-green-400"} ${className}`}
      {...props}
    />
  );
}

function Textarea({ hasError, className = "", ...props }) {
  return (
    <textarea
      rows={5}
      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300
        focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white resize-none
        ${hasError ? "border-red-300 focus:ring-red-300 bg-red-50/30" : "border-gray-200 focus:ring-green-400"} ${className}`}
      {...props}
    />
  );
}

function ImageUpload({ currentImg, value, onChange, hasError }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    onChange(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleClear = () => { onChange(null); setPreview(null); if (inputRef.current) inputRef.current.value = ""; };
  const displaySrc = preview || currentImg;

  if (displaySrc) {
    return (
      <div className={`relative rounded-2xl overflow-hidden border shadow-sm ${hasError ? "border-red-300" : "border-green-100"}`}>
        <img src={displaySrc} alt="preview" className="w-full h-48 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 flex items-center justify-between">
          <span className="text-white text-xs font-medium truncate max-w-[65%]">
            {value?.name || "Current image"}
          </span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors">
              <Upload size={11} /> Replace
            </button>
            {preview && (
              <button type="button" onClick={handleClear}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors">
                <X size={13} />
              </button>
            )}
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    );
  }

  return (
    <div onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all
        ${hasError ? "border-red-300 bg-red-50/40" : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50"}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasError ? "bg-red-100" : "bg-green-100"}`}>
        <ImagePlus size={22} className={hasError ? "text-red-500" : "text-green-600"} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">Drop image here or <span className="text-green-600 underline underline-offset-2">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5 MB</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
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

function SaveBar({ onDelete, deleteLabel = "Delete", loading }) {
  return (
    <div className={`flex ${onDelete ? "justify-between" : "justify-end"} items-center pt-3 border-t border-gray-100`}>
      {onDelete && (
        <button type="button" onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer">
          <Trash2 size={13} /> {deleteLabel}
        </button>
      )}
      <button type="submit" disabled={loading}
        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold shadow-md shadow-green-200 transition-colors cursor-pointer">
        {loading
          ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
          : <><Save size={14} />Save Changes</>}
      </button>
    </div>
  );
}

// ── Hero Edit ─────────────────────────────────────────────────────────────────
function HeroEdit({ data, onSave }) {
  const [form, setForm] = useState({ title: "", description: "", is_active: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: "" })); };

  useEffect(() => {
    if (!data) return;
    setForm({
      title: data.title || "",
      description: data.description || "",
      is_active: data.is_active ?? true,
    });
  }, [data]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(); if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try { await onSave(form); }
    catch { setErrors({ submit: "Failed to save. Please try again." }); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Hero Title" required error={errors.title}>
        <Input value={form.title} onChange={set("title")} placeholder="e.g. Discover Kerala" hasError={!!errors.title} />
      </Field>
      <Field label="Tagline / Description" required error={errors.description} hint="Shown below the title in the hero section">
        <Textarea value={form.description} onChange={set("description")} rows={3} hasError={!!errors.description} />
      </Field>
      <ActiveToggle value={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
      <SaveBar loading={loading} />
    </form>
  );
}

// ── History Edit ──────────────────────────────────────────────────────────────
function HistoryEdit({ data, onSave }) {
  const [form, setForm] = useState({ title: "", description: "", is_active: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: "" })); };

  useEffect(() => {
    if (!data) return;
    setForm({
      title: data.title || "",
      description: data.description || "",
      is_active: data.is_active ?? true,
    });
  }, [data]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Content is required.";
    else if (form.description.trim().length < 20) e.description = "Content must be at least 20 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(); if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try { await onSave(form); }
    catch { setErrors({ submit: "Failed to save. Please try again." }); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Section Title" required error={errors.title}>
        <Input value={form.title} onChange={set("title")} placeholder="e.g. History of Kerala" hasError={!!errors.title} />
      </Field>
      <Field label="History Content" required error={errors.description} hint="Rich narrative text about Kerala's history">
        <Textarea value={form.description} onChange={set("description")} rows={8} hasError={!!errors.description} />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-300">{form.description.length} chars</span>
        </div>
      </Field>
      <ActiveToggle value={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
      <SaveBar loading={loading} />
    </form>
  );
}

// ── Region Edit ───────────────────────────────────────────────────────────────
function RegionEdit({ data, onSave, onDelete }) {
  const [form, setForm] = useState({ name: "", desc: "", img: "", is_active: true });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: "" })); };

  useEffect(() => {
    if (!data) return;
    setForm({
      name: data.title || "",
      desc: data.description || "",
      img: data.image || "",
      is_active: data.is_active ?? true,
    });
  }, [data]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Region name is required.";
    else if (form.name.trim().length < 3) e.name = "Name must be at least 3 characters.";
    if (!form.desc.trim()) e.desc = "Description is required.";
    else if (form.desc.trim().length < 10) e.desc = "Description must be at least 10 characters.";
    if (imageFile) { const imgErr = validateImage(imageFile); if (imgErr) e.image = imgErr; }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(); if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try { await onSave({ ...form, imageFile }); }
    catch { setErrors({ submit: "Failed to save. Please try again." }); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Region Name" required error={errors.name}>
        <Input value={form.name} onChange={set("name")} hasError={!!errors.name} maxLength={80} />
      </Field>
      <Field label="Short Description" required error={errors.desc} hint="Shown in the region card below the image">
        <Input value={form.desc} onChange={set("desc")} hasError={!!errors.desc} maxLength={200} />
      </Field>
      <Field label="Region Image" error={errors.image} hint="Replace image or keep current (max 5 MB)">
        <ImageUpload currentImg={form.img} value={imageFile}
          onChange={(f) => { setImageFile(f); setErrors((err) => ({ ...err, image: "" })); }} hasError={!!errors.image} />
        {errors.image && <ErrorMsg msg={errors.image} />}
      </Field>
      <ActiveToggle value={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
      <SaveBar onDelete={onDelete} deleteLabel="Delete Region" loading={loading} />
    </form>
  );
}

// ── Place Edit ────────────────────────────────────────────────────────────────
function PlaceEdit({ data, onSave, onDelete }) {
  const [form, setForm] = useState({ name: "", is_active: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({ name: data.title || "", is_active: data.is_active ?? true });
  }, [data]);

  const validate = () => {
    const e = {}; const n = form.name.trim();
    if (!n) e.name = "Place name is required.";
    else if (n.length < 2) e.name = "Name must be at least 2 characters.";
    else if (n.length > 50) e.name = "Name must be 50 characters or less.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(); if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try { await onSave(form); }
    catch { setErrors({ submit: "Failed to save. Please try again." }); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Place Name" required error={errors.name} hint="Shown as a pill tag on the top places section">
        <Input value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors({}); }} hasError={!!errors.name} maxLength={50} />
      </Field>
      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-green-700 mb-2">Preview</p>
        <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-1.5 w-fit">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-green-800 text-sm font-medium">{form.name || "Place Name"}</span>
        </div>
      </div>
      <ActiveToggle value={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
      <SaveBar onDelete={onDelete} deleteLabel="Delete Place" loading={loading} />
    </form>
  );
}

// ── Experience Edit ───────────────────────────────────────────────────────────
function ExperienceEdit({ data, onSave, onDelete }) {
  const [form, setForm] = useState({ name: "", is_active: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({ name: data.title || "", is_active: data.is_active ?? true });
  }, [data]);

  const validate = () => {
    const e = {}; const n = form.name.trim();
    if (!n) e.name = "Experience title is required.";
    else if (n.length < 3) e.name = "Title must be at least 3 characters.";
    else if (n.length > 60) e.name = "Title must be 60 characters or less.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(); if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try { await onSave(form); }
    catch { setErrors({ submit: "Failed to save. Please try again." }); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Experience Title" required error={errors.name} hint="Shown as an experience card on the user page">
        <Input value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors({}); }} hasError={!!errors.name} maxLength={60} />
      </Field>
      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-green-700 mb-2">Preview</p>
        <div className="inline-flex flex-col items-center bg-white rounded-xl border border-green-100 px-5 py-4 w-36 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-green-900">{form.name || "Experience"}</span>
        </div>
      </div>
      <ActiveToggle value={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
      <SaveBar onDelete={onDelete} deleteLabel="Delete Experience" loading={loading} />
    </form>
  );
}

// ── Tip Edit ──────────────────────────────────────────────────────────────────
function TipEdit({ data, onSave, onDelete }) {
  const [form, setForm] = useState({ icon: "☀", title: "", text: "", is_active: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const ICONS = ["☀", "✈", "🌿", "🏛", "🍛", "💡", "📍", "⛵"];
  const TEXT_MAX = 500;
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: "" })); };

  useEffect(() => {
    if (!data) return;
    setForm({
      icon: data.icon || "☀",
      title: data.title || "",
      text: data.description || "",
      is_active: data.is_active ?? true,
    });
  }, [data]);

  const validate = () => {
    const e = {}; const title = form.title.trim(); const text = form.text.trim();
    if (!title) e.title = "Tip title is required.";
    else if (title.length < 3) e.title = "Title must be at least 3 characters.";
    if (!text) e.text = "Tip content is required.";
    else if (text.length < 20) e.text = "Content must be at least 20 characters.";
    else if (text.length > TEXT_MAX) e.text = `Content must be ${TEXT_MAX} characters or less.`;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(); if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try { await onSave(form); }
    catch { setErrors({ submit: "Failed to save. Please try again." }); }
    finally { setLoading(false); }
  };

  const remaining = TEXT_MAX - form.text.length;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SubmitError msg={errors.submit} />
      <Field label="Icon Emoji">
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
        <Input value={form.title} onChange={set("title")} hasError={!!errors.title} maxLength={80} />
      </Field>
      <Field label="Tip Content" required error={errors.text}>
        <Textarea value={form.text} onChange={set("text")} rows={5} hasError={!!errors.text} maxLength={TEXT_MAX} />
        <div className="flex justify-end mt-1">
          <span className={`text-xs font-medium ${remaining < 50 ? "text-red-400" : remaining < 100 ? "text-amber-400" : "text-gray-300"}`}>
            {remaining} chars left
          </span>
        </div>
      </Field>
      <ActiveToggle value={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
      <SaveBar onDelete={onDelete} deleteLabel="Delete Tip" loading={loading} />
    </form>
  );
}

// ── Section meta ──────────────────────────────────────────────────────────────
const SECTION_META = {
  hero: { label: "Edit Hero Banner", icon: Star, color: "from-sky-500 to-indigo-600" },
  history: { label: "Edit History", icon: BookOpen, color: "from-amber-500 to-orange-600" },
  region: { label: "Edit Region", icon: MapPin, color: "from-green-500 to-emerald-600" },
  place: { label: "Edit Place", icon: Globe, color: "from-teal-500 to-green-600" },
  experience: { label: "Edit Experience", icon: Sparkles, color: "from-emerald-500 to-teal-600" },
  tip: { label: "Edit Travel Tip", icon: Lightbulb, color: "from-green-600 to-emerald-700" },
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EditExploreKerala() {
  const navigate = useNavigate();
  const { section, id } = useParams();
  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [data, setData] = useState(null);

  const meta = SECTION_META[section] || { label: "Edit Section", icon: Globe, color: "from-green-500 to-emerald-600" };
  const Icon = meta.icon;

  useEffect(() => {
    if (!id) return;
    const fetchSingleExploreKerala = async () => {
      try {
        const response = await getExploreKeralaById(id, section);
        const { explorekerala } = response.data;
        setData(explorekerala);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleExploreKerala();
  }, [id, section]);

  const handleSave = async (payload) => {
    console.log("Saving:", section, id, payload);

    let formData;
    if (payload.imageFile) {
      formData = new FormData();

      formData.append("title", payload.name);
      formData.append("description", payload.desc);
      formData.append("is_active", payload.is_active);

      if (payload.imageFile) {
        formData.append("image", payload.imageFile);
      }
    } else {
      formData = {
        title: payload.title || payload.name,
        description: payload.description || payload.desc || payload.text,
        icon: payload.icon,
        is_active: payload.is_active,
      };
    }
    const response = await updateExploreKerala(id, formData);
    const { message } = response.data;
    if (message == "Explore Kerala Updated") {
      setSaved(true);
      setTimeout(() => navigate("/admin/explore-kerala"), 1200);
    }
  };

  const handleDelete = () => {
    console.log("Deleting:", section, id);
    setDeleted(true);
    setTimeout(() => navigate("/admin/explore-kerala"), 1200);
  };

  const handleBack = () => navigate("/admin/explore-kerala");

  return (
    <div className="min-h-screen bg-green-50/30">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap'); * { font-family: 'DM Sans', sans-serif; }`}</style>

      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <button onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-green-200 bg-white text-green-700 hover:bg-green-50 transition-colors shadow-sm">
            <ArrowLeft size={15} />
          </button>
          <div className="w-px h-5 bg-green-100 mx-1" />
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-md`}>
              <Icon size={15} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">{meta.label}</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Explore Kerala <span className="text-gray-300">›</span> <span className="capitalize">{section}</span>
              </p>
            </div>
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
        {saved && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
            <span className="text-green-600 text-sm font-semibold">✓ Changes saved! Redirecting…</span>
          </div>
        )}
        {deleted && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
            <span className="text-red-600 text-sm font-semibold">Deleted. Redirecting…</span>
          </div>
        )}

        <div className="max-w-xl">
          <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
            {section === "hero" && <HeroEdit data={data} onSave={handleSave} />}
            {section === "history" && <HistoryEdit data={data} onSave={handleSave} />}
            {section === "region" && <RegionEdit data={data} onSave={handleSave} onDelete={handleDelete} />}
            {section === "place" && <PlaceEdit data={data} onSave={handleSave} onDelete={handleDelete} />}
            {section === "experience" && <ExperienceEdit data={data} onSave={handleSave} onDelete={handleDelete} />}
            {section === "tip" && <TipEdit data={data} onSave={handleSave} onDelete={handleDelete} />}
            {!SECTION_META[section] && (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">Unknown section: <strong>{section}</strong></p>
                <button onClick={handleBack} className="mt-4 text-green-600 text-sm font-semibold hover:underline cursor-pointer">
                  ← Back to Explore Kerala
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}