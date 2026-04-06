import { useState } from "react";

const STATUS_CONFIG = [
  { key: "inUse", label: "사용중", color: "#10b981" },
  { key: "stock", label: "재고", color: "#3b82f6" },
  { key: "repair", label: "수리중", color: "#f59e0b" },
  { key: "dispose", label: "처분예정", color: "#ef4444" },
];

export default function StatusDonutChart({ stats }) {
  const [hovered, setHovered] = useState(null);

  const total = stats.total || 1;
  const radius = 70;
  const stroke = 22;
  const center = 90;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const segments = STATUS_CONFIG.filter((s) => stats[s.key] > 0).map((s) => {
    const ratio = stats[s.key] / total;
    const offset = accumulated;
    accumulated += ratio;
    return { ...s, ratio, offset, value: stats[s.key] };
  });

  return (
    <article className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="mb-4 text-[15px] font-bold text-dark">상태별 분포</h3>
      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: 180, height: 180 }}>
          <svg width={180} height={180} viewBox="0 0 180 180">
            {segments.map((seg, i) => {
              const dashLength = seg.ratio * circumference;
              const gapLength = circumference - dashLength;
              const rotation = seg.offset * 360 - 90;
              const isHovered = hovered === seg.key;

              return (
                <circle
                  key={seg.key}
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
                  onMouseEnter={() => setHovered(seg.key)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ transition: "all 0.2s" }}
          >
            {hovered ? (
              <>
                <div className="text-2xl font-extrabold" style={{ color: segments.find((s) => s.key === hovered)?.color }}>
                  {segments.find((s) => s.key === hovered)?.value}
                </div>
                <div className="text-xs text-gray-400">{segments.find((s) => s.key === hovered)?.label}</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-extrabold text-dark">{total}</div>
                <div className="text-xs text-gray-400">전체</div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          {segments.map((seg) => (
            <div
              key={seg.key}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer"
              style={{
                background: hovered === seg.key ? `${seg.color}10` : "transparent",
                transition: "background 0.2s",
              }}
              onMouseEnter={() => setHovered(seg.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
              <span className="text-[13px] text-gray-600 flex-1">{seg.label}</span>
              <span className="text-[13px] font-bold text-dark">{seg.value}</span>
              <span className="text-[11px] text-gray-400">{Math.round(seg.ratio * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
