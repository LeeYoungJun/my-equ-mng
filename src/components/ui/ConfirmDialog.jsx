import { useEffect } from "react";
import { AlertTriangle, Info } from "lucide-react";

export default function ConfirmDialog({ config, onClose }) {
  useEffect(() => {
    if (!config) return;
    const handler = (e) => { if (e.key === "Escape") onClose(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [config, onClose]);

  if (!config) return null;

  const isDanger = config.type === "danger";

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={() => onClose(false)}
    >
      <div
        className="bg-white rounded-[16px] p-6 w-[360px] mx-4"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: isDanger ? "rgba(217,48,37,0.1)" : "rgba(0,113,227,0.1)" }}
          >
            {isDanger
              ? <AlertTriangle size={17} style={{ color: "#d93025" }} />
              : <Info size={17} style={{ color: "#0071e3" }} />
            }
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            {config.title && (
              <div className="text-[15px] font-semibold mb-1.5" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
                {config.title}
              </div>
            )}
            <div className="text-[13px] leading-relaxed" style={{ color: "rgba(0,0,0,0.6)", whiteSpace: "pre-line" }}>
              {config.message}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          {!config.alertOnly && (
            <button
              onClick={() => onClose(false)}
              className="px-4 py-2 text-[13px] font-medium cursor-pointer border-none rounded-[8px] transition-opacity hover:opacity-80"
              style={{ background: "rgba(0,0,0,0.06)", color: "#1d1d1f" }}
            >
              {config.cancelLabel || "취소"}
            </button>
          )}
          <button
            autoFocus
            onClick={() => onClose(true)}
            className="px-4 py-2 text-[13px] font-medium cursor-pointer border-none rounded-[8px] transition-opacity hover:opacity-85"
            style={{ background: isDanger ? "#d93025" : "#0071e3", color: "#fff" }}
          >
            {config.confirmLabel || (config.alertOnly ? "확인" : isDanger ? "삭제" : "확인")}
          </button>
        </div>
      </div>
    </div>
  );
}
