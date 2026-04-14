import { useState, useCallback, useMemo, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { INITIAL_MEMBERS } from "../data/members";
import { INITIAL_ASSETS } from "../data/assets";
import { INITIAL_HISTORY } from "../data/history";
import { CATEGORIES, TEAMS, STATUSES } from "../data/constants";
import { uid } from "../utils";
import { toast } from "../lib/toast";
import { dialog } from "../lib/confirm";

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
        toast.success("장비가 수정되었습니다");
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
        toast.success("장비가 등록되었습니다");
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
      toast.success("팀원 정보가 수정되었습니다");
      supabase.from("members").update(data).eq("id", editItem.id).then(({ error }) => {
        if (error) console.error("member update failed:", error);
      });
    } else {
      const newMember = { ...data, id: uid() };
      setMembers((prev) => [...prev, newMember]);
      toast.success("팀원이 등록되었습니다");
      supabase.from("members").insert(newMember).then(({ error }) => {
        if (error) console.error("member insert failed:", error);
      });
    }
  }, []);

  const assignAsset = useCallback((assetId, memberId, dueDate) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? { ...a, assignedTo: memberId, status: "in-use", isShared: false, sharedLabel: "", dueDate: dueDate || null }
          : a,
      ),
    );
    toast.success("장비가 배정되었습니다");
    supabase
      .from("assets")
      .update({ assignedTo: memberId, status: "in-use", isShared: false, sharedLabel: "", dueDate: dueDate || null })
      .eq("id", assetId)
      .then(({ error }) => {
        if (error) console.error("assign asset failed:", error);
      });

    const entry = {
      id: uid(),
      assetId,
      action: "assign",
      memberId,
      date: new Date().toISOString().split("T")[0],
      note: dueDate ? `장비 배정 (반납 예정: ${dueDate})` : "장비 배정",
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
        prev.map((a) =>
          a.id === assetId
            ? { ...a, assignedTo: null, status: "stock", isShared: false, sharedLabel: "", dueDate: null }
            : a,
        ),
      );
      toast.success("장비가 반납되었습니다");
      supabase
        .from("assets")
        .update({ assignedTo: null, status: "stock", isShared: false, sharedLabel: "", dueDate: null })
        .eq("id", assetId)
        .then(({ error }) => {
          if (error) console.error("return asset failed:", error);
        });
    },
    [assets],
  );

  const updateAssetStatus = useCallback(
    (assetId, status) => {
      const asset = assets.find((a) => a.id === assetId);
      if (!asset || asset.status === status) return;

      const today = new Date().toISOString().split("T")[0];

      // If was in-use and changing away, create a return history entry
      if (asset.assignedTo && status !== "in-use") {
        const entry = {
          id: uid(),
          assetId,
          action: "status-change",
          memberId: asset.assignedTo,
          date: today,
          note: `상태 변경 → ${STATUSES[status]}`,
        };
        setHistory((prev) => [entry, ...prev]);
        supabase.from("history").insert(entry).then(({ error }) => {
          if (error) console.error("history insert failed:", error);
        });
      }

      const update = {
        status,
        ...(asset.assignedTo && status !== "in-use" ? { assignedTo: null, dueDate: null } : {}),
      };

      setAssets((prev) => prev.map((a) => (a.id === assetId ? { ...a, ...update } : a)));
      toast.success("상태가 변경되었습니다");
      supabase.from("assets").update(update).eq("id", assetId).then(({ error }) => {
        if (error) console.error("status update failed:", error);
      });
    },
    [assets],
  );

  const deleteAsset = useCallback(async (id) => {
    const ok = await dialog.confirm("장비를 삭제하시겠습니까?", {
      type: "danger",
      confirmLabel: "삭제",
    });
    if (ok) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success("장비가 삭제되었습니다");
      supabase.from("assets").delete().eq("id", id).then(({ error }) => {
        if (error) console.error("asset delete failed:", error);
      });
    }
  }, []);

  const deleteAssets = useCallback(
    async (ids) => {
      const inUseNames = ids
        .filter((id) => assets.some((a) => a.id === id && a.status === "in-use"))
        .map((id) => assets.find((a) => a.id === id)?.model)
        .filter(Boolean);

      const message =
        inUseNames.length > 0
          ? `사용중인 장비가 포함되어 있습니다:\n${inUseNames.join(", ")}\n\n모두 삭제하시겠습니까?`
          : `${ids.length}개의 장비를 삭제하시겠습니까?`;

      const ok = await dialog.confirm(message, { type: "danger", confirmLabel: "삭제" });
      if (ok) {
        setAssets((prev) => prev.filter((a) => !ids.includes(a.id)));
        toast.success(`${ids.length}개 장비가 삭제되었습니다`);
        supabase.from("assets").delete().in("id", ids).then(({ error }) => {
          if (error) console.error("bulk asset delete failed:", error);
        });
      }
    },
    [assets],
  );

  const deleteMember = useCallback(
    async (id) => {
      const memberAssets = assets.filter((a) => a.assignedTo === id && a.status === "in-use");
      if (memberAssets.length > 0) {
        await dialog.alert("배정된 장비가 있는 팀원은 삭제할 수 없습니다.\n먼저 장비를 반납해주세요.", {
          title: "삭제 불가",
        });
        return;
      }
      const ok = await dialog.confirm("팀원을 삭제하시겠습니까?", {
        type: "danger",
        confirmLabel: "삭제",
      });
      if (ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        toast.success("팀원이 삭제되었습니다");
        supabase.from("members").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("member delete failed:", error);
        });
      }
    },
    [assets],
  );

  const deleteMembers = useCallback(
    async (ids) => {
      const withAssets = ids.filter((id) => assets.some((a) => a.assignedTo === id && a.status === "in-use"));
      const deletable = ids.filter((id) => !assets.some((a) => a.assignedTo === id && a.status === "in-use"));

      if (withAssets.length > 0) {
        const names = withAssets.map((id) => members.find((m) => m.id === id)?.name).filter(Boolean).join(", ");
        await dialog.alert(`배정된 장비가 있어 삭제할 수 없는 팀원:\n${names}\n\n먼저 장비를 반납해주세요.`, {
          title: "일부 삭제 불가",
        });
      }
      if (deletable.length === 0) return;

      const ok = await dialog.confirm(`${deletable.length}명을 삭제하시겠습니까?`, {
        type: "danger",
        confirmLabel: "삭제",
      });
      if (ok) {
        setMembers((prev) => prev.filter((m) => !deletable.includes(m.id)));
        toast.success(`${deletable.length}명이 삭제되었습니다`);
        supabase.from("members").delete().in("id", deletable).then(({ error }) => {
          if (error) console.error("bulk member delete failed:", error);
        });
      }
    },
    [assets, members],
  );

  const bulkAssignAssets = useCallback(
    (assetIds, memberId) => {
      const stockIds = assetIds.filter((id) => assets.some((a) => a.id === id && a.status === "stock"));
      if (!stockIds.length) return;

      setAssets((prev) =>
        prev.map((a) =>
          stockIds.includes(a.id)
            ? { ...a, assignedTo: memberId, status: "in-use", isShared: false, sharedLabel: "", dueDate: null }
            : a,
        ),
      );
      toast.success(`${stockIds.length}개 장비가 배정되었습니다`);

      const today = new Date().toISOString().split("T")[0];

      supabase
        .from("assets")
        .update({ assignedTo: memberId, status: "in-use", isShared: false, sharedLabel: "" })
        .in("id", stockIds)
        .then(({ error }) => {
          if (error) console.error("bulk assign failed:", error);
        });

      const entries = stockIds.map((assetId) => ({
        id: uid(), assetId, action: "assign", memberId, date: today, note: "일괄 배정",
      }));
      setHistory((prev) => [...entries, ...prev]);
      supabase.from("history").insert(entries).then(({ error }) => {
        if (error) console.error("history bulk insert failed:", error);
      });
    },
    [assets],
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
    updateAssetStatus,
    deleteAsset,
    deleteAssets,
    deleteMember,
    deleteMembers,
    bulkAssignAssets,
  };
}
