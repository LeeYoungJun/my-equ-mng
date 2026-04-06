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
    return members.filter((m) => {
      if (filterTeam !== "all" && m.team !== filterTeam) return false;
      if (search) {
        const q = search.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.team.toLowerCase().includes(q) || m.position.toLowerCase().includes(q);
      }
      return true;
    });
  }, [members, filterTeam, search]);

  // 필터 변경 시 선택 초기화
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
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((m) => m.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = () => {
    onDeleteMultiple(Array.from(selectedIds));
    clearSelection();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-[1_1_250px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="이름, 팀, 직급 검색..."
            className={`${inputClass} pl-10`}
            aria-label="팀원 검색"
          />
        </div>
        <select value={filterTeam} onChange={(e) => onFilterTeam(e.target.value)} className={`${selectClass} w-36 flex-none`} aria-label="팀 필터">
          <option value="all">전체 팀</option>
          {TEAMS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button onClick={onAdd} className="px-5 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold cursor-pointer flex items-center gap-1.5">
          <Plus size={15} aria-hidden="true" />
          팀원 등록
        </button>
      </div>

      {/* 선택 액션 바 */}
      {someSelected && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-4 bg-primary/5 border border-primary/20">
          {/* 전체 선택/해제 체크박스 */}
          <button
            onClick={handleSelectAll}
            className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all flex-shrink-0"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: allSelected ? "var(--color-primary)" : "transparent",
            }}
            aria-label={allSelected ? "전체 선택 해제" : "전체 선택"}
          >
            {allSelected ? (
              <Check size={11} color="white" strokeWidth={3} />
            ) : (
              <div className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
            )}
          </button>

          <span className="text-sm font-semibold text-primary">
            {selectedIds.size}명 선택됨
          </span>

          <button
            onClick={clearSelection}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border-none bg-transparent"
          >
            선택 취소
          </button>

          <div className="ml-auto">
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80 text-white"
              style={{ backgroundColor: "var(--color-danger)" }}
            >
              <Trash2 size={13} aria-hidden="true" />
              {selectedIds.size}명 삭제
            </button>
          </div>
        </div>
      )}

      {/* 카드 그리드 */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-3.5">
        {filtered.map((m) => {
          const mAssets = getMemberAssets(m.id);
          const isSelected = selectedIds.has(m.id);
          return (
            <article
              key={m.id}
              className={`rounded-2xl p-5 border cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary/5 border-primary/30 ring-2 ring-primary/20"
                  : "bg-white border-gray-100 hover:shadow-md"
              }`}
              onClick={() => onDetail(m)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onDetail(m)}
              role="button"
              aria-label={`${m.name} 상세 보기`}
            >
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  {/* 아바타 (클릭 시 선택 토글) */}
                  <div
                    className="relative w-[42px] h-[42px] flex-shrink-0 group cursor-pointer"
                    onClick={(e) => toggleSelect(e, m.id)}
                    title={isSelected ? "선택 해제" : "클릭하여 선택"}
                  >
                    <MemberAvatar
                      member={m}
                      className={`w-[42px] h-[42px] rounded-full transition-opacity duration-150 ${isSelected ? "opacity-0" : ""}`}
                      style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" }}
                      textClass="text-base"
                    />
                    {/* 호버 힌트 (미선택 상태) */}
                    {!isSelected && (
                      <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                        <div className="w-5 h-5 rounded-full border-2 border-white" />
                      </div>
                    )}
                    {/* 선택된 상태 오버레이 */}
                    {isSelected && (
                      <div
                        className="absolute inset-0 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        <Check size={18} color="white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[15px] font-bold text-dark">{m.name}</div>
                    <div className="text-xs text-gray-400">{m.team} · {m.position}</div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(m); }}
                    className="p-1 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600"
                    aria-label={`${m.name} 수정`}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(m.id); }}
                    className="p-1 bg-transparent border-none cursor-pointer text-danger hover:text-danger/80"
                    aria-label={`${m.name} 삭제`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {mAssets.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {mAssets.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg text-xs">
                      <CategoryIcon category={a.category} size={14} />
                      <span className="text-gray-500 font-medium">{a.manufacturer} {a.model}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-2.5 py-2 bg-gray-50 rounded-lg text-xs text-gray-400 text-center">
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
