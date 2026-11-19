import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Cloud, 
  Check, 
  Copy, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw, 
  Trash2,
  Radio
} from 'lucide-react';
import { 
  supabaseUrl, 
  supabaseAnonKey, 
  isSupabaseConfigured, 
  saveSupabaseConfig, 
  clearSupabaseConfig 
} from '../lib/supabaseClient';

export const CloudConfigModal = ({ isOpen, onClose }) => {
  const [urlInput, setUrlInput] = useState(supabaseUrl || '');
  const [keyInput, setKeyInput] = useState(supabaseAnonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      alert("Harap masukkan Supabase Project URL dan Anon Key.");
      return;
    }
    saveSupabaseConfig(urlInput.trim(), keyInput.trim());
  };

  const handleClear = () => {
    if (window.confirm("Putuskan koneksi Supabase dan kembali ke mode LocalStorage offline?")) {
      clearSupabaseConfig();
    }
  };

  const copySqlToClipboard = () => {
    const sqlText = `-- Jalankan file 'supabase-schema.sql' yang ada di root repositori Anda di Supabase SQL Editor`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#1B365D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F26522] flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Koneksi Database Cloud (Supabase)</h3>
              <p className="text-[11px] text-slate-300">Multi-User Live Realtime Sync antar tim</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Status Badge */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isSupabaseConfigured 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <div>
                <p className="font-extrabold text-xs">
                  {isSupabaseConfigured ? '🟢 Mode Realtime Supabase Aktif' : '🟠 Mode Offline (LocalStorage)'}
                </p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {isSupabaseConfigured 
                    ? 'Perubahan approval, check-in, dan task langsung tersinkronisasi ke seluruh browser tim secara live.'
                    : 'Data saat ini masih tersimpan lokal di browser perangkat Anda saja.'}
                </p>
              </div>
            </div>

            {isSupabaseConfigured && (
              <button
                onClick={handleClear}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg flex items-center gap-1 shrink-0"
                title="Disconnect Supabase"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            )}
          </div>

          {/* Quick Guide */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
              3 Langkah Mudah Mengaktifkan Cloud Database:
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li>
                Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#1B365D] font-bold underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a> dan buat project baru (gratis).
              </li>
              <li>
                Buka menu <strong>SQL Editor</strong> di Supabase, lalu jalankan script yang sudah kami siapkan di file <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[10px]">supabase-schema.sql</code> (sudah include tabel & initial seed data).
              </li>
              <li>
                Salin <strong>Project URL</strong> dan <strong>Anon Public Key</strong> dari menu <em>Project Settings &gt; API</em> ke formulir di bawah ini (atau masukkan ke <em>Environment Variables</em> di Vercel).
              </li>
            </ol>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3 pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Supabase Project URL:
              </label>
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-slate-800 focus:ring-2 focus:ring-[#F26522] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Supabase Anon / Public Key:
              </label>
              <textarea
                rows={2}
                required
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-slate-800 focus:ring-2 focus:ring-[#F26522] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
              >
                Tutup
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#1B365D] hover:bg-[#24477A] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Cloud className="w-4 h-4" />
                <span>Simpan & Aktifkan Realtime</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
