import React, { useState } from 'react';
import { X, Clock, AlertTriangle, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckinModal = () => {
  const { 
    currentUser, 
    isCheckinModalOpen, 
    setIsCheckinModalOpen, 
    submitCheckin,
    currentDate 
  } = useApp();

  const [doneYesterday, setDoneYesterday] = useState('');
  const [focusToday, setFocusToday] = useState('');
  const [hasBlocker, setHasBlocker] = useState(false);
  const [blockerDetail, setBlockerDetail] = useState('');

  if (!isCheckinModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doneYesterday.trim() || !focusToday.trim()) {
      alert("Harap isi aktivitas kemarin dan fokus hari ini.");
      return;
    }

    if (hasBlocker && !blockerDetail.trim()) {
      alert("Harap jelaskan kendala/blocker yang Anda hadapi agar tim bisa membantu.");
      return;
    }

    submitCheckin({
      doneYesterday: doneYesterday.trim(),
      focusToday: focusToday.trim(),
      hasBlocker,
      blockerDetail: hasBlocker ? blockerDetail.trim() : ''
    });

    // Reset and close
    setDoneYesterday('');
    setFocusToday('');
    setHasBlocker(false);
    setBlockerDetail('');
    setIsCheckinModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#1B365D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F26522] flex items-center justify-center text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">30s Daily Check-In & Stand-Up</h3>
              <p className="text-[11px] text-slate-300">
                {currentUser.name} ({currentUser.roleLabel}) &bull; {currentDate}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsCheckinModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
            💡 Update cepat 30 detik untuk menyelaraskan prioritas harian dan mendeteksi kendala tim sejak dini.
          </div>

          {/* Done Yesterday */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              1. Selesai Dikerjakan Kemarin (Done Yesterday): <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={doneYesterday}
              onChange={(e) => setDoneYesterday(e.target.value)}
              placeholder="Cth: Selesai edit materi carousel promo Pigeon & kirim draft ke kasir Setiabudi..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium text-slate-800"
            />
          </div>

          {/* Focus Today */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              2. Fokus Utama Hari Ini (Focus Today): <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={focusToday}
              onChange={(e) => setFocusToday(e.target.value)}
              placeholder="Cth: Koordinasi revisi blast jastiper, follow up 1 KOL cadangan Pigeon..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium text-slate-800"
            />
          </div>

          {/* Has Blocker Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Apakah Ada Kendala / Blocker?</span>
                <span className="text-[11px] text-slate-500">
                  Pilih "Ya" jika Anda membutuhkan bantuan Riki atau divisi lain untuk unblock.
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-200 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setHasBlocker(false)}
                  className={`px-3 py-1 rounded-md font-bold text-xs transition-colors ${
                    !hasBlocker ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tidak Ada
                </button>
                <button
                  type="button"
                  onClick={() => setHasBlocker(true)}
                  className={`px-3 py-1 rounded-md font-bold text-xs transition-colors ${
                    hasBlocker ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ada Kendala
                </button>
              </div>
            </div>

            {/* Conditional Blocker Detail */}
            {hasBlocker && (
              <div className="mt-3 pt-3 border-t border-slate-200 animate-in fade-in duration-150">
                <label className="block font-bold text-rose-800 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Jelaskan Detail Blocker / Kendala: <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required={hasBlocker}
                  rows={2}
                  value={blockerDetail}
                  onChange={(e) => setBlockerDetail(e.target.value)}
                  placeholder="Cth: Belum dapat konfirmasi fee dari KOL @mommy.bdg, butuh persetujuan budget tambahan..."
                  className="w-full p-2.5 rounded-lg border border-rose-300 bg-rose-50/50 focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium text-rose-950"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCheckinModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F26522] hover:bg-[#D95314] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Check-In</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
