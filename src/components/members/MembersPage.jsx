import { useMemo, useState, useEffect } from "react";
import { Search, Plus, Edit3, Trash2, Check } from "lucide-react";
import { TEAMS } from "../../data/constants";
import { inputClass, selectClass } from "../ui/FormField";
import CategoryIcon from "../ui/CategoryIcon";
import MemberAvatar from "../ui/MemberAvatar";

export default function MembersPage({
  members,
  search,
  onSearchChange,
  filterTeam,
  onFilterTeam,
  getMemberAssets,
  onAdd,
  onEdit,
  onDelete,
  onDeleteMultiple,
  onDetail,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filtered = useMemo(() => {
    return members
      .filter((m) => {
        if (filterTeam !== "all" && m.team !== filterTeam) return false;
        if (search) {
          const q = search.toLowerCase();
          return m.name.toLowerCase().includes(q) || m.team.toLowerCase().includes(q) || m.position.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }, [members, filterTeam, search]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [search, filterTeam]);

  const someSelected = selectedIds.size > 0;
  const allSelected = filtered.length > 0 && filtered.every((m) => selectedIds.has(m.id));

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((m) => m.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = () => {
    onDeleteMultiple(Array.from(selectedIds));
    clearSelection();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-[1_1_240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(0,0,0,0.3)" }} aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="이름, 팀, 직급 검색..."
            className={`${inputClass} pl-10`}
            aria-label="팀원 검색"
          />
        </div>
        <select
          value={filterTeam}
          onChange={(e) => onFilterTeam(e.target.value)}
          className={`${selectClass} w-36 flex-none`}
          aria-label="팀 필터"
        >
          <option value="all">전체 팀</option>
          {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          onClick={onAdd}
          className="px-4 py-2.5 text-[14px] font-medium cursor-pointer flex items-center gap-1.5 border-none transition-opacity hover:opacity-85"
          style={{ borderRadius: "8px", background: "#0071e3", color: "#fff", letterSpacing: "-0.1px" }}
        >
          <Plus size={15} aria-hidden="true" />
          팀원 등록
        </button>
      </div>

      {/* Bulk select bar */}
      {someSelected && (
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-[10px] mb-4"
          style={{ background: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.15)" }}
        >
          <button
            onClick={handleSelectAll}
            className="w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all flex-shrink-0 border-none"
            style={{
              border: "1.5px solid #0071e3",
              backgroundColor: allSelected ? "#0071e3" : "transparent",
            }}
            aria-label={allSelected ? "전체 선택 해제" : "전체 선택"}
          >
            {allSelected ? (
              <Check size={11} color="white" strokeWidth={3} />
            ) : (
              <div className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: "#0071e3" }} />
            )}
          </button>
          <span className="text-[13px] font-medium" style={{ color: "#0071e3", letterSpacing: "-0.1px" }}>
            {selectedIds.size}명 선택됨
          </span>
          <button
            onClick={clearSelection}
            className="text-[12px] border-none bg-transparent cursor-pointer transition-colors"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            선택 취소
          </button>
          <div className="ml-auto">
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-80 text-white border-none"
              style={{ background: "#d93025" }}
            >
              <Trash2 size={13} aria-hidden="true" />
              {selectedIds.size}명 삭제
            </button>
          </div>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-2.5">
        {filtered.map((m) => {
          const mAssets = getMemberAssets(m.id);
          const isSelected = selectedIds.has(m.id);
          return (
            <article
              key={m.id}
              className="bg-white p-4 cursor-pointer transition-all"
              style={{
                borderRadius: "12px",
                boxShadow: isSelected
                  ? "0 0 0 2px #0071e3, rgba(0,0,0,0.08) 0 2px 8px"
                  : "rgba(0,0,0,0.05) 0 1px 4px",
                background: isSelected ? "rgba(0,113,227,0.03)" : "#fff",
              }}
              onClick={() => onDetail(m)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onDetail(m)}
              role="button"
              aria-label={`${m.name} 상세 보기`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {/* Avatar / select toggle */}
                  <div
                    className="relative w-10 h-10 flex-shrink-0 group cursor-pointer"
                    onClick={(e) => toggleSelect(e, m.id)}
                    title={isSelected ? "선택 해제" : "클릭하여 선택"}
                  >
                    <MemberAvatar
                      member={m}
                      className={`w-10 h-10 rounded-full transition-opacity duration-150 ${isSelected ? "opacity-0" : ""}`}
                      style={{ background: "linear-gradient(135deg, #0071e3, #2997ff)" }}
                      textClass="text-[13px] font-semibold"
                    />
                    {!isSelected && (
                      <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                        <div className="w-5 h-5 rounded-full border-2 border-white" />
                      </div>
                    )}
                    {isSelected && (
                      <div
                        className="absolute inset-0 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#0071e3" }}
                      >
                        <Check size={16} color="white" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>

                  <div>
                    <div
                      className="text-[14px] font-semibold"
                      style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}
                    >
                      {m.name}
                    </div>
                    <div className="text-[12px] mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>
                      {m.team} · {m.position}
                    </div>
                  </div>
                </div>

                <div className="flex gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(m); }}
                    className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors"
                    style={{ color: "rgba(0,0,0,0.35)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#1d1d1f"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "rgba(0,0,0,0.35)"; }}
                    aria-label={`${m.name} 수정`}
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(m.id); }}
                    className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors"
                    style={{ color: "#d93025" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(217,48,37,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                    aria-label={`${m.name} 삭제`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {mAssets.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {mAssets.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-[12px]"
                      style={{ background: "#f5f5f7" }}
                    >
                      <span style={{ color: "rgba(0,0,0,0.4)" }}><CategoryIcon category={a.category} size={13} /></span>
                      <span className="font-medium" style={{ color: "#1d1d1f" }}>{a.manufacturer} {a.model}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="px-2.5 py-2 rounded-[8px] text-[12px] text-center"
                  style={{ background: "#f5f5f7", color: "rgba(0,0,0,0.3)" }}
                >
                  배정된 장비 없음
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
