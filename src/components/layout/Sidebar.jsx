import { Monitor, Users, Package, Clock, ChevronRight, ChevronLeft, BarChart3 } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "대시보드", icon: BarChart3 },
  { id: "assets", label: "장비 관리", icon: Monitor },
  { id: "members", label: "팀원 관리", icon: Users },
  { id: "stock", label: "재고 관리", icon: Package },
  { id: "history", label: "이력 관리", icon: Clock },
];

export { navItems };

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle }) {
  return (
    <aside
      className={`${collapsed ? "w-[64px]" : "w-[220px]"} flex flex-col transition-all duration-200 shrink-0 overflow-hidden`}
      style={{
        background: "#000000",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
      aria-label="주요 내비게이션"
    >
      {/* Logo */}
      <div
        className={`${collapsed ? "px-4 justify-center" : "px-5"} h-[52px] flex items-center gap-3 shrink-0`}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "#0071e3" }}
        >
          <Monitor size={16} color="#fff" aria-hidden="true" />
        </div>
        {!collapsed && (
          <div
            className="text-[15px] font-semibold whitespace-nowrap"
            style={{ color: "#fff", letterSpacing: "-0.3px" }}
          >
            Asset Manager
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2" aria-label="메인 메뉴">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2.5 w-full ${collapsed ? "px-2.5 justify-center" : "px-3"} py-2.5 rounded-lg border-none text-[13px] mb-0.5 cursor-pointer font-[inherit] transition-all`}
              style={{
                background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                fontWeight: isActive ? 500 : 400,
                letterSpacing: "-0.1px",
              }}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={16} className="shrink-0" aria-hidden="true" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="mx-2 mb-3 p-2 rounded-lg border-none cursor-pointer font-[inherit] flex items-center justify-center gap-2 transition-all"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.35)",
          fontSize: "12px",
        }}
        aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
      >
        {collapsed ? <ChevronRight size={14} /> : (
          <>
            <ChevronLeft size={14} />
            <span>접기</span>
          </>
        )}
      </button>
    </aside>
  );
}
