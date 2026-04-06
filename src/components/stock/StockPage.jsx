import { UserPlus } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";

function StockTable({ items, title, emptyMsg, onAssign }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 mb-5">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-dark">
          {title} <span className="text-gray-400 font-normal text-[13px]">({items.length})</span>
        </h3>
      </div>
      {items.length > 0 ? (
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["카테고리", "제조사", "모델명", "세부사양", "비고", "액션"].map((h) => (
                <th key={h} className="text-left px-3.5 py-2.5 text-gray-400 font-semibold text-[11px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-b border-gray-50">
                <td className="px-3.5 py-2.5">
                  <span className="flex items-center gap-2 text-gray-500">
                    <CategoryIcon category={a.category} size={16} />
                    {a.category}
                  </span>
                </td>
                <td className="px-3.5 py-2.5 text-gray-500">{a.manufacturer}</td>
                <td className="px-3.5 py-2.5 font-semibold text-dark">{a.model}</td>
                <td className="px-3.5 py-2.5 text-gray-400 text-xs max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{a.spec || "-"}</td>
                <td className="px-3.5 py-2.5 text-gray-400 text-xs">{a.note || "-"}</td>
                <td className="px-3.5 py-2.5">
                  {a.status === "stock" && onAssign && (
                    <button
                      onClick={() => onAssign(a.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-dark text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
                      aria-label={`${a.model} 배정`}
                    >
                      <UserPlus size={12} aria-hidden="true" />
                      배정
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="py-10 text-center text-gray-400 text-[13px]">{emptyMsg}</div>
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
