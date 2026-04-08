import { useState } from "react";
import { CATEGORIES, STATUSES } from "../../data/constants";
import FormField, { inputClass, selectClass } from "../ui/FormField";

export default function AssetForm({ editItem, members, onSave, onCancel }) {
  const [form, setForm] = useState(
    editItem || {
      category: "Laptop",
      manufacturer: "",
      model: "",
      serial: "",
      spec: "",
      purchaseDate: "",
      status: "stock",
      assignedTo: null,
      note: "",
      isShared: false,
      sharedLabel: "",
    },
  );

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="카테고리 *" htmlFor="asset-category">
          <select id="asset-category" value={form.category} onChange={(e) => update("category", e.target.value)} className={selectClass}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="제조사 *" htmlFor="asset-manufacturer">
          <input id="asset-manufacturer" value={form.manufacturer} onChange={(e) => update("manufacturer", e.target.value)} className={inputClass} placeholder="예: Apple, LG, Dell" required />
        </FormField>
      </div>
      <FormField label="모델명 *" htmlFor="asset-model">
        <input id="asset-model" value={form.model} onChange={(e) => update("model", e.target.value)} className={inputClass} placeholder="예: MacBook Pro 14" required />
      </FormField>
      <FormField label="시리얼 번호 (S/N)" htmlFor="asset-serial">
        <input id="asset-serial" value={form.serial} onChange={(e) => update("serial", e.target.value)} className={inputClass} placeholder="예: FVFHM0J2Q6" />
      </FormField>
      <FormField label="세부사양" htmlFor="asset-spec">
        <textarea id="asset-spec" value={form.spec} onChange={(e) => update("spec", e.target.value)} rows={3} className={`${inputClass} resize-y`} placeholder="CPU, RAM, SSD 등" />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="구입일" htmlFor="asset-date">
          <input id="asset-date" type="month" value={form.purchaseDate} onChange={(e) => update("purchaseDate", e.target.value)} className={inputClass} />
        </FormField>
        <FormField label="상태" htmlFor="asset-status">
          <select id="asset-status" value={form.status} onChange={(e) => update("status", e.target.value)} className={selectClass}>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </FormField>
      </div>
      <FormField label="배정 사용자" htmlFor="asset-assignee">
        <select id="asset-assignee" value={form.assignedTo || ""} onChange={(e) => update("assignedTo", e.target.value || null)} className={selectClass}>
          <option value="">미배정</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.team})</option>)}
        </select>
      </FormField>
      <FormField label="비고" htmlFor="asset-note">
        <input id="asset-note" value={form.note || ""} onChange={(e) => update("note", e.target.value)} className={inputClass} />
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
          disabled={!form.manufacturer || !form.model}
        >
          {editItem ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
}
