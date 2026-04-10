import { UserPlus } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";

function StockTable({ items, title, emptyMsg, onAssign }) {
  return (
    <section
      className="bg-white mb-4 overflow-hidden"
      style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.05) 0 1px 4px" }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <h3 className="text-[14px] font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
          {title}{" "}
          <span className="text-[12px] font-normal" style={{ color: "rgba(0,0,0,0.4)" }}>
            ({items.length})
          </span>
        </h3>
      </div>
      {items.length > 0 ? (
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {["카테고리", "제조사", "모델명", "세부사양", "비고", "배정"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 font-semibold text-[11px]"
                  style={{ color: "rgba(0,0,0,0.4)", background: "#f5f5f7" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr
                key={a.id}
                style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f7")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2" style={{ color: "rgba(0,0,0,0.48)" }}>
                    <CategoryIcon category={a.category} size={15} />
                    {a.category}
                  </span>
                </td>
                <td className="px-4 py-2.5" style={{ color: "rgba(0,0,0,0.48)" }}>{a.manufacturer}</td>
                <td className="px-4 py-2.5 font-semibold" style={{ color: "#1d1d1f" }}>{a.model}</td>
                <td
                  className="px-4 py-2.5 text-[12px] max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ color: "rgba(0,0,0,0.4)" }}
                >
                  {a.spec || "-"}
                </td>
                <td className="px-4 py-2.5 text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>{a.note || "-"}</td>
                <td className="px-4 py-2.5">
                  {a.status === "stock" && onAssign && (
                    <button
                      onClick={() => onAssign(a.id)}
                      className="px-3 py-1.5 text-[12px] font-medium cursor-pointer flex items-center gap-1 border-none transition-opacity hover:opacity-80"
                      style={{ borderRadius: "8px", background: "#0071e3", color: "#fff" }}
                      aria-label={`${a.model} 배정`}
                    >
                      <UserPlus size={12} aria-hidden="true" />
                      팀원
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="py-10 text-center text-[13px]" style={{ color: "rgba(0,0,0,0.3)" }}>
          {emptyMsg}
        </div>
      )}
    </section>
  );
}

export default function StockPage({ assets, onAssign }) {
  const stockAssets = assets.filter((a) => a.status === "stock");
  const repairAssets = assets.filter((a) => a.status === "repair");
  const disposeAssets = assets.filter((a) => a.status === "dispose");

  return (
    <div>
      <StockTable items={stockAssets} title="재고 장비" emptyMsg="재고 장비가 없습니다" onAssign={onAssign} />
      <StockTable items={repairAssets} title="수리중" emptyMsg="수리중인 장비가 없습니다" />
      <StockTable items={disposeAssets} title="처분 예정" emptyMsg="처분 예정 장비가 없습니다" />
    </div>
  );
}
