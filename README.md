# Yen's Marketing Command Center (November 2026)

Aplikasi web dashboard eksekutif dan pusat kendali tim marketing **Yen's Baby & Kid Shop** berbasis **React**, **Tailwind CSS**, **lucide-react**, dan **Supabase Realtime Database** dengan sistem autentikasi akun & Role-Based Access Control (RBAC).

---

## 🔐 Kredensial Login Akun Tim

Semua pengguna harus login terlebih dahulu untuk mengakses sistem. Tersedia juga tombol **1-Click Quick Access** di halaman login untuk pengujian cepat:

| Nama Pengguna | Username | Password | Role / Jabatan | Hak Akses Modul / Tab |
|---|---|---|---|---|
| 👑 **Riki** | `riki` | `riki123` | **Super Admin** & Head of Marketing | **Akses Penuh (All Tabs)** Termasuk Pengaturan Tim & Akun |
| **Alvi** | `alvi` | `alvi123` | Social Media Coordinator | My Workspace, Campaigns Hub, Daily Stand-Up |
| **Syntia** | `syntia` | `syntia123` | SocMed Execution & Ops | My Workspace, Campaigns Hub, Daily Stand-Up |
| **Joe** | `joe` | `joe123` | Social Media Execution | My Workspace, Campaigns Hub, Daily Stand-Up |
| **Fanny** | `fanny` | `fanny123` | Marketing & Partnership | My Workspace, Campaigns Hub, Daily Stand-Up, November Report |

---

## 👑 Fitur Super Admin (Khusus Riki)

Sebagai **Super Admin**, Riki memiliki modul khusus di sidebar kiri: **"Pengaturan Tim & Pengguna"**:
1. **Kelola Akun & Kredensial:**
   - Tambah personil baru atau edit akun yang sudah ada.
   - Mengubah nama, username login, password akun (dilengkapi tombol lihat/sembunyikan password).
   - Mengubah jabatan / role label serta nomor WhatsApp dan email tim.
2. **Kontrol Hak Akses Tab (RBAC):**
   - Mengatur izin tab mana saja yang boleh dibuka oleh masing-masing personil (*Command Center, Campaigns Hub, Approval Center, Daily Stand-Up, November Report*).
   - Anggota tim biasa hanya dapat melihat tab yang telah ditentukan oleh Riki. Tab yang tidak diizinkan otomatis tersembunyi dari menu dan dilindungi sistem proteksi rute.
3. **Pusat Approval 1-Klik:**
   - Menyetujui konten (*Approve*) atau meminta revisi (*Request Revision*) dengan catatan otomatis.

---

## 🚀 Fitur Unggulan Lainnya

1. **Sinkronisasi Database Cloud Realtime (Supabase):**
   - Data tersinkronisasi otomatis antar pengguna secara live via WebSockets.
   - Tetap mendukung mode *Offline / LocalStorage Fallback* jika koneksi database terputus.
2. **Notifikasi WhatsApp & Telegram:**
   - Tombol 1-klik kirim peringatan kendala (*Active Blocker*) ke WhatsApp Riki.
   - Tombol pengingat persetujuan materi (*Approval Request*) dan pengiriman catatan revisi ke PIC via WhatsApp.
3. **Grafik Analitik & Ekspor Laporan:**
   - Grafik interaktif *Target vs Realisasi Net Sales*, *Distribusi Status Deliverable*, dan *Sebaran Program per Outlet Toko*.
   - Tombol **Export Tasks CSV** dan **Export Sales CSV** (format UTF-8 BOM kompatibel Microsoft Excel).
   - Tampilan resmi cetak laporan eksekutif (*Print / PDF*).
