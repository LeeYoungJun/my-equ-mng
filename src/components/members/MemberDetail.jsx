import { X } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import MemberAvatar from "../ui/MemberAvatar";

export default function MemberDetail({ member, getMemberAssets, history, getAsset, getMember, onAssetClick, onClose }) {
  const mAssets = getMemberAssets(member.id);
  const memberHist = history.filter((h) => h.memberId === member.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <aside
      className="fixed right-0 top-0 bottom-0 w-[420px] bg-white z-[500] overflow-auto"
      style={{ boxShadow: "-1px 0 0 rgba(0,0,0,0.06), rgba(0,0,0,0.12) -8px 0 32px" }}
      role="complementary"
      aria-label="팀원 상세 정보"
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between sticky top-0 bg-white z-10"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <h3 className="text-[17px] font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.3px" }}>
          팀원 상세
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
          <MemberAvatar
            member={member}
            className="w-14 h-14 rounded-full shrink-0"
            style={{ background: "linear-gradient(135deg, #0071e3, #2997ff)" }}
            textClass="text-[22px] font-semibold"
          />
          <div>
            <div className="text-[18px] font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.4px", lineHeight: 1.2 }}>
              {member.name}
            </div>
            <div className="text-[13px] mt-0.5" style={{ color: "rgba(0,0,0,0.48)" }}>
              {member.team} · {member.position}
            </div>
          </div>
        </div>

        {/* Assigned assets */}
        <section className="mb-6">
          <h4 className="text-[13px] font-semibold mb-3" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
            배정 장비{" "}
            <span style={{ color: "rgba(0,0,0,0.4)", fontWeight: 400 }}>({mAssets.length})</span>
          </h4>
          {mAssets.length > 0 ? (
            mAssets.map((a) => (
              <button
                key={a.id}
                className="flex items-center gap-3 px-4 py-3 rounded-[10px] mb-2 cursor-pointer w-full text-left border-none transition-colors"
                style={{ background: "#f5f5f7" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#ebebed")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f5f7")}
                onClick={() => onAssetClick(a)}
                aria-label={`${a.manufacturer} ${a.model} 상세 보기`}
              >
                <span style={{ color: "#0071e3" }}>
                  <CategoryIcon category={a.category} size={17} />
                </span>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: "#1d1d1f" }}>
                    {a.manufacturer} {a.model}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>{a.spec}</div>
                </div>
              </button>
            ))
          ) : (
            <div
              className="py-5 text-center text-[13px] rounded-[10px]"
              style={{ background: "#f5f5f7", color: "rgba(0,0,0,0.3)" }}
            >
              배정된 장비 없음
            </div>
          )}
        </section>

        {/* History */}
        <section>
          <h4 className="text-[13px] font-semibold mb-3" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
            이력
          </h4>
          {memberHist.length > 0 ? (
            memberHist.map((h) => {
              const asset = getAsset(h.assetId);
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
                  <span style={{ color: "rgba(0,0,0,0.6)" }}>{asset?.model || "알 수 없음"}</span>
                </div>
              );
            })
          ) : (
            <div className="py-5 text-center text-[13px]" style={{ color: "rgba(0,0,0,0.3)" }}>
              이력 없음
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
