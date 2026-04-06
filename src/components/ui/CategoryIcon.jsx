import { Server, Laptop, Monitor, Tablet, Printer, Box } from "lucide-react";

const icons = {
  Desktop: Server,
  Laptop: Laptop,
  Monitor: Monitor,
  Tablet: Tablet,
  Printer: Printer,
};

export default function CategoryIcon({ category, size = 18, className = "" }) {
  const Icon = icons[category] || Box;
  return <Icon size={size} strokeWidth={1.5} className={className} aria-hidden="true" />;
}
