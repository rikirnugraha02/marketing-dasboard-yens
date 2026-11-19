import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Check, 
  X, 
  Sparkles,
  Smartphone,
  Mail,
  Shield,
  Layers,
  CheckSquare,
  CalendarCheck,
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_AVAILABLE_TABS } from '../data/mockData';

export const UserManagement = () => {
  const { 
    currentUser, 
    users, 
    addUser, 
    updateUser, 
    deleteUser 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleLabel, setRoleLabel] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [allowedTabs, setAllowedTabs] = useState(['command-center', 'campaigns-hub', 'daily-checkins']);

  const toggleShowPassword = (userId) => {
    setShowPasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName('');
    setUsername('');
    setPassword('yens123');
    setRoleLabel('Social Media Executive');
    setEmail('');
    setPhone('+62 8');
    setIsSuperAdmin(false);
    setAllowedTabs(['command-center', 'campaigns-hub', 'daily-checkins']);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setEditingUser(u);
    setName(u.name);
    setUsername(u.username);
    setPassword(u.password);
    setRoleLabel(u.roleLabel);
    setEmail(u.email || '');
    setPhone(u.phone || '');
    setIsSuperAdmin(Boolean(u.isSuperAdmin));
    setAllowedTabs(u.allowedTabs || ['command-center', 'campaigns-hub', 'daily-checkins']);
    setIsModalOpen(true);
  };

  const handleToggleTab = (tabId) => {
    setAllowedTabs(prev => {
      if (prev.includes(tabId)) {
        if (prev.length === 1) {
          alert("Pengguna harus memiliki setidaknya 1 tab yang dapat diakses.");
          return prev;
        }
        return prev.filter(t => t !== tabId);
      } else {
        return [...prev, tabId];
      }
    });
  };

  const handleSelectAllTabs = () => {
    setAllowedTabs(ALL_AVAILABLE_TABS.map(t => t.id));
  };

  const handleSelectStandardTabs = () => {
    setAllowedTabs(['command-center', 'campaigns-hub', 'daily-checkins']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !password.trim() || !roleLabel.trim()) {
      alert("Harap lengkapi nama, username, password, dan jabatan.");
      return;
    }

    // Check duplicate username if adding new
    if (!editingUser) {
      const exists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (exists) {
        alert(`Username "${username}" sudah digunakan. Gunakan username lain.`);
        return;
      }
    }

    const userData = {
      name: name.trim(),
      username: username.trim(),
      password: password.trim(),
      roleLabel: roleLabel.trim(),
      role: editingUser ? editingUser.role : roleLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'),
      avatar: name.trim().substring(0, 2).toUpperCase(),
      email: email.trim(),
      phone: phone.trim(),
      isSuperAdmin,
      allowedTabs: isSuperAdmin ? ALL_AVAILABLE_TABS.map(t => t.id) : allowedTabs
    };

    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (userId, userName) => {
    if (userId === currentUser.id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${userName}?`)) {
      deleteUser(userId);
    }
  };

  const getTabBadgeColor = (tabId) => {
    switch (tabId) {
      case 'command-center': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'campaigns-hub': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'approval-center': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'daily-checkins': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'monthly-report': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'user-management': return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B365D] text-amber-300 flex items-center justify-center font-bold">
              👑
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Pengaturan Tim, Akun & Hak Akses Pengguna
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Area kendali <strong>Super Admin ({currentUser.name})</strong>. Kelola akun login anggota tim, ganti username & password, atur role, dan batasi tab yang dapat diakses oleh masing-masing personil.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#F26522] hover:bg-[#D95314] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Anggota Tim</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Akun Terdaftar</span>
          <div className="text-2xl font-black text-[#1B365D] mt-1">
            {users.length} <span className="text-xs font-medium text-slate-400">Pengguna</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Semua akun aktif dengan proteksi login</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Super Administrator</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {users.filter(u => u.isSuperAdmin).length} <span className="text-xs font-medium text-slate-400">Akun</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Memiliki akses ke seluruh menu & konfigurasi</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Hak Akses Berbasis Tab (RBAC)</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            Aktif &bull; Terisolasi
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Anggota hanya melihat tab yang diizinkan</p>
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1B365D]" />
            <h2 className="font-extrabold text-sm text-slate-800">Daftar Akun Pengguna & Hak Akses</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">{users.length} personil terdaftar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Anggota Tim</th>
                <th className="py-3.5 px-4">Kredensial (User / Pass)</th>
                <th className="py-3.5 px-4">Jabatan & Role</th>
                <th className="py-3.5 px-4">Hak Akses Tab yang Diizinkan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                const isPasswordShown = Boolean(showPasswords[u.id]);

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Member Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1B365D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {u.avatar || u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span>{u.name}</span>
                            {u.isSuperAdmin && (
                              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md">
                                👑 Super Admin
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] bg-slate-100 text-slate-500 font-normal px-1 rounded">
                                (Anda)
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{u.email || '-'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Username & Password */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
                          <span className="text-slate-400 font-sans">User:</span>
                          <strong className="text-slate-900">{u.username}</strong>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-slate-400 font-sans">Pass:</span>
                          <span className="text-slate-800">
                            {isPasswordShown ? u.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => toggleShowPassword(u.id)}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                            title={isPasswordShown ? "Sembunyikan" : "Tampilkan password"}
                          >
                            {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Role Label */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{u.roleLabel}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{u.role}</span>
                    </td>

                    {/* Allowed Tabs */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.isSuperAdmin ? (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            ✓ Akses Penuh Seluruh Modul (All Tabs)
                          </span>
                        ) : (
                          (u.allowedTabs || []).map((tabId) => (
                            <span 
                              key={tabId} 
                              className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getTabBadgeColor(tabId)}`}
                            >
                              {tabId === 'command-center' ? 'Workspace' :
                               tabId === 'campaigns-hub' ? 'Campaigns' :
                               tabId === 'approval-center' ? 'Approval' :
                               tabId === 'daily-checkins' ? 'Daily Check-In' :
                               tabId === 'monthly-report' ? 'Report' : tabId}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#1B365D] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          title="Edit Akun & Akses"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {!isCurrent && (
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ADD / EDIT USER MODAL */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-[#1B365D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F26522] flex items-center justify-center text-white">
                  {editingUser ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {editingUser ? `Edit Akun: ${editingUser.name}` : 'Tambah Anggota Tim Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-300">Konfigurasi akun, password, dan izin tab workspace</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Row 1: Name & Role Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Cth: Sarah Amelia"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jabatan / Role Label: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={roleLabel}
                    onChange={(e) => setRoleLabel(e.target.value)}
                    placeholder="Cth: Graphic Designer & Content"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Row 2: Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Username Login: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="sarah"
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#F26522] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Password Akun: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="sarah123"
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#F26522] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Email & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email (Opsional):</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@yensbaby.id"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp (Opsional):</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none"
                  />
                </div>
              </div>

              {/* Super Admin Checkbox Toggle */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-amber-950 block">Jadikan Super Admin?</span>
                  <span className="text-[11px] text-amber-800">
                    Super Admin memiliki kontrol penuh atas semua tab, data tim, dan akun.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isSuperAdmin}
                  onChange={(e) => setIsSuperAdmin(e.target.checked)}
                  className="w-4 h-4 text-[#F26522] rounded cursor-pointer"
                />
              </div>

              {/* Allowed Tabs Permission Checklist */}
              {!isSuperAdmin && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-slate-800 block text-xs">
                        Batasan Akses Tab Pengguna (RBAC):
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Pilih tab yang boleh dibuka oleh {name || 'pengguna ini'}.
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={handleSelectStandardTabs}
                        className="text-[#1B365D] font-bold hover:underline"
                      >
                        Standar Tim
                      </button>
                      <span>&bull;</span>
                      <button
                        type="button"
                        onClick={handleSelectAllTabs}
                        className="text-[#F26522] font-bold hover:underline"
                      >
                        Pilih Semua
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 border border-slate-200 rounded-xl p-3 bg-slate-50">
                    {ALL_AVAILABLE_TABS.filter(t => t.id !== 'user-management').map((tab) => {
                      const isChecked = allowedTabs.includes(tab.id);
                      return (
                        <label 
                          key={tab.id}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked ? 'bg-white border border-slate-200 shadow-xs' : 'hover:bg-slate-100 opacity-70'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleTab(tab.id)}
                            className="w-4 h-4 text-[#1B365D] rounded mt-0.5 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="font-bold text-xs text-slate-900 block">{tab.label}</span>
                            <span className="text-[10px] text-slate-500">{tab.description}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F26522] hover:bg-[#D95314] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? 'Simpan Perubahan' : 'Buat Akun Pengguna'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
