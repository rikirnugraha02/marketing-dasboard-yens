import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Check, 
  RotateCw, 
  ExternalLink, 
  MessageSquare, 
  Users, 
  ChevronRight, 
  Sparkles,
  Store,
  Calendar,
  ShieldAlert,
  Send,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatIDRShort, formatDateTime, getStatusBadgeStyle, getPriorityBadgeStyle } from '../utils/formatters';

export const CommandCenter = () => {
  const { 
    currentUser, 
    campaigns, 
    deliverables, 
    kolSlots, 
    checkins, 
    teamMembers,
    pendingApprovals,
    revisionsCount,
    emptyKolSlots,
    overdueDeliverables,
    activeBlockers,
    approveDeliverable,
    requestRevision,
    updateDeliverableStatus,
    resolveBlocker,
    setIsCheckinModalOpen,
    setActiveTab,
    setSelectedCampaignId
  } = useApp();

  const isRiki = Boolean(currentUser?.isSuperAdmin || currentUser?.role === 'head_of_marketing');

  // State for revision popover in Approval Queue
  const [revisionTargetId, setRevisionTargetId] = useState(null);
  const [revisionNoteInput, setRevisionNoteInput] = useState('');

  // Handle revision submission
  const handleSendRevision = (deliverableId) => {
    if (!revisionNoteInput.trim()) {
      alert("Harap masukkan catatan revisi untuk tim.");
      return;
    }
    requestRevision(deliverableId, revisionNoteInput.trim());
    setRevisionTargetId(null);
    setRevisionNoteInput('');
  };

  // Team-specific data
  const myTasks = deliverables.filter(d => d.picId === currentUser.id);
  const myRevisions = deliverables.filter(d => d.picId === currentUser.id && (d.status === 'Revision' || d.revisionNotes));
  const myTodayCheckin = checkins.find(c => c.userId === currentUser.id && c.date === "2026-11-19");

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B365D] to-[#24477A] text-white rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-amber-300 rounded-full text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yen's Marketing Command Center &bull; Retail Sprint Nov 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Halo, {currentUser.name}! 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {isRiki 
                ? "Pantau approval queue, target sales brand partner (Pigeon, Libby, Interbat, Molagi), dan status harian tim marketing di sini."
                : `Ruang kerja operasional ${currentUser.roleLabel}. Periksa brief, approval Riki, dan laporkan progres harian.`
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCheckinModalOpen(true)}
              className="px-4 py-2.5 bg-[#F26522] hover:bg-[#D95314] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>30s Daily Check-In</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW FOR RIKI (HEAD OF MARKETING) */}
      {/* ============================================================== */}
      {isRiki ? (
        <>
          {/* 1. CRITICAL ALERT BANNER (Overdue, Empty KOL, Active Blockers) */}
          {(overdueDeliverables.length > 0 || emptyKolSlots.length > 0 || activeBlockers.length > 0) && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2.5 text-rose-800 font-bold text-sm sm:text-base mb-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
                <span>Critical Attention Required (Action Needed by Head of Marketing)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Overdue Items Alert */}
                {overdueDeliverables.length > 0 && (
                  <div className="bg-white p-3.5 rounded-xl border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-rose-700 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-rose-600" />
                          Overdue Deliverables
                        </span>
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[11px]">
                          {overdueDeliverables.length} Terlambat
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">
                        {overdueDeliverables[0].title}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        PIC: {overdueDeliverables[0].picId.toUpperCase()} &bull; Deadline: {formatDateTime(overdueDeliverables[0].deadline)}
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('campaigns-hub')}
                      className="mt-2.5 text-rose-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      Follow up PIC <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Empty KOL Slot Alert */}
                {emptyKolSlots.length > 0 && (
                  <div className="bg-white p-3.5 rounded-xl border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-rose-700 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-rose-600" />
                          Empty KOL Slots
                        </span>
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[11px]">
                          {emptyKolSlots.length} Slot Kosong
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">
                        Pigeon Fun Fair &bull; {emptyKolSlots[0].week}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Belum ada momfluencer terkonfirmasi. Perlu lock Fanny hari ini!
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('campaigns-hub')}
                      className="mt-2.5 text-rose-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      Buka KOL Matrix <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Active Blocker Alert */}
                {activeBlockers.length > 0 && (
                  <div className="bg-white p-3.5 rounded-xl border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-rose-700 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          Active Team Blocker
                        </span>
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[11px]">
                          {activeBlockers.length} Active
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium line-clamp-2">
                        {activeBlockers[0].userId.toUpperCase()}: {activeBlockers[0].blockerDetail}
                      </p>
                    </div>
                    <button 
                      onClick={() => resolveBlocker(activeBlockers[0].id)}
                      className="mt-2.5 text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md text-[11px] self-start flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. 1-CLICK APPROVAL QUEUE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    1-Click Approval Queue
                  </h2>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {pendingApprovals.length} Menunggu Approval
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review materi promosi, poster, WA blast jastiper, atau collateral sebelum tayang ke publik.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('approval-center')}
                className="text-xs font-bold text-[#1B365D] hover:text-[#F26522] flex items-center gap-1 self-start sm:self-auto"
              >
                Lihat Semua Antrean ({pendingApprovals.length + revisionsCount})
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold text-slate-700">Semua Approval Beres!</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Tidak ada draft promosi yang menunggu persetujuan saat ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingApprovals.map((item) => {
                  const pic = teamMembers.find(m => m.id === item.picId);
                  const isOpeningRevision = revisionTargetId === item.id;

                  return (
                    <div 
                      key={item.id}
                      className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl p-4.5 transition-all shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold text-[#1B365D] bg-[#1B365D]/10 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(item.status)}`}>
                            {item.status}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-800 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-200/70">
                          <span className="font-semibold text-slate-500 block text-[10px] uppercase">Catatan PIC ({pic?.name}):</span>
                          {item.notes}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-200 font-bold text-[10px] flex items-center justify-center text-slate-700">
                              {pic?.avatar}
                            </div>
                            <span className="text-[11px] font-medium">{pic?.name} ({pic?.roleLabel})</span>
                          </div>
                          
                          {item.draftLink && (
                            <a
                              href={item.draftLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-semibold text-[#1B365D] hover:text-[#F26522] flex items-center gap-1 underline"
                            >
                              <span>Buka Draf</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Revision Input Box or Buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        {isOpeningRevision ? (
                          <div className="space-y-2 animate-in fade-in duration-150">
                            <textarea
                              value={revisionNoteInput}
                              onChange={(e) => setRevisionNoteInput(e.target.value)}
                              placeholder={`Tulis catatan revisi untuk ${pic?.name}... (cth: Cek harga botol di poster, perjelas S&K B1G1)`}
                              rows={2}
                              className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setRevisionTargetId(null);
                                  setRevisionNoteInput('');
                                }}
                                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => handleSendRevision(item.id)}
                                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md flex items-center gap-1 shadow-xs"
                              >
                                <Send className="w-3 h-3" />
                                <span>Kirim Revisi</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => approveDeliverable(item.id, "Approved 1-click by Riki")}
                              className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve (1-Click)</span>
                            </button>

                            <button
                              onClick={() => {
                                setRevisionTargetId(item.id);
                                setRevisionNoteInput('');
                              }}
                              className="py-1.5 px-3 bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>Request Revision</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. CAMPAIGN KPI PROGRESS CARDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  Campaign KPI & Partner Targets (Nov 2026)
                </h2>
                <p className="text-xs text-slate-500">
                  Tracking performa program Pigeon, Libby, Interbat, dan event Molagi Bond.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('campaigns-hub')}
                className="text-xs font-bold text-[#1B365D] hover:text-[#F26522] flex items-center gap-1"
              >
                Detail Semua Brief
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {campaigns.map((camp) => {
                const percent = Math.min(100, Math.round((camp.actualValue / camp.targetValue) * 100));
                const isCurrency = camp.targetValue > 1000;

                return (
                  <div
                    key={camp.id}
                    className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs hover:border-[#1B365D]/30 transition-all flex flex-col justify-between cursor-pointer"
                    onClick={() => {
                      setSelectedCampaignId(camp.id);
                      setActiveTab('campaigns-hub');
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {camp.brandPartner}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {camp.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                        {camp.title}
                      </h3>

                      <div className="mt-3.5 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">{camp.kpiLabel}</span>
                          <span className="font-extrabold text-slate-800">{percent}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              percent >= 70 ? 'bg-emerald-500' : percent >= 30 ? 'bg-[#F26522]' : 'bg-amber-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                          <span>Actual: <strong className="text-slate-800">{isCurrency ? formatIDRShort(camp.actualValue) : `${camp.actualValue} org`}</strong></span>
                          <span>Target: {isCurrency ? formatIDRShort(camp.targetValue) : `${camp.targetValue} org`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Store className="w-3.5 h-3.5" />
                        {camp.stores.length} Toko
                      </span>
                      <span className="text-[#1B365D] font-bold flex items-center gap-0.5 hover:text-[#F26522]">
                        Brief & Matrix <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. TEAM CHECK-IN TRACKER (DAILY STAND-UP SUMMARY) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1B365D]" />
                <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  Team Daily Stand-Up & Blocker Tracker
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('daily-checkins')}
                className="text-xs font-bold text-[#1B365D] hover:text-[#F26522] flex items-center gap-1"
              >
                Papan Lengkap Check-In
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {teamMembers.filter(m => m.id !== 'riki').map((member) => {
                const memberCheckin = checkins.find(c => c.userId === member.id && c.date === "2026-11-19");
                const hasBlocker = memberCheckin?.hasBlocker && !memberCheckin?.resolved;

                return (
                  <div 
                    key={member.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      hasBlocker 
                        ? 'bg-rose-50/50 border-rose-300' 
                        : memberCheckin 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-white border-dashed border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1B365D] text-white font-bold text-[10px] flex items-center justify-center">
                          {member.avatar}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{member.name}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        hasBlocker 
                          ? 'bg-rose-100 text-rose-700' 
                          : memberCheckin 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {hasBlocker ? 'Ada Blocker' : memberCheckin ? 'Check-In OK' : 'Belum Check-In'}
                      </span>
                    </div>

                    {memberCheckin ? (
                      <div className="space-y-1.5 text-[11px]">
                        <div>
                          <span className="text-slate-400 font-medium block text-[10px]">Fokus Hari Ini:</span>
                          <p className="text-slate-700 font-medium line-clamp-2">{memberCheckin.focusToday}</p>
                        </div>
                        {memberCheckin.hasBlocker && (
                          <div className="p-1.5 bg-rose-100/60 rounded text-rose-800 text-[10px] font-medium">
                            <span className="font-bold block">Kendala:</span>
                            {memberCheckin.blockerDetail}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        Menunggu update 30s check-in dari {member.name}...
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* ============================================================== */
        /* VIEW FOR TEAM MEMBERS (ALVI, SYNTIA, JOE, FANNY) */
        /* ============================================================== */
        <>
          {/* 1. REVISION NOTES FROM RIKI (Prominent Amber Banner if exists) */}
          {myRevisions.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm sm:text-base mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
                <span>Catatan Revisi dari Riki (Head of Marketing)</span>
              </div>
              <p className="text-xs text-amber-800 mb-3 font-medium">
                Ada {myRevisions.length} task Anda yang memerlukan penyesuaian sebelum di-approve:
              </p>

              <div className="space-y-2.5">
                {myRevisions.map((rev) => (
                  <div key={rev.id} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-slate-800">{rev.title}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                        Revision
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-medium">
                      <span className="font-bold text-[11px] text-amber-800 block">Notes dari Riki:</span>
                      "{rev.revisionNotes || 'Harap periksa kembali detail materi dan format yang diajukan.'}"
                    </div>
                    <div className="mt-2.5 flex items-center justify-end gap-2">
                      {rev.draftLink && (
                        <a
                          href={rev.draftLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                        >
                          Link Draf <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        onClick={() => updateDeliverableStatus(rev.id, 'Need Approval')}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim Ulang untuk Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. INLINE 30S DAILY CHECK-IN CARD FOR TEAM */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F26522]" />
                <h3 className="font-extrabold text-sm text-slate-800">
                  Status Stand-Up Harian Anda (19 Nov 2026)
                </h3>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                myTodayCheckin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {myTodayCheckin ? 'Sudah Submit Hari Ini' : 'Belum Submit'}
              </span>
            </div>

            {myTodayCheckin ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Kemarin:</span>
                  <p className="text-slate-700 font-medium">{myTodayCheckin.doneYesterday}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Fokus Hari Ini:</span>
                  <p className="text-slate-700 font-medium">{myTodayCheckin.focusToday}</p>
                </div>
                {myTodayCheckin.hasBlocker && (
                  <div className="col-span-full bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-rose-800">
                    <span className="font-bold text-[10px] uppercase block">Kendala / Blocker:</span>
                    {myTodayCheckin.blockerDetail}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <p className="text-xs text-amber-800 font-medium text-center sm:text-left">
                  Laporkan aktivitas kemarin, target prioritas hari ini, dan kendala/blocker agar tim bisa saling unblock.
                </p>
                <button
                  onClick={() => setIsCheckinModalOpen(true)}
                  className="px-4 py-2 bg-[#F26522] hover:bg-[#D95314] text-white text-xs font-bold rounded-lg shrink-0 shadow-xs"
                >
                  Isi Check-In Sekarang (30s)
                </button>
              </div>
            )}
          </div>

          {/* 3. MY URGENT TASKS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  My Deliverables & Tasks ({currentUser.name})
                </h2>
                <p className="text-xs text-slate-500">
                  Daftar deliverable yang di-assign kepada Anda untuk kampanye November 2026.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('campaigns-hub')}
                className="text-xs font-bold text-[#1B365D] hover:text-[#F26522] flex items-center gap-1"
              >
                Lihat Semua Program <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {myTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-xs">Tidak ada task yang di-assign saat ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myTasks.map((task) => (
                  <div key={task.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(task.status)}`}>
                          {task.status}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {task.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadgeStyle(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">{task.title}</h4>
                      <p className="text-xs text-slate-500">{task.notes}</p>
                      <p className="text-[11px] text-slate-400">
                        Deadline: <strong className="text-slate-600">{formatDateTime(task.deadline)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {task.draftLink && (
                        <a
                          href={task.draftLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                        >
                          <span>Draft</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {task.status === 'In Progress' && (
                        <button
                          onClick={() => updateDeliverableStatus(task.id, 'Need Approval')}
                          className="px-3 py-1.5 bg-[#1B365D] hover:bg-[#24477A] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Approval</span>
                        </button>
                      )}

                      {task.status === 'Approved' && (
                        <button
                          onClick={() => updateDeliverableStatus(task.id, 'Published/Done')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Tandai Selesai/Publish</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};
