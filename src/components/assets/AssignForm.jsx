import { useState } from "react";
import CategoryIcon from "../ui/CategoryIcon";
import FormField, { selectClass } from "../ui/FormField";

export default function AssignForm({ asset, members, onAssign, onCancel }) {
  const [selectedMember, setSelectedMember] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAssign(asset.id, selectedMember);
      }}
    >
      <div className="p-3.5 bg-gray-50 rounded-xl mb-4 flex items-center gap-3">
        <CategoryIcon category={asset?.category} size={20} />
        <div>
          <div className="text-sm font-semibold text-dark">{asset?.manufacturer} {asset?.model}</div>
          <div className="text-xs text-gray-400">{asset?.serial}</div>
        </div>
      </div>
      <FormField label="배정할 팀원 선택 *" htmlFor="assign-member">
        <select id="assign-member" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} className={selectClass} required>
          <option value="">선택해주세요</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.team} · {m.position})</option>
          ))}
        </select>
      </FormField>
      <div className="flex gap-2.5 justify-end mt-2">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold cursor-pointer">
          취소
        </button>
        <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold cursor-pointer disabled:opacity-40" disabled={!selectedMember}>
          배정
        </button>
      </div>
    </form>
  );
}
