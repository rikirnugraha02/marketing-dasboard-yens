-- ==============================================================================
-- YEN'S MARKETING COMMAND CENTER - SUPABASE REALTIME SCHEMA & SEED DATA
-- Copy and paste this script into Supabase SQL Editor, then click "RUN".
-- ==============================================================================

-- 1. DROP EXISTING TABLES (IF ANY)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS kol_slots CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;

-- 2. CREATE TABLES

-- Users & Accounts Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role_label TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  email TEXT,
  phone TEXT,
  is_super_admin BOOLEAN DEFAULT FALSE,
  allowed_tabs JSONB DEFAULT '["command-center", "campaigns-hub", "daily-checkins"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns Table
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand_partner TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  kpi_label TEXT NOT NULL,
  target_value NUMERIC NOT NULL DEFAULT 0,
  actual_value NUMERIC NOT NULL DEFAULT 0,
  stores JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'Active',
  brief TEXT,
  event_readiness JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliverables Table
CREATE TABLE deliverables (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  pic_id TEXT NOT NULL,
  deadline TEXT,
  priority TEXT NOT NULL DEFAULT 'High',
  status TEXT NOT NULL DEFAULT 'In Progress',
  draft_link TEXT,
  notes TEXT,
  revision_notes TEXT DEFAULT '',
  submitted_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KOL Slots Table
CREATE TABLE kol_slots (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  week TEXT NOT NULL,
  kol_name TEXT DEFAULT '',
  pic_id TEXT NOT NULL DEFAULT 'fanny',
  status TEXT NOT NULL DEFAULT 'Slot Empty',
  publish_date TEXT DEFAULT '',
  deliverable_type TEXT DEFAULT 'IG Reel + Story',
  followers TEXT DEFAULT '-',
  er TEXT DEFAULT '-',
  link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Check-ins Table
CREATE TABLE checkins (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  user_id TEXT NOT NULL,
  done_yesterday TEXT NOT NULL,
  focus_today TEXT NOT NULL,
  has_blocker BOOLEAN NOT NULL DEFAULT FALSE,
  blocker_detail TEXT DEFAULT '',
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  timestamp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  deliverable_id TEXT NOT NULL,
  deliverable_title TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS) WITH PUBLIC ACCESS POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE kol_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access to users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to campaigns" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to deliverables" ON deliverables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to kol_slots" ON kol_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to checkins" ON checkins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

-- 4. ENABLE REALTIME BROADCAST
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE deliverables;
ALTER PUBLICATION supabase_realtime ADD TABLE kol_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE checkins;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;

-- 5. INSERT INITIAL SEED DATA (NOVEMBER 2026)

-- Users Seed
INSERT INTO users (id, name, username, password, role_label, role, avatar, email, phone, is_super_admin, allowed_tabs)
VALUES
(
  'riki',
  'Riki',
  'riki',
  'riki123',
  'Head of Marketing',
  'head_of_marketing',
  'RK',
  'riki.marketing@yensbaby.id',
  '+62 811-2345-6789',
  TRUE,
  '["command-center", "campaigns-hub", "approval-center", "daily-checkins", "monthly-report", "user-management"]'::jsonb
),
(
  'alvi',
  'Alvi',
  'alvi',
  'alvi123',
  'Social Media Coordinator',
  'socmed_coordinator',
  'AL',
  'alvi.socmed@yensbaby.id',
  '+62 812-3456-7890',
  FALSE,
  '["command-center", "campaigns-hub", "daily-checkins"]'::jsonb
),
(
  'syntia',
  'Syntia',
  'syntia',
  'syntia123',
  'SocMed Execution & Ops',
  'socmed_exec_ops',
  'SY',
  'syntia.ops@yensbaby.id',
  '+62 813-4567-8901',
  FALSE,
  '["command-center", "campaigns-hub", "daily-checkins"]'::jsonb
),
(
  'joe',
  'Joe',
  'joe',
  'joe123',
  'Social Media Execution',
  'socmed_exec',
  'JO',
  'joe.creative@yensbaby.id',
  '+62 815-5678-9012',
  FALSE,
  '["command-center", "campaigns-hub", "daily-checkins"]'::jsonb
),
(
  'fanny',
  'Fanny',
  'fanny',
  'fanny123',
  'Marketing & Partnership',
  'marketing_partnership',
  'FA',
  'fanny.partner@yensbaby.id',
  '+62 817-6789-0123',
  FALSE,
  '["command-center", "campaigns-hub", "daily-checkins", "monthly-report"]'::jsonb
);

-- Campaigns Seed
INSERT INTO campaigns (id, title, brand_partner, period_start, period_end, kpi_label, target_value, actual_value, stores, status, brief, event_readiness)
VALUES 
(
  'cmp-pigeon-nov26',
  'Yen''s x Pigeon: November Fun Fair',
  'Pigeon',
  '2026-11-01',
  '2026-11-30',
  'Target Net Sales',
  200000000,
  68500000,
  '["Setiabudi", "Dakota", "TKI", "Lembang", "Tokem"]'::jsonb,
  'Active',
  'Promo Buy 1 Get 1 (selected bottles & baby care at Setiabudi), Special Deals (Buy 2 Disc 10%, Buy 3 Disc 15% across all Bandung stores), Bottle Trade-In, Big Roulette (min spend Rp 350k), weekly KOL push, and Photo Competition.',
  '{"venueConfirmed": true, "posmPrinted": 75, "merchandiseReady": true, "crewBriefed": true, "notes": "Setup roulette booth di Yen''s Setiabudi lobby utama lancar. Perlu follow up stock botol B1G1."}'::jsonb
),
(
  'cmp-libby-q4',
  'Yen''s x Libby: Lucky Draw & Clearance',
  'Libby',
  '2026-11-12',
  '2026-12-30',
  'Target Net Sales (49 Days)',
  300000000,
  46200000,
  '["Setiabudi", "Dakota", "TKI", "Lembang"]'::jsonb,
  'Active',
  '1 Lucky Draw coupon per Rp 25.000 Libby purchase (multiples apply), draw on 30 Dec 2026, prizes worth Rp 5 Juta, plus Libby Clearance Wagon at Setiabudi front area (10 Nov - 30 Dec 2026).',
  '{"venueConfirmed": true, "posmPrinted": 100, "merchandiseReady": true, "crewBriefed": true, "notes": "Clearance wagon di depan Setiabudi sudah beroperasi dengan traffic tinggi. Kotak kupon undian siap."}'::jsonb
),
(
  'cmp-interbat-loyalty',
  'Yen''s x Interbat: Smart Loyalty',
  'Interbat',
  '2026-11-17',
  '2026-12-31',
  'Target Ecosystem Points / Sales',
  150000000,
  18400000,
  '["Setiabudi", "Dakota", "TKI", "Lembang", "Tokem"]'::jsonb,
  'Active',
  '1 Point per Rp 100.000 spend on Interbat ecosystem (Mustela, Motherlove, Interlac, Molagi, Dr. Teal''s, Farlin, Laderma). 50 Points = Rp 50.000 Yen''s dummy voucher for next purchase. Must register WA via QR & record receipt no.',
  '{"venueConfirmed": true, "posmPrinted": 40, "merchandiseReady": true, "crewBriefed": false, "notes": "Kasir Dakota & TKI menunggu sosialisasi SOP validasi struk Interbat. Tent card sedang dicetak Joe."}'::jsonb
),
(
  'cmp-molagi-clay28',
  'Yen''s x Molagi Bond: Canvas Clay Art Challenge',
  'Molagi',
  '2026-11-28',
  '2026-11-28',
  'Target Participants (Ages 3-6)',
  30,
  14,
  '["Setiabudi"]'::jsonb,
  'Planning',
  'Kids 3D Canvas Clay Art Workshop & Competition on Sat, 28 Nov 2026 (10.00-12.00 WIB) at Yen''s Setiabudi. Budget Rp 3.000.000 (Quotation & Invoice ready), 35 sets canvas/playdough, prizes Rp 500k / Rp 300k / Rp 200k.',
  '{"venueConfirmed": true, "posmPrinted": 20, "merchandiseReady": false, "crewBriefed": false, "notes": "Area lantai 2 Setiabudi di-reserve. Tunggu invoice Molagi cair untuk belanja clay kit."}'::jsonb
);

-- Deliverables Seed
INSERT INTO deliverables (id, campaign_id, title, category, pic_id, deadline, priority, status, draft_link, notes, revision_notes, submitted_at)
VALUES
(
  'del-1',
  'cmp-pigeon-nov26',
  'Publish Photo Competition Rules & Poster (Pigeon)',
  'Content/SocMed',
  'alvi',
  '2026-11-18T17:00:00',
  'High',
  'Need Approval',
  'https://canva.com/example-pigeon-photocomp',
  'Draft poster & caption siap di-review sebelum rilis photo competition.',
  '',
  '2026-11-18T16:30:00'
),
(
  'del-2',
  'cmp-pigeon-nov26',
  'Reels Promo Buy 1 Get 1 & Special Deals Pigeon',
  'Content/SocMed',
  'joe',
  '2026-11-20T15:00:00',
  'High',
  'In Progress',
  'https://drive.google.com/example-pigeon-reels',
  'Shooting di display Setiabudi, editing transisi botol T-Ester & Bath Care.',
  '',
  '2026-11-18T10:00:00'
),
(
  'del-3',
  'cmp-pigeon-nov26',
  'WA Blast Jastiper Pigeon (B1G1 + Special Deals)',
  'Content/SocMed',
  'syntia',
  '2026-11-19T14:00:00',
  'High',
  'Need Approval',
  'https://docs.google.com/example-jastiper-blast',
  'Mohon approval caption blast grup jastiper sebelum dikirim siang ini.',
  '',
  '2026-11-19T09:15:00'
),
(
  'del-4',
  'cmp-libby-q4',
  'Feed & Story Announcement Libby Lucky Draw',
  'Content/SocMed',
  'syntia',
  '2026-11-16T17:00:00',
  'High',
  'Published/Done',
  'https://instagram.com/example-libby-post',
  'Sudah tayang di IG Feed & Story.',
  '',
  '2026-11-16T15:00:00'
),
(
  'del-5',
  'cmp-interbat-loyalty',
  'Cetak Tent Card QR Smart Loyalty Tiap Kasir',
  'Store Collateral/POSM',
  'joe',
  '2026-11-20T16:00:00',
  'High',
  'In Progress',
  'https://canva.com/example-interbat-tentcard',
  'Menyesuaikan QR pendaftaran member & alur input nomor struk.',
  '',
  '2026-11-18T11:00:00'
),
(
  'del-6',
  'cmp-molagi-clay28',
  'Kirim Quotation & Invoice Rp 3.000.000 ke Molagi',
  'Admin/B2B',
  'fanny',
  '2026-11-19T16:00:00',
  'High',
  'In Progress',
  'https://drive.google.com/example-molagi-inv-qtn',
  'Menunggu konfirmasi detail NPWP / PIC finance Molagi.',
  '',
  '2026-11-18T14:20:00'
);

-- KOL Slots Seed
INSERT INTO kol_slots (id, campaign_id, week, kol_name, pic_id, status, publish_date, deliverable_type, followers, er, link)
VALUES
(
  'kol-1',
  'cmp-pigeon-nov26',
  'Week 1 (1–7 Nov)',
  '@mommy.bandung1',
  'fanny',
  'Published',
  '2026-11-05',
  'IG Reel + 3 IG Stories',
  '45.2K',
  '4.8%',
  'https://instagram.com/mommy.bandung1'
),
(
  'kol-2',
  'cmp-pigeon-nov26',
  'Week 2 (8–14 Nov)',
  '@ceritasi kecil_bdg',
  'fanny',
  'Published',
  '2026-11-12',
  'IG Reel + Visit Store Setiabudi',
  '62.1K',
  '5.2%',
  'https://instagram.com/ceritasikecil_bdg'
),
(
  'kol-3',
  'cmp-pigeon-nov26',
  'Week 3 (15–21 Nov)',
  '',
  'fanny',
  'Slot Empty',
  '',
  'IG Reel + Story Swipe Up',
  '-',
  '-',
  ''
),
(
  'kol-4',
  'cmp-pigeon-nov26',
  'Week 4 (22–30 Nov)',
  '@parenting.harian',
  'fanny',
  'Briefed',
  '2026-11-25',
  'Carousel + IG Live 15 mins',
  '88.4K',
  '3.9%',
  'https://instagram.com/parenting.harian'
),
(
  'kol-5',
  'cmp-libby-q4',
  'Week 3 (15–21 Nov)',
  '@bunda.kece.bdg',
  'fanny',
  'Draft Review',
  '2026-11-20',
  'IG Reel (Clearance Wagon Showcase)',
  '31.8K',
  '6.1%',
  'https://instagram.com/bunda.kece.bdg'
);

-- Checkins Seed
INSERT INTO checkins (id, date, user_id, done_yesterday, focus_today, has_blocker, blocker_detail, resolved, timestamp)
VALUES
(
  'chk-1',
  '2026-11-19',
  'fanny',
  'Menyiapkan kelengkapan dokumen kerja sama & koordinasi awal dengan tim Molagi.',
  'Mengunci 1 KOL pengganti untuk slot Pigeon Week 3 yang kosong dan follow-up invoice Molagi.',
  TRUE,
  'Slot KOL Pigeon minggu ke-3 belum ada yang tayang; perlu konfirmasi cepat momfluencer hari ini.',
  FALSE,
  '2026-11-19T08:45:00'
),
(
  'chk-2',
  '2026-11-19',
  'alvi',
  'Menyusun draf mekanisme & materi awal Photo Competition Pigeon.',
  'Finalisasi draf Photo Competition dan koordinasi jadwal upload dengan Syntia & Joe.',
  FALSE,
  '',
  TRUE,
  '2026-11-19T09:00:00'
),
(
  'chk-3',
  '2026-11-19',
  'syntia',
  'Menyiapkan draf caption blast jastiper untuk promo Pigeon.',
  'Mengirim blast WA jastiper setelah di-approve Riki dan memantau respons.',
  FALSE,
  '',
  TRUE,
  '2026-11-19T09:10:00'
);

-- Audit Logs Seed
INSERT INTO audit_logs (id, deliverable_id, deliverable_title, action, actor_id, actor_name, timestamp, note)
VALUES
(
  'log-1',
  'del-4',
  'Feed & Story Announcement Libby Lucky Draw',
  'Approved',
  'riki',
  'Riki (Head of Marketing)',
  '2026-11-16 16:10:00',
  'Visual & copy sesuai tema Q4 Lucky Draw. Siap tayang.'
),
(
  'log-2',
  'del-1',
  'Publish Photo Competition Rules & Poster (Pigeon)',
  'Submitted for Review',
  'alvi',
  'Alvi (Social Media Coordinator)',
  '2026-11-18 16:30:00',
  'Revisi layout hadiah sudah disesuaikan dengan sponsor Pigeon.'
);
