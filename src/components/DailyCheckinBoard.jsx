import React, { useState } from 'react';
import { 
  CalendarCheck, 
  AlertTriangle, 
  Check, 
  PlusCircle, 
  Clock, 
  Users, 
  Filter, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDateTime } from '../utils/formatters';

export const DailyCheckinBoard = () => {
  const { 
    currentUser, 
    checkins, 
    teamMembers, 
    resolveBlocker, 
    setIsCheckinModalOpen 
  } = useApp();

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'blockers'
  const isRiki = currentUser.role === 'head_of_marketing';

  const todayCheckins = checkins.filter(c => c.date === '2026-11-19');
  const activeBlockers = checkins.filter(c => c.hasBlocker && !c.resolved);
  
  const filteredCheckins = filterMode === 'blockers' 
    ? checkins.filter(c => c.hasBlocker && !c.resolved) 
    : checkins;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#F26522]" />
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Papan Daily Check-In & Stand-Up (19 Nov 2026)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Sinkronisasi harian 30 detik tim marketing Yen's Baby & Kid Shop. Pastikan tidak ada blocker operasional yang tertahan.
          </p>
        </div>

        <button
          onClick={() => setIsCheckinModalOpen(true)}
          className="px-4 py-2.5 bg-[#F26522] hover:bg-[#D95314] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Isi 30s Check-In Saya</span>
        </button>
      </div>

      {/* Participation & Blocker Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Participation Stat */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1B365D] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Partisipasi Stand-Up</span>
            <div className="text-xl font-extrabold text-slate-800">
              {todayCheckins.length} <span className="text-xs font-medium text-slate-400">dari {teamMembers.length} Tim</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Hari ini, Kamis 19 Nov 2026</p>
          </div>
        </div>

        {/* Active Blockers Stat */}
        <div className={`p-4.5 rounded-2xl border shadow-xs flex items-center gap-4 ${
          activeBlockers.length > 0 
            ? 'bg-rose-50/70 border-rose-200 text-rose-900' 
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            activeBlockers.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {activeBlockers.length > 0 ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">Kendala / Blocker Aktif</span>
            <div className="text-xl font-extrabold">
              {activeBlockers.length} <span className="text-xs font-semibold">Kendala Butuh Bantuan</span>
            </div>
            <p className="text-[11px] opacity-80 mt-0.5">
              {activeBlockers.length > 0 ? "Perlu unblock segera oleh Head of Marketing" : "Tidak ada blocker operasional"}
            </p>
          </div>
        </div>

        {/* Focus Sprint Target */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F26522] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Siklus Sprint</span>
            <div className="text-xl font-extrabold text-slate-800">
              Minggu Ke-3 <span className="text-xs font-medium text-slate-400">(15–21 Nov)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Fokus: Eksekusi B1G1 Pigeon & Lucky Draw Libby</p>
          </div>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Check-In ({checkins.length})
          </button>

          <button
            onClick={() => setFilterMode('blockers')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              filterMode === 'blockers'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Active Blockers Only ({activeBlockers.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Filter update harian
        </span>
      </div>

      {/* Check-ins Feed List */}
      <div className="space-y-4">
        {filteredCheckins.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada check-in yang cocok</h3>
            <p className="text-xs text-slate-400 mt-1">
              {filterMode === 'blockers' ? 'Hebat! Semua kendala blocker telah terselesaikan.' : 'Belum ada data check-in.'}
            </p>
          </div>
        ) : (
          filteredCheckins.map((item) => {
            const member = teamMembers.find(m => m.id === item.userId);
            const isUnresolvedBlocker = item.hasBlocker && !item.resolved;

            return (
              <div 
                key={item.id}
                className={`bg-white rounded-2xl border shadow-xs p-5 sm:p-6 transition-all ${
                  isUnresolvedBlocker 
                    ? 'border-rose-300 ring-2 ring-rose-500/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header of Item */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1B365D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {member?.avatar || 'YM'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-800">{member?.name}</h3>
                        <span className="text-[11px] font-medium text-slate-500">({member?.roleLabel})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.timestamp ? formatDateTime(item.timestamp) : `Tanggal: ${item.date}`}
                      </span>
                    </div>
                  </div>

                  {/* Blocker status badge */}
                  <div>
                    {item.hasBlocker ? (
                      item.resolved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>Blocker Resolved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Active Blocker</span>
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>No Blocker (Lancar)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Selesai Kemarin (Done Yesterday):
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {item.doneYesterday || '-'}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Fokus Utama Hari Ini (Focus Today):
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {item.focusToday || '-'}
                    </p>
                  </div>
                </div>

                {/* Active Blocker Detail Box & Resolve Action */}
                {item.hasBlocker && (
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    item.resolved 
                      ? 'bg-slate-50 border-slate-200 text-slate-600' 
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div>
                      <span className="font-extrabold uppercase text-[10px] block mb-0.5 tracking-wider">
                        {item.resolved ? 'Kendala yang Telah Diselesaikan:' : 'Kendala / Blocker yang Dihadapi:'}
                      </span>
                      <p className="font-medium text-xs leading-relaxed">
                        {item.blockerDetail}
                      </p>
                    </div>

                    {!item.resolved && (
                      <button
                        onClick={() => resolveBlocker(item.id)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                        title="Tandai blocker ini selesai dibantu"
                      >
                        <Check className="w-4 h-4" />
                        <span>1-Click Mark Resolved</span>
                      </button>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
