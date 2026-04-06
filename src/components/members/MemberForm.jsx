import { useState } from "react";
import { TEAMS } from "../../data/constants";
import FormField, { inputClass, selectClass } from "../ui/FormField";

export default function MemberForm({ editItem, onSave, onCancel }) {
  const [form, setForm] = useState(editItem || { name: "", team: TEAMS[0], position: "", email: "" });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <FormField label="이름 *" htmlFor="member-name">
        <input id="member-name" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="홍길동" required />
      </FormField>
      <div className="grid grid-cols-2 gap-3.5">
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
        <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold cursor-pointer">
          취소
        </button>
        <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold cursor-pointer disabled:opacity-40" disabled={!form.name}>
          {editItem ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
}
