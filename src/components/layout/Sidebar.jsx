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
      className={`${collapsed ? "w-16" : "w-60"} bg-dark text-white flex flex-col transition-all duration-250 shrink-0 overflow-hidden`}
      aria-label="주요 내비게이션"
    >
      {/* Logo */}
      <div className={`${collapsed ? "px-3" : "px-6"} py-5 border-b border-white/[0.08] flex items-center gap-3`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shrink-0">
          <Monitor size={18} aria-hidden="true" />
        </div>
        {!collapsed && <div className="text-base font-extrabold whitespace-nowrap">Asset Manager</div>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2" aria-label="메인 메뉴">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 w-full ${collapsed ? "px-3 justify-center" : "px-4"} py-3 rounded-xl border-none text-sm mb-1 transition-all cursor-pointer font-[inherit] ${
                isActive
                  ? "bg-primary/25 text-primary-light font-semibold"
                  : "bg-transparent text-white/60 hover:text-white/80 hover:bg-white/5"
              }`}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" aria-hidden="true" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="mx-2 mb-4 p-2.5 rounded-xl border border-white/10 bg-transparent text-white/40 hover:text-white/60 cursor-pointer text-xs font-[inherit] flex items-center justify-center gap-2"
        aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
      >
        {collapsed ? <ChevronRight size={16} /> : (
          <>
            <ChevronLeft size={16} />
            <span>사이드바 접기</span>
          </>
        )}
      </button>
    </aside>
  );
}
