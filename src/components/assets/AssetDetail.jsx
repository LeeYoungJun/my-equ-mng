import { X, Wrench, Clock } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import StatusBadge from "../ui/StatusBadge";

export default function AssetDetail({ asset, getMember, getAssetHistory, onClose }) {
  const member = asset.assignedTo ? getMember(asset.assignedTo) : null;
  const assetHist = getAssetHistory(asset.id);

  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = asset.dueDate && asset.status === "in-use" && asset.dueDate < todayStr;

  const warrantyExpired = asset.warrantyExpiry && new Date(asset.warrantyExpiry) < new Date();
  const warrantyExpiring = asset.warrantyExpiry && !warrantyExpired && (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return new Date(asset.warrantyExpiry) < d;
  })();

  const hasRepairInfo = asset.status === "repair" && (asset.repairVendor || asset.repairStartDate || asset.repairExpectedDate);

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
          <div className="p-3 rounded-[10px]" style={{ background: "#f5f5f7" }}>
            <dt className="text-[11px] font-semibold mb-1.5" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>상태</dt>
            <dd className="text-[13px] font-medium m-0" style={{ color: "#1d1d1f" }}>
              <StatusBadge status={asset.status} />
            </dd>
          </div>
          <div className="p-3 rounded-[10px]" style={{ background: "#f5f5f7" }}>
            <dt className="text-[11px] font-semibold mb-1.5" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>사용자</dt>
            <dd className="text-[13px] font-medium m-0" style={{ color: "#1d1d1f" }}>
              {member?.name || (asset.isShared ? asset.sharedLabel : "미배정")}
            </dd>
          </div>
          <div className="p-3 rounded-[10px]" style={{ background: "#f5f5f7" }}>
            <dt className="text-[11px] font-semibold mb-1.5" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>S/N</dt>
            <dd className="text-[13px] font-medium m-0 font-mono" style={{ color: "#1d1d1f", fontSize: "12px" }}>
              {asset.serial || "-"}
            </dd>
          </div>
          <div className="p-3 rounded-[10px]" style={{ background: "#f5f5f7" }}>
            <dt className="text-[11px] font-semibold mb-1.5" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>구입일</dt>
            <dd className="text-[13px] font-medium m-0" style={{ color: "#1d1d1f" }}>
              {asset.purchaseDate || "-"}
            </dd>
          </div>
          {asset.warrantyExpiry && (
            <div className="p-3 rounded-[10px]" style={{ background: warrantyExpired ? "rgba(217,48,37,0.06)" : warrantyExpiring ? "rgba(0,113,227,0.06)" : "#f5f5f7" }}>
              <dt className="text-[11px] font-semibold mb-1.5" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>보증 만료일</dt>
              <dd className="text-[13px] font-medium m-0" style={{ color: warrantyExpired ? "#d93025" : warrantyExpiring ? "#0071e3" : "#1d1d1f" }}>
                {asset.warrantyExpiry}
                {warrantyExpired && <span className="ml-1 text-[11px]">(만료)</span>}
                {warrantyExpiring && <span className="ml-1 text-[11px]">(임박)</span>}
              </dd>
            </div>
          )}
          {asset.dueDate && (
            <div className="p-3 rounded-[10px]" style={{ background: isOverdue ? "rgba(217,48,37,0.06)" : "rgba(26,127,78,0.06)" }}>
              <dt className="text-[11px] font-semibold mb-1.5" style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "-0.1px" }}>반납 예정일</dt>
              <dd className="flex items-center gap-1.5 text-[13px] font-medium m-0" style={{ color: isOverdue ? "#d93025" : "#1a7f4e" }}>
                <Clock size={12} />
                {asset.dueDate}
                {isOverdue && <span className="text-[11px]">(기한 초과)</span>}
              </dd>
            </div>
          )}
        </dl>

        {/* Repair info */}
        {hasRepairInfo && (
          <div className="mb-5">
            <h4
              className="flex items-center gap-1.5 text-[13px] font-semibold mb-3"
              style={{ color: "#0071e3", letterSpacing: "-0.2px" }}
            >
              <Wrench size={13} />
              수리 정보
            </h4>
            <div className="p-3.5 rounded-[10px] flex flex-col gap-2" style={{ background: "rgba(0,113,227,0.04)", border: "1px solid rgba(0,113,227,0.1)" }}>
              {asset.repairVendor && (
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: "rgba(0,0,0,0.4)" }}>수리 업체</span>
                  <span style={{ color: "#1d1d1f", fontWeight: 500 }}>{asset.repairVendor}</span>
                </div>
              )}
              {asset.repairStartDate && (
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: "rgba(0,0,0,0.4)" }}>수리 접수일</span>
                  <span style={{ color: "#1d1d1f", fontWeight: 500 }}>{asset.repairStartDate}</span>
                </div>
              )}
              {asset.repairExpectedDate && (
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: "rgba(0,0,0,0.4)" }}>반환 예정일</span>
                  <span style={{ color: asset.repairExpectedDate < new Date().toISOString().split("T")[0] ? "#d93025" : "#1d1d1f", fontWeight: 500 }}>
                    {asset.repairExpectedDate}
                    {asset.repairExpectedDate < new Date().toISOString().split("T")[0] && <span className="ml-1 text-[11px]">(지연)</span>}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

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
