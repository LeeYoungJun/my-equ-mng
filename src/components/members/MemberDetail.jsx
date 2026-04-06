import { X } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import MemberAvatar from "../ui/MemberAvatar";

export default function MemberDetail({ member, getMemberAssets, history, getAsset, getMember, onAssetClick, onClose }) {
  const mAssets = getMemberAssets(member.id);
  const memberHist = history.filter((h) => h.memberId === member.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <aside
      className="fixed right-0 top-0 bottom-0 w-[440px] bg-white shadow-[-8px_0_40px_rgba(0,0,0,0.1)] z-[500] overflow-auto"
      role="complementary"
      aria-label="팀원 상세 정보"
    >
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-dark">팀원 상세</h3>
        <button onClick={onClose} className="p-1 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600" aria-label="닫기">
          <X size={20} />
        </button>
      </div>
      <div className="px-6 py-5">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <MemberAvatar
            member={member}
            className="w-14 h-14 rounded-full"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" }}
            textClass="text-[22px]"
          />
          <div>
            <div className="text-lg font-bold text-dark">{member.name}</div>
            <div className="text-[13px] text-gray-400">{member.team} · {member.position}</div>
          </div>
        </div>

        {/* Assigned assets */}
        <section className="mb-6">
          <h4 className="text-[13px] font-bold text-dark mb-3">배정 장비 ({mAssets.length})</h4>
          {mAssets.length > 0 ? (
            mAssets.map((a) => (
              <button
                key={a.id}
                className="flex items-center gap-3 px-3.5 py-3 bg-gray-50 rounded-xl mb-2 cursor-pointer w-full text-left border-none hover:bg-gray-100 transition-colors"
                onClick={() => onAssetClick(a)}
                aria-label={`${a.manufacturer} ${a.model} 상세 보기`}
              >
                <CategoryIcon category={a.category} size={18} />
                <div>
                  <div className="text-[13px] font-semibold text-dark">{a.manufacturer} {a.model}</div>
                  <div className="text-[11px] text-gray-400">{a.spec}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="py-5 text-center text-gray-300 text-[13px] bg-gray-50 rounded-xl">배정된 장비 없음</div>
          )}
        </section>

        {/* History */}
        <section>
          <h4 className="text-[13px] font-bold text-dark mb-3">이력</h4>
          {memberHist.length > 0 ? (
            memberHist.map((h) => {
              const asset = getAsset(h.assetId);
              return (
                <div key={h.id} className="flex gap-3 py-2.5 border-b border-gray-50 text-xs">
                  <time className="text-gray-400 w-20">{h.date}</time>
                  <span className={`font-semibold w-10 ${h.action === "assign" ? "text-success" : "text-warning"}`}>
                    {h.action === "assign" ? "배정" : "반납"}
                  </span>
                  <span className="text-gray-500">{asset?.model || "알 수 없음"}</span>
                </div>
              );
            })
          ) : (
            <div className="py-5 text-center text-gray-300 text-[13px]">이력 없음</div>
          )}
        </section>
      </div>
    </aside>
  );
}
