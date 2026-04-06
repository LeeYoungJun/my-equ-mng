import { STATUSES, STATUS_COLORS } from "../../data/constants";

const colorMap = {
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

const dotMap = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorMap[color]}`}
      role="status"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[color]}`} aria-hidden="true" />
      {STATUSES[status]}
    </span>
  );
}
