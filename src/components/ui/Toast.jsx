import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  const ok = toast.type === "success";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        borderRadius: "12px",
        background: "#fff",
        border: `1px solid ${ok ? "rgba(26,127,78,0.2)" : "rgba(217,48,37,0.2)"}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        minWidth: "260px",
        maxWidth: "400px",
        fontSize: "13px",
        fontWeight: 500,
        color: "#1d1d1f",
        letterSpacing: "-0.1px",
      }}
    >
      {ok ? (
        <CheckCircle size={16} style={{ color: "#1a7f4e", flexShrink: 0 }} />
      ) : (
        <XCircle size={16} style={{ color: "#d93025", flexShrink: 0 }} />
      )}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "rgba(0,0,0,0.3)",
          padding: "2px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
