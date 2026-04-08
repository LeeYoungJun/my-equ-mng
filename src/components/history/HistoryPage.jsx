export default function HistoryPage({ history, getAsset, getMember }) {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

  const actionConfig = {
    assign:          { label: "배정",     bg: "rgba(26,127,78,0.08)",   color: "#1a7f4e" },
    return:          { label: "반납",     bg: "rgba(196,126,0,0.08)",   color: "#c47e00" },
    "status-change": { label: "상태변경", bg: "rgba(0,113,227,0.08)",   color: "#0071e3" },
  };

  return (
    <div
      className="bg-white overflow-hidden"
      style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.05) 0 1px 4px" }}
    >
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            {["날짜", "유형", "장비", "사용자", "메모"].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 font-semibold text-[11px]"
                style={{ color: "rgba(0,0,0,0.4)", background: "#f5f5f7" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((h) => {
            const asset = getAsset(h.assetId);
            const member = h.memberId ? getMember(h.memberId) : null;
            const config = actionConfig[h.action] || actionConfig["status-change"];
            return (
              <tr
                key={h.id}
                style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f7")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                <td className="px-4 py-2.5">
                  <time style={{ color: "rgba(0,0,0,0.48)" }}>{h.date}</time>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.label}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-medium" style={{ color: "#1d1d1f" }}>
                  {asset ? `${asset.manufacturer} ${asset.model}` : "삭제된 장비"}
                </td>
                <td className="px-4 py-2.5" style={{ color: "rgba(0,0,0,0.48)" }}>{member?.name || "-"}</td>
                <td className="px-4 py-2.5 text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>{h.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
