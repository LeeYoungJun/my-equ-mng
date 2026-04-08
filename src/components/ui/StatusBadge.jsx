import { STATUSES, STATUS_COLORS } from "../../data/constants";

const styleMap = {
  success: { bg: "rgba(26,127,78,0.08)", color: "#1a7f4e" },
  info:    { bg: "rgba(0,113,227,0.08)", color: "#0071e3" },
  warning: { bg: "rgba(196,126,0,0.08)", color: "#c47e00" },
  danger:  { bg: "rgba(217,48,37,0.08)", color: "#d93025" },
};

export default function StatusBadge({ status }) {
  const colorKey = STATUS_COLORS[status];
  const style = styleMap[colorKey] || styleMap.info;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
      style={{ background: style.bg, color: style.color, letterSpacing: "-0.1px" }}
      role="status"
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: style.color }}
        aria-hidden="true"
      />
      {STATUSES[status]}
    </span>
  );
}
