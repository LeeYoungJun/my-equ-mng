import { useState } from "react";
import { Package } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import FormField, { inputClass, selectClass } from "../ui/FormField";

export default function AssignForm({ asset, assetIds, assetCount, members, onAssign, onCancel }) {
  const [selectedMember, setSelectedMember] = useState("");
  const [dueDate, setDueDate] = useState("");

  const isBulk = !!assetIds;
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isBulk) {
      onAssign(assetIds, selectedMember);
    } else {
      onAssign(asset.id, selectedMember, dueDate || null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isBulk ? (
        <div className="p-4 rounded-[10px] mb-4 flex items-center gap-3" style={{ background: "#f5f5f7" }}>
          <span style={{ color: "#0071e3" }}>
            <Package size={20} />
          </span>
          <div>
            <div className="text-[14px] font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
              {assetCount}개 장비 일괄 배정
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>재고 상태인 장비만 배정됩니다</div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-[10px] mb-4 flex items-center gap-3" style={{ background: "#f5f5f7" }}>
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
      )}

      <FormField label="배정할 팀원 선택 *" htmlFor="assign-member">
        <select
          id="assign-member"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className={selectClass}
          required
        >
          <option value="">선택해주세요</option>
          {[...members].sort((a, b) => a.name.localeCompare(b.name, "ko")).map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.team} · {m.position})</option>
          ))}
        </select>
      </FormField>

      {!isBulk && (
        <FormField label="반납 예정일 (선택)" htmlFor="assign-duedate">
          <input
            id="assign-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
            min={today}
          />
        </FormField>
      )}

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
          {isBulk ? "일괄 배정" : "배정"}
        </button>
      </div>
    </form>
  );
}
