import { useState, useMemo } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import MemberAvatar from "../ui/MemberAvatar";

const PAGE_SIZE = 10;

export default function MemberEquipmentTable({ members, getMemberAssets, onMemberClick }) {
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const enriched = useMemo(() => {
    return members.map((m) => {
      const mAssets = getMemberAssets(m.id);
      return {
        ...m,
        mAssets,
        laptops: mAssets.filter((a) => a.category === "Laptop"),
        monitors: mAssets.filter((a) => a.category === "Monitor"),
        assetCount: mAssets.length,
      };
    });
  }, [members, getMemberAssets]);

  const filtered = useMemo(() => {
    if (!searchQuery) return enriched;
    const q = searchQuery.toLowerCase();
    return enriched.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.team.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q)
    );
  }, [enriched, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "team": cmp = a.team.localeCompare(b.team); break;
        case "assetCount": cmp = a.assetCount - b.assetCount; break;
        default: cmp = 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const SortHeader = ({ label, sortField, align }) => (
    <th
      className={`${align === "center" ? "text-center" : "text-left"} px-3.5 py-2.5 text-gray-400 font-semibold text-[11px] cursor-pointer select-none hover:text-gray-600`}
      style={{ transition: "color 0.15s" }}
      onClick={() => toggleSort(sortField)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown
          size={12}
          style={{
            opacity: sortKey === sortField ? 1 : 0.3,
            color: sortKey === sortField ? "#6366f1" : undefined,
          }}
        />
      </span>
    </th>
  );

  return (
    <article className="bg-white rounded-2xl p-6 border border-gray-100 mt-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-dark">팀원별 장비 현황</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            placeholder="팀원 검색..."
            className="pl-8 pr-3 py-1.5 text-[12px] rounded-lg border border-gray-200 outline-none focus:border-primary/40 w-44"
            style={{ transition: "border-color 0.15s" }}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <SortHeader label="팀원" sortField="name" />
              <SortHeader label="팀" sortField="team" />
              <th className="text-left px-3.5 py-2.5 text-gray-400 font-semibold text-[11px]">노트북</th>
              <th className="text-left px-3.5 py-2.5 text-gray-400 font-semibold text-[11px]">모니터</th>
              <SortHeader label="총 장비" sortField="assetCount" align="center" />
            </tr>
          </thead>
          <tbody>
            {paged.map((m, idx) => (
              <tr
                key={m.id}
                className="border-b border-gray-50 cursor-pointer"
                style={{
                  background: hoveredRow === idx ? "#fafaff" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onMemberClick(m)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onMemberClick(m)}
                role="button"
                aria-label={`${m.name} 상세 보기`}
              >
                <td className="px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <MemberAvatar
                      member={m}
                      className="w-7 h-7 rounded-full"
                      style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" }}
                      textClass="text-[11px]"
                    />
                    <span className="font-semibold text-dark">{m.name}</span>
                  </div>
                </td>
                <td className="px-3.5 py-2.5 text-gray-500">{m.team}</td>
                <td className="px-3.5 py-2.5 text-gray-500">
                  {m.laptops.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <CategoryIcon category="Laptop" size={13} />
                      <span>{m.laptops.map((l) => l.model).join(", ")}</span>
                    </div>
                  ) : "-"}
                </td>
                <td className="px-3.5 py-2.5 text-gray-500">
                  {m.monitors.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <CategoryIcon category="Monitor" size={13} />
                      <span>{m.monitors.map((mo) => mo.model).join(", ")}</span>
                    </div>
                  ) : "-"}
                </td>
                <td className="px-3.5 py-2.5 text-center">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[13px] font-bold"
                    style={{
                      background: m.assetCount > 0 ? "rgba(99,102,241,0.1)" : "transparent",
                      color: m.assetCount > 0 ? "#6366f1" : "#ccc",
                    }}
                  >
                    {m.assetCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paged.length === 0 && (
          <div className="py-10 text-center text-gray-400 text-[13px]">검색 결과가 없습니다</div>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <span className="text-[12px] text-gray-400">
            총 {sorted.length}명 중 {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, sorted.length)}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ transition: "all 0.15s" }}
            >
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-7 h-7 rounded-lg text-[12px] font-medium"
                style={{
                  background: page === i ? "#6366f1" : "transparent",
                  color: page === i ? "#fff" : "#888",
                  transition: "all 0.15s",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ transition: "all 0.15s" }}
            >
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
