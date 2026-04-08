import { useState, useEffect, useRef } from "react";
import { Monitor, Check, Package, AlertCircle } from "lucide-react";

const cards = [
  { key: "total",   label: "전체 장비",  color: "#0071e3", icon: Monitor,      nav: "assets" },
  { key: "inUse",   label: "사용중",     color: "#1a7f4e", icon: Check,        nav: "assets" },
  { key: "stock",   label: "재고",       color: "#0066cc", icon: Package,      nav: "stock"  },
  { key: "dispose", label: "처분예정",   color: "#d93025", icon: AlertCircle,  nav: "stock"  },
];

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const duration = 700;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <>{display}</>;
}

export default function StatCards({ stats, onNavigate }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mb-7">
      {cards.map(({ key, label, color, icon: Icon, nav }, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <article
            key={key}
            className="bg-white flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
            style={{
              borderRadius: "12px",
              boxShadow: isHovered
                ? `rgba(0, 0, 0, 0.22) 3px 5px 30px 0px`
                : "rgba(0,0,0,0.05) 0 1px 4px",
              transition: "box-shadow 0.25s, transform 0.25s",
              transform: isHovered ? "translateY(-2px)" : "none",
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => onNavigate && onNavigate(nav)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onNavigate && onNavigate(nav)}
          >
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: `${color}12`, color }}
            >
              <Icon size={20} aria-hidden="true" />
            </div>
            <div>
              <div
                className="text-[30px] font-semibold leading-none"
                style={{ color: "#1d1d1f", letterSpacing: "-1px" }}
              >
                <AnimatedNumber value={stats[key]} />
              </div>
              <div
                className="text-[12px] mt-1"
                style={{ color: "rgba(0,0,0,0.48)", letterSpacing: "-0.1px" }}
              >
                {label}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
