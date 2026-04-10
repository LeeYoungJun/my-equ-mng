import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { TEAMS } from "../../data/constants";
import FormField, { inputClass, selectClass } from "../ui/FormField";
import MemberAvatar from "../ui/MemberAvatar";

function compressImage(file, maxSize = 240, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > h) { h = Math.round((h / w) * maxSize); w = maxSize; }
        else { w = Math.round((w / h) * maxSize); h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function MemberForm({ editItem, onSave, onCancel }) {
  const [form, setForm] = useState(editItem || { name: "", team: TEAMS[0], position: "", email: "", photo: "" });
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const base64 = await compressImage(file);
    update("photo", base64);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const hasPhoto = form.photo && (form.photo.startsWith("data:") || form.photo.startsWith("http") || form.photo.length > 0);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>

      {/* 사진 업로드 영역 */}
      <div className="flex flex-col items-center mb-5">
        <div
          className="relative group cursor-pointer"
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          title="클릭하거나 사진을 드래그해서 업로드"
        >
          <MemberAvatar
            member={form}
            className="w-20 h-20 rounded-full"
            style={
              hasPhoto
                ? {}
                : { background: dragging ? "rgba(0,113,227,0.15)" : "linear-gradient(135deg, #0071e3, #2997ff)" }
            }
            textClass="text-2xl font-semibold"
          />
          {/* 호버 오버레이 */}
          <div
            className="absolute inset-0 rounded-full flex flex-col items-center justify-center transition-opacity duration-150"
            style={{
              background: "rgba(0,0,0,0.45)",
              opacity: dragging ? 1 : 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = dragging ? "1" : "0")}
          >
            <Camera size={18} color="white" />
            <span className="text-white text-[10px] font-medium mt-1">
              {hasPhoto ? "변경" : "업로드"}
            </span>
          </div>

          {/* 삭제 버튼 */}
          {hasPhoto && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); update("photo", ""); }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-none cursor-pointer"
              style={{ background: "#d93025" }}
              aria-label="사진 삭제"
            >
              <X size={10} color="white" strokeWidth={3} />
            </button>
          )}
        </div>

        <p className="text-[11px] mt-2" style={{ color: "rgba(0,0,0,0.35)" }}>
          클릭하거나 드래그하여 사진 업로드
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      <FormField label="이름 *" htmlFor="member-name">
        <input id="member-name" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="홍길동" required />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="팀 *" htmlFor="member-team">
          <select id="member-team" value={form.team} onChange={(e) => update("team", e.target.value)} className={selectClass}>
            {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="직급" htmlFor="member-position">
          <input id="member-position" value={form.position} onChange={(e) => update("position", e.target.value)} className={inputClass} placeholder="과장" />
        </FormField>
      </div>
      <FormField label="이메일" htmlFor="member-email">
        <input id="member-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="email@company.com" />
      </FormField>

      <div className="flex gap-2.5 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-[14px] font-medium cursor-pointer border-none transition-opacity hover:opacity-80"
          style={{ borderRadius: "8px", background: "rgba(0,0,0,0.06)", color: "#1d1d1f" }}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-[14px] font-medium cursor-pointer border-none transition-opacity hover:opacity-85 disabled:opacity-40"
          style={{ borderRadius: "8px", background: "#0071e3", color: "#fff" }}
          disabled={!form.name}
        >
          {editItem ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
}
