import React, { useState } from 'react';
import { 
  CheckSquare, 
  Check, 
  RotateCw, 
  ExternalLink, 
  History, 
  FileText, 
  Clock, 
  Send, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDateTime, getStatusBadgeStyle, getPriorityBadgeStyle } from '../utils/formatters';

export const ApprovalCenter = () => {
  const { 
    currentUser, 
    deliverables, 
    auditLogs, 
    teamMembers, 
    approveDeliverable, 
    requestRevision 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending' | 'revision' | 'all' | 'audit'
  const [revisionInputs, setRevisionInputs] = useState({});
  const [activeRevisionId, setActiveRevisionId] = useState(null);

  const isRiki = currentUser.role === 'head_of_marketing';

  // Deliverables requiring attention
  const pendingItems = deliverables.filter(d => d.status === 'Need Approval');
  const revisionItems = deliverables.filter(d => d.status === 'Revision');
  const approvedItems = deliverables.filter(d => d.status === 'Approved' || d.status === 'Published/Done');

  const filteredItems = () => {
    if (activeFilter === 'pending') return pendingItems;
    if (activeFilter === 'revision') return revisionItems;
    if (activeFilter === 'approved') return approvedItems;
    return deliverables;
  };

  const handleRevisionNoteChange = (id, text) => {
    setRevisionInputs(prev => ({ ...prev, [id]: text }));
  };

  const submitRevision = (id) => {
    const note = revisionInputs[id];
    if (!note || !note.trim()) {
      alert("Harap tuliskan catatan revisi yang spesifik untuk PIC.");
      return;
    }
    requestRevision(id, note.trim());
    setActiveRevisionId(null);
    setRevisionInputs(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#F26522]" />
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Marketing Approval & Review Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pusat validasi konten promosi, materi visual, dan broadcast pesan brand partner Yen's Baby & Kid Shop.
          </p>
        </div>

        {/* Status Counts */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Menunggu Approval</span>
            <span className="text-lg font-black text-amber-800">{pendingItems.length}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Dalam Revisi</span>
            <span className="text-lg font-black text-slate-700">{revisionItems.length}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Disetujui</span>
            <span className="text-lg font-black text-emerald-800">{approvedItems.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'pending'
                ? 'bg-white text-[#1B365D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu Review ({pendingItems.length})
          </button>

          <button
            onClick={() => setActiveFilter('revision')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'revision'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revisi ({revisionItems.length})
          </button>

          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'approved'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah Disetujui ({approvedItems.length})
          </button>

          <button
            onClick={() => setActiveFilter('audit')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'audit'
                ? 'bg-[#1B365D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log Audit ({auditLogs.length})
          </button>
        </div>

        {!isRiki && (
          <span className="text-xs text-slate-500 italic">
            *Sedang preview sebagai <strong>{currentUser.name}</strong> ({currentUser.roleLabel}).
          </span>
        )}
      </div>

      {/* Content Area */}
      {activeFilter === 'audit' ? (
        /* AUDIT LOG VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-[#1B365D]" />
            <h2 className="text-base font-extrabold text-slate-800">Riwayat & Log Audit Persetujuan</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Deliverable / Materi</th>
                  <th className="py-3 px-4">Aksi</th>
                  <th className="py-3 px-4">Oleh</th>
                  <th className="py-3 px-4">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 max-w-xs truncate">
                      {log.deliverableTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        log.action === 'Approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : log.action === 'Revision Requested'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                      {log.actorName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 italic">
                      "{log.note}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* DELIVERABLES CARDS VIEW */
        <div className="space-y-4">
          {filteredItems().length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="text-base font-bold text-slate-800">Tidak ada item di kategori ini</h3>
              <p className="text-xs text-slate-400 mt-1">
                Semua item telah diproses atau belum ada materi baru yang diajukan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems().map((item) => {
                const pic = teamMembers.find(m => m.id === item.picId);
                const isOpeningRevision = activeRevisionId === item.id;

                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 sm:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      
                      {/* Left: Detail & Meta */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="text-[10px] font-bold text-[#1B365D] bg-[#1B365D]/10 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadgeStyle(item.priority)}`}>
                            {item.priority} Priority
                          </span>
                          <span className="text-slate-400 text-xs">
                            Deadline: <strong>{formatDateTime(item.deadline)}</strong>
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {item.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <span>Diajukan oleh: <strong className="text-slate-700">{pic?.name} ({pic?.roleLabel})</strong></span>
                            {item.submittedAt && (
                              <>
                                <span>&bull;</span>
                                <span>Pada: {formatDateTime(item.submittedAt)}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Submission note */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-700">
                          <span className="font-bold text-slate-500 uppercase text-[10px] block mb-0.5">Catatan Pengajuan:</span>
                          {item.notes}
                        </div>

                        {/* Existing Revision Notes if any */}
                        {item.revisionNotes && (
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                            <span className="font-bold text-amber-800 uppercase text-[10px] block mb-0.5">
                              Catatan Revisi dari Riki:
                            </span>
                            "{item.revisionNotes}"
                          </div>
                        )}
                      </div>

                      {/* Right: Draft Link & Actions */}
                      <div className="lg:w-80 flex flex-col justify-between gap-4 pt-3 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-5">
                        
                        {/* Draft Preview Box */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                            Aset Draf Siap Review:
                          </span>
                          {item.draftLink ? (
                            <a
                              href={item.draftLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#1B365D] hover:text-[#F26522] font-semibold break-all flex items-center gap-1.5 underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{item.draftLink}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Belum ada link draf</span>
                          )}
                        </div>

                        {/* Revision text field if triggered */}
                        {isOpeningRevision && (
                          <div className="space-y-2 animate-in fade-in duration-150">
                            <label className="block text-[11px] font-bold text-slate-700">
                              Catatan Revisi untuk {pic?.name}:
                            </label>
                            <textarea
                              rows={3}
                              value={revisionInputs[item.id] || ''}
                              onChange={(e) => handleRevisionNoteChange(item.id, e.target.value)}
                              placeholder="Cth: Tolong sesuaikan logo Pigeon & Yen's berdampingan, tambahkan nomor WhatsApp CS."
                              className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-amber-50/40 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setActiveRevisionId(null)}
                                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => submitRevision(item.id)}
                                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                <span>Kirim Catatan</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {!isOpeningRevision && (
                          <div className="space-y-2">
                            {item.status === 'Need Approval' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => approveDeliverable(item.id, "Approved directly via Approval Center")}
                                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Approve (Disetujui)</span>
                                </button>

                                <button
                                  onClick={() => setActiveRevisionId(item.id)}
                                  className="py-2 px-3 bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <RotateCw className="w-3.5 h-3.5" />
                                  <span>Minta Revisi</span>
                                </button>
                              </div>
                            )}

                            {item.status === 'Revision' && (
                              <button
                                onClick={() => approveDeliverable(item.id, "Approved after revision check")}
                                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                              >
                                <Check className="w-4 h-4" />
                                <span>Tandai Selesai & Approve</span>
                              </button>
                            )}

                            {item.status === 'Approved' && (
                              <div className="text-center py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                                ✓ Disetujui & Siap Publikasi
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
