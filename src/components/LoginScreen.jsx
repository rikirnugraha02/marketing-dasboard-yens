import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginScreen = () => {
  const { users, login } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Harap masukkan username dan password Anda.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = login(username.trim(), password.trim());
      if (!success) {
        setErrorMsg("Username atau password salah. Silakan periksa kembali.");
        setIsLoading(false);
      }
    }, 300);
  };

  const handleQuickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
    login(u, p);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1B365D] rounded-full filter blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F26522] rounded-full filter blur-3xl opacity-20 pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Strip */}
        <div className="bg-[#1B365D] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/5 transform skew-x-12 pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-[#F26522] text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-white/10">
            Y
          </div>

          <h1 className="text-xl font-extrabold tracking-tight">
            Yen's Baby & Kid Shop
          </h1>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Marketing Command Center &bull; Retail HQ Login
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan kredensial akun untuk mengakses ruang kerja Anda.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda"
                  className="w-full text-xs font-semibold py-2.5 pl-9 pr-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:border-[#F26522] focus:outline-none transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full text-xs font-semibold py-2.5 pl-9 pr-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:border-[#F26522] focus:outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 rounded"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#F26522] hover:bg-[#D95314] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Workspace</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login for Testing */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F26522]" />
                1-Click Quick Access (Testing / Demo)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {/* Riki Super Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin('riki', 'riki123')}
                className="col-span-2 p-2 bg-[#1B365D]/5 hover:bg-[#1B365D]/10 border border-[#1B365D]/20 rounded-xl text-left flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1B365D] text-amber-300 font-bold text-xs flex items-center justify-center">
                    👑
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">Riki (Super Admin)</span>
                    <span className="text-[10px] text-slate-500">Akses Penuh Seluruh Modul</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Team Members */}
              {users.filter(u => !u.isSuperAdmin).map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleQuickLogin(member.username, member.password)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {member.avatar}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block text-[11px] truncate">{member.name}</span>
                    <span className="text-[9px] text-slate-400 block truncate">{member.roleLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Dilindungi oleh Yen's Role-Based Access Control (RBAC) &bull; Nov 2026
        </div>

      </div>
    </div>
  );
};
