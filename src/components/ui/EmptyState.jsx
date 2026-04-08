import { Package } from "lucide-react";

export default function EmptyState({ icon: Icon = Package, message = "데이터가 없습니다" }) {
  return (
    <div className="py-16 text-center">
      <Icon size={36} strokeWidth={1.2} className="mx-auto mb-3" style={{ color: "rgba(0,0,0,0.2)" }} aria-hidden="true" />
      <div className="text-[13px]" style={{ color: "rgba(0,0,0,0.3)", letterSpacing: "-0.1px" }}>{message}</div>
    </div>
  );
}
