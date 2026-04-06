import { useState } from "react";
import { TEAMS } from "../../data/constants";
import { ChevronDown, Users } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";

const TEAM_COLORS = ["#6366f1", "#10b981", "#f59e0b"];

export default function TeamBreakdown({ members, assets, getMember, getMemberAssets, onMemberClick }) {
  const [expanded, setExpanded] = useState(null);

  const maxAssets = Math.max(
    ...TEAMS.map((t) =>
      assets.filter((a) => {
        if (!a.assignedTo) return false;
        const m = getMember(a.assignedTo);
        return m && m.team === t;
      }).length
    ),
    1
  );

  return (
    <article className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="mb-4 text-[15px] font-bold text-dark">팀별 현황</h3>
      <div className="flex flex-col gap-3">
        {TEAMS.map((team, i) => {
          const count = members.filter((m) => m.team === team).length;
          const teamAssets = assets.filter((a) => {
            if (!a.assignedTo) return false;
            const m = getMember(a.assignedTo);
            return m && m.team === team;
          }).length;
          const isExpanded = expanded === team;
          const teamMembers = members.filter((m) => m.team === team);
          const color = TEAM_COLORS[i % TEAM_COLORS.length];

          return (
            <div key={team}>
              <div
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer"
                style={{
                  background: isExpanded ? `${color}08` : "#f8f9fb",
                  border: isExpanded ? `1px solid ${color}22` : "1px solid transparent",
                  transition: "all 0.2s",
                }}
                onClick={() => setExpanded(isExpanded ? null : team)}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}14`, color }}
                >
                  <Users size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-dark">{team}</span>
                    <span className="text-[11px] text-gray-400">{count}명 / 장비 {teamAssets}개</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(teamAssets / maxAssets) * 100}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className="text-gray-400 shrink-0"
                  style={{
                    transition: "transform 0.2s",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                  }}
                />
              </div>
              {isExpanded && (
                <div
                  className="mx-2 mt-1 overflow-hidden"
                  style={{
                    animation: "slideDown 0.2s ease-out",
                  }}
                >
                  {teamMembers.map((m) => {
                    const mAssets = getMemberAssets ? getMemberAssets(m.id) : [];
                    return (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50"
                        style={{ transition: "background 0.15s" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMemberClick && onMemberClick(m);
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                        >
                          {m.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-dark">{m.name}</div>
                          <div className="text-[11px] text-gray-400">{m.position}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {mAssets.slice(0, 3).map((a) => (
                            <div key={a.id} className="text-gray-400" title={`${a.manufacturer} ${a.model}`}>
                              <CategoryIcon category={a.category} size={14} />
                            </div>
                          ))}
                          {mAssets.length === 0 && <span className="text-[11px] text-gray-300">장비 없음</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}
