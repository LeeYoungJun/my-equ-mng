import { useState } from "react";
import CategoryIcon from "../ui/CategoryIcon";
import FormField, { selectClass } from "../ui/FormField";

export default function AssignForm({ asset, members, onAssign, onCancel }) {
  const [selectedMember, setSelectedMember] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onAssign(asset.id, selectedMember); }}>
      <div
        className="p-4 rounded-[10px] mb-4 flex items-center gap-3"
        style={{ background: "#f5f5f7" }}
      >
        <span style={{ color: "#0071e3" }}>
          <CategoryIcon category={asset?.category} size={20} />
        </span>
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
            {asset?.manufacturer} {asset?.model}
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>{asset?.serial}</div>
        </div>
      </div>
      <FormField label="배정할 팀원 선택 *" htmlFor="assign-member">
        <select
          id="assign-member"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className={selectClass}
          required
        >
          <option value="">선택해주세요</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.team} · {m.position})</option>
          ))}
        </select>
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
          disabled={!selectedMember}
        >
          배정
        </button>
      </div>
    </form>
  );
}
