import { useState, useEffect, useRef } from "react";
import { Monitor, Check, Package, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

const cards = [
  { key: "total", label: "전체 장비", color: "#6366f1", bgColor: "rgba(99,102,241,0.12)", icon: Monitor, nav: "assets" },
  { key: "inUse", label: "사용중", color: "#10b981", bgColor: "rgba(16,185,129,0.12)", icon: Check, nav: "assets" },
  { key: "stock", label: "재고", color: "#3b82f6", bgColor: "rgba(59,130,246,0.12)", icon: Package, nav: "stock" },
  { key: "dispose", label: "처분예정", color: "#ef4444", bgColor: "rgba(239,68,68,0.12)", icon: AlertCircle, nav: "stock" },
];

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <>{display}</>;
}

export default function StatCards({ stats, onNavigate }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-7">
      {cards.map(({ key, label, color, bgColor, icon: Icon, nav }, idx) => (
        <article
          key={key}
          className="bg-white rounded-2xl px-6 py-5 border border-gray-100 flex items-center gap-4 cursor-pointer select-none"
          style={{
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: hoveredIdx === idx ? "translateY(-4px) scale(1.02)" : "translateY(0)",
            boxShadow: hoveredIdx === idx ? `0 12px 32px ${color}22` : "0 1px 3px rgba(0,0,0,0.04)",
            borderColor: hoveredIdx === idx ? `${color}44` : undefined,
          }}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
          onClick={() => onNavigate && onNavigate(nav)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigate && onNavigate(nav)}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: bgColor,
              color: color,
              transition: "transform 0.3s",
              transform: hoveredIdx === idx ? "scale(1.1) rotate(-5deg)" : "scale(1)",
            }}
          >
            <Icon size={22} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[28px] font-extrabold leading-none" style={{ color: hoveredIdx === idx ? color : "#1a1a2e" }}>
              <AnimatedNumber value={stats[key]} />
            </div>
            <div className="text-xs text-gray-400 mt-1 font-medium">{label}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
