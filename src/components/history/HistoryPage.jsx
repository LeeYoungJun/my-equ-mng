import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { inputClass, selectClass } from "../ui/FormField";

export default function HistoryPage({ history, getAsset, getMember }) {
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterMember, setFilterMember] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const actionConfig = {
    assign:          { label: "배정",     bg: "rgba(26,127,78,0.08)",   color: "#1a7f4e" },
    return:          { label: "반납",     bg: "rgba(196,126,0,0.08)",   color: "#c47e00" },
    "status-change": { label: "상태변경", bg: "rgba(0,113,227,0.08)",   color: "#0071e3" },
  };

  const uniqueMembers = useMemo(() => {
    const ids = [...new Set(history.map((h) => h.memberId).filter(Boolean))];
    return ids.map((id) => getMember(id)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }, [history, getMember]);

  const filtered = useMemo(() => {
    return [...history]
      .filter((h) => {
        if (filterAction !== "all" && h.action !== filterAction) return false;
        if (filterMember !== "all" && h.memberId !== filterMember) return false;
        if (filterDateFrom && h.date < filterDateFrom) return false;
        if (filterDateTo && h.date > filterDateTo) return false;
        if (search) {
          const q = search.toLowerCase();
          const asset = getAsset(h.assetId);
          const member = h.memberId ? getMember(h.memberId) : null;
          const assetName = asset ? `${asset.manufacturer} ${asset.model}`.toLowerCase() : "";
          const memberName = member ? member.name.toLowerCase() : "";
          if (!assetName.includes(q) && !memberName.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [history, filterAction, filterMember, filterDateFrom, filterDateTo, search, getAsset, getMember]);

  const hasFilters = search || filterAction !== "all" || filterMember !== "all" || filterDateFrom || filterDateTo;

  const resetFilters = () => {
    setSearch("");
    setFilterAction("all");
    setFilterMember("all");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="relative flex-[1_1_200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(0,0,0,0.3)" }} aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="장비명, 팀원 검색..."
            className={`${inputClass} pl-10`}
            aria-label="이력 검색"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className={`${selectClass} w-32 flex-none`}
          aria-label="유형 필터"
        >
          <option value="all">전체 유형</option>
          <option value="assign">배정</option>
          <option value="return">반납</option>
          <option value="status-change">상태변경</option>
        </select>
        <select
          value={filterMember}
          onChange={(e) => setFilterMember(e.target.value)}
          className={`${selectClass} w-36 flex-none`}
          aria-label="팀원 필터"
        >
          <option value="all">전체 팀원</option>
          {uniqueMembers.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          className={`${inputClass} w-36 flex-none`}
          aria-label="시작일"
        />
        <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.3)" }}>~</span>
        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          className={`${inputClass} w-36 flex-none`}
          aria-label="종료일"
        />
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-[13px] border-none bg-transparent cursor-pointer px-2"
            style={{ color: "#0071e3" }}
          >
            초기화
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="mb-3 text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>
          {filtered.length}건 검색됨 (전체 {history.length}건)
        </div>
      )}

      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.05) 0 1px 4px" }}
      >
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {["날짜", "유형", "장비", "사용자", "메모"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-semibold text-[11px]"
                  style={{ color: "rgba(0,0,0,0.4)", background: "#f5f5f7" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => {
              const asset = getAsset(h.assetId);
              const member = h.memberId ? getMember(h.memberId) : null;
              const config = actionConfig[h.action] || actionConfig["status-change"];
              return (
                <tr
                  key={h.id}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f7")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <td className="px-4 py-2.5">
                    <time style={{ color: "rgba(0,0,0,0.48)" }}>{h.date}</time>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ background: config.bg, color: config.color }}
                    >
                      {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium" style={{ color: "#1d1d1f" }}>
                    {asset ? `${asset.manufacturer} ${asset.model}` : "삭제된 장비"}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: "rgba(0,0,0,0.48)" }}>{member?.name || "-"}</td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>{h.note}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[13px]" style={{ color: "rgba(0,0,0,0.3)" }}>
                  {hasFilters ? "검색 결과가 없습니다" : "이력이 없습니다"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
