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
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-[1_1_250px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="모델명, 제조사, S/N, 사용자 검색..."
            className={`${inputClass} pl-10`}
            aria-label="장비 검색"
          />
        </div>
        <select value={filterCategory} onChange={(e) => onFilterCategory(e.target.value)} className={`${selectClass} w-36 flex-none`} aria-label="카테고리 필터">
          <option value="all">전체 카테고리</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => onFilterStatus(e.target.value)} className={`${selectClass} w-32 flex-none`} aria-label="상태 필터">
          <option value="all">전체 상태</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={onAdd} className="px-5 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold cursor-pointer flex items-center gap-1.5">
          <Plus size={15} aria-hidden="true" />
          장비 등록
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-100">
              {["카테고리", "제조사", "모델명", "S/N", "상태", "사용자", "구입일", ""].map((h) => (
                <th key={h} className="text-left px-3.5 py-3 text-gray-400 font-semibold text-[11px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const member = a.assignedTo ? getMember(a.assignedTo) : null;
              const userLabel = member ? member.name : a.isShared ? a.sharedLabel : "-";
              return (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-3.5 py-2.5">
                    <span className="flex items-center gap-2 text-gray-500">
                      <CategoryIcon category={a.category} size={16} />
                      {a.category}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-gray-500">{a.manufacturer}</td>
                  <td className="px-3.5 py-2.5 font-semibold text-dark">
                    <button onClick={() => onDetail(a)} className="bg-transparent border-none cursor-pointer text-dark font-semibold hover:text-primary transition-colors text-left p-0">
                      {a.model}
                    </button>
                  </td>
                  <td className="px-3.5 py-2.5 text-gray-400 font-mono text-[11px]">{a.serial || "-"}</td>
                  <td className="px-3.5 py-2.5"><StatusBadge status={a.status} /></td>
                  <td className={`px-3.5 py-2.5 text-gray-500 ${member ? "font-semibold" : ""}`}>{userLabel}</td>
                  <td className="px-3.5 py-2.5 text-gray-400">{a.purchaseDate || "-"}</td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={() => onEdit(a)} className="p-1 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600" aria-label={`${a.model} 수정`}>
                        <Edit3 size={14} />
                      </button>
                      {a.status === "stock" && (
                        <button onClick={() => onAssign(a.id)} className="p-1 bg-transparent border-none cursor-pointer text-info hover:text-info/80" aria-label={`${a.model} 배정`}>
                          <UserPlus size={14} />
                        </button>
                      )}
                      {a.assignedTo && (
                        <button onClick={() => onReturn(a.id)} className="p-1 bg-transparent border-none cursor-pointer text-warning hover:text-warning/80" aria-label={`${a.model} 반납`}>
                          <ArrowLeft size={14} />
                        </button>
                      )}
                      <button onClick={() => onDelete(a.id)} className="p-1 bg-transparent border-none cursor-pointer text-danger hover:text-danger/80" aria-label={`${a.model} 삭제`}>
                        <Trash2 size={14} />
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
