import { useState, useEffect, useCallback, useRef } from "react";
import useAssetManager from "./hooks/useAssetManager";
import { toast } from "./lib/toast";
import { dialog } from "./lib/confirm";
import ToastContainer from "./components/ui/Toast";
import ConfirmDialog from "./components/ui/ConfirmDialog";
import GlobalSearch from "./components/ui/GlobalSearch";
import Sidebar, { navItems } from "./components/layout/Sidebar";
import PageHeader from "./components/layout/PageHeader";
import Modal from "./components/ui/Modal";
import DashboardPage from "./components/dashboard/DashboardPage";
import AssetsPage from "./components/assets/AssetsPage";
import AssetForm from "./components/assets/AssetForm";
import AssetDetail from "./components/assets/AssetDetail";
import AssignForm from "./components/assets/AssignForm";
import MembersPage from "./components/members/MembersPage";
import MemberForm from "./components/members/MemberForm";
import MemberDetail from "./components/members/MemberDetail";
import StockPage from "./components/stock/StockPage";
import HistoryPage from "./components/history/HistoryPage";

export default function App() {
  const manager = useAssetManager();
  const {
    members, assets, history, stats, loading,
    getMember, getAsset, getMemberAssets, getAssetHistory,
    saveAsset, saveMember, assignAsset, returnAsset,
    updateAssetStatus, deleteAsset, deleteAssets,
    deleteMember, deleteMembers, bulkAssignAssets,
  } = manager;

  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [detailItem, setDetailItem] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  // Toast
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback(({ message, type }) => {
    setToasts((prev) => [...prev, { id: Math.random().toString(36).slice(2), message, type }]);
  }, []);
  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  useEffect(() => { toast._register(addToast); }, [addToast]);

  // Confirm dialog
  const [confirmConfig, setConfirmConfig] = useState(null);
  const confirmResolveRef = useRef(null);
  const showConfirm = useCallback((config, resolve) => {
    setConfirmConfig(config);
    confirmResolveRef.current = resolve;
  }, []);
  const handleConfirmClose = useCallback((result) => {
    confirmResolveRef.current?.(result);
    confirmResolveRef.current = null;
    setConfirmConfig(null);
  }, []);
  useEffect(() => { dialog._register(showConfirm); }, [showConfirm]);

  // Global search — Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setGlobalSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = (pageId) => {
    setPage(pageId);
    setSearch("");
    setFilterCategory("all");
    setFilterStatus("all");
    setFilterTeam("all");
    setDetailItem(null);
  };

  const navigateWithFilter = useCallback((pageId, filters = {}) => {
    setPage(pageId);
    setSearch("");
    setDetailItem(null);
    setFilterCategory(filters.category || "all");
    setFilterStatus(filters.status || "all");
    setFilterTeam(filters.team || "all");
  }, []);

  const handleGlobalSearchSelect = useCallback((result) => {
    setGlobalSearchOpen(false);
    if (result.type === "asset") {
      setPage("assets");
      setDetailItem(result.data);
    } else {
      setPage("members");
      setDetailItem(result.data);
    }
    setSearch("");
    setFilterCategory("all");
    setFilterStatus("all");
    setFilterTeam("all");
  }, []);

  const closeModal = () => { setModalOpen(null); setEditItem(null); };

  const getDescription = () => {
    switch (page) {
      case "dashboard": return "전체 장비 및 팀원 현황을 한눈에 확인하세요";
      case "assets": return `총 ${assets.length}개의 장비가 등록되어 있습니다`;
      case "members": return `총 ${members.length}명의 팀원이 등록되어 있습니다`;
      case "stock": return `재고 ${stats.stock}개 · 수리중 ${stats.repair}개 · 처분예정 ${stats.dispose}개`;
      case "history": return `총 ${history.length}건의 이력이 기록되어 있습니다`;
      default: return "";
    }
  };

  const isAssetDetail = detailItem && !!detailItem.category;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f5f7] text-[#1d1d1f]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans bg-[#f5f5f7] text-[#1d1d1f]">
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      <main className="flex-1 overflow-auto px-8 py-8">
        <PageHeader
          title={navItems.find((n) => n.id === page)?.label}
          description={getDescription()}
          onSearchOpen={() => setGlobalSearchOpen(true)}
        />

        {page === "dashboard" && (
          <DashboardPage
            assets={assets}
            members={members}
            getMemberAssets={getMemberAssets}
            onMemberClick={(m) => { setDetailItem(m); setPage("members"); }}
            onNavigate={navigateWithFilter}
          />
        )}

        {page === "assets" && (
          <AssetsPage
            assets={assets}
            search={search}
            onSearchChange={setSearch}
            filterCategory={filterCategory}
            onFilterCategory={setFilterCategory}
            filterStatus={filterStatus}
            onFilterStatus={setFilterStatus}
            getMember={getMember}
            onAdd={() => { setEditItem(null); setModalOpen("asset"); }}
            onEdit={(a) => { setEditItem(a); setModalOpen("asset"); }}
            onDetail={setDetailItem}
            onAssign={(assetId) => setModalOpen({ type: "assign", assetId })}
            onBulkAssign={(assetIds) => setModalOpen({ type: "bulkAssign", assetIds })}
            onReturn={returnAsset}
            onDelete={deleteAsset}
            onDeleteMultiple={deleteAssets}
            onStatusChange={updateAssetStatus}
          />
        )}

        {page === "members" && (
          <MembersPage
            members={members}
            search={search}
            onSearchChange={setSearch}
            filterTeam={filterTeam}
            onFilterTeam={setFilterTeam}
            getMemberAssets={getMemberAssets}
            onAdd={() => { setEditItem(null); setModalOpen("member"); }}
            onEdit={(m) => { setEditItem(m); setModalOpen("member"); }}
            onDelete={deleteMember}
            onDeleteMultiple={deleteMembers}
            onDetail={setDetailItem}
          />
        )}

        {page === "stock" && (
          <StockPage assets={assets} onAssign={(assetId) => setModalOpen({ type: "assign", assetId })} />
        )}

        {page === "history" && (
          <HistoryPage history={history} getAsset={getAsset} getMember={getMember} />
        )}
      </main>

      {/* Detail Panels */}
      {detailItem && isAssetDetail && (
        <AssetDetail asset={detailItem} getMember={getMember} getAssetHistory={getAssetHistory} onClose={() => setDetailItem(null)} />
      )}
      {detailItem && !isAssetDetail && (
        <MemberDetail
          member={detailItem}
          getMemberAssets={getMemberAssets}
          history={history}
          getAsset={getAsset}
          onAssetClick={setDetailItem}
          onReturn={returnAsset}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Modals */}
      <Modal isOpen={modalOpen === "asset"} onClose={closeModal} title={editItem ? "장비 수정" : "장비 등록"}>
        <AssetForm editItem={editItem} members={members} onSave={(data) => { saveAsset(data, editItem); closeModal(); }} onCancel={closeModal} />
      </Modal>

      <Modal isOpen={modalOpen === "member"} onClose={closeModal} title={editItem ? "팀원 수정" : "팀원 등록"}>
        <MemberForm
          editItem={editItem}
          onSave={(data) => {
            saveMember(data, editItem);
            if (detailItem && !detailItem.category && editItem && detailItem.id === editItem.id) {
              setDetailItem({ ...detailItem, ...data });
            }
            closeModal();
          }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal isOpen={modalOpen?.type === "assign"} onClose={closeModal} title="장비 배정">
        <AssignForm
          asset={getAsset(modalOpen?.assetId)}
          members={members}
          getMemberAssets={getMemberAssets}
          onAssign={(assetId, memberId, dueDate) => { assignAsset(assetId, memberId, dueDate); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal isOpen={modalOpen?.type === "bulkAssign"} onClose={closeModal} title="일괄 배정">
        <AssignForm
          assetIds={modalOpen?.assetIds}
          assetCount={modalOpen?.assetIds?.length}
          members={members}
          getMemberAssets={getMemberAssets}
          onAssign={(assetIds, memberId) => { bulkAssignAssets(assetIds, memberId); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>

      {/* Global Search */}
      {globalSearchOpen && (
        <GlobalSearch
          assets={assets}
          members={members}
          getMember={getMember}
          onSelect={handleGlobalSearchSelect}
          onClose={() => setGlobalSearchOpen(false)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog config={confirmConfig} onClose={handleConfirmClose} />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
