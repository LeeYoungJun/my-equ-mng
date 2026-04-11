import { useState } from "react";
import { Package } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import FormField, { inputClass, selectClass } from "../ui/FormField";

export default function AssignForm({ asset, assetIds, assetCount, members, getMemberAssets, onAssign, onCancel }) {
  const [selectedMember, setSelectedMember] = useState("");
  const [dueDate, setDueDate] = useState("");

  const isBulk = !!assetIds;
  const today = new Date().toISOString().split("T")[0];

  const currentAssets = selectedMember && getMemberAssets ? getMemberAssets(selectedMember) : [];

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
      {/* Asset preview */}
      {isBulk ? (
        <div className="p-4 rounded-[10px] mb-4 flex items-center gap-3" style={{ background: "#f5f5f7" }}>
          <span style={{ color: "#0071e3" }}><Package size={20} /></span>
          <div>
            <div className="text-[14px] font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
              {assetCount}개 장비 일괄 배정
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>재고 상태인 장비만 배정됩니다</div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-[10px] mb-4 flex items-center gap-3" style={{ background: "#f5f5f7" }}>
          <span style={{ color: "#0071e3" }}><CategoryIcon category={asset?.category} size={20} /></span>
          <div>
            <div className="text-[14px] font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
              {asset?.manufacturer} {asset?.model}
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>{asset?.serial}</div>
          </div>
        </div>
      )}

      {/* Member select */}
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

      {/* Current assets of selected member */}
      {selectedMember && (
        <div className="mb-4 -mt-1">
          {currentAssets.length > 0 ? (
            <div className="p-3 rounded-[10px]" style={{ background: "rgba(255,149,0,0.06)", border: "1px solid rgba(255,149,0,0.15)" }}>
              <div className="text-[11px] font-semibold mb-2" style={{ color: "#c47e00" }}>
                현재 배정 장비 ({currentAssets.length}개)
              </div>
              <div className="flex flex-col gap-1">
                {currentAssets.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 text-[12px]" style={{ color: "rgba(0,0,0,0.6)" }}>
                    <CategoryIcon category={a.category} size={12} />
                    <span>{a.manufacturer} {a.model}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-3 py-2 rounded-[10px] text-[12px]" style={{ background: "rgba(26,127,78,0.06)", color: "#1a7f4e" }}>
              배정된 장비 없음
            </div>
          )}
        </div>
      )}

      {/* Due date (single assign only) */}
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
