import { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import MemberAvatar from "../ui/MemberAvatar";

const TEAM_COLORS = {
  "솔루션팀": "#6366f1",
  "기술지원팀": "#10b981",
  "데이터컨설팅팀": "#f59e0b",
};

export default function MemberSidebar({ members, getMemberAssets, onMemberClick }) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const enriched = useMemo(() => {
    return members.map((m) => ({
      ...m,
      assets: getMemberAssets(m.id),
    }));
  }, [members, getMemberAssets]);

  const filtered = useMemo(() => {
    if (!search) return enriched;
    const q = search.toLowerCase();
    return enriched.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.team.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q)
    );
  }, [enriched, search]);

  const totalWithAssets = enriched.filter((m) => m.assets.length > 0).length;

  return (
    <aside className="w-[300px] shrink-0 bg-white border-l border-gray-100 flex flex-col h-screen">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Users size={16} />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-dark leading-tight">팀원별 장비현황</h2>
            <p className="text-[11px] text-gray-400">{totalWithAssets}명 장비 보유 / 총 {members.length}명</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 팀, 직급 검색..."
            className="w-full pl-8 pr-3 py-2 text-[12px] rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-primary/30 focus:bg-white"
            style={{ transition: "all 0.15s" }}
          />
        </div>
      </div>

      {/* Card list - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ scrollbarWidth: "thin" }}>
        <div className="flex flex-col gap-2.5">
          {filtered.map((m) => {
            const color = TEAM_COLORS[m.team] || "#6366f1";
            const isHovered = hoveredId === m.id;
            const hasAssets = m.assets.length > 0;

            return (
              <div
                key={m.id}
                className="rounded-xl p-3.5 cursor-pointer"
                style={{
                  background: isHovered ? `${color}06` : "#fafafa",
                  border: `1px solid ${isHovered ? `${color}25` : "#f0f0f0"}`,
                  transition: "all 0.2s ease",
                  transform: isHovered ? "translateX(-2px)" : "none",
                  boxShadow: isHovered ? `3px 3px 12px ${color}10` : "none",
                }}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onMemberClick(m)}
              >
                {/* Member info */}
                <div className="flex items-center gap-3 mb-2">
                  <MemberAvatar
                    member={m}
                    className="w-9 h-9 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
                    textClass="text-[13px]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-dark leading-tight">{m.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      <span
                        className="inline-block px-1.5 py-0 rounded text-[10px] font-medium mr-1"
                        style={{ background: `${color}12`, color }}
                      >
                        {m.team}
                      </span>
                      {m.position}
                    </div>
                  </div>
                  {hasAssets && (
                    <span
                      className="text-[11px] font-bold w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${color}12`, color }}
                    >
                      {m.assets.length}
                    </span>
                  )}
                </div>

                {/* Equipment list */}
                {hasAssets ? (
                  <div className="flex flex-col gap-1 ml-0.5">
                    {m.assets.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/80 text-[11px]"
                        style={{ border: "1px solid #f0f0f0" }}
                      >
                        <span className="text-gray-400">
                          <CategoryIcon category={a.category} size={13} />
                        </span>
                        <span className="text-gray-600 font-medium truncate">{a.manufacturer}</span>
                        <span className="text-gray-400 truncate flex-1">{a.model}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-300 text-center py-1">배정 장비 없음</div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-10 text-center text-gray-300 text-[12px]">검색 결과가 없습니다</div>
          )}
        </div>
      </div>
    </aside>
  );
}
