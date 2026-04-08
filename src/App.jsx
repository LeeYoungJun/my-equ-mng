import { useState } from "react";
import useAssetManager from "./hooks/useAssetManager";
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

const PAGE_DESCRIPTIONS = {
  dashboard: "전체 장비 및 팀원 현황을 한눈에 확인하세요",
  assets: null, // dynamic
  members: null,
  stock: null,
  history: null,
};

export default function App() {
  const manager = useAssetManager();
  const { members, assets, history, stats, getMember, getAsset, getMemberAssets, getAssetHistory, saveAsset, saveMember, assignAsset, returnAsset, deleteAsset, deleteMember, deleteMembers } = manager;

  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [detailItem, setDetailItem] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = (pageId) => {
    setPage(pageId);
    setSearch("");
    setFilterCategory("all");
    setFilterStatus("all");
    setFilterTeam("all");
    setDetailItem(null);
  };

  const closeModal = () => {
    setModalOpen(null);
    setEditItem(null);
  };

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
        />

        {page === "dashboard" && (
          <DashboardPage
            assets={assets}
            members={members}
            getMemberAssets={getMemberAssets}
            onMemberClick={(m) => { setDetailItem(m); setPage("members"); }}
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
            onReturn={returnAsset}
            onDelete={deleteAsset}
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
          <StockPage
            assets={assets}
            onAssign={(assetId) => setModalOpen({ type: "assign", assetId })}
          />
        )}

        {page === "history" && (
          <HistoryPage history={history} getAsset={getAsset} getMember={getMember} />
        )}
      </main>

      {/* Detail Panel */}
      {detailItem && isAssetDetail && (
        <AssetDetail
          asset={detailItem}
          getMember={getMember}
          getAssetHistory={getAssetHistory}
          onClose={() => setDetailItem(null)}
        />
      )}
      {detailItem && !isAssetDetail && (
        <MemberDetail
          member={detailItem}
          getMemberAssets={getMemberAssets}
          history={history}
          getAsset={getAsset}
          getMember={getMember}
          onAssetClick={setDetailItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Modals */}
      <Modal isOpen={modalOpen === "asset"} onClose={closeModal} title={editItem ? "장비 수정" : "장비 등록"}>
        <AssetForm
          editItem={editItem}
          members={members}
          onSave={(data) => { saveAsset(data, editItem); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal isOpen={modalOpen === "member"} onClose={closeModal} title={editItem ? "팀원 수정" : "팀원 등록"}>
        <MemberForm
          editItem={editItem}
          onSave={(data) => { saveMember(data, editItem); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal isOpen={modalOpen?.type === "assign"} onClose={closeModal} title="장비 배정">
        <AssignForm
          asset={getAsset(modalOpen?.assetId)}
          members={members}
          onAssign={(assetId, memberId) => { assignAsset(assetId, memberId); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
