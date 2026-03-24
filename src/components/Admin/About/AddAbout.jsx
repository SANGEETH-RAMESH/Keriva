import { useState } from "react";
import {
  Bell,
  ChevronLeft,
  Info,
  BookOpen,
  Lightbulb,
  Target,
  Save,
  X,
} from "lucide-react";
import { createAbout } from "../../../services/adminService";
import { useNavigate } from 'react-router-dom';

const SECTION_OPTIONS = [
  {
    value: "hero",
    label: "Hero",
    desc: "Main hero headline & tagline",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    activeBg: "bg-purple-600",
  },
  {
    value: "way_card",
    label: "Way Card",
    desc: "The Kerivaa Way feature card",
    icon: Lightbulb,
    color: "text-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-200",
    activeBg: "bg-sky-600",
  },
  {
    value: "vision",
    label: "Vision",
    desc: "Vision or Long-Term Ambition",
    icon: Target,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBg: "bg-amber-600",
  },
];

const INITIAL_FORM = {
  section: "hero",
  title: "",
  subtitle: "",
  body: "",
  is_active: true,
};

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

export default function AddAbout() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const set = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.body.trim()) e.body = "Body content is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      setTimeout(() => setErrors({}), 5000);
      return;
    }
    setSaving(true);
    try {
      const response = await createAbout(form);
      const { message } = response.data;
      if (message === "About Created") {
        // setForm(INITIAL_FORM);
        showToast("About entry created successfully! 🎉");
        setTimeout(() => navigate("/admin/about"), 3000);
      }
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
      setTimeout(() => setErrors((e) => ({ ...e, submit: "" })), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSaved(false);
  };

  const selectedSection = SECTION_OPTIONS.find((s) => s.value === form.section);

  return (
    <div className="min-h-screen bg-green-50/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-green-100 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-green-50">
        <div className="flex items-center gap-3">
          <a
            href="/admin/about"
            className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors"
          >
            <ChevronLeft size={16} />
          </a>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <Info size={16} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">
              Add About Entry
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Create a new About section block
            </p>
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

      <div className="p-6 max-w-2xl mx-auto space-y-5">
        {/* Success banner */}
        {saved && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Save size={13} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-emerald-700">
              About entry saved successfully!
            </p>
            <button
              onClick={() => setSaved(false)}
              className="ml-auto text-emerald-400 hover:text-emerald-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Section Selector */}
        <div className="bg-white rounded-2xl border border-green-50 shadow-sm p-5">
          <FieldLabel required>Section Type</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {SECTION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = form.section === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("section", opt.value)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${active
                    ? `border-green-400 bg-green-50 shadow-sm shadow-green-100`
                    : `border-gray-100 hover:border-gray-200 bg-gray-50/50`
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-green-100" : opt.bg
                      }`}
                  >
                    <Icon
                      size={16}
                      className={active ? "text-green-600" : opt.color}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${active ? "text-green-700" : "text-gray-700"
                        }`}
                    >
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                      {opt.desc}
                    </p>
                  </div>
                  {active && (
                    <div className="ml-auto w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 12 12"
                        className="w-2.5 h-2.5 fill-white"
                      >
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Fields */}
        <div className="bg-white rounded-2xl border border-green-50 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            {selectedSection && (
              <div
                className={`w-6 h-6 rounded-md ${selectedSection.bg} flex items-center justify-center`}
              >
                <selectedSection.icon
                  size={12}
                  className={selectedSection.color}
                />
              </div>
            )}
            <h2 className="text-sm font-bold text-gray-700">Content</h2>
          </div>

          {/* Title */}
          <div>
            <FieldLabel required>Title</FieldLabel>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={
                form.section === "hero"
                  ? "e.g. Why Kerivaa Exists"
                  : form.section === "way_card"
                    ? "e.g. Deep Personalization"
                    : "e.g. Our Vision"
              }
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition ${errors.title ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          {/* Subtitle / Icon */}
          <div>
            <FieldLabel>
              {form.section === "way_card" ? "Emoji Icon" : "Subtitle / Label"}
            </FieldLabel>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder={
                form.section === "way_card"
                  ? "e.g. 🤍  (paste emoji)"
                  : form.section === "hero"
                    ? "e.g. Our Story"
                    : "Optional label"
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {form.section === "way_card"
                ? "Paste or type an emoji shown in the card icon."
                : "Small label shown above the title (optional)."}
            </p>
          </div>

          {/* Body */}
          <div>
            <FieldLabel required>Body Content</FieldLabel>
            <textarea
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              rows={5}
              placeholder="Write the content that appears in this section…"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition resize-none ${errors.body ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.body ? (
                <p className="text-xs text-red-500 font-medium">{errors.body}</p>
              ) : (
                <span />
              )}
              <p className="text-[10px] text-gray-400 ml-auto">
                {form.body.length} chars
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl border border-green-50 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Visibility</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("is_active", !form.is_active)}
              className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none ${form.is_active ? "bg-green-500" : "bg-gray-200"
                }`}
              style={{ height: 22, width: 40 }}
              aria-checked={form.is_active}
              role="switch"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${form.is_active ? "translate-x-[18px]" : "translate-x-0"
                  }`}
              />
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {form.is_active ? "Active" : "Inactive"}
              </p>
              <p className="text-[11px] text-gray-400">
                {form.is_active
                  ? "This entry will be visible on the public About page."
                  : "This entry will be hidden from the public."}
              </p>
            </div>
          </div>
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600 font-medium">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pb-6">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Save size={14} />
                Save Entry
              </>
            )}
          </button>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-xl animate-fade-in">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 12 12" className="w-3 h-3">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}