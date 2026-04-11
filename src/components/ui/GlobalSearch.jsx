import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import MemberAvatar from "./MemberAvatar";
import { STATUSES } from "../../data/constants";

export default function GlobalSearch({ assets, members, getMember, onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const assetResults = assets
      .filter((a) =>
        a.model.toLowerCase().includes(q) ||
        a.manufacturer.toLowerCase().includes(q) ||
        (a.serial || "").toLowerCase().includes(q),
      )
      .slice(0, 6)
      .map((a) => {
        const member = a.assignedTo ? getMember(a.assignedTo) : null;
        return {
          type: "asset",
          id: a.id,
          label: `${a.manufacturer} ${a.model}`,
          sublabel: [STATUSES[a.status], member?.name].filter(Boolean).join(" · "),
          data: a,
        };
      });

    const memberResults = members
      .filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.team.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q),
      )
      .slice(0, 4)
      .map((m) => ({
        type: "member",
        id: m.id,
        label: m.name,
        sublabel: `${m.team} · ${m.position}`,
        data: m,
      }));

    return [...assetResults, ...memberResults];
  }, [query, assets, members, getMember]);

  useEffect(() => { setActiveIdx(0); }, [results]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      onSelect(results[activeIdx]);
    }
  };

  const assetResults = results.filter((r) => r.type === "asset");
  const memberResults = results.filter((r) => r.type === "member");

  return (
    <div
      className="fixed inset-0 z-[8000] flex items-start justify-center"
      style={{ paddingTop: "15vh", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-[560px] bg-white rounded-[16px] overflow-hidden mx-4"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: results.length > 0 ? "1px solid rgba(0,0,0,0.06)" : "none" }}
        >
          <Search size={17} style={{ color: "rgba(0,0,0,0.3)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="장비명, 팀원, 시리얼 번호 검색..."
            className="flex-1 border-none outline-none text-[15px] bg-transparent font-[inherit]"
            style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}
          />
          {query ? (
            <button onClick={() => setQuery("")} className="border-none bg-transparent cursor-pointer p-1 flex items-center" style={{ color: "rgba(0,0,0,0.3)" }}>
              <X size={14} />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 rounded-[6px] text-[11px] font-medium" style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.4)" }}>
              ESC
            </kbd>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="py-2 max-h-[400px] overflow-auto">
            {assetResults.length > 0 && (
              <div>
                <div className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.3)" }}>
                  장비
                </div>
                {assetResults.map((r) => {
                  const globalIdx = results.indexOf(r);
                  return (
                    <ResultRow key={r.id} result={r} isActive={globalIdx === activeIdx} onSelect={onSelect} onHover={() => setActiveIdx(globalIdx)}>
                      <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: "rgba(0,113,227,0.1)", color: "#0071e3" }}>
                        <CategoryIcon category={r.data.category} size={15} />
                      </div>
                    </ResultRow>
                  );
                })}
              </div>
            )}
            {memberResults.length > 0 && (
              <div>
                <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.3)" }}>
                  팀원
                </div>
                {memberResults.map((r) => {
                  const globalIdx = results.indexOf(r);
                  return (
                    <ResultRow key={r.id} result={r} isActive={globalIdx === activeIdx} onSelect={onSelect} onHover={() => setActiveIdx(globalIdx)}>
                      <MemberAvatar member={r.data} className="w-8 h-8 rounded-full shrink-0" textClass="text-[13px] font-semibold" />
                    </ResultRow>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="py-10 text-center text-[13px]" style={{ color: "rgba(0,0,0,0.3)" }}>
            "<span style={{ color: "#1d1d1f" }}>{query}</span>" 에 대한 결과가 없습니다
          </div>
        )}

        {!query.trim() && (
          <div className="py-8 text-center text-[13px]" style={{ color: "rgba(0,0,0,0.35)" }}>
            장비명, 팀원, 시리얼 번호로 검색하세요
          </div>
        )}

        {/* Footer hint */}
        <div className="px-4 py-2.5 flex items-center gap-3 text-[11px]" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.3)" }}>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[rgba(0,0,0,0.06)]">↑↓</kbd> 이동</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[rgba(0,0,0,0.06)]">Enter</kbd> 선택</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[rgba(0,0,0,0.06)]">ESC</kbd> 닫기</span>
        </div>
      </div>
    </div>
  );
}

function ResultRow({ result, isActive, onSelect, onHover, children }) {
  return (
    <button
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left border-none cursor-pointer transition-colors"
      style={{ background: isActive ? "#f5f5f7" : "transparent" }}
      onClick={() => onSelect(result)}
      onMouseEnter={onHover}
    >
      {children}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold truncate" style={{ color: "#1d1d1f" }}>{result.label}</div>
        <div className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(0,0,0,0.4)" }}>{result.sublabel}</div>
      </div>
    </button>
  );
}
