import { Package } from "lucide-react";

export default function EmptyState({ icon: Icon = Package, message = "데이터가 없습니다" }) {
  return (
    <div className="py-16 text-center text-gray-400">
      <Icon size={40} strokeWidth={1} className="mx-auto mb-3 opacity-40" aria-hidden="true" />
      <div className="text-sm">{message}</div>
    </div>
  );
}
