export const CURRENT_DATE = "2026-11-19";

export const ALL_AVAILABLE_TABS = [
  { id: "command-center", label: "Command Center / My Workspace", description: "Ringkasan metrik, tugas harian, dan approval queue" },
  { id: "campaigns-hub", label: "Campaigns Hub", description: "Katalog program brand partner, brief, deliverables & event" },
  { id: "approval-center", label: "Approval Center", description: "Pusat persetujuan konten, draft review & log audit" },
  { id: "daily-checkins", label: "Daily Stand-Up & Check-In", description: "Laporan harian tim, tracking blocker, dan koordinasi" },
  { id: "monthly-report", label: "November Report & Analytics", description: "Laporan eksekutif, grafik analitik, dan export CSV" },
  { id: "user-management", label: "Pengaturan Tim & Pengguna", description: "Kelola akun pengguna, username, password, dan hak akses (Super Admin)" }
];

export const INITIAL_USERS = [
  { 
    id: "riki", 
    username: "riki",
    password: "riki123",
    name: "Riki", 
    roleLabel: "Head of Marketing", 
    role: "head_of_marketing", 
    avatar: "RK",
    email: "riki.marketing@yensbaby.id",
    phone: "+62 811-2345-6789",
    isSuperAdmin: true,
    allowedTabs: ["command-center", "campaigns-hub", "approval-center", "daily-checkins", "monthly-report", "user-management"]
  },
  { 
    id: "alvi", 
    username: "alvi",
    password: "alvi123",
    name: "Alvi", 
    roleLabel: "Social Media Coordinator", 
    role: "socmed_coordinator", 
    avatar: "AL",
    email: "alvi.socmed@yensbaby.id",
    phone: "+62 812-3456-7890",
    isSuperAdmin: false,
    allowedTabs: ["command-center", "campaigns-hub", "daily-checkins"]
  },
  { 
    id: "syntia", 
    username: "syntia",
    password: "syntia123",
    name: "Syntia", 
    roleLabel: "SocMed Execution & Ops", 
    role: "socmed_exec_ops", 
    avatar: "SY",
    email: "syntia.ops@yensbaby.id",
    phone: "+62 813-4567-8901",
    isSuperAdmin: false,
    allowedTabs: ["command-center", "campaigns-hub", "daily-checkins"]
  },
  { 
    id: "joe", 
    username: "joe",
    password: "joe123",
    name: "Joe", 
    roleLabel: "Social Media Execution", 
    role: "socmed_exec", 
    avatar: "JO",
    email: "joe.creative@yensbaby.id",
    phone: "+62 815-5678-9012",
    isSuperAdmin: false,
    allowedTabs: ["command-center", "campaigns-hub", "daily-checkins"]
  },
  { 
    id: "fanny", 
    username: "fanny",
    password: "fanny123",
    name: "Fanny", 
    roleLabel: "Marketing & Partnership", 
    role: "marketing_partnership", 
    avatar: "FA",
    email: "fanny.partner@yensbaby.id",
    phone: "+62 817-6789-0123",
    isSuperAdmin: false,
    allowedTabs: ["command-center", "campaigns-hub", "daily-checkins", "monthly-report"]
  }
];

export const TEAM_MEMBERS = INITIAL_USERS;

export const INITIAL_CAMPAIGNS = [
  {
    id: "cmp-pigeon-nov26",
    title: "Yen's x Pigeon: November Fun Fair",
    brandPartner: "Pigeon",
    periodStart: "2026-11-01",
    periodEnd: "2026-11-30",
    kpiLabel: "Target Net Sales",
    targetValue: 200000000,
    actualValue: 68500000,
    stores: ["Setiabudi", "Dakota", "TKI", "Lembang", "Tokem"],
    status: "Active",
    brief: "Promo Buy 1 Get 1 (selected bottles & baby care at Setiabudi), Special Deals (Buy 2 Disc 10%, Buy 3 Disc 15% across all Bandung stores), Bottle Trade-In, Big Roulette (min spend Rp 350k), weekly KOL push, and Photo Competition.",
    eventReadiness: {
      venueConfirmed: true,
      posmPrinted: 75,
      merchandiseReady: true,
      crewBriefed: true,
      notes: "Setup roulette booth di Yen's Setiabudi lobby utama lancar. Perlu follow up stock botol B1G1."
    }
  },
  {
    id: "cmp-libby-q4",
    title: "Yen's x Libby: Lucky Draw & Clearance",
    brandPartner: "Libby",
    periodStart: "2026-11-12",
    periodEnd: "2026-12-30",
    kpiLabel: "Target Net Sales (49 Days)",
    targetValue: 300000000,
    actualValue: 46200000,
    stores: ["Setiabudi", "Dakota", "TKI", "Lembang"],
    status: "Active",
    brief: "1 Lucky Draw coupon per Rp 25.000 Libby purchase (multiples apply), draw on 30 Dec 2026, prizes worth Rp 5 Juta, plus Libby Clearance Wagon at Setiabudi front area (10 Nov - 30 Dec 2026).",
    eventReadiness: {
      venueConfirmed: true,
      posmPrinted: 100,
      merchandiseReady: true,
      crewBriefed: true,
      notes: "Clearance wagon di depan Setiabudi sudah beroperasi dengan traffic tinggi. Kotak kupon undian siap."
    }
  },
  {
    id: "cmp-interbat-loyalty",
    title: "Yen's x Interbat: Smart Loyalty",
    brandPartner: "Interbat",
    periodStart: "2026-11-17",
    periodEnd: "2026-12-31",
    kpiLabel: "Target Ecosystem Points / Sales",
    targetValue: 150000000,
    actualValue: 18400000,
    stores: ["Setiabudi", "Dakota", "TKI", "Lembang", "Tokem"],
    status: "Active",
    brief: "1 Point per Rp 100.000 spend on Interbat ecosystem (Mustela, Motherlove, Interlac, Molagi, Dr. Teal's, Farlin, Laderma). 50 Points = Rp 50.000 Yen's dummy voucher for next purchase. Must register WA via QR & record receipt no.",
    eventReadiness: {
      venueConfirmed: true,
      posmPrinted: 40,
      merchandiseReady: true,
      crewBriefed: false,
      notes: "Kasir Dakota & TKI menunggu sosialisasi SOP validasi struk Interbat. Tent card sedang dicetak Joe."
    }
  },
  {
    id: "cmp-molagi-clay28",
    title: "Yen's x Molagi Bond: Canvas Clay Art Challenge",
    brandPartner: "Molagi",
    periodStart: "2026-11-28",
    periodEnd: "2026-11-28",
    kpiLabel: "Target Participants (Ages 3-6)",
    targetValue: 30,
    actualValue: 14,
    stores: ["Setiabudi"],
    status: "Planning",
    brief: "Kids 3D Canvas Clay Art Workshop & Competition on Sat, 28 Nov 2026 (10.00-12.00 WIB) at Yen's Setiabudi. Budget Rp 3.000.000 (Quotation & Invoice ready), 35 sets canvas/playdough, prizes Rp 500k / Rp 300k / Rp 200k.",
    eventReadiness: {
      venueConfirmed: true,
      posmPrinted: 20,
      merchandiseReady: false,
      crewBriefed: false,
      notes: "Area lantai 2 Setiabudi di-reserve. Tunggu invoice Molagi cair untuk belanja clay kit."
    }
  }
];

export const INITIAL_DELIVERABLES = [
  {
    id: "del-1",
    campaignId: "cmp-pigeon-nov26",
    title: "Publish Photo Competition Rules & Poster (Pigeon)",
    category: "Content/SocMed",
    picId: "alvi",
    deadline: "2026-11-18T17:00:00",
    priority: "High",
    status: "Need Approval",
    draftLink: "https://canva.com/example-pigeon-photocomp",
    notes: "Draft poster & caption siap di-review sebelum rilis photo competition.",
    revisionNotes: "",
    submittedAt: "2026-11-18T16:30:00"
  },
  {
    id: "del-2",
    campaignId: "cmp-pigeon-nov26",
    title: "Reels Promo Buy 1 Get 1 & Special Deals Pigeon",
    category: "Content/SocMed",
    picId: "joe",
    deadline: "2026-11-20T15:00:00",
    priority: "High",
    status: "In Progress",
    draftLink: "https://drive.google.com/example-pigeon-reels",
    notes: "Shooting di display Setiabudi, editing transisi botol T-Ester & Bath Care.",
    revisionNotes: "",
    submittedAt: "2026-11-18T10:00:00"
  },
  {
    id: "del-3",
    campaignId: "cmp-pigeon-nov26",
    title: "WA Blast Jastiper Pigeon (B1G1 + Special Deals)",
    category: "Content/SocMed",
    picId: "syntia",
    deadline: "2026-11-19T14:00:00",
    priority: "High",
    status: "Need Approval",
    draftLink: "https://docs.google.com/example-jastiper-blast",
    notes: "Mohon approval caption blast grup jastiper sebelum dikirim siang ini.",
    revisionNotes: "",
    submittedAt: "2026-11-19T09:15:00"
  },
  {
    id: "del-4",
    campaignId: "cmp-libby-q4",
    title: "Feed & Story Announcement Libby Lucky Draw",
    category: "Content/SocMed",
    picId: "syntia",
    deadline: "2026-11-16T17:00:00",
    priority: "High",
    status: "Published/Done",
    draftLink: "https://instagram.com/example-libby-post",
    notes: "Sudah tayang di IG Feed & Story.",
    revisionNotes: "",
    submittedAt: "2026-11-16T15:00:00"
  },
  {
    id: "del-5",
    campaignId: "cmp-interbat-loyalty",
    title: "Cetak Tent Card QR Smart Loyalty Tiap Kasir",
    category: "Store Collateral/POSM",
    picId: "joe",
    deadline: "2026-11-20T16:00:00",
    priority: "High",
    status: "In Progress",
    draftLink: "https://canva.com/example-interbat-tentcard",
    notes: "Menyesuaikan QR pendaftaran member & alur input nomor struk.",
    revisionNotes: "",
    submittedAt: "2026-11-18T11:00:00"
  },
  {
    id: "del-6",
    campaignId: "cmp-molagi-clay28",
    title: "Kirim Quotation & Invoice Rp 3.000.000 ke Molagi",
    category: "Admin/B2B",
    picId: "fanny",
    deadline: "2026-11-19T16:00:00",
    priority: "High",
    status: "In Progress",
    draftLink: "https://drive.google.com/example-molagi-inv-qtn",
    notes: "Menunggu konfirmasi detail NPWP / PIC finance Molagi.",
    revisionNotes: "",
    submittedAt: "2026-11-18T14:20:00"
  }
];

export const INITIAL_KOL_SLOTS = [
  { 
    id: "kol-1", 
    campaignId: "cmp-pigeon-nov26", 
    week: "Week 1 (1–7 Nov)", 
    kolName: "@mommy.bandung1", 
    picId: "fanny", 
    status: "Published", 
    publishDate: "2026-11-05",
    deliverableType: "IG Reel + 3 IG Stories",
    followers: "45.2K",
    er: "4.8%",
    link: "https://instagram.com/mommy.bandung1"
  },
  { 
    id: "kol-2", 
    campaignId: "cmp-pigeon-nov26", 
    week: "Week 2 (8–14 Nov)", 
    kolName: "@ceritasi kecil_bdg", 
    picId: "fanny", 
    status: "Published", 
    publishDate: "2026-11-12",
    deliverableType: "IG Reel + Visit Store Setiabudi",
    followers: "62.1K",
    er: "5.2%",
    link: "https://instagram.com/ceritasikecil_bdg"
  },
  { 
    id: "kol-3", 
    campaignId: "cmp-pigeon-nov26", 
    week: "Week 3 (15–21 Nov)", 
    kolName: "", 
    picId: "fanny", 
    status: "Slot Empty", 
    publishDate: "",
    deliverableType: "IG Reel + Story Swipe Up",
    followers: "-",
    er: "-",
    link: ""
  },
  { 
    id: "kol-4", 
    campaignId: "cmp-pigeon-nov26", 
    week: "Week 4 (22–30 Nov)", 
    kolName: "@parenting.harian", 
    picId: "fanny", 
    status: "Briefed", 
    publishDate: "2026-11-25",
    deliverableType: "Carousel + IG Live 15 mins",
    followers: "88.4K",
    er: "3.9%",
    link: "https://instagram.com/parenting.harian"
  },
  { 
    id: "kol-5", 
    campaignId: "cmp-libby-q4", 
    week: "Week 3 (15–21 Nov)", 
    kolName: "@bunda.kece.bdg", 
    picId: "fanny", 
    status: "Draft Review", 
    publishDate: "2026-11-20",
    deliverableType: "IG Reel (Clearance Wagon Showcase)",
    followers: "31.8K",
    er: "6.1%",
    link: "https://instagram.com/bunda.kece.bdg"
  }
];

export const INITIAL_CHECKINS = [
  {
    id: "chk-1",
    date: "2026-11-19",
    userId: "fanny",
    doneYesterday: "Menyiapkan kelengkapan dokumen kerja sama & koordinasi awal dengan tim Molagi.",
    focusToday: "Mengunci 1 KOL pengganti untuk slot Pigeon Week 3 yang kosong dan follow-up invoice Molagi.",
    hasBlocker: true,
    blockerDetail: "Slot KOL Pigeon minggu ke-3 belum ada yang tayang; perlu konfirmasi cepat momfluencer hari ini.",
    resolved: false,
    timestamp: "2026-11-19T08:45:00"
  },
  {
    id: "chk-2",
    date: "2026-11-19",
    userId: "alvi",
    doneYesterday: "Menyusun draf mekanisme & materi awal Photo Competition Pigeon.",
    focusToday: "Finalisasi draf Photo Competition dan koordinasi jadwal upload dengan Syntia & Joe.",
    hasBlocker: false,
    blockerDetail: "",
    resolved: true,
    timestamp: "2026-11-19T09:00:00"
  },
  {
    id: "chk-3",
    date: "2026-11-19",
    userId: "syntia",
    doneYesterday: "Menyiapkan draf caption blast jastiper untuk promo Pigeon.",
    focusToday: "Mengirim blast WA jastiper setelah di-approve Riki dan memantau respons.",
    hasBlocker: false,
    blockerDetail: "",
    resolved: true,
    timestamp: "2026-11-19T09:10:00"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    deliverableId: "del-4",
    deliverableTitle: "Feed & Story Announcement Libby Lucky Draw",
    action: "Approved",
    actorId: "riki",
    actorName: "Riki (Head of Marketing)",
    timestamp: "2026-11-16T16:10:00",
    note: "Visual & copy sesuai tema Q4 Lucky Draw. Siap tayang."
  },
  {
    id: "log-2",
    deliverableId: "del-1",
    deliverableTitle: "Publish Photo Competition Rules & Poster (Pigeon)",
    action: "Submitted for Review",
    actorId: "alvi",
    actorName: "Alvi (Social Media Coordinator)",
    timestamp: "2026-11-18T16:30:00",
    note: "Revisi layout hadiah sudah disesuaikan dengan sponsor Pigeon."
  }
];
