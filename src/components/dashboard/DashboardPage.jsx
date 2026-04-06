import { useState, useMemo } from "react";
import { CATEGORIES } from "../../data/constants";
import CategoryIcon from "../ui/CategoryIcon";
import MemberAvatar from "../ui/MemberAvatar";
import { Search } from "lucide-react";

const CATEGORY_COLORS = {
  Desktop: "#6366f1",
  Laptop: "#8b5cf6",
  Monitor: "#ec4899",
  Tablet: "#f59e0b",
  Printer: "#10b981",
  "기타": "#3b82f6",
};

const TEAM_COLORS = {
  "솔루션팀": "#6366f1",
  "기술지원팀": "#10b981",
  "데이터컨설팅팀": "#f59e0b",
};

export default function DashboardPage({ assets, members, getMemberAssets, onMemberClick }) {
  const [hoveredCat, setHoveredCat] = useState(null);
  const [search, setSearch] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  // Category summary: in-use + stock per category
  const categorySummary = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const all = assets.filter((a) => a.category === cat);
      if (all.length === 0) return null;
      return {
        cat,
        total: all.length,
        inUse: all.filter((a) => a.status === "in-use").length,
        stock: all.filter((a) => a.status === "stock").length,
        repair: all.filter((a) => a.status === "repair").length,
        dispose: all.filter((a) => a.status === "dispose").length,
      };
    }).filter(Boolean);
  }, [assets]);

  // Enriched members
  const enriched = useMemo(() => {
    return members
      .map((m) => {
        const mAssets = getMemberAssets(m.id);
        return { ...m, assets: mAssets };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));
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

  return (
    <div>
      {/* ── Category Summary Cards ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 mb-8">
        {categorySummary.map((item) => {
          const color = CATEGORY_COLORS[item.cat] || "#6366f1";
          const isHovered = hoveredCat === item.cat;
          return (
            <div
              key={item.cat}
              className="bg-white rounded-2xl px-5 py-4 border border-gray-100 cursor-default select-none"
              style={{
                transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                transform: isHovered ? "translateY(-3px)" : "none",
                boxShadow: isHovered ? `0 8px 24px ${color}18` : "0 1px 3px rgba(0,0,0,0.03)",
                borderColor: isHovered ? `${color}30` : undefined,
              }}
              onMouseEnter={() => setHoveredCat(item.cat)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}12`, color, transition: "transform 0.25s", transform: isHovered ? "scale(1.1)" : "none" }}
                >
                  <CategoryIcon category={item.cat} size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-dark">{item.cat}</div>
                  <div className="text-[11px] text-gray-400">총 {item.total}대</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg px-2.5 py-1.5 bg-green-50 text-center">
                  <div className="text-[16px] font-extrabold text-green-600">{item.inUse}</div>
                  <div className="text-[10px] text-green-500 font-medium">사용중</div>
                </div>
                <div className="flex-1 rounded-lg px-2.5 py-1.5 bg-blue-50 text-center">
                  <div className="text-[16px] font-extrabold text-blue-600">{item.stock}</div>
                  <div className="text-[10px] text-blue-500 font-medium">재고</div>
                </div>
                {(item.repair > 0 || item.dispose > 0) && (
                  <div className="flex-1 rounded-lg px-2.5 py-1.5 bg-red-50 text-center">
                    <div className="text-[16px] font-extrabold text-red-500">{item.repair + item.dispose}</div>
                    <div className="text-[10px] text-red-400 font-medium">기타</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Member Equipment Section ── */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-dark">팀원별 장비현황</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 팀, 직급 검색..."
            className="pl-8 pr-3 py-1.5 text-[12px] rounded-lg border border-gray-200 bg-white outline-none focus:border-primary/40 w-52"
            style={{ transition: "border-color 0.15s" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {filtered.map((m) => {
          const color = TEAM_COLORS[m.team] || "#6366f1";
          const isHovered = hoveredCard === m.id;
          const hasAssets = m.assets.length > 0;

          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer"
              style={{
                transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                transform: isHovered ? "translateY(-2px)" : "none",
                boxShadow: isHovered ? `0 8px 24px ${color}12` : "0 1px 3px rgba(0,0,0,0.03)",
                borderColor: isHovered ? `${color}30` : undefined,
              }}
              onMouseEnter={() => setHoveredCard(m.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onMemberClick(m)}
            >
              {/* Member header */}
              <div className="flex items-center gap-3 mb-3">
                <MemberAvatar
                  member={m}
                  className="w-10 h-10 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
                  textClass="text-[14px] font-bold"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-dark">{m.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-[10px] font-medium px-1.5 py-px rounded"
                      style={{ background: `${color}12`, color }}
                    >
                      {m.team}
                    </span>
                    <span className="text-[11px] text-gray-400">{m.position}</span>
                  </div>
                </div>
                {hasAssets && (
                  <span
                    className="text-[12px] font-bold w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}10`, color }}
                  >
                    {m.assets.length}
                  </span>
                )}
              </div>

              {/* Equipment list */}
              {hasAssets ? (
                <div className="flex flex-col gap-1.5">
                  {m.assets.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50/80 text-[12px]"
                    >
                      <span className="text-gray-400 shrink-0">
                        <CategoryIcon category={a.category} size={14} />
                      </span>
                      <span className="text-gray-700 font-medium truncate">{a.manufacturer}</span>
                      <span className="text-gray-400 truncate flex-1">{a.model}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[12px] text-gray-300 text-center py-2 bg-gray-50/50 rounded-lg">
                  배정 장비 없음
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-gray-300 text-[13px]">검색 결과가 없습니다</div>
      )}
    </div>
  );
}
