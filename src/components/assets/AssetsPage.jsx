import { useMemo } from "react";
import { Search, Plus, Edit3, Trash2, UserPlus, ArrowLeft } from "lucide-react";
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
}) {
  const filtered = useMemo(() => {
    return assets.filter((a) => {
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
    });
  }, [assets, filterCategory, filterStatus, search, getMember]);

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
          style={{
            borderRadius: "8px",
            background: "#0071e3",
            color: "#fff",
            letterSpacing: "-0.1px",
          }}
        >
          <Plus size={15} aria-hidden="true" />
          장비 등록
        </button>
      </div>

      {/* Table */}
      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.05) 0 1px 4px" }}
      >
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
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
              return (
                <tr
                  key={a.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f7")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2" style={{ color: "rgba(0,0,0,0.48)" }}>
                      <CategoryIcon category={a.category} size={15} />
                      {a.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5" style={{ color: "rgba(0,0,0,0.48)" }}>{a.manufacturer}</td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => onDetail(a)}
                      className="bg-transparent border-none cursor-pointer font-semibold transition-colors p-0 text-[13px]"
                      style={{ color: "#1d1d1f", letterSpacing: "-0.1px" }}
                      onMouseEnter={(e) => (e.target.style.color = "#0071e3")}
                      onMouseLeave={(e) => (e.target.style.color = "#1d1d1f")}
                    >
                      {a.model}
                    </button>
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
