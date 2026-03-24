import { useState, useRef } from "react";
import { updateExperience } from "../../../services/adminService";

const FIELD_STYLE = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #e0e0e0",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  color: "#111",
  background: "#fafafa",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};

const LABEL_STYLE = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#555",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 6,
};

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
      {error && (
        <div style={{ fontSize: 12, color: "#c0392b", marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
}

export default function EditExperience({ onSave, onCancel, initial, showToast }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    desc: initial?.desc || "",
    price: initial?.price || "",
    duration: initial?.duration || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [imageError, setImageError] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please upload a valid image file." }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be smaller than 10 MB." }));
      return;
    }
    setImageFile(file);
    setImageError(false);
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview("");
    setImageError(false);
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.desc.trim()) e.desc = "Description is required.";
    if (!form.duration.trim()) e.duration = "Duration is required.";
    if (!form.price.trim()) e.price = "Price is required.";
    if (!imageFile && !preview) e.image = "Please upload an image.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("desc", form.desc.trim());
    formData.append("price", form.price.trim());
    formData.append("duration", form.duration.trim());
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);
      const response = await updateExperience(initial._id, formData);
      const { message } = response.data;
      if (message == 'Experience Updated') {
        showToast("Experience updated successfully.");   // ← toast here
        onSave({
          ...initial,
          title: form.title.trim(),
          desc: form.desc.trim(),
          price: form.price.trim(),
          duration: form.duration.trim(),
          image: preview,
        });
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .edit-field:focus {
          border-color: #2d6a4f !important;
          box-shadow: 0 0 0 3px rgba(45,106,79,0.10) !important;
          background: #fff !important;
        }
        .edit-modal-scroll::-webkit-scrollbar { width: 5px; }
        .edit-modal-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        .edit-upload-zone {
          border: 1.5px dashed #d0d0d0;
          border-radius: 8px;
          background: #fafafa;
          padding: 24px 16px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .edit-upload-zone:hover, .edit-upload-zone.dragging {
          border-color: #2d6a4f;
          background: #f0f7f4;
        }
        .edit-upload-zone.has-error {
          border-color: #c0392b;
          background: #fff8f8;
        }
      `}</style>

      <div
        className="edit-modal-scroll"
        style={{
          background: "#fff",
          borderRadius: 18,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "26px 28px 20px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 10,
            borderRadius: "18px 18px 0 0",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 24,
                fontWeight: 600,
                color: "#111",
                lineHeight: 1.2,
              }}
            >
              Edit Experience
            </div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
              Update the journey details below.
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: "#f4f4f4",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: "24px 28px 28px" }}>

          {/* Image Preview */}
          {preview && !imageError && (
            <div
              style={{
                marginBottom: 20,
                borderRadius: 10,
                overflow: "hidden",
                aspectRatio: "16/7",
                background: "#f0f0f0",
                position: "relative",
              }}
            >
              <img
                src={preview}
                alt="Preview"
                onError={() => setImageError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.45)",
                  color: "#fff",
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 6,
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Preview
              </div>
              <button
                onClick={handleRemoveImage}
                title="Remove image"
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  background: "rgba(0,0,0,0.45)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 11,
                  padding: "3px 8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                ✕ Remove
              </button>
            </div>
          )}

          {imageError && (
            <div
              style={{
                marginBottom: 20,
                background: "#ffeaea",
                border: "1px solid #f5c6cb",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#c0392b",
              }}
            >
              ⚠ Could not load image. Try uploading again.
            </div>
          )}

          {/* Title */}
          <Field label="Journey Title" error={errors.title}>
            <input
              className="edit-field"
              style={FIELD_STYLE}
              type="text"
              placeholder="e.g. The Backwater Escape"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              maxLength={80}
            />
          </Field>

          {/* Description */}
          <Field label="Short Description" error={errors.desc}>
            <textarea
              className="edit-field"
              style={{ ...FIELD_STYLE, minHeight: 80, resize: "vertical" }}
              placeholder="e.g. Private houseboat, sunset canoe ride, village visit."
              value={form.desc}
              onChange={(e) => set("desc", e.target.value)}
              maxLength={200}
            />
            <div style={{ fontSize: 11, color: "#bbb", textAlign: "right", marginTop: 3 }}>
              {form.desc.length}/200
            </div>
          </Field>

          {/* Image Upload */}
          <Field label="Experience Image" error={errors.image}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {!preview && (
              <div
                className={`edit-upload-zone${dragging ? " dragging" : ""}${errors.image ? " has-error" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <div style={{ fontSize: 28, marginBottom: 8, lineHeight: 1 }}>🖼️</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 4 }}>
                  Drag & drop an image here
                </div>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>or</div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#2d6a4f",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "7px 18px",
                    borderRadius: 100,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                  }}
                >
                  Browse File
                </span>
                <div style={{ fontSize: 11, color: "#ccc", marginTop: 10 }}>
                  JPG, PNG, WEBP · Max 10 MB
                </div>
              </div>
            )}
            {preview && (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  border: "1.5px dashed #2d6a4f",
                  borderRadius: 8,
                  background: "#f0f7f4",
                  color: "#2d6a4f",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.03em",
                }}
              >
                🔄 Change Image
              </button>
            )}
          </Field>

          {/* Duration */}
          <Field label="Duration" error={errors.duration}>
            <input
              className="edit-field"
              style={FIELD_STYLE}
              type="text"
              placeholder="e.g. 5 Days"
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
              maxLength={40}
            />
          </Field>

          {/* Price */}
          <Field label="Starting Price" error={errors.price}>
            <input
              className="edit-field"
              style={FIELD_STYLE}
              type="text"
              placeholder="e.g. ₹40,000"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              maxLength={40}
            />
          </Field>

          {/* Badge Preview */}
          {(form.duration.trim() || form.price.trim()) && (
            <div
              style={{
                marginBottom: 22,
                padding: "10px 14px",
                background: "#f7f6f3",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: "#666",
              }}
            >
              <span>Badge preview:</span>
              <span
                style={{
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 6,
                  letterSpacing: "0.04em",
                }}
              >
                {[form.duration.trim(), form.price.trim() ? `Starting from ₹${form.price.trim()}` : ""].filter(Boolean).join(" | ")}
              </span>
            </div>
          )}

          <div style={{ borderTop: "1px solid #f0f0f0", marginBottom: 22 }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={onCancel}
              style={{
                background: "transparent",
                border: "1.5px solid #ddd",
                borderRadius: 100,
                padding: "10px 22px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                color: "#555",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#aaa")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ddd")}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? "#7aab93" : "#2d6a4f",
                color: "#fff",
                border: "none",
                borderRadius: 100,
                padding: "10px 26px",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = "#235840"; }}
              onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = "#2d6a4f"; }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}