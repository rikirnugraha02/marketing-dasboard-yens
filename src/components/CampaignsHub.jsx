import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Store, 
  Calendar, 
  Target, 
  FileText, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  X, 
  Edit3, 
  AlertTriangle,
  Check,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatIDRShort, formatDateTime, formatDateOnly, getStatusBadgeStyle, getPriorityBadgeStyle } from '../utils/formatters';
import { AddTaskModal } from './AddTaskModal';

export const CampaignsHub = () => {
  const { 
    campaigns, 
    deliverables, 
    kolSlots, 
    teamMembers, 
    updateDeliverableStatus,
    addOrUpdateKolSlot,
    selectedCampaignId,
    setSelectedCampaignId
  } = useApp();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('brief'); // 'brief' | 'deliverables' | 'kol' | 'readiness'
  
  // Quick KOL Assignment state
  const [editingKolSlot, setEditingKolSlot] = useState(null);
  const [kolFormName, setKolFormName] = useState('');
  const [kolFormStatus, setKolFormStatus] = useState('Briefed');
  const [kolFormDate, setKolFormDate] = useState('2026-11-20');

  // Find currently opened campaign modal
  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || null;

  const handleOpenCampaignModal = (campId) => {
    setSelectedCampaignId(campId);
    setActiveModalTab('brief');
  };

  const handleSaveKolSlot = (e) => {
    e.preventDefault();
    if (!editingKolSlot) return;

    addOrUpdateKolSlot({
      ...editingKolSlot,
      kolName: kolFormName.trim() || 'Momfluencer Candidate',
      status: kolFormStatus,
      publishDate: kolFormDate
    });

    setEditingKolSlot(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#F26522]" />
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Campaigns & Programs Hub (November 2026)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Program aktivasi kemitraan brand retail Yen's Baby & Kid Shop: Pigeon, Libby, Interbat, dan Molagi Bond.
          </p>
        </div>

        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="px-4 py-2.5 bg-[#F26522] hover:bg-[#D95314] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Task / Deliverable</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((camp) => {
          const campDeliverables = deliverables.filter(d => d.campaignId === camp.id);
          const campKolSlots = kolSlots.filter(k => k.campaignId === camp.id);
          const emptySlots = campKolSlots.filter(k => k.status === 'Slot Empty' || !k.kolName);
          const percent = Math.min(100, Math.round((camp.actualValue / camp.targetValue) * 100));
          const isCurrency = camp.targetValue > 1000;

          return (
            <div 
              key={camp.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {/* Partner badge & Period */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs px-2.5 py-1 rounded-lg bg-[#1B365D] text-white">
                      {camp.brandPartner}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(camp.status)}`}>
                      {camp.status}
                    </span>
                  </div>
                  
                  <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDateOnly(camp.periodStart)} – {formatDateOnly(camp.periodEnd)}</span>
                  </div>
                </div>

                <h2 className="text-base font-extrabold text-slate-800 leading-snug">
                  {camp.title}
                </h2>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {camp.brief}
                </p>

                {/* KPI Bar */}
                <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-slate-600 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-[#F26522]" />
                      {camp.kpiLabel}
                    </span>
                    <span className="font-extrabold text-slate-800">{percent}%</span>
                  </div>

                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 70 ? 'bg-emerald-500' : percent >= 30 ? 'bg-[#F26522]' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                    <span>Realisasi: <strong className="text-slate-800">{isCurrency ? formatIDR(camp.actualValue) : `${camp.actualValue} Peserta`}</strong></span>
                    <span>Target: {isCurrency ? formatIDR(camp.targetValue) : `${camp.targetValue} Peserta`}</span>
                  </div>
                </div>

                {/* Stores & Mini stats */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Toko:</span>
                  {camp.stores.map((st) => (
                    <span key={st} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {st}
                    </span>
                  ))}
                </div>

                {/* Alerts inside card if any */}
                {emptySlots.length > 0 && (
                  <div className="mt-3 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Perhatian: Ada {emptySlots.length} slot KOL mingguan yang masih kosong!</span>
                  </div>
                )}
              </div>

              {/* Card Footer CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span className="font-bold text-slate-700">{campDeliverables.length}</span> Tasks &bull; <span className="font-bold text-slate-700">{campKolSlots.length}</span> KOL Slots
                </div>

                <button
                  onClick={() => handleOpenCampaignModal(camp.id)}
                  className="px-4 py-1.5 bg-[#1B365D] hover:bg-[#24477A] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                >
                  <span>Buka Detail & 4 Tab</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* CAMPAIGN DETAIL MODAL / DRAWER (WITH 4 TABS) */}
      {/* ============================================================== */}
      {activeCampaign && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedCampaignId(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#1B365D] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-[#F26522] text-white">
                    {activeCampaign.brandPartner}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    Cycle: November 2026
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {activeCampaign.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span>Stores: {activeCampaign.stores.join(', ')}</span>
                  <span>&bull;</span>
                  <span>Status: {activeCampaign.status}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCampaignId(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 4 Tabs Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveModalTab('brief')}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeModalTab === 'brief'
                    ? 'border-[#F26522] text-[#F26522]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Program Brief & SKP</span>
              </button>

              <button
                onClick={() => setActiveModalTab('deliverables')}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeModalTab === 'deliverables'
                    ? 'border-[#F26522] text-[#F26522]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Deliverables Checklist ({deliverables.filter(d => d.campaignId === activeCampaign.id).length})</span>
              </button>

              <button
                onClick={() => setActiveModalTab('kol')}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeModalTab === 'kol'
                    ? 'border-[#F26522] text-[#F26522]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>3. Weekly KOL Matrix</span>
              </button>

              <button
                onClick={() => setActiveModalTab('readiness')}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeModalTab === 'readiness'
                    ? 'border-[#F26522] text-[#F26522]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>4. Event Readiness</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs">
              
              {/* TAB 1: PROGRAM BRIEF & SKP */}
              {activeModalTab === 'brief' && (
                <div className="space-y-5">
                  <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200">
                    <h3 className="font-extrabold text-sm text-slate-800 mb-2">Ringkasan Mekanisme & Target (SKP)</h3>
                    <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                      {activeCampaign.brief}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block uppercase text-[10px]">Target Key Metric</span>
                      <p className="text-lg font-extrabold text-[#1B365D] mt-1">
                        {activeCampaign.targetValue > 1000 ? formatIDR(activeCampaign.targetValue) : `${activeCampaign.targetValue} Peserta`}
                      </p>
                      <span className="text-[11px] text-slate-500">{activeCampaign.kpiLabel}</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block uppercase text-[10px]">Pencapaian s/d 19 Nov</span>
                      <p className="text-lg font-extrabold text-emerald-600 mt-1">
                        {activeCampaign.targetValue > 1000 ? formatIDR(activeCampaign.actualValue) : `${activeCampaign.actualValue} Peserta`}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {Math.round((activeCampaign.actualValue / activeCampaign.targetValue) * 100)}% dari target
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block uppercase text-[10px]">Cakupan Outlet</span>
                      <p className="text-lg font-extrabold text-slate-800 mt-1">
                        {activeCampaign.stores.length} Cabang
                      </p>
                      <span className="text-[11px] text-slate-500">{activeCampaign.stores.join(', ')}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Key Marketing Objectives
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Mendorong basket size konsumen keluarga dan jastiper di seluruh cabang Bandung.</li>
                      <li>Memaksimalkan engagement media sosial melalui Reels promo dan activation mingguan.</li>
                      <li>Sinkronisasi collateral toko (Tent card kasir, hanging banner, clearance wagon) sesuai jadwal.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: DELIVERABLES CHECKLIST */}
              {activeModalTab === 'deliverables' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800">Checklist Pengerjaan Campaign</h3>
                      <p className="text-slate-500">Status penyelesaian deliverables untuk {activeCampaign.title}</p>
                    </div>
                    <button
                      onClick={() => setIsAddTaskOpen(true)}
                      className="px-3 py-1.5 bg-[#F26522] hover:bg-[#D95314] text-white font-bold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Task Baru</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {deliverables.filter(d => d.campaignId === activeCampaign.id).map((item) => {
                      const pic = teamMembers.find(m => m.id === item.picId);
                      return (
                        <div 
                          key={item.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(item.status)}`}>
                                {item.status}
                              </span>
                              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {item.category}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{item.title}</h4>
                            <p className="text-slate-500 text-[11px]">{item.notes}</p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400">
                              <span>PIC: <strong className="text-slate-700">{pic?.name}</strong></span>
                              <span>&bull;</span>
                              <span>Deadline: <strong className="text-slate-700">{formatDateTime(item.deadline)}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            {item.draftLink && (
                              <a
                                href={item.draftLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold flex items-center gap-1"
                              >
                                <span>Preview</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            
                            <select
                              value={item.status}
                              onChange={(e) => updateDeliverableStatus(item.id, e.target.value)}
                              className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-[#F26522]"
                            >
                              <option value="In Progress">In Progress</option>
                              <option value="Need Approval">Need Approval</option>
                              <option value="Revision">Revision</option>
                              <option value="Approved">Approved</option>
                              <option value="Published/Done">Published/Done</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}

                    {deliverables.filter(d => d.campaignId === activeCampaign.id).length === 0 && (
                      <p className="text-center py-6 text-slate-400">Belum ada deliverable untuk program ini.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: WEEKLY KOL MATRIX */}
              {activeModalTab === 'kol' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800">Weekly KOL Matrix & Push</h3>
                      <p className="text-slate-500">Penjadwalan influencer mingguan untuk boost campaign</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {kolSlots.filter(k => k.campaignId === activeCampaign.id).map((slot) => {
                      const isEmpty = slot.status === 'Slot Empty' || !slot.kolName;
                      const pic = teamMembers.find(m => m.id === slot.picId);

                      return (
                        <div 
                          key={slot.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isEmpty 
                              ? 'bg-rose-50/60 border-rose-300' 
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#1B365D] bg-[#1B365D]/10 px-2 py-0.5 rounded">
                                  {slot.week}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(slot.status)}`}>
                                  {slot.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-extrabold text-slate-800">
                                  {isEmpty ? '⚠️ Slot Kosong / Belum Ada KOL' : slot.kolName}
                                </span>
                                {slot.followers && slot.followers !== '-' && (
                                  <span className="text-[11px] text-slate-400">({slot.followers} followers)</span>
                                )}
                              </div>

                              <p className="text-slate-500 text-[11px]">
                                Deliverables: {slot.deliverableType || 'IG Reels & Stories'}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {isEmpty ? (
                                <button
                                  onClick={() => {
                                    setEditingKolSlot(slot);
                                    setKolFormName('@mommy.bandung_nov');
                                    setKolFormStatus('Briefed');
                                    setKolFormDate('2026-11-20');
                                  }}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-xs"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Assign Influencer Sekarang</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingKolSlot(slot);
                                    setKolFormName(slot.kolName);
                                    setKolFormStatus(slot.status);
                                    setKolFormDate(slot.publishDate || '2026-11-20');
                                  }}
                                  className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Quick Edit Subform if active */}
                          {editingKolSlot?.id === slot.id && (
                            <form onSubmit={handleSaveKolSlot} className="mt-3 pt-3 border-t border-slate-200 space-y-2 bg-slate-50 p-3 rounded-lg">
                              <h5 className="font-bold text-slate-700">Update Slot KOL:</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500">Username KOL:</label>
                                  <input
                                    type="text"
                                    required
                                    value={kolFormName}
                                    onChange={(e) => setKolFormName(e.target.value)}
                                    placeholder="@handle.instagram"
                                    className="w-full p-1.5 border border-slate-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500">Status KOL:</label>
                                  <select
                                    value={kolFormStatus}
                                    onChange={(e) => setKolFormStatus(e.target.value)}
                                    className="w-full p-1.5 border border-slate-300 rounded text-xs"
                                  >
                                    <option value="Briefed">Briefed</option>
                                    <option value="Draft Review">Draft Review</option>
                                    <option value="Published">Published</option>
                                    <option value="Slot Empty">Slot Empty</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500">Publish Target Date:</label>
                                  <input
                                    type="date"
                                    value={kolFormDate}
                                    onChange={(e) => setKolFormDate(e.target.value)}
                                    className="w-full p-1.5 border border-slate-300 rounded text-xs"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingKolSlot(null)}
                                  className="px-2.5 py-1 text-slate-500 hover:text-slate-800"
                                >
                                  Batal
                                </button>
                                <button
                                  type="submit"
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs"
                                >
                                  Simpan Slot KOL
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      );
                    })}

                    {kolSlots.filter(k => k.campaignId === activeCampaign.id).length === 0 && (
                      <p className="text-center py-6 text-slate-400">Tidak ada slot KOL khusus yang dialokasikan untuk program ini.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: EVENT READINESS */}
              {activeModalTab === 'readiness' && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-800">Kesiapan Operasional Toko & Event</h3>
                  
                  {activeCampaign.eventReadiness ? (
                    <div className="space-y-4">
                      {/* Checklist items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="font-semibold text-slate-700">1. Konfirmasi Lokasi / Venue</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            activeCampaign.eventReadiness.venueConfirmed 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {activeCampaign.eventReadiness.venueConfirmed ? 'Confirmed' : 'Pending'}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="font-semibold text-slate-700">2. Briefing Crew & Kasir Toko</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            activeCampaign.eventReadiness.crewBriefed 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {activeCampaign.eventReadiness.crewBriefed ? 'Sudah Briefing' : 'Belum Briefing'}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="font-semibold text-slate-700">3. Kesiapan Hadiah & Merchandise</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            activeCampaign.eventReadiness.merchandiseReady 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {activeCampaign.eventReadiness.merchandiseReady ? 'Ready di Store' : 'Menunggu Pengiriman'}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="font-semibold text-slate-700">4. Cetak & Pasang POSM / Collateral</span>
                          <span className="font-extrabold text-[#F26522]">
                            {activeCampaign.eventReadiness.posmPrinted}% Siap
                          </span>
                        </div>
                      </div>

                      {/* POSM Progress bar */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-700">Progress Cetak POSM Toko:</span>
                          <span className="font-extrabold text-slate-800">{activeCampaign.eventReadiness.posmPrinted}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#1B365D] h-full rounded-full" 
                            style={{ width: `${activeCampaign.eventReadiness.posmPrinted}%` }}
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Catatan Operasional:</span>
                        <p className="text-slate-700 leading-relaxed">
                          {activeCampaign.eventReadiness.notes}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400">Data kesiapan event belum dimasukkan.</p>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCampaignId(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs"
              >
                Tutup Brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        defaultCampaignId={selectedCampaignId || campaigns[0]?.id}
      />

    </div>
  );
};
