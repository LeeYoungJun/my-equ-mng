import { memberImages } from "../../data/memberImages";

/**
 * className  — 크기/모양 클래스 (예: "w-10 h-10 rounded-xl")
 * style      — 인라인 스타일 (사진 없을 때 배경 그라데이션 등)
 * textClass  — 이니셜 폰트 크기 (예: "text-sm")
 */
export default function MemberAvatar({ member, className = "", style = {}, textClass = "" }) {
  const photo = member?.photo;
  const imgSrc = photo
    ? (photo.startsWith("data:") || photo.startsWith("http") ? photo : memberImages[photo] ?? null)
    : null;

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={member.name}
        className={`object-cover object-center shrink-0 ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-white font-bold shrink-0 ${className}`}
      style={style}
    >
      <span className={textClass}>{member?.name?.charAt(0)}</span>
    </div>
  );
}
