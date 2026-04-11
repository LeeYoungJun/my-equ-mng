import { useMemo, useState, useEffect, useRef } from "react";
import { Search, Plus, Edit3, Trash2, UserPlus, ArrowLeft, AlertTriangle, Check, Download, ShieldAlert, Clock, ChevronDown } from "lucide-react";
import { CATEGORIES, STATUSES } from "../../data/constants";
import { inputClass, selectClass } from "../ui/FormField";
import CategoryIcon from "../ui/CategoryIcon";
import StatusBadge from "../ui/StatusBadge";

const STATUS_COLORS = {
  "in-use": { bg: "rgba(26,127,78,0.08)", color: "#1a7f4e" },
  stock:    { bg: "rgba(0,113,227,0.08)",  color: "#0071e3" },
  repair:   { bg: "rgba(255,149,0,0.08)",  color: "#c47e00" },
  dispose:  { bg: "rgba(217,48,37,0.08)",  color: "#d93025" },
};

function StatusDropdown({ assetId, currentStatus, onStatusChange, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Inline dropdown — don't offer "in-use" (requires explicit assignment)
  const options = Object.entries(STATUSES).filter(([k]) => k !== "in-use");

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-1 rounded-[10px] py-1 z-50"
      style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", minWidth: "120px", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      {options.map(([k, v]) => {
        const c = STATUS_COLORS[k];
        return (
          <button
            key={k}
            onClick={() => { onStatusChange(assetId, k); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium border-none cursor-pointer transition-colors text-left"
            style={{ background: k === currentStatus ? c.bg : "transparent", color: c.color }}
            onMouseEnter={(e) => { if (k !== currentStatus) e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = k === currentStatus ? c.bg : "transparent"; }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
            {v}
            {k === currentStatus && <Check size={11} className="ml-auto" />}
          </button>
        );
      })}
    </div>
  );
}

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
  onBulkAssign,
  onReturn,
  onDelete,
  onDeleteMultiple,
  onStatusChange,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [openStatusId, setOpenStatusId] = useState(null);

  const STATUS_ORDER = { "in-use": 0, stock: 1, repair: 2, dispose: 3 };

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split("T")[0], [today]);

  const fiveYearsAgo = useMemo(() => {
    const d = new Date(); d.setFullYear(d.getFullYear() - 5); return d;
  }, []);
  const threeMonthsLater = useMemo(() => {
    const d = new Date(); d.setMonth(d.getMonth() + 3); return d;
  }, []);

  const needsReplacement = (a) =>
    a.category === "Laptop" && a.purchaseDate && new Date(a.purchaseDate) < fiveYearsAgo;

  const warrantyStatus = (a) => {
    if (!a.warrantyExpiry) return null;
    const exp = new Date(a.warrantyExpiry);
    if (exp < today) return "expired";
    if (exp < threeMonthsLater) return "expiring";
    return null;
  };

  const isOverdue = (a) => a.dueDate && a.status === "in-use" && a.dueDate < todayStr;

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

  useEffect(() => { setSelectedIds(new Set()); }, [search, filterCategory, filterStatus]);

  const someSelected = selectedIds.size > 0;
  const allSelected = filtered.length > 0 && filtered.every((a) => selectedIds.has(a.id));

  const selectedStockIds = useMemo(
    () => filtered.filter((a) => selectedIds.has(a.id) && a.status === "stock").map((a) => a.id),
    [filtered, selectedIds],
  );

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((a) => a.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const exportCSV = () => {
    const headers = ["카테고리", "제조사", "모델명", "S/N", "세부사양", "상태", "사용자", "구입일", "보증만료일", "반납예정일", "비고"];
    const rows = filtered.map((a) => {
      const member = a.assignedTo ? getMember(a.assignedTo) : null;
      const userLabel = member ? member.name : a.isShared ? (a.sharedLabel || "") : "";
      return [
        a.category, a.manufacturer, a.model, a.serial || "",
        (a.spec || "").replace(/\n/g, " "),
        STATUSES[a.status] || a.status,
        userLabel, a.purchaseDate || "", a.warrantyExpiry || "", a.dueDate || "", a.note || "",
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `장비현황_${todayStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilter = search || filterCategory !== "all" || filterStatus !== "all";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <div className="relative flex-[1_1_240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(0,0,0,0.3)" }} />
          <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="모델명, 제조사, S/N, 사용자 검색..." className={`${inputClass} pl-10`} aria-label="장비 검색" />
        </div>
        <select value={filterCategory} onChange={(e) => onFilterCategory(e.target.value)} className={`${selectClass} w-36 flex-none`}>
          <option value="all">전체 카테고리</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => onFilterStatus(e.target.value)} className={`${selectClass} w-32 flex-none`}>
          <option value="all">전체 상태</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={exportCSV} className="px-4 py-2.5 text-[14px] font-medium cursor-pointer flex items-center gap-1.5 border-none transition-opacity hover:opacity-85" style={{ borderRadius: "8px", background: "rgba(0,0,0,0.06)", color: "#1d1d1f" }} title="현재 필터 기준 CSV 내보내기">
          <Download size={15} />내보내기
        </button>
        <button onClick={onAdd} className="px-4 py-2.5 text-[14px] font-medium cursor-pointer flex items-center gap-1.5 border-none transition-opacity hover:opacity-85" style={{ borderRadius: "8px", background: "#0071e3", color: "#fff" }}>
          <Plus size={15} />장비 등록
        </button>
      </div>

      {/* Bulk select bar */}
      {someSelected && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-[10px] mb-4 flex-wrap" style={{ background: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.15)" }}>
          <button onClick={handleSelectAll} className="w-5 h-5 rounded flex items-center justify-center cursor-pointer flex-shrink-0 border-none transition-all" style={{ border: "1.5px solid #0071e3", backgroundColor: allSelected ? "#0071e3" : "transparent" }}>
            {allSelected ? <Check size={11} color="white" strokeWidth={3} /> : <div className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: "#0071e3" }} />}
          </button>
          <span className="text-[13px] font-medium" style={{ color: "#0071e3" }}>{selectedIds.size}개 선택됨</span>
          <button onClick={clearSelection} className="text-[12px] border-none bg-transparent cursor-pointer" style={{ color: "rgba(0,0,0,0.4)" }}>선택 취소</button>
          <div className="ml-auto flex gap-2">
            {selectedStockIds.length > 0 && (
              <button onClick={() => { onBulkAssign(selectedStockIds); clearSelection(); }} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-80 text-white border-none" style={{ background: "#0071e3" }}>
                <UserPlus size={13} />{selectedStockIds.length}개 일괄 배정
              </button>
            )}
            <button onClick={() => { onDeleteMultiple(Array.from(selectedIds)); clearSelection(); }} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-80 text-white border-none" style={{ background: "#d93025" }}>
              <Trash2 size={13} />{selectedIds.size}개 삭제
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white overflow-hidden" style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.05) 0 1px 4px" }}>
        <table className="w-full border-collapse text-[13px]" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "44px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "140px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "110px" }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <th className="px-4 py-3" style={{ background: "#f5f5f7" }}>
                <button onClick={handleSelectAll} className="w-4 h-4 rounded flex items-center justify-center cursor-pointer border-none transition-all" style={{ border: `1.5px solid ${someSelected ? "#0071e3" : "rgba(0,0,0,0.2)"}`, backgroundColor: allSelected ? "#0071e3" : "transparent" }} aria-label="전체 선택">
                  {allSelected && <Check size={9} color="white" strokeWidth={3} />}
                  {someSelected && !allSelected && <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: "#0071e3" }} />}
                </button>
              </th>
              {["카테고리", "제조사", "모델명", "S/N", "상태", "사용자", "구입일", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-[11px] whitespace-nowrap" style={{ color: "rgba(0,0,0,0.4)", background: "#f5f5f7" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const member = a.assignedTo ? getMember(a.assignedTo) : null;
              const userLabel = member ? member.name : a.isShared ? a.sharedLabel : "-";
              const replace = needsReplacement(a);
              const wStatus = warrantyStatus(a);
              const overdue = isOverdue(a);
              const isSelected = selectedIds.has(a.id);

              const baseBg = replace ? "rgba(255,149,0,0.04)" : "";
              const selectedBg = "rgba(0,113,227,0.04)";
              const hoverBg = isSelected ? "rgba(0,113,227,0.07)" : replace ? "rgba(255,149,0,0.08)" : "#f5f5f7";

              return (
                <tr
                  key={a.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", background: isSelected ? selectedBg : baseBg, boxShadow: isSelected ? "inset 3px 0 0 #0071e3" : undefined }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = isSelected ? selectedBg : baseBg)}
                >
                  <td className="px-4 py-2.5">
                    <button onClick={(e) => toggleSelect(e, a.id)} className="w-4 h-4 rounded flex items-center justify-center cursor-pointer border-none transition-all" style={{ border: `1.5px solid ${isSelected ? "#0071e3" : "rgba(0,0,0,0.2)"}`, backgroundColor: isSelected ? "#0071e3" : "transparent" }}>
                      {isSelected && <Check size={9} color="white" strokeWidth={3} />}
                    </button>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2 truncate" style={{ color: "rgba(0,0,0,0.48)" }}>
                      <CategoryIcon category={a.category} size={15} />
                      <span className="truncate">{a.category}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 truncate" style={{ color: "rgba(0,0,0,0.48)" }}>{a.manufacturer}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => onDetail(a)} className="bg-transparent border-none cursor-pointer font-semibold transition-colors p-0 text-[13px] truncate" style={{ color: "#1d1d1f" }} onMouseEnter={(e) => (e.target.style.color = "#0071e3")} onMouseLeave={(e) => (e.target.style.color = "#1d1d1f")}>
                        {a.model}
                      </button>
                      {replace && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-[5px] shrink-0" style={{ background: "rgba(255,149,0,0.12)", color: "#c47e00" }} title="구입 후 5년 경과">
                          <AlertTriangle size={9} strokeWidth={2.5} />교체 필요
                        </span>
                      )}
                      {wStatus === "expired" && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-[5px] shrink-0" style={{ background: "rgba(217,48,37,0.1)", color: "#d93025" }} title={`보증 만료: ${a.warrantyExpiry}`}>
                          <ShieldAlert size={9} strokeWidth={2.5} />보증만료
                        </span>
                      )}
                      {wStatus === "expiring" && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-[5px] shrink-0" style={{ background: "rgba(0,113,227,0.1)", color: "#0071e3" }} title={`보증 만료 예정: ${a.warrantyExpiry}`}>
                          <ShieldAlert size={9} strokeWidth={2.5} />보증임박
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] truncate" style={{ color: "rgba(0,0,0,0.35)" }}>{a.serial || "-"}</td>

                  {/* Inline status change */}
                  <td className="px-4 py-2.5 relative whitespace-nowrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenStatusId(openStatusId === a.id ? null : a.id); }}
                      className="flex items-center gap-1 border-none bg-transparent cursor-pointer p-0 rounded-[6px] transition-opacity hover:opacity-75"
                      title="클릭하여 상태 변경"
                    >
                      <StatusBadge status={a.status} />
                      <ChevronDown size={11} style={{ color: "rgba(0,0,0,0.3)", marginLeft: "2px" }} />
                    </button>
                    {openStatusId === a.id && (
                      <StatusDropdown
                        assetId={a.id}
                        currentStatus={a.status}
                        onStatusChange={onStatusChange}
                        onClose={() => setOpenStatusId(null)}
                      />
                    )}
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="truncate" style={{ color: member ? "#1d1d1f" : "rgba(0,0,0,0.4)", fontWeight: member ? 500 : 400 }}>{userLabel}</span>
                      {overdue && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-[5px] shrink-0" style={{ background: "rgba(217,48,37,0.1)", color: "#d93025" }} title={`반납 예정일 초과: ${a.dueDate}`}>
                          <Clock size={9} strokeWidth={2.5} />기한초과
                        </span>
                      )}
                      {a.dueDate && !overdue && (
                        <span className="text-[11px] shrink-0" style={{ color: "rgba(0,0,0,0.3)" }}>~{a.dueDate}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>{a.purchaseDate || "-"}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-0.5">
                      <button onClick={() => onEdit(a)} className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors" style={{ color: "rgba(0,0,0,0.35)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#1d1d1f"; }} onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "rgba(0,0,0,0.35)"; }} aria-label={`${a.model} 수정`}><Edit3 size={13} /></button>
                      {a.status === "stock" && (
                        <button onClick={() => onAssign(a.id)} className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors" style={{ color: "#0071e3" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,113,227,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = ""; }} aria-label={`${a.model} 배정`}><UserPlus size={13} /></button>
                      )}
                      {a.assignedTo && (
                        <button onClick={() => onReturn(a.id)} className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors" style={{ color: "#c47e00" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,126,0,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = ""; }} aria-label={`${a.model} 반납`}><ArrowLeft size={13} /></button>
                      )}
                      <button onClick={() => onDelete(a.id)} className="p-1.5 rounded-[6px] bg-transparent border-none cursor-pointer transition-colors" style={{ color: "#d93025" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(217,48,37,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = ""; }} aria-label={`${a.model} 삭제`}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-14 flex flex-col items-center gap-3">
            <div className="text-[13px]" style={{ color: "rgba(0,0,0,0.3)" }}>
              {hasActiveFilter ? "검색 조건에 맞는 장비가 없습니다" : "등록된 장비가 없습니다"}
            </div>
            {hasActiveFilter ? (
              <button
                onClick={() => { onSearchChange(""); onFilterCategory("all"); onFilterStatus("all"); }}
                className="px-4 py-2 text-[13px] font-medium border-none cursor-pointer rounded-[8px] transition-opacity hover:opacity-80"
                style={{ background: "rgba(0,113,227,0.08)", color: "#0071e3" }}
              >
                필터 초기화
              </button>
            ) : (
              <button
                onClick={onAdd}
                className="px-4 py-2 text-[13px] font-medium border-none cursor-pointer rounded-[8px] transition-opacity hover:opacity-85 flex items-center gap-1.5"
                style={{ background: "#0071e3", color: "#fff" }}
              >
                <Plus size={14} />장비 등록하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
