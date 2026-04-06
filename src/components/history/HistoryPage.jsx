export default function HistoryPage({ history, getAsset, getMember }) {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

  const actionConfig = {
    assign: { label: "배정", color: "bg-success/10 text-success" },
    return: { label: "반납", color: "bg-warning/10 text-warning" },
    "status-change": { label: "상태변경", color: "bg-primary/10 text-primary" },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-100">
            {["날짜", "유형", "장비", "사용자", "메모"].map((h) => (
              <th key={h} className="text-left px-3.5 py-3 text-gray-400 font-semibold text-[11px]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((h) => {
            const asset = getAsset(h.assetId);
            const member = h.memberId ? getMember(h.memberId) : null;
            const config = actionConfig[h.action] || actionConfig["status-change"];
            return (
              <tr key={h.id} className="border-b border-gray-50">
                <td className="px-3.5 py-2.5 text-gray-500">
                  <time>{h.date}</time>
                </td>
                <td className="px-3.5 py-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${config.color}`}>{config.label}</span>
                </td>
                <td className="px-3.5 py-2.5 font-medium text-dark">{asset ? `${asset.manufacturer} ${asset.model}` : "삭제된 장비"}</td>
                <td className="px-3.5 py-2.5 text-gray-500">{member?.name || "-"}</td>
                <td className="px-3.5 py-2.5 text-gray-400 text-xs">{h.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
