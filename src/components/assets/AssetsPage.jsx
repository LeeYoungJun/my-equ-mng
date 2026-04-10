import { useMemo, useState, useEffect } from "react";
import { Search, Plus, Edit3, Trash2, UserPlus, ArrowLeft, AlertTriangle, Check } from "lucide-react";
import { CATEGORIES, STATUSES } from "../../data/constants";
import { inputClass, selectClass } from "../ui/FormField";
import CategoryIcon from "../ui/CategoryIcon";
import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";

export default function AssetsPage({
  assets,
  search,
  onSearchChange,
  filterCategory,
  onFilterCategory,
  filterStatus,
  onFilterStatus,
  getMember,
  onAdd,
  onEdit,
  onDetail,
  onAssign,
  onReturn,
  onDelete,
  onDeleteMultiple,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const STATUS_ORDER = { "in-use": 0, stock: 1, repair: 2, dispose: 3 };

  const fiveYearsAgo = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 5);
    return d;
  }, []);

  const needsReplacement = (a) =>
    a.category === "Laptop" && a.purchaseDate && new Date(a.purchaseDate) < fiveYearsAgo;

  const filtered = useMemo(() => {
    return assets
      .filter((a) => {
        if (filterCategory !== "all" && a.category !== filterCategory) return false;
        if (filterStatus !== "all" && a.status !== filterStatus) return false;
        if (search) {
          const q = search.toLowerCase();
          const member = a.assignedTo ? getMember(a.assignedTo) : null;
          const memberName = member ? member.name : a.sharedLabel || "";
          return (
            a.model.toLowerCase().includes(q) ||
            a.manufacturer.toLowerCase().includes(q) ||
            a.serial.toLowerCase().includes(q) ||
            memberName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
  }, [assets, filterCategory, filterStatus, search, getMember, fiveYearsAgo]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [search, filterCategory, filterStatus]);

  const someSelected = selectedIds.size > 0;
  const allSelected = filtered.length > 0 && filtered.every((a) => selectedIds.has(a.id));

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
    else setSelectedIds(new Set(filtered.map((a) => a.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = () => {
    onDeleteMultiple(Array.from(selectedIds));
    clearSelection();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <div className="relative flex-[1_1_240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(0,0,0,0.3)" }} aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="모델명, 제조사, S/N, 사용자 검색..."
            className={`${inputClass} pl-10`}
            aria-label="장비 검색"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => onFilterCategory(e.target.value)}
          className={`${selectClass} w-36 flex-none`}
          aria-label="카테고리 필터"
        >
          <option value="all">전체 카테고리</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value)}
          className={`${selectClass} w-32 flex-none`}
          aria-label="상태 필터"
        >
          <option value="all">전체 상태</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button
          onClick={onAdd}
          className="px-4 py-2.5 text-[14px] font-medium cursor-pointer flex items-center gap-1.5 border-none transition-opacity hover:opacity-85"
          style={{ borderRadius: "8px", background: "#0071e3", color: "#fff", letterSpacing: "-0.1px" }}
        >
          <Plus size={15} aria-hidden="true" />
          장비 등록
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
            className="w-5 h-5 rounded flex items-center justify-center cursor-pointer flex-shrink-0 border-none transition-all"
            style={{ border: "1.5px solid #0071e3", backgroundColor: allSelected ? "#0071e3" : "transparent" }}
            aria-label={allSelected ? "전체 선택 해제" : "전체 선택"}
          >
            {allSelected ? (
              <Check size={11} color="white" strokeWidth={3} />
            ) : (
              <div className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: "#0071e3" }} />
            )}
          </button>
          <span className="text-[13px] font-medium" style={{ color: "#0071e3", letterSpacing: "-0.1px" }}>
            {selectedIds.size}개 선택됨
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
              {selectedIds.size}개 삭제
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.05) 0 1px 4px" }}
      >
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {/* 전체선택 체크박스 헤더 */}
              <th className="px-4 py-3 w-10" style={{ background: "#f5f5f7" }}>
                <button
                  onClick={handleSelectAll}
                  className="w-4 h-4 rounded flex items-center justify-center cursor-pointer border-none transition-all"
                  style={{
                    border: `1.5px solid ${someSelected ? "#0071e3" : "rgba(0,0,0,0.2)"}`,
                    backgroundColor: allSelected ? "#0071e3" : "transparent",
                  }}
                  aria-label="전체 선택"
                >
                  {allSelected && <Check size={9} color="white" strokeWidth={3} />}
                  {someSelected && !allSelected && (
                    <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: "#0071e3" }} />
                  )}
                </button>
              </th>
              {["카테고리", "제조사", "모델명", "S/N", "상태", "사용자", "구입일", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-semibold whitespace-nowrap text-[11px]"
                  style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px", background: "#f5f5f7" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const member = a.assignedTo ? getMember(a.assignedTo) : null;
              const userLabel = member ? member.name : a.isShared ? a.sharedLabel : "-";
              const replace = needsReplacement(a);
              const isSelected = selectedIds.has(a.id);

              const baseBg = replace ? "rgba(255,149,0,0.04)" : "";
              const selectedBg = "rgba(0,113,227,0.04)";
              const hoverBg = isSelected
                ? "rgba(0,113,227,0.07)"
                : replace ? "rgba(255,149,0,0.08)" : "#f5f5f7";

              return (
                <tr
                  key={a.id}
                  className="transition-colors"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    background: isSelected ? selectedBg : baseBg,
                    boxShadow: isSelected ? "inset 3px 0 0 #0071e3" : undefined,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = isSelected ? selectedBg : baseBg)}
                >
                  {/* 체크박스 셀 */}
                  <td className="px-4 py-2.5 w-10">
                    <button
                      onClick={(e) => toggleSelect(e, a.id)}
                      className="w-4 h-4 rounded flex items-center justify-center cursor-pointer border-none transition-all"
                      style={{
                        border: `1.5px solid ${isSelected ? "#0071e3" : "rgba(0,0,0,0.2)"}`,
                        backgroundColor: isSelected ? "#0071e3" : "transparent",
                      }}
                      aria-label={`${a.model} ${isSelected ? "선택 해제" : "선택"}`}
                    >
                      {isSelected && <Check size={9} color="white" strokeWidth={3} />}
                    </button>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2" style={{ color: "rgba(0,0,0,0.48)" }}>
                      <CategoryIcon category={a.category} size={15} />
                      {a.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5" style={{ color: "rgba(0,0,0,0.48)" }}>{a.manufacturer}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => onDetail(a)}
                        className="bg-transparent border-none cursor-pointer font-semibold transition-colors p-0 text-[13px]"
                        style={{ color: "#1d1d1f", letterSpacing: "-0.1px" }}
                        onMouseEnter={(e) => (e.target.style.color = "#0071e3")}
                        onMouseLeave={(e) => (e.target.style.color = "#1d1d1f")}
                      >
                        {a.model}
                      </button>
                      {replace && (
                        <span
                          className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-[5px]"
                          style={{ background: "rgba(255,149,0,0.12)", color: "#c47e00" }}
                          title="구입 후 5년이 경과한 노트북입니다"
                        >
                          <AlertTriangle size={9} strokeWidth={2.5} />
                          교체 필요
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px]" style={{ color: "rgba(0,0,0,0.35)" }}>
                    {a.serial || "-"}
                  </td>
                  <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-2.5" style={{ color: member ? "#1d1d1f" : "rgba(0,0,0,0.4)", fontWeight: member ? 500 : 400 }}>
                    {userLabel}
                  </td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>
                    {a.purchaseDate || "-"}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => onEdit(a)}
                        className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors"
                        style={{ color: "rgba(0,0,0,0.35)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#1d1d1f"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "rgba(0,0,0,0.35)"; }}
                        aria-label={`${a.model} 수정`}
                      >
                        <Edit3 size={13} />
                      </button>
                      {a.status === "stock" && (
                        <button
                          onClick={() => onAssign(a.id)}
                          className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors"
                          style={{ color: "#0071e3" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,113,227,0.08)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                          aria-label={`${a.model} 배정`}
                        >
                          <UserPlus size={13} />
                        </button>
                      )}
                      {a.assignedTo && (
                        <button
                          onClick={() => onReturn(a.id)}
                          className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors"
                          style={{ color: "#c47e00" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,126,0,0.08)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                          aria-label={`${a.model} 반납`}
                        >
                          <ArrowLeft size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(a.id)}
                        className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors"
                        style={{ color: "#d93025" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(217,48,37,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                        aria-label={`${a.model} 삭제`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="검색 결과가 없습니다" />}
      </div>
    </div>
  );
}
