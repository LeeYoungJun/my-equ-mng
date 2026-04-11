import { useState, useMemo } from "react";
import { CATEGORIES } from "../../data/constants";
import CategoryIcon from "../ui/CategoryIcon";
import MemberAvatar from "../ui/MemberAvatar";
import { Search } from "lucide-react";

const CATEGORY_COLORS = {
  Desktop:  "#0071e3",
  Laptop:   "#5856d6",
  Monitor:  "#ff2d55",
  Tablet:   "#ff9500",
  Printer:  "#34c759",
  "기타":   "#8e8e93",
};

const TEAM_COLORS = {
  "솔루션팀":        "#0071e3",
  "기술지원팀":      "#34c759",
  "데이터컨설팅팀":  "#ff9500",
};

export default function DashboardPage({ assets, members, getMemberAssets, onMemberClick, onNavigate }) {
  const [hoveredCat, setHoveredCat] = useState(null);
  const [search, setSearch] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const enriched = useMemo(() => {
    return members
      .map((m) => ({ ...m, assets: getMemberAssets(m.id) }))
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
      {/* ── Category Cards ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(155px,1fr))] gap-2.5 mb-8">
        {categorySummary.map((item) => {
          const color = CATEGORY_COLORS[item.cat] || "#0071e3";
          const isHovered = hoveredCat === item.cat;
          return (
            <div
              key={item.cat}
              className="bg-white px-4 py-4 cursor-pointer select-none"
              style={{
                borderRadius: "12px",
                boxShadow: isHovered
                  ? "rgba(0, 0, 0, 0.22) 3px 5px 30px 0px"
                  : "rgba(0,0,0,0.05) 0 1px 4px",
                transition: "box-shadow 0.25s, transform 0.25s",
                transform: isHovered ? "translateY(-2px)" : "none",
              }}
              onMouseEnter={() => setHoveredCat(item.cat)}
              onMouseLeave={() => setHoveredCat(null)}
              onClick={() => onNavigate?.("assets", { category: item.cat })}
              title={`${item.cat} 장비 전체 보기`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center"
                  style={{ background: `${color}12`, color }}
                >
                  <CategoryIcon category={item.cat} size={18} />
                </div>
                <div>
                  <div
                    className="text-[13px] font-semibold"
                    style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}
                  >
                    {item.cat}
                  </div>
                  <div className="text-[11px]" style={{ color: "rgba(0,0,0,0.4)" }}>
                    총 {item.total}대
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div
                  className="flex-1 rounded-[8px] px-2 py-1.5 text-center cursor-pointer transition-opacity hover:opacity-70"
                  style={{ background: "rgba(52,199,89,0.08)" }}
                  onClick={(e) => { e.stopPropagation(); onNavigate?.("assets", { category: item.cat, status: "in-use" }); }}
                  title="사용중 장비 보기"
                >
                  <div className="text-[15px] font-semibold" style={{ color: "#1a7f4e", letterSpacing: "-0.5px" }}>{item.inUse}</div>
                  <div className="text-[10px] font-medium" style={{ color: "#1a7f4e" }}>사용중</div>
                </div>
                <div
                  className="flex-1 rounded-[8px] px-2 py-1.5 text-center cursor-pointer transition-opacity hover:opacity-70"
                  style={{ background: "rgba(0,113,227,0.08)" }}
                  onClick={(e) => { e.stopPropagation(); onNavigate?.("assets", { category: item.cat, status: "stock" }); }}
                  title="재고 장비 보기"
                >
                  <div className="text-[15px] font-semibold" style={{ color: "#0071e3", letterSpacing: "-0.5px" }}>{item.stock}</div>
                  <div className="text-[10px] font-medium" style={{ color: "#0071e3" }}>재고</div>
                </div>
                {(item.repair > 0 || item.dispose > 0) && (
                  <div
                    className="flex-1 rounded-[8px] px-2 py-1.5 text-center cursor-pointer transition-opacity hover:opacity-70"
                    style={{ background: "rgba(217,48,37,0.08)" }}
                    onClick={(e) => { e.stopPropagation(); onNavigate?.("assets", { category: item.cat, status: "repair" }); }}
                    title="수리/처분 장비 보기"
                  >
                    <div className="text-[15px] font-semibold" style={{ color: "#d93025", letterSpacing: "-0.5px" }}>{item.repair + item.dispose}</div>
                    <div className="text-[10px] font-medium" style={{ color: "#d93025" }}>기타</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Member Equipment ── */}
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="text-[15px] font-semibold"
          style={{ color: "#1d1d1f", letterSpacing: "-0.3px" }}
        >
          팀원별 장비현황
        </h2>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(0,0,0,0.3)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 팀, 직급 검색..."
            className="pl-8 pr-3 py-1.5 text-[12px] outline-none w-52 font-[inherit]"
            style={{
              borderRadius: "11px",
              border: "1.5px solid rgba(0,0,0,0.1)",
              background: "#fafafc",
              color: "#1d1d1f",
              letterSpacing: "-0.1px",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0071e3")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.1)")}
          />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5">
        {filtered.map((m) => {
          const color = TEAM_COLORS[m.team] || "#0071e3";
          const isHovered = hoveredCard === m.id;
          const hasAssets = m.assets.length > 0;

          return (
            <div
              key={m.id}
              className="bg-white p-4 cursor-pointer"
              style={{
                borderRadius: "12px",
                boxShadow: isHovered
                  ? "rgba(0, 0, 0, 0.22) 3px 5px 30px 0px"
                  : "rgba(0,0,0,0.05) 0 1px 4px",
                transition: "box-shadow 0.25s, transform 0.25s",
                transform: isHovered ? "translateY(-2px)" : "none",
              }}
              onMouseEnter={() => setHoveredCard(m.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onMemberClick(m)}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <MemberAvatar
                  member={m}
                  className="w-9 h-9 rounded-full shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
                  textClass="text-[13px] font-semibold"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[14px] font-semibold truncate"
                    style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}
                  >
                    {m.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-[10px] font-medium px-1.5 py-px rounded-[4px]"
                      style={{ background: `${color}12`, color }}
                    >
                      {m.team}
                    </span>
                    <span className="text-[11px]" style={{ color: "rgba(0,0,0,0.4)" }}>{m.position}</span>
                  </div>
                </div>
                {hasAssets && (
                  <span
                    className="text-[12px] font-semibold w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0"
                    style={{ background: `${color}10`, color }}
                  >
                    {m.assets.length}
                  </span>
                )}
              </div>

              {hasAssets ? (
                <div className="flex flex-col gap-1">
                  {m.assets.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-[12px]"
                      style={{ background: "#f5f5f7" }}
                    >
                      <span style={{ color: "rgba(0,0,0,0.4)" }} className="shrink-0">
                        <CategoryIcon category={a.category} size={13} />
                      </span>
                      <span className="font-medium truncate" style={{ color: "#1d1d1f" }}>{a.manufacturer}</span>
                      <span className="truncate flex-1" style={{ color: "rgba(0,0,0,0.48)" }}>{a.model}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-[12px] text-center py-2 rounded-[8px]"
                  style={{ background: "#f5f5f7", color: "rgba(0,0,0,0.3)" }}
                >
                  배정 장비 없음
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-[13px]" style={{ color: "rgba(0,0,0,0.3)" }}>
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}
