# Yen's Marketing Command Center (November 2026)

Aplikasi web dashboard eksekutif dan pusat kendali tim marketing **Yen's Baby & Kid Shop** berbasis **React**, **Tailwind CSS**, dan **lucide-react**, dilengkapi persistensi data interaktif menggunakan `localStorage`.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi saat ini sudah aktif berjalan di:
- **URL Lokal**: [http://localhost:3000/](http://localhost:3000/)
- **Network URL**: `http://192.168.11.225:3000/`

Jika Anda ingin menjalankan ulang secara manual dari terminal:
```bash
# Menjalankan development server
npm run dev

# Membangun produksi (Production Build)
npm run build
```

---

## 🌟 Fitur Utama & Panduan Pengujian

### 1. **Role Switcher (Live Preview 5 Anggota Tim)**
Gunakan dropdown **Role Preview** di bagian atas sidebar kiri untuk beralih perspektif:
1. **Riki (Head of Marketing)**: Melihat *Critical Attention Alert Banner* (Overdue task, Empty KOL Slot, Active Blocker), *1-Click Approval Queue*, kartu progres target KPI brand partner (Pigeon, Libby, Interbat, Molagi), dan *Team Daily Stand-Up Tracker*.
2. **Alvi (Social Media Coordinator)**: Melihat task konten IG Photo Competition Pigeon, status stand-up harian, dan notifikasi approval.
3. **Syntia (SocMed Execution & Ops)**: Melihat draft WA Blast jastiper, materi pengumuman Lucky Draw Libby.
4. **Joe (Social Media Execution)**: Melihat task video reels Pigeon & cetak tent card QR Smart Loyalty kasir Interbat.
5. **Fanny (Marketing & Partnership)**: Melihat koordinasi B2B invoice Molagi dan slot influencer mingguan.

### 2. **1-Click Live Approval Flow & Revisions**
- Klik tombol **Approve (1-Click)** pada materi seperti poster Photo Competition Pigeon atau WA Blast Jastiper. Item langsung ter-update menjadi `Approved`, berkurang dari antrean pending, dan tercatat otomatis di **Log Audit Persetujuan**.
- Klik tombol **Request Revision** untuk memasukkan catatan penyesuaian khusus. Status item akan beralih menjadi `Revision` dengan kotak peringatan amber bagi PIC yang ditugaskan.

### 3. **Critical Attention Banner (Red Alert Strip)**
Secara otomatis mendeteksi dan menyorot:
- **Slot KOL Kosong**: Slot KOL Minggu ke-3 (15–21 Nov) pada kampanye Pigeon.
- **Overdue Deliverables**: Tenggat waktu pengerjaan sebelum 19 Nov 2026.
- **Active Team Blockers**: Laporan kendala belum terselesaikan (misal: kendala konfirmasi slot momfluencer oleh Fanny) dengan tombol *1-Click Mark Resolved*.

### 4. **Campaigns & Programs Hub (Modal 4 Tab)**
Buka detail setiap program untuk melihat modal komprehensif:
- **Tab 1: Program Brief & SKP**: Deskripsi promo (B1G1, Lucky Draw, Smart Loyalty point, Clay Art challenge), target angka, dan outlet yang berpartisipasi.
- **Tab 2: Deliverables Checklist**: Daftar task, tenggat waktu, dan toggle status pengerjaan.
- **Tab 3: Weekly KOL Matrix**: Manajemen jadwal momfluencer mingguan + form langsung untuk mengisi slot kosong.
- **Tab 4: Event Readiness**: Kesiapan venue, briefing crew kasir, POSM cetak progress bar, dan catatan operasional.
- Tombol **+ Add Task / Deliverable**: Menambahkan tugas baru secara real-time ke PIC mana pun.

### 5. **30s Daily Check-In & Stand-Up Board**
- Form modal cepat untuk melaporkan *Done Yesterday*, *Focus Today*, dan *Kendala/Blocker*.
- Filter *Active Blockers Only* untuk fokus membantu menyelesaikan hambatan tim.

### 6. **November 2026 Monthly Report & Executive Print View**
- Rangkuman total pencapaian Net Sales (Realisasi vs Target), tingkat penyelesaian deliverable tim, dan status aktivasi KOL mingguan.
- Tata letak resmi eksekutif dengan tombol **Print / Executive View** yang siap dicetak bersih (tanpa sidebar/header).
