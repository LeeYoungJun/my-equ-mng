import { useState } from "react";
import { CATEGORIES } from "../../data/constants";
import CategoryIcon from "../ui/CategoryIcon";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

export default function CategoryChart({ stats }) {
  const [hovered, setHovered] = useState(null);

  const items = CATEGORIES.filter((c) => stats.byCategory[c] > 0).map((cat, i) => ({
    cat,
    count: stats.byCategory[cat],
    color: COLORS[i % COLORS.length],
  }));

  const total = stats.total || 1;
  const radius = 70;
  const stroke = 22;
  const center = 90;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const segments = items.map((item) => {
    const ratio = item.count / total;
    const offset = accumulated;
    accumulated += ratio;
    return { ...item, ratio, offset };
  });

  return (
    <article className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="mb-4 text-[15px] font-bold text-dark">카테고리별 장비</h3>
      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: 180, height: 180 }}>
          <svg width={180} height={180} viewBox="0 0 180 180">
            {segments.map((seg) => {
              const dashLength = seg.ratio * circumference;
              const gapLength = circumference - dashLength;
              const rotation = seg.offset * 360 - 90;
              const isHovered = hovered === seg.cat;

              return (
                <circle
                  key={seg.cat}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHovered ? stroke + 4 : stroke}
                  strokeDasharray={`${dashLength} ${gapLength}`}
                  strokeLinecap="round"
                  transform={`rotate(${rotation} ${center} ${center})`}
                  style={{
                    transition: "all 0.3s ease",
                    opacity: hovered && !isHovered ? 0.4 : 1,
                    cursor: "pointer",
                    filter: isHovered ? `drop-shadow(0 0 8px ${seg.color}66)` : "none",
                  }}
                  onMouseEnter={() => setHovered(seg.cat)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hovered ? (
              <>
                <div className="text-2xl font-extrabold" style={{ color: segments.find((s) => s.cat === hovered)?.color }}>
                  {segments.find((s) => s.cat === hovered)?.count}
                </div>
                <div className="text-xs text-gray-400">{hovered}</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-extrabold text-dark">{total}</div>
                <div className="text-xs text-gray-400">전체</div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {segments.map((seg) => (
            <div
              key={seg.cat}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer"
              style={{
                background: hovered === seg.cat ? `${seg.color}10` : "transparent",
                transition: "background 0.2s",
              }}
              onMouseEnter={() => setHovered(seg.cat)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="text-gray-500">
                <CategoryIcon category={seg.cat} size={16} />
              </div>
              <span className="text-[13px] text-gray-600 flex-1">{seg.cat}</span>
              <div className="w-16 h-1.5 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${seg.ratio * 100}%`,
                    background: seg.color,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <span className="text-[13px] font-bold text-dark w-6 text-right">{seg.count}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
