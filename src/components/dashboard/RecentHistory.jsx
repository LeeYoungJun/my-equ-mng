import { useState } from "react";
import { ArrowRight } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";

const actionConfig = {
  assign: { label: "배정", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  return: { label: "반납", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  "status-change": { label: "상태변경", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
};

export default function RecentHistory({ history, getAsset, getMember }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const recentHistory = [...history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <article className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-dark">최근 이력</h3>
        <span className="text-[11px] text-gray-400">{history.length}건 기록</span>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gray-100" />

        <div className="flex flex-col">
          {recentHistory.map((h, idx) => {
            const asset = getAsset(h.assetId);
            const member = h.memberId ? getMember(h.memberId) : null;
            const config = actionConfig[h.action] || actionConfig["status-change"];
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={h.id}
                className="flex items-start gap-4 py-2.5 px-2 rounded-xl relative"
                style={{
                  background: isHovered ? "#fafafa" : "transparent",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Timeline dot */}
                <div
                  className="w-[10px] h-[10px] rounded-full shrink-0 mt-1.5 relative z-10 border-2 border-white"
                  style={{
                    background: config.color,
                    boxShadow: isHovered ? `0 0 0 3px ${config.color}22` : "none",
                    transition: "box-shadow 0.2s",
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: config.bg, color: config.color }}
                    >
                      {config.label}
                    </span>
                    <span className="text-[13px] font-medium text-dark">
                      {asset ? (
                        <span className="inline-flex items-center gap-1.5">
                          <CategoryIcon category={asset.category} size={13} />
                          {asset.manufacturer} {asset.model}
                        </span>
                      ) : "삭제된 장비"}
                    </span>
                    {member && (
                      <>
                        <ArrowRight size={12} className="text-gray-300" />
                        <span className="text-[13px] text-gray-500">{member.name}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <time className="text-[11px] text-gray-400">{h.date}</time>
                    {h.note && <span className="text-[11px] text-gray-300">· {h.note}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
