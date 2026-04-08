import { X } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import StatusBadge from "../ui/StatusBadge";

export default function AssetDetail({ asset, getMember, getAssetHistory, onClose }) {
  const member = asset.assignedTo ? getMember(asset.assignedTo) : null;
  const assetHist = getAssetHistory(asset.id);

  return (
    <aside
      className="fixed right-0 top-0 bottom-0 w-[420px] bg-white z-[500] overflow-auto"
      style={{ boxShadow: "-1px 0 0 rgba(0,0,0,0.06), rgba(0,0,0,0.12) -8px 0 32px" }}
      role="complementary"
      aria-label="장비 상세 정보"
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between sticky top-0 bg-white z-10"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <h3
          className="text-[17px] font-semibold"
          style={{ color: "#1d1d1f", letterSpacing: "-0.3px" }}
        >
          장비 상세
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full border-none cursor-pointer transition-colors"
          style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.48)" }}
          aria-label="닫기"
        >
          <X size={15} />
        </button>
      </div>

      <div className="px-6 py-5">
        {/* Hero */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-[12px]" style={{ background: "#f5f5f7" }}>
          <div
            className="w-14 h-14 rounded-[14px] flex items-center justify-center"
            style={{ background: "rgba(0,113,227,0.1)", color: "#0071e3" }}
          >
            <CategoryIcon category={asset.category} size={26} />
          </div>
          <div>
            <div
              className="text-[18px] font-semibold"
              style={{ color: "#1d1d1f", letterSpacing: "-0.4px", lineHeight: 1.2 }}
            >
              {asset.model}
            </div>
            <div className="text-[13px] mt-0.5" style={{ color: "rgba(0,0,0,0.48)" }}>
              {asset.manufacturer} · {asset.category}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <dl className="grid grid-cols-2 gap-3 mb-6">
          {[
            ["상태", <StatusBadge key="s" status={asset.status} />],
            ["사용자", member?.name || (asset.isShared ? asset.sharedLabel : "미배정")],
            ["S/N", asset.serial || "-"],
            ["구입일", asset.purchaseDate || "-"],
          ].map(([label, value]) => (
            <div key={label} className="p-3 rounded-[10px]" style={{ background: "#f5f5f7" }}>
              <dt className="text-[11px] font-semibold mb-1.5" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>
                {label}
              </dt>
              <dd className="text-[13px] font-medium m-0" style={{ color: "#1d1d1f" }}>{value}</dd>
            </div>
          ))}
        </dl>

        {/* Spec */}
        <div className="mb-5">
          <h4 className="text-[11px] font-semibold mb-2" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>
            세부사양
          </h4>
          <div
            className="p-3.5 rounded-[10px] text-[13px] leading-relaxed whitespace-pre-wrap"
            style={{ background: "#f5f5f7", color: "rgba(0,0,0,0.6)" }}
          >
            {asset.spec || "-"}
          </div>
        </div>

        {/* Note */}
        {asset.note && (
          <div className="mb-5">
            <h4 className="text-[11px] font-semibold mb-2" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>
              비고
            </h4>
            <div
              className="p-3.5 rounded-[10px] text-[13px]"
              style={{ background: "rgba(255,149,0,0.07)", color: "rgba(0,0,0,0.6)" }}
            >
              {asset.note}
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h4
            className="text-[13px] font-semibold mb-3"
            style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}
          >
            이력
          </h4>
          {assetHist.length > 0 ? (
            assetHist.map((h) => {
              const hmember = h.memberId ? getMember(h.memberId) : null;
              return (
                <div
                  key={h.id}
                  className="flex gap-3 py-2.5 text-[12px]"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <time className="w-20 shrink-0" style={{ color: "rgba(0,0,0,0.4)" }}>{h.date}</time>
                  <span
                    className="font-semibold w-10 shrink-0"
                    style={{ color: h.action === "assign" ? "#1a7f4e" : "#c47e00" }}
                  >
                    {h.action === "assign" ? "배정" : "반납"}
                  </span>
                  <span style={{ color: "rgba(0,0,0,0.6)" }}>{hmember?.name || "-"}</span>
                  <span className="ml-auto" style={{ color: "rgba(0,0,0,0.3)" }}>{h.note}</span>
                </div>
              );
            })
          ) : (
            <div className="py-5 text-center text-[13px]" style={{ color: "rgba(0,0,0,0.3)" }}>
              이력 없음
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
