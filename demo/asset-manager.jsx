import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Plus, Monitor, Laptop, Server, Users, Package, BarChart3, ChevronDown, ChevronRight, X, Edit3, Trash2, ArrowLeft, Clock, UserPlus, Box, AlertCircle, Check, Filter, Download, Upload, Eye, Printer, Wifi, HardDrive, Tablet, Headset } from "lucide-react";

/* ─────────────────────────────────────────────
   INITIAL DATA - imported from Excel
   ───────────────────────────────────────────── */
const INITIAL_MEMBERS = [
  { id: "m1", name: "김민규", team: "솔루션팀", position: "차장", email: "mingyukim@company.com" },
  { id: "m2", name: "김선경", team: "기술지원팀", position: "과장", email: "sunkyungkim@company.com" },
  { id: "m3", name: "김성희", team: "기술지원팀", position: "대리", email: "sungheekim@company.com" },
  { id: "m4", name: "김종현", team: "솔루션팀", position: "과장", email: "jonghyunkim@company.com" },
  { id: "m5", name: "남철현", team: "데이터컨설팅팀", position: "과장", email: "cheolhyunnam@company.com" },
  { id: "m6", name: "박재한", team: "기술지원팀", position: "대리", email: "jaehanpark@company.com" },
  { id: "m7", name: "박재형", team: "솔루션팀", position: "과장", email: "jaehyungpark@company.com" },
  { id: "m8", name: "성낙철", team: "기술지원팀", position: "부장", email: "nakcheolsung@company.com" },
  { id: "m9", name: "소광진", team: "데이터컨설팅팀", position: "과장", email: "gwangjinso@company.com" },
  { id: "m10", name: "심혜윤", team: "솔루션팀", position: "대리", email: "hyeyunsim@company.com" },
  { id: "m11", name: "안병준", team: "기술지원팀", position: "대리", email: "byungjunan@company.com" },
  { id: "m12", name: "안수현", team: "솔루션팀", position: "사원", email: "soohyunan@company.com" },
  { id: "m13", name: "안주연", team: "기술지원팀", position: "사원", email: "jooyeonan@company.com" },
  { id: "m14", name: "안창현", team: "데이터컨설팅팀", position: "과장", email: "changhyunan@company.com" },
  { id: "m15", name: "우지윤", team: "솔루션팀", position: "대리", email: "jiyunwoo@company.com" },
  { id: "m16", name: "유경수", team: "기술지원팀", position: "이사", email: "gyeongsooyoo@company.com" },
  { id: "m17", name: "윤정환", team: "데이터컨설팅팀", position: "과장", email: "junghwanyoon@company.com" },
  { id: "m18", name: "이규원", team: "솔루션팀", position: "대리", email: "gyuwonlee@company.com" },
  { id: "m19", name: "이도협", team: "기술지원팀", position: "대리", email: "dohyuplee@company.com" },
  { id: "m20", name: "이승재", team: "솔루션팀", position: "과장", email: "seungjaelee@company.com" },
  { id: "m21", name: "이영준", team: "기술지원팀", position: "대리", email: "youngjunlee@company.com" },
  { id: "m22", name: "송화진", team: "데이터컨설팅팀", position: "대리", email: "hwajinsong@company.com" },
  { id: "m23", name: "이형민", team: "솔루션팀", position: "과장", email: "hyungminlee@company.com" },
  { id: "m24", name: "장현광", team: "기술지원팀", position: "부장", email: "hyungwangjang@company.com" },
  { id: "m25", name: "전상환", team: "데이터컨설팅팀", position: "과장", email: "sanghwanjeon@company.com" },
  { id: "m26", name: "정보라", team: "솔루션팀", position: "대리", email: "borajeong@company.com" },
  { id: "m27", name: "진유영", team: "기술지원팀", position: "사원", email: "yuyoungjin@company.com" },
  { id: "m28", name: "최정연", team: "솔루션팀", position: "대리", email: "jungyeonchoi@company.com" },
  { id: "m29", name: "한성준", team: "데이터컨설팅팀", position: "과장", email: "sungjunhan@company.com" },
  { id: "m30", name: "함건", team: "기술지원팀", position: "대리", email: "gunham@company.com" },
  { id: "m31", name: "최윤혁", team: "솔루션팀", position: "사원", email: "yunhyukchoi@company.com" },
  { id: "m32", name: "추지연", team: "데이터컨설팅팀", position: "사원", email: "jiyeonchu@company.com" },
  { id: "m33", name: "박주영", team: "기술지원팀", position: "사원", email: "jooyoungpark@company.com" },
  { id: "m34", name: "이윤지", team: "솔루션팀", position: "대리", email: "yunjilee@company.com" },
  { id: "m35", name: "이혜진", team: "데이터컨설팅팀", position: "대리", email: "hyejinlee@company.com" },
  { id: "m36", name: "김혜린", team: "기술지원팀", position: "사원", email: "hyerinkim@company.com" },
];

const INITIAL_ASSETS = [
  { id: "a1", category: "Desktop", manufacturer: "조립 PC", model: "조립 PC", serial: "252401679318", spec: "AMD 라이젠 스레드리퍼 2950X, RTX 3090, 삼성 3200 RAM x4", purchaseDate: "2021-02", status: "in-use", assignedTo: null, note: "데이터컨설팅팀 딥러닝 용 장비", isShared: true, sharedLabel: "공용" },
  { id: "a2", category: "Laptop", manufacturer: "LG", model: "16ZD90Q-GX76K", serial: "", spec: "i7-1260P, RAM 16GB, SSD 256GB, Win11", purchaseDate: "2022-05", status: "in-use", assignedTo: null, isShared: true, sharedLabel: "공용(솔루션팀)", note: "" },
  { id: "a3", category: "Laptop", manufacturer: "SAMSUNG", model: "NT900X5T", serial: "C02J2N55DKQ1", spec: "i7-8550U, RAM 16GB, HDD 500GB, Win10", purchaseDate: "2018-05", status: "in-use", assignedTo: null, isShared: true, sharedLabel: "공용(솔루션팀)", note: "" },
  { id: "a4", category: "Desktop", manufacturer: "HP", model: "HP OMEN 40L GT21-0004KR", serial: "8CG15190H4", spec: "i7-12700K, RTX 3070Ti, 64GB RAM, 1TB SSD", purchaseDate: "2022-04", status: "in-use", assignedTo: null, isShared: true, sharedLabel: "공용", note: "22년 빛공해 연구과제 장비, 솔루션팀" },
  { id: "a5", category: "Desktop", manufacturer: "DELL", model: "ALIENWARE AURORA R12", serial: "J7YMRH3", spec: "Intel Core i9, RAM 64GB", purchaseDate: "2021-09", status: "in-use", assignedTo: null, isShared: true, sharedLabel: "공용", note: "21년 ICT 디바이스융합 연구과제" },
  { id: "a6", category: "Laptop", manufacturer: "Apple", model: "MacBook Pro 14 (M3 Pro)", serial: "FVFHM0J2Q6", spec: "M3 Pro, 18GB, 512GB SSD", purchaseDate: "2024-07", status: "in-use", assignedTo: "m1", note: "" },
  { id: "a7", category: "Laptop", manufacturer: "LG", model: "16ZD90Q-GX56K", serial: "203NZZA051432", spec: "i5-1240P, RAM 16GB, SSD 512GB", purchaseDate: "2022-05", status: "in-use", assignedTo: "m2", note: "" },
  { id: "a8", category: "Monitor", manufacturer: "SAMSUNG", model: "S27A700NWK", serial: "CXX9H4ZT300169W", spec: "27inch 4K UHD", purchaseDate: "2022-03", status: "in-use", assignedTo: "m2", note: "" },
  { id: "a9", category: "Laptop", manufacturer: "Apple", model: "MacBook Pro 16 (M1 Pro)", serial: "C02G7154ML7H", spec: "M1 Pro, 16GB, 1TB SSD", purchaseDate: "2021-12", status: "in-use", assignedTo: "m3", note: "" },
  { id: "a10", category: "Monitor", manufacturer: "Dell", model: "P2722H", serial: "CN-04H37D", spec: "27inch FHD", purchaseDate: "2022-02", status: "in-use", assignedTo: "m3", note: "" },
  { id: "a11", category: "Laptop", manufacturer: "LG", model: "16ZD90Q-GX76K", serial: "203NZZA048882", spec: "i7-1260P, RAM 16GB, SSD 256GB, Win11", purchaseDate: "2022-05", status: "in-use", assignedTo: "m5", note: "" },
  { id: "a12", category: "Laptop", manufacturer: "Apple", model: "MacBook Pro 14 (M3 Pro)", serial: "FVFHM0K3Q6", spec: "M3 Pro, 18GB, 512GB SSD", purchaseDate: "2024-07", status: "in-use", assignedTo: "m7", note: "" },
  { id: "a13", category: "Monitor", manufacturer: "Dell", model: "U2723QE", serial: "CN-0MFGDT", spec: "27inch 4K USB-C", purchaseDate: "2023-07", status: "in-use", assignedTo: "m7", note: "" },
  { id: "a14", category: "Laptop", manufacturer: "Apple", model: "MacBook Air (M2)", serial: "FVFHT3K2Q72X", spec: "M2, 8GB, 512GB SSD", purchaseDate: "2023-02", status: "in-use", assignedTo: "m9", note: "" },
  { id: "a15", category: "Laptop", manufacturer: "Dell", model: "Latitude 5430", serial: "HPQWRT55", spec: "i7-1265U, 16GB, 512GB", purchaseDate: "2023-08", status: "in-use", assignedTo: "m10", note: "" },
  { id: "a16", category: "Monitor", manufacturer: "SAMSUNG", model: "S27A700NWK", serial: "CXX9H4ZT300170W", spec: "27inch 4K UHD", purchaseDate: "2022-03", status: "in-use", assignedTo: "m10", note: "" },
  { id: "a17", category: "Laptop", manufacturer: "LG", model: "16ZD90Q-GX56K", serial: "203NZZA051433", spec: "i5-1240P, RAM 16GB, SSD 512GB", purchaseDate: "2022-05", status: "in-use", assignedTo: "m11", note: "" },
  { id: "a18", category: "Monitor", manufacturer: "Dell", model: "P2418D", serial: "CN-043C7Y-74261", spec: "24inch QHD", purchaseDate: "2016-07", status: "in-use", assignedTo: "m16", note: "" },
  // Stock items
  { id: "s1", category: "Laptop", manufacturer: "LG", model: "17Z990-VA7BK", serial: "901NZVF013895", spec: "i7-8565U, 16GB, 256GB+512GB, GTX 1060", purchaseDate: "2019-01", status: "stock", assignedTo: null, note: "재고" },
  { id: "s2", category: "Laptop", manufacturer: "Apple", model: "MacBook Air (13.3 inch)", serial: "FVFFT3J2Q72X", spec: "Apple M1, 8코어 CPU, 1TB SSD", purchaseDate: "2021-07", status: "stock", assignedTo: null, note: "김민규 차장 대여 이력" },
  { id: "s3", category: "Laptop", manufacturer: "LG", model: "162D90P-GX7TK", serial: "202NZZA036557", spec: "i7-1165G7, 16GB, 2TB SSD, Win11 Pro", purchaseDate: "2022-05", status: "stock", assignedTo: null, note: "" },
  { id: "s4", category: "Laptop", manufacturer: "Apple", model: "MacBook Air (M1, 2020)", serial: "FVFHC0HPQ6L5", spec: "M1, 8GB, 256GB SSD", purchaseDate: "2022-03", status: "stock", assignedTo: null, note: "" },
  { id: "s5", category: "Laptop", manufacturer: "LG", model: "15ZD90N-VX70K", serial: "101NZVF001087", spec: "i7-1065G7, 16GB, Win10", purchaseDate: "2022-02", status: "stock", assignedTo: null, note: "" },
  { id: "s6", category: "Laptop", manufacturer: "LG", model: "15ZD90N", serial: "104NZYB026482", spec: "i5-1035G7, 16GB, 256GB+256GB SSD", purchaseDate: "2021-04", status: "stock", assignedTo: null, note: "" },
  { id: "s7", category: "Laptop", manufacturer: "HP", model: "Victus 16-d1132TX", serial: "6DD3P-JHRCY", spec: "i7-12700H, 16GB, 1TB SSD, Win11 Pro", purchaseDate: "2021-05", status: "stock", assignedTo: null, note: "" },
  { id: "s8", category: "Monitor", manufacturer: "SAMSUNG", model: "S27F350FHK", serial: "ZZN4H4ZK502010T", spec: "27inch FHD", purchaseDate: "", status: "stock", assignedTo: null, note: "서버실 위치" },
  { id: "s9", category: "Monitor", manufacturer: "LG", model: "24MN430HW", serial: "112NTUW9J902", spec: "24inch", purchaseDate: "2022-03", status: "stock", assignedTo: null, note: "" },
  { id: "s10", category: "Monitor", manufacturer: "Dell", model: "P2421D", serial: "CN-0492DH", spec: "QHD 2560x1440", purchaseDate: "2020", status: "stock", assignedTo: null, note: "심혜윤 옆자리 위치" },
  { id: "s11", category: "Monitor", manufacturer: "BenQ", model: "GW2780-T", serial: "ET93K0047201Q", spec: "", purchaseDate: "", status: "stock", assignedTo: null, note: "심혜윤 옆자리 위치" },
  { id: "s12", category: "Monitor", manufacturer: "LG", model: "27ML600SW", serial: "904NTNHF7175", spec: "27inch", purchaseDate: "2019-08", status: "stock", assignedTo: null, note: "서버실 위치" },
  // Disposal
  { id: "d1", category: "Laptop", manufacturer: "Google", model: "Chrome Book CB001", serial: "3B213249569500254", spec: "i5-3427U, 4GB, 32GB SSD, Chrome OS", purchaseDate: "", status: "dispose", assignedTo: null, note: "처분 예정" },
  { id: "d2", category: "Laptop", manufacturer: "MSI", model: "크리에이터 17M A10SD", serial: "K2008N0093267", spec: "i7-10750H, GTX1660Ti, 16GB, 1TB SSD", purchaseDate: "2020", status: "dispose", assignedTo: null, note: "처분 예정" },
  { id: "d3", category: "Laptop", manufacturer: "SAMSUNG", model: "NT950QDZ-G58AB", serial: "4RD59FHR200293", spec: "i5-1135G7, 8GB, 256GB SSD, MX450", purchaseDate: "2021-04", status: "dispose", assignedTo: null, note: "처분 예정" },
];

const INITIAL_HISTORY = [
  { id: "h1", assetId: "a6", action: "assign", memberId: "m1", date: "2024-07-15", note: "신규 입고 후 배정" },
  { id: "h2", assetId: "s2", action: "return", memberId: "m1", date: "2024-01-10", note: "김민규 차장 반납" },
  { id: "h3", assetId: "a9", action: "assign", memberId: "m3", date: "2021-12-20", note: "신규 입고 후 배정" },
  { id: "h4", assetId: "a15", action: "assign", memberId: "m10", date: "2023-08-10", note: "신규 배정" },
  { id: "h5", assetId: "d1", action: "status-change", memberId: null, date: "2025-01-15", note: "처분 예정으로 상태 변경" },
];

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
const CATEGORIES = ["Desktop", "Laptop", "Monitor", "Tablet", "Printer", "기타"];
const STATUSES = { "in-use": "사용중", stock: "재고", repair: "수리중", dispose: "처분예정" };
const STATUS_COLORS = { "in-use": "#10b981", stock: "#3b82f6", repair: "#f59e0b", dispose: "#ef4444" };
const TEAMS = ["솔루션팀", "기술지원팀", "데이터컨설팅팀"];

const CategoryIcon = ({ category, size = 18 }) => {
  const props = { size, strokeWidth: 1.5 };
  switch (category) {
    case "Desktop": return <Server {...props} />;
    case "Laptop": return <Laptop {...props} />;
    case "Monitor": return <Monitor {...props} />;
    case "Tablet": return <Tablet {...props} />;
    case "Printer": return <Printer {...props} />;
    default: return <Box {...props} />;
  }
};

const uid = () => Math.random().toString(36).substr(2, 9);

/* ─────────────────────────────────────────────
   MODAL COMPONENT
   ───────────────────────────────────────────── */
const Modal = ({ isOpen, onClose, title, children, width = "560px" }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 16, width, maxWidth: "92vw", maxHeight: "88vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#999" }}><X size={20} /></button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FORM COMPONENTS
   ───────────────────────────────────────────── */
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.15s", boxSizing: "border-box" };
const selectStyle = { ...inputStyle, appearance: "none", background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center`, paddingRight: 32 };
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 };
const btnPrimary = { padding: "10px 24px", borderRadius: 10, border: "none", background: "#1a1a2e", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
const btnSecondary = { ...btnPrimary, background: "#f0f0f0", color: "#333" };

const FormField = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   STATUS BADGE
   ───────────────────────────────────────────── */
const StatusBadge = ({ status }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[status] + "18", color: STATUS_COLORS[status] }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLORS[status] }} />
    {STATUSES[status]}
  </span>
);

/* ─────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────── */
export default function AssetManager() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [detailItem, setDetailItem] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const total = assets.length;
    const inUse = assets.filter(a => a.status === "in-use").length;
    const stock = assets.filter(a => a.status === "stock").length;
    const repair = assets.filter(a => a.status === "repair").length;
    const dispose = assets.filter(a => a.status === "dispose").length;
    const byCategory = {};
    CATEGORIES.forEach(c => { byCategory[c] = assets.filter(a => a.category === c).length; });
    const byTeam = {};
    TEAMS.forEach(t => { byTeam[t] = members.filter(m => m.team === t).length; });
    return { total, inUse, stock, repair, dispose, byCategory, byTeam };
  }, [assets, members]);

  const getMember = useCallback((id) => members.find(m => m.id === id), [members]);
  const getAsset = useCallback((id) => assets.find(a => a.id === id), [assets]);

  const getMemberAssets = useCallback((memberId) => 
    assets.filter(a => a.assignedTo === memberId && a.status === "in-use"), [assets]);

  const getAssetHistory = useCallback((assetId) =>
    history.filter(h => h.assetId === assetId).sort((a, b) => b.date.localeCompare(a.date)), [history]);

  /* FILTER */
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      if (filterCategory !== "all" && a.category !== filterCategory) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        const member = a.assignedTo ? getMember(a.assignedTo) : null;
        const memberName = member ? member.name : (a.sharedLabel || "");
        return a.model.toLowerCase().includes(q) || a.manufacturer.toLowerCase().includes(q) || a.serial.toLowerCase().includes(q) || memberName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [assets, filterCategory, filterStatus, search, getMember]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (filterTeam !== "all" && m.team !== filterTeam) return false;
      if (search) {
        const q = search.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.team.toLowerCase().includes(q) || m.position.toLowerCase().includes(q);
      }
      return true;
    });
  }, [members, filterTeam, search]);

  /* CRUD HANDLERS */
  const handleSaveAsset = (data) => {
    if (editItem) {
      setAssets(prev => prev.map(a => a.id === editItem.id ? { ...a, ...data } : a));
      if (data.assignedTo !== editItem.assignedTo) {
        setHistory(prev => [...prev, { id: uid(), assetId: editItem.id, action: data.assignedTo ? "assign" : "return", memberId: data.assignedTo || editItem.assignedTo, date: new Date().toISOString().split("T")[0], note: data.assignedTo ? "장비 배정" : "장비 반납" }]);
      }
    } else {
      const newId = uid();
      setAssets(prev => [...prev, { ...data, id: newId }]);
      if (data.assignedTo) {
        setHistory(prev => [...prev, { id: uid(), assetId: newId, action: "assign", memberId: data.assignedTo, date: new Date().toISOString().split("T")[0], note: "신규 등록 후 배정" }]);
      }
    }
    setModalOpen(null);
    setEditItem(null);
  };

  const handleSaveMember = (data) => {
    if (editItem) {
      setMembers(prev => prev.map(m => m.id === editItem.id ? { ...m, ...data } : m));
    } else {
      setMembers(prev => [...prev, { ...data, id: uid() }]);
    }
    setModalOpen(null);
    setEditItem(null);
  };

  const handleAssign = (assetId, memberId) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, assignedTo: memberId, status: "in-use", isShared: false, sharedLabel: "" } : a));
    setHistory(prev => [...prev, { id: uid(), assetId, action: "assign", memberId, date: new Date().toISOString().split("T")[0], note: "장비 배정" }]);
    setModalOpen(null);
  };

  const handleReturn = (assetId) => {
    const asset = getAsset(assetId);
    if (asset?.assignedTo) {
      setHistory(prev => [...prev, { id: uid(), assetId, action: "return", memberId: asset.assignedTo, date: new Date().toISOString().split("T")[0], note: "장비 반납" }]);
    }
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, assignedTo: null, status: "stock", isShared: false, sharedLabel: "" } : a));
  };

  const handleDeleteAsset = (id) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleDeleteMember = (id) => {
    const memberAssets = getMemberAssets(id);
    if (memberAssets.length > 0) {
      alert("배정된 장비가 있는 팀원은 삭제할 수 없습니다. 먼저 장비를 반납해주세요.");
      return;
    }
    if (confirm("정말 삭제하시겠습니까?")) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  /* ─────────────────────────────────────────────
     NAV
     ───────────────────────────────────────────── */
  const navItems = [
    { id: "dashboard", label: "대시보드", icon: BarChart3 },
    { id: "assets", label: "장비 관리", icon: Monitor },
    { id: "members", label: "팀원 관리", icon: Users },
    { id: "stock", label: "재고 관리", icon: Package },
    { id: "history", label: "이력 관리", icon: Clock },
  ];

  /* ─────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────── */
  const renderDashboard = () => {
    const statCards = [
      { label: "전체 장비", value: stats.total, color: "#6366f1", icon: Monitor },
      { label: "사용중", value: stats.inUse, color: "#10b981", icon: Check },
      { label: "재고", value: stats.stock, color: "#3b82f6", icon: Package },
      { label: "처분예정", value: stats.dispose, color: "#ef4444", icon: AlertCircle },
    ];

    const recentHistory = [...history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + "14", display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                <s.icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
          {/* Category breakdown */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #f0f0f0" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>카테고리별 장비</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CATEGORIES.filter(c => stats.byCategory[c] > 0).map(cat => (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, width: 100, fontSize: 13, color: "#555" }}>
                    <CategoryIcon category={cat} size={16} />
                    {cat}
                  </div>
                  <div style={{ flex: 1, height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(stats.byCategory[cat] / stats.total) * 100}%`, background: "linear-gradient(90deg, #6366f1, #818cf8)", borderRadius: 4, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", width: 30, textAlign: "right" }}>{stats.byCategory[cat]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team breakdown */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #f0f0f0" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>팀별 인원</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TEAMS.map(team => {
                const count = members.filter(m => m.team === team).length;
                const teamAssets = assets.filter(a => {
                  if (!a.assignedTo) return false;
                  const m = getMember(a.assignedTo);
                  return m && m.team === team;
                }).length;
                return (
                  <div key={team} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f8f9fb", borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{team}</div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{count}명</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#6366f1" }}>{teamAssets}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>배정 장비</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #f0f0f0" }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>최근 이력</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentHistory.map(h => {
              const asset = getAsset(h.assetId);
              const member = h.memberId ? getMember(h.memberId) : null;
              const actionLabel = h.action === "assign" ? "배정" : h.action === "return" ? "반납" : "상태변경";
              const actionColor = h.action === "assign" ? "#10b981" : h.action === "return" ? "#f59e0b" : "#6366f1";
              return (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: actionColor, flexShrink: 0 }} />
                  <span style={{ color: "#999", width: 80, flexShrink: 0 }}>{h.date}</span>
                  <span style={{ color: actionColor, fontWeight: 600, width: 50 }}>{actionLabel}</span>
                  <span style={{ color: "#333", fontWeight: 500 }}>{asset?.model || "알 수 없음"}</span>
                  {member && <span style={{ color: "#888" }}>→ {member.name}</span>}
                  <span style={{ color: "#aaa", marginLeft: "auto", fontSize: 12 }}>{h.note}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member equipment overview */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #f0f0f0", marginTop: 20 }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>팀원별 장비 현황</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "#888", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>팀원</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "#888", fontWeight: 600, fontSize: 11 }}>팀</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "#888", fontWeight: 600, fontSize: 11 }}>노트북</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "#888", fontWeight: 600, fontSize: 11 }}>모니터</th>
                  <th style={{ textAlign: "center", padding: "10px 14px", color: "#888", fontWeight: 600, fontSize: 11 }}>총 장비</th>
                </tr>
              </thead>
              <tbody>
                {members.slice(0, 15).map(m => {
                  const mAssets = getMemberAssets(m.id);
                  const laptops = mAssets.filter(a => a.category === "Laptop");
                  const monitors = mAssets.filter(a => a.category === "Monitor");
                  return (
                    <tr key={m.id} style={{ borderBottom: "1px solid #f5f5f5", cursor: "pointer" }} onClick={() => { setDetailItem(m); setPage("members"); }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1a1a2e" }}>{m.name}</td>
                      <td style={{ padding: "10px 14px", color: "#666" }}>{m.team}</td>
                      <td style={{ padding: "10px 14px", color: "#666" }}>{laptops.map(l => l.model).join(", ") || "-"}</td>
                      <td style={{ padding: "10px 14px", color: "#666" }}>{monitors.map(mo => mo.model).join(", ") || "-"}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#6366f1" }}>{mAssets.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ── ASSETS PAGE ── */
  const renderAssets = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 250px" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="모델명, 제조사, S/N, 사용자 검색..." style={{ ...inputStyle, paddingLeft: 38 }} />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...selectStyle, width: 140, flex: "none" }}>
          <option value="all">전체 카테고리</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...selectStyle, width: 130, flex: "none" }}>
          <option value="all">전체 상태</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={() => { setEditItem(null); setModalOpen("asset"); }} style={btnPrimary}>
          <Plus size={15} style={{ marginRight: 6, verticalAlign: -2 }} />장비 등록
        </button>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#fafafa", borderBottom: "2px solid #eee" }}>
              {["카테고리", "제조사", "모델명", "S/N", "상태", "사용자", "구입일", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: "#888", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map(a => {
              const member = a.assignedTo ? getMember(a.assignedTo) : null;
              const userLabel = member ? member.name : a.isShared ? a.sharedLabel : "-";
              return (
                <tr key={a.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#555" }}>
                      <CategoryIcon category={a.category} size={16} />
                      {a.category}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#555" }}>{a.manufacturer}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1a1a2e", cursor: "pointer" }} onClick={() => setDetailItem(a)}>{a.model}</td>
                  <td style={{ padding: "10px 14px", color: "#888", fontFamily: "monospace", fontSize: 11 }}>{a.serial || "-"}</td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status={a.status} /></td>
                  <td style={{ padding: "10px 14px", color: "#555", fontWeight: member ? 600 : 400 }}>{userLabel}</td>
                  <td style={{ padding: "10px 14px", color: "#888" }}>{a.purchaseDate || "-"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => { setEditItem(a); setModalOpen("asset"); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#888" }}><Edit3 size={14} /></button>
                      {a.status === "stock" && <button onClick={() => setModalOpen({ type: "assign", assetId: a.id })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#3b82f6" }}><UserPlus size={14} /></button>}
                      {a.assignedTo && <button onClick={() => handleReturn(a.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#f59e0b" }} title="반납"><ArrowLeft size={14} /></button>}
                      <button onClick={() => handleDeleteAsset(a.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#ef4444" }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredAssets.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: "#aaa" }}>
            <Package size={40} strokeWidth={1} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontSize: 14 }}>검색 결과가 없습니다</div>
          </div>
        )}
      </div>
    </div>
  );

  /* ── MEMBERS PAGE ── */
  const renderMembers = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 250px" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름, 팀, 직급 검색..." style={{ ...inputStyle, paddingLeft: 38 }} />
        </div>
        <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} style={{ ...selectStyle, width: 140, flex: "none" }}>
          <option value="all">전체 팀</option>
          {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => { setEditItem(null); setModalOpen("member"); }} style={btnPrimary}>
          <Plus size={15} style={{ marginRight: 6, verticalAlign: -2 }} />팀원 등록
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
        {filteredMembers.map(m => {
          const mAssets = getMemberAssets(m.id);
          return (
            <div key={m.id} style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f0f0f0", cursor: "pointer", transition: "box-shadow 0.2s" }} onClick={() => setDetailItem(m)}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{m.team} · {m.position}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={e => { e.stopPropagation(); setEditItem(m); setModalOpen("member"); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#888" }}><Edit3 size={14} /></button>
                  <button onClick={e => { e.stopPropagation(); handleDeleteMember(m.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#ef4444" }}><Trash2 size={14} /></button>
                </div>
              </div>
              {mAssets.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {mAssets.map(a => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#f8f9fb", borderRadius: 8, fontSize: 12 }}>
                      <CategoryIcon category={a.category} size={14} />
                      <span style={{ color: "#555", fontWeight: 500 }}>{a.manufacturer} {a.model}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "8px 10px", background: "#f8f9fb", borderRadius: 8, fontSize: 12, color: "#aaa", textAlign: "center" }}>
                  배정된 장비 없음
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ── STOCK PAGE ── */
  const renderStock = () => {
    const stockAssets = assets.filter(a => a.status === "stock");
    const disposeAssets = assets.filter(a => a.status === "dispose");
    const repairAssets = assets.filter(a => a.status === "repair");
    
    const renderStockTable = (items, title, emptyMsg) => (
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{title} <span style={{ color: "#888", fontWeight: 400, fontSize: 13 }}>({items.length})</span></h3>
        </div>
        {items.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                {["카테고리", "제조사", "모델명", "세부사양", "비고", "액션"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#888", fontWeight: 600, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#555" }}>
                      <CategoryIcon category={a.category} size={16} /> {a.category}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#555" }}>{a.manufacturer}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1a1a2e" }}>{a.model}</td>
                  <td style={{ padding: "10px 14px", color: "#888", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.spec || "-"}</td>
                  <td style={{ padding: "10px 14px", color: "#888", fontSize: 12 }}>{a.note || "-"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    {a.status === "stock" && (
                      <button onClick={() => setModalOpen({ type: "assign", assetId: a.id })} style={{ ...btnPrimary, padding: "6px 14px", fontSize: 12 }}>
                        <UserPlus size={12} style={{ marginRight: 4, verticalAlign: -1 }} />배정
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 13 }}>{emptyMsg}</div>
        )}
      </div>
    );

    return (
      <div>
        {renderStockTable(stockAssets, "재고 장비", "재고 장비가 없습니다")}
        {renderStockTable(repairAssets, "수리중", "수리중인 장비가 없습니다")}
        {renderStockTable(disposeAssets, "처분 예정", "처분 예정 장비가 없습니다")}
      </div>
    );
  };

  /* ── HISTORY PAGE ── */
  const renderHistory = () => {
    const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));
    return (
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#fafafa", borderBottom: "2px solid #eee" }}>
              {["날짜", "유형", "장비", "사용자", "메모"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: "#888", fontWeight: 600, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map(h => {
              const asset = getAsset(h.assetId);
              const member = h.memberId ? getMember(h.memberId) : null;
              const actionLabel = h.action === "assign" ? "배정" : h.action === "return" ? "반납" : "상태변경";
              const actionColor = h.action === "assign" ? "#10b981" : h.action === "return" ? "#f59e0b" : "#6366f1";
              return (
                <tr key={h.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "10px 14px", color: "#666" }}>{h.date}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: actionColor + "18", color: actionColor }}>{actionLabel}</span>
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 500, color: "#1a1a2e" }}>{asset ? `${asset.manufacturer} ${asset.model}` : "삭제된 장비"}</td>
                  <td style={{ padding: "10px 14px", color: "#555" }}>{member?.name || "-"}</td>
                  <td style={{ padding: "10px 14px", color: "#888", fontSize: 12 }}>{h.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  /* ── DETAIL PANEL ── */
  const renderDetail = () => {
    if (!detailItem) return null;
    const isAsset = !!detailItem.category;
    
    if (isAsset) {
      const assetHist = getAssetHistory(detailItem.id);
      const member = detailItem.assignedTo ? getMember(detailItem.assignedTo) : null;
      return (
        <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 440, background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.1)", zIndex: 500, overflow: "auto" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>장비 상세</h3>
            <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} /></button>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "#f0f0ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1" }}>
                <CategoryIcon category={detailItem.category} size={28} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>{detailItem.model}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{detailItem.manufacturer} · {detailItem.category}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              {[
                ["상태", <StatusBadge key="s" status={detailItem.status} />],
                ["사용자", member?.name || (detailItem.isShared ? detailItem.sharedLabel : "미배정")],
                ["S/N", detailItem.serial || "-"],
                ["구입일", detailItem.purchaseDate || "-"],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 600, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 600, marginBottom: 6 }}>세부사양</div>
              <div style={{ padding: 14, background: "#f8f9fb", borderRadius: 10, fontSize: 13, color: "#555", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{detailItem.spec || "-"}</div>
            </div>
            {detailItem.note && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 600, marginBottom: 6 }}>비고</div>
                <div style={{ padding: 14, background: "#fff8f0", borderRadius: 10, fontSize: 13, color: "#555" }}>{detailItem.note}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 }}>이력</div>
              {assetHist.length > 0 ? assetHist.map(h => {
                const hmember = h.memberId ? getMember(h.memberId) : null;
                return (
                  <div key={h.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #f5f5f5", fontSize: 12 }}>
                    <span style={{ color: "#999", width: 80 }}>{h.date}</span>
                    <span style={{ color: h.action === "assign" ? "#10b981" : "#f59e0b", fontWeight: 600, width: 40 }}>{h.action === "assign" ? "배정" : "반납"}</span>
                    <span style={{ color: "#555" }}>{hmember?.name || "-"}</span>
                    <span style={{ color: "#aaa", marginLeft: "auto" }}>{h.note}</span>
                  </div>
                );
              }) : <div style={{ padding: 20, textAlign: "center", color: "#ccc", fontSize: 13 }}>이력 없음</div>}
            </div>
          </div>
        </div>
      );
    } else {
      // Member detail
      const mAssets = getMemberAssets(detailItem.id);
      const memberHist = history.filter(h => h.memberId === detailItem.id).sort((a, b) => b.date.localeCompare(a.date));
      return (
        <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 440, background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.1)", zIndex: 500, overflow: "auto" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>팀원 상세</h3>
            <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} /></button>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22 }}>
                {detailItem.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>{detailItem.name}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{detailItem.team} · {detailItem.position}</div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 }}>배정 장비 ({mAssets.length})</div>
              {mAssets.length > 0 ? mAssets.map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8f9fb", borderRadius: 10, marginBottom: 8, cursor: "pointer" }} onClick={() => setDetailItem(a)}>
                  <CategoryIcon category={a.category} size={18} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{a.manufacturer} {a.model}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{a.spec}</div>
                  </div>
                </div>
              )) : <div style={{ padding: 20, textAlign: "center", color: "#ccc", fontSize: 13, background: "#f8f9fb", borderRadius: 10 }}>배정된 장비 없음</div>}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 }}>이력</div>
              {memberHist.length > 0 ? memberHist.map(h => {
                const asset = getAsset(h.assetId);
                return (
                  <div key={h.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #f5f5f5", fontSize: 12 }}>
                    <span style={{ color: "#999", width: 80 }}>{h.date}</span>
                    <span style={{ color: h.action === "assign" ? "#10b981" : "#f59e0b", fontWeight: 600, width: 40 }}>{h.action === "assign" ? "배정" : "반납"}</span>
                    <span style={{ color: "#555" }}>{asset?.model || "알 수 없음"}</span>
                  </div>
                );
              }) : <div style={{ padding: 20, textAlign: "center", color: "#ccc", fontSize: 13 }}>이력 없음</div>}
            </div>
          </div>
        </div>
      );
    }
  };

  /* ── ASSET FORM MODAL ── */
  const AssetForm = () => {
    const [form, setForm] = useState(editItem || { category: "Laptop", manufacturer: "", model: "", serial: "", spec: "", purchaseDate: "", status: "stock", assignedTo: null, note: "", isShared: false, sharedLabel: "" });
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="카테고리 *">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={selectStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="제조사 *">
            <input value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} style={inputStyle} placeholder="예: Apple, LG, Dell" />
          </FormField>
        </div>
        <FormField label="모델명 *">
          <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} style={inputStyle} placeholder="예: MacBook Pro 14" />
        </FormField>
        <FormField label="시리얼 번호 (S/N)">
          <input value={form.serial} onChange={e => setForm({ ...form, serial: e.target.value })} style={inputStyle} placeholder="예: FVFHM0J2Q6" />
        </FormField>
        <FormField label="세부사양">
          <textarea value={form.spec} onChange={e => setForm({ ...form, spec: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="CPU, RAM, SSD 등" />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="구입일">
            <input type="month" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} style={inputStyle} />
          </FormField>
          <FormField label="상태">
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={selectStyle}>
              {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </FormField>
        </div>
        <FormField label="배정 사용자">
          <select value={form.assignedTo || ""} onChange={e => setForm({ ...form, assignedTo: e.target.value || null })} style={selectStyle}>
            <option value="">미배정</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.team})</option>)}
          </select>
        </FormField>
        <FormField label="비고">
          <input value={form.note || ""} onChange={e => setForm({ ...form, note: e.target.value })} style={inputStyle} />
        </FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={() => { setModalOpen(null); setEditItem(null); }} style={btnSecondary}>취소</button>
          <button onClick={() => handleSaveAsset(form)} style={btnPrimary} disabled={!form.manufacturer || !form.model}>
            {editItem ? "수정" : "등록"}
          </button>
        </div>
      </div>
    );
  };

  /* ── MEMBER FORM MODAL ── */
  const MemberForm = () => {
    const [form, setForm] = useState(editItem || { name: "", team: TEAMS[0], position: "", email: "" });
    return (
      <div>
        <FormField label="이름 *">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="홍길동" />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="팀 *">
            <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} style={selectStyle}>
              {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="직급">
            <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={inputStyle} placeholder="과장" />
          </FormField>
        </div>
        <FormField label="이메일">
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="email@company.com" />
        </FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={() => { setModalOpen(null); setEditItem(null); }} style={btnSecondary}>취소</button>
          <button onClick={() => handleSaveMember(form)} style={btnPrimary} disabled={!form.name}>
            {editItem ? "수정" : "등록"}
          </button>
        </div>
      </div>
    );
  };

  /* ── ASSIGN MODAL ── */
  const AssignForm = () => {
    const [selectedMember, setSelectedMember] = useState("");
    const assetId = modalOpen?.assetId;
    const asset = getAsset(assetId);
    return (
      <div>
        <div style={{ padding: 14, background: "#f8f9fb", borderRadius: 10, marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
          <CategoryIcon category={asset?.category} size={20} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{asset?.manufacturer} {asset?.model}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{asset?.serial}</div>
          </div>
        </div>
        <FormField label="배정할 팀원 선택 *">
          <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} style={selectStyle}>
            <option value="">선택해주세요</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.team} · {m.position})</option>)}
          </select>
        </FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={() => setModalOpen(null)} style={btnSecondary}>취소</button>
          <button onClick={() => handleAssign(assetId, selectedMember)} style={btnPrimary} disabled={!selectedMember}>배정</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f5f6f8", color: "#333" }}>
      {/* SIDEBAR */}
      <div style={{ width: sidebarCollapsed ? 64 : 240, background: "#1a1a2e", color: "#fff", display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: sidebarCollapsed ? "20px 12px" : "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Monitor size={18} />
          </div>
          {!sidebarCollapsed && <div style={{ fontSize: 16, fontWeight: 800, whiteSpace: "nowrap" }}>Asset Manager</div>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => {
            const isActive = page === item.id;
            return (
              <button key={item.id} onClick={() => { setPage(item.id); setSearch(""); setFilterCategory("all"); setFilterStatus("all"); setFilterTeam("all"); setDetailItem(null); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: sidebarCollapsed ? "12px" : "12px 16px", borderRadius: 10, border: "none", background: isActive ? "rgba(99,102,241,0.25)" : "transparent", color: isActive ? "#818cf8" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14, fontWeight: isActive ? 600 : 400, marginBottom: 4, transition: "all 0.15s", fontFamily: "inherit", justifyContent: sidebarCollapsed ? "center" : "flex-start" }}>
                <item.icon size={18} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ margin: "0 8px 16px", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
          {sidebarCollapsed ? <ChevronRight size={16} /> : <span style={{ display: "flex", alignItems: "center", gap: 8 }}><ChevronDown size={16} style={{ transform: "rotate(90deg)" }} /> 사이드바 접기</span>}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>
              {navItems.find(n => n.id === page)?.label}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>
              {page === "dashboard" && "전체 장비 및 팀원 현황을 한눈에 확인하세요"}
              {page === "assets" && `총 ${assets.length}개의 장비가 등록되어 있습니다`}
              {page === "members" && `총 ${members.length}명의 팀원이 등록되어 있습니다`}
              {page === "stock" && `재고 ${stats.stock}개 · 수리중 ${stats.repair}개 · 처분예정 ${stats.dispose}개`}
              {page === "history" && `총 ${history.length}건의 이력이 기록되어 있습니다`}
            </p>
          </div>
        </div>

        {page === "dashboard" && renderDashboard()}
        {page === "assets" && renderAssets()}
        {page === "members" && renderMembers()}
        {page === "stock" && renderStock()}
        {page === "history" && renderHistory()}
      </div>

      {/* DETAIL PANEL */}
      {detailItem && renderDetail()}

      {/* MODALS */}
      <Modal isOpen={modalOpen === "asset"} onClose={() => { setModalOpen(null); setEditItem(null); }} title={editItem ? "장비 수정" : "장비 등록"}>
        <AssetForm />
      </Modal>
      <Modal isOpen={modalOpen === "member"} onClose={() => { setModalOpen(null); setEditItem(null); }} title={editItem ? "팀원 수정" : "팀원 등록"}>
        <MemberForm />
      </Modal>
      <Modal isOpen={modalOpen?.type === "assign"} onClose={() => setModalOpen(null)} title="장비 배정">
        <AssignForm />
      </Modal>
    </div>
  );
}
