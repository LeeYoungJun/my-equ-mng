import { X } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import StatusBadge from "../ui/StatusBadge";

export default function AssetDetail({ asset, getMember, getAssetHistory, onClose }) {
  const member = asset.assignedTo ? getMember(asset.assignedTo) : null;
  const assetHist = getAssetHistory(asset.id);

  return (
    <aside
      className="fixed right-0 top-0 bottom-0 w-[440px] bg-white shadow-[-8px_0_40px_rgba(0,0,0,0.1)] z-[500] overflow-auto"
      role="complementary"
      aria-label="장비 상세 정보"
    >
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-dark">장비 상세</h3>
        <button onClick={onClose} className="p-1 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600" aria-label="닫기">
          <X size={20} />
        </button>
      </div>
      <div className="px-6 py-5">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <CategoryIcon category={asset.category} size={28} />
          </div>
          <div>
            <div className="text-lg font-bold text-dark">{asset.model}</div>
            <div className="text-[13px] text-gray-400">{asset.manufacturer} · {asset.category}</div>
          </div>
        </div>

        {/* Info grid */}
        <dl className="grid grid-cols-2 gap-3.5 mb-6">
          {[
            ["상태", <StatusBadge key="s" status={asset.status} />],
            ["사용자", member?.name || (asset.isShared ? asset.sharedLabel : "미배정")],
            ["S/N", asset.serial || "-"],
            ["구입일", asset.purchaseDate || "-"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] text-gray-400 font-semibold mb-1">{label}</dt>
              <dd className="text-[13px] text-gray-700 font-medium m-0">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Spec */}
        <div className="mb-6">
          <h4 className="text-[11px] text-gray-400 font-semibold mb-1.5">세부사양</h4>
          <div className="p-3.5 bg-gray-50 rounded-xl text-[13px] text-gray-500 leading-relaxed whitespace-pre-wrap">{asset.spec || "-"}</div>
        </div>

        {/* Note */}
        {asset.note && (
          <div className="mb-6">
            <h4 className="text-[11px] text-gray-400 font-semibold mb-1.5">비고</h4>
            <div className="p-3.5 bg-orange-50 rounded-xl text-[13px] text-gray-500">{asset.note}</div>
          </div>
        )}

        {/* History */}
        <div>
          <h4 className="text-[13px] font-bold text-dark mb-3">이력</h4>
          {assetHist.length > 0 ? (
            assetHist.map((h) => {
              const hmember = h.memberId ? getMember(h.memberId) : null;
              return (
                <div key={h.id} className="flex gap-3 py-2.5 border-b border-gray-50 text-xs">
                  <time className="text-gray-400 w-20">{h.date}</time>
                  <span className={`font-semibold w-10 ${h.action === "assign" ? "text-success" : "text-warning"}`}>
                    {h.action === "assign" ? "배정" : "반납"}
                  </span>
                  <span className="text-gray-500">{hmember?.name || "-"}</span>
                  <span className="text-gray-300 ml-auto">{h.note}</span>
                </div>
              );
            })
          ) : (
            <div className="py-5 text-center text-gray-300 text-[13px]">이력 없음</div>
          )}
        </div>
      </div>
    </aside>
  );
}
