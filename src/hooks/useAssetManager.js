import { useState, useCallback, useMemo, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { INITIAL_MEMBERS } from "../data/members";
import { INITIAL_ASSETS } from "../data/assets";
import { INITIAL_HISTORY } from "../data/history";
import { CATEGORIES, TEAMS } from "../data/constants";
import { uid } from "../utils";

export default function useAssetManager() {
  const [members, setMembers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [
          { data: membersData, error: me },
          { data: assetsData, error: ae },
          { data: historyData, error: he },
        ] = await Promise.all([
          supabase.from("members").select("*"),
          supabase.from("assets").select("*"),
          supabase.from("history").select("*").order("date", { ascending: false }),
        ]);

        if (me || ae || he) throw me || ae || he;

        if (membersData.length === 0) {
          await supabase.from("members").insert(INITIAL_MEMBERS);
          setMembers(INITIAL_MEMBERS);
        } else {
          setMembers(membersData);
        }

        if (assetsData.length === 0) {
          await supabase.from("assets").insert(INITIAL_ASSETS);
          setAssets(INITIAL_ASSETS);
        } else {
          setAssets(assetsData);
        }

        if (historyData.length === 0 && INITIAL_HISTORY.length > 0) {
          await supabase.from("history").insert(INITIAL_HISTORY);
          setHistory(INITIAL_HISTORY);
        } else {
          setHistory(historyData);
        }
      } catch (err) {
        console.error("Supabase load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Lookups
  const getMember = useCallback((id) => members.find((m) => m.id === id), [members]);
  const getAsset = useCallback((id) => assets.find((a) => a.id === id), [assets]);
  const getMemberAssets = useCallback(
    (memberId) => assets.filter((a) => a.assignedTo === memberId && a.status === "in-use"),
    [assets],
  );
  const getAssetHistory = useCallback(
    (assetId) => history.filter((h) => h.assetId === assetId).sort((a, b) => b.date.localeCompare(a.date)),
    [history],
  );

  // Stats
  const stats = useMemo(() => {
    const total = assets.length;
    const inUse = assets.filter((a) => a.status === "in-use").length;
    const stock = assets.filter((a) => a.status === "stock").length;
    const repair = assets.filter((a) => a.status === "repair").length;
    const dispose = assets.filter((a) => a.status === "dispose").length;
    const byCategory = {};
    CATEGORIES.forEach((c) => {
      byCategory[c] = assets.filter((a) => a.category === c).length;
    });
    const byTeam = {};
    TEAMS.forEach((t) => {
      byTeam[t] = members.filter((m) => m.team === t).length;
    });
    return { total, inUse, stock, repair, dispose, byCategory, byTeam };
  }, [assets, members]);

  // CRUD
  const saveAsset = useCallback(
    (data, editItem) => {
      if (editItem) {
        const updated = { ...editItem, ...data };
        setAssets((prev) => prev.map((a) => (a.id === editItem.id ? updated : a)));
        supabase.from("assets").update(data).eq("id", editItem.id).then(({ error }) => {
          if (error) console.error("asset update failed:", error);
        });

        if (data.assignedTo !== editItem.assignedTo) {
          const entry = {
            id: uid(),
            assetId: editItem.id,
            action: data.assignedTo ? "assign" : "return",
            memberId: data.assignedTo || editItem.assignedTo,
            date: new Date().toISOString().split("T")[0],
            note: data.assignedTo ? "장비 배정" : "장비 반납",
          };
          setHistory((prev) => [entry, ...prev]);
          supabase.from("history").insert(entry).then(({ error }) => {
            if (error) console.error("history insert failed:", error);
          });
        }
      } else {
        const newAsset = { ...data, id: uid() };
        setAssets((prev) => [...prev, newAsset]);
        supabase.from("assets").insert(newAsset).then(({ error }) => {
          if (error) console.error("asset insert failed:", error);
        });

        if (data.assignedTo) {
          const entry = {
            id: uid(),
            assetId: newAsset.id,
            action: "assign",
            memberId: data.assignedTo,
            date: new Date().toISOString().split("T")[0],
            note: "신규 등록 후 배정",
          };
          setHistory((prev) => [entry, ...prev]);
          supabase.from("history").insert(entry).then(({ error }) => {
            if (error) console.error("history insert failed:", error);
          });
        }
      }
    },
    [],
  );

  const saveMember = useCallback((data, editItem) => {
    if (editItem) {
      setMembers((prev) => prev.map((m) => (m.id === editItem.id ? { ...m, ...data } : m)));
      supabase.from("members").update(data).eq("id", editItem.id).then(({ error }) => {
        if (error) console.error("member update failed:", error);
      });
    } else {
      const newMember = { ...data, id: uid() };
      setMembers((prev) => [...prev, newMember]);
      supabase.from("members").insert(newMember).then(({ error }) => {
        if (error) console.error("member insert failed:", error);
      });
    }
  }, []);

  const assignAsset = useCallback((assetId, memberId) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, assignedTo: memberId, status: "in-use", isShared: false, sharedLabel: "" } : a)),
    );
    supabase.from("assets").update({ assignedTo: memberId, status: "in-use", isShared: false, sharedLabel: "" }).eq("id", assetId).then(({ error }) => {
      if (error) console.error("assign asset failed:", error);
    });

    const entry = {
      id: uid(),
      assetId,
      action: "assign",
      memberId,
      date: new Date().toISOString().split("T")[0],
      note: "장비 배정",
    };
    setHistory((prev) => [entry, ...prev]);
    supabase.from("history").insert(entry).then(({ error }) => {
      if (error) console.error("history insert failed:", error);
    });
  }, []);

  const returnAsset = useCallback(
    (assetId) => {
      const asset = assets.find((a) => a.id === assetId);
      if (asset?.assignedTo) {
        const entry = {
          id: uid(),
          assetId,
          action: "return",
          memberId: asset.assignedTo,
          date: new Date().toISOString().split("T")[0],
          note: "장비 반납",
        };
        setHistory((prev) => [entry, ...prev]);
        supabase.from("history").insert(entry).then(({ error }) => {
          if (error) console.error("history insert failed:", error);
        });
      }
      setAssets((prev) =>
        prev.map((a) => (a.id === assetId ? { ...a, assignedTo: null, status: "stock", isShared: false, sharedLabel: "" } : a)),
      );
      supabase.from("assets").update({ assignedTo: null, status: "stock", isShared: false, sharedLabel: "" }).eq("id", assetId).then(({ error }) => {
        if (error) console.error("return asset failed:", error);
      });
    },
    [assets],
  );

  const deleteAsset = useCallback((id) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      supabase.from("assets").delete().eq("id", id).then(({ error }) => {
        if (error) console.error("asset delete failed:", error);
      });
    }
  }, []);

  const deleteMember = useCallback(
    (id) => {
      const memberAssets = assets.filter((a) => a.assignedTo === id && a.status === "in-use");
      if (memberAssets.length > 0) {
        alert("배정된 장비가 있는 팀원은 삭제할 수 없습니다. 먼저 장비를 반납해주세요.");
        return;
      }
      if (confirm("정말 삭제하시겠습니까?")) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        supabase.from("members").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("member delete failed:", error);
        });
      }
    },
    [assets],
  );

  const deleteMembers = useCallback(
    (ids) => {
      const withAssets = ids.filter((id) => assets.some((a) => a.assignedTo === id && a.status === "in-use"));
      const deletable = ids.filter((id) => !assets.some((a) => a.assignedTo === id && a.status === "in-use"));

      if (withAssets.length > 0) {
        const names = withAssets.map((id) => members.find((m) => m.id === id)?.name).filter(Boolean).join(", ");
        alert(`배정된 장비가 있어 삭제할 수 없는 팀원: ${names}\n\n먼저 장비를 반납해주세요.`);
      }
      if (deletable.length === 0) return;
      if (confirm(`${deletable.length}명을 삭제하시겠습니까?`)) {
        setMembers((prev) => prev.filter((m) => !deletable.includes(m.id)));
        supabase.from("members").delete().in("id", deletable).then(({ error }) => {
          if (error) console.error("bulk member delete failed:", error);
        });
      }
    },
    [assets, members],
  );

  return {
    members,
    assets,
    history,
    stats,
    loading,
    getMember,
    getAsset,
    getMemberAssets,
    getAssetHistory,
    saveAsset,
    saveMember,
    assignAsset,
    returnAsset,
    deleteAsset,
    deleteMember,
    deleteMembers,
  };
}
