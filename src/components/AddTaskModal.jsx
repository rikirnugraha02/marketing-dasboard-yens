import React, { useState } from 'react';
import { X, Plus, Calendar, User, Tag, Link2, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddTaskModal = ({ isOpen, onClose, defaultCampaignId }) => {
  const { campaigns, teamMembers, addDeliverable } = useApp();

  const [campaignId, setCampaignId] = useState(defaultCampaignId || campaigns[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Content/SocMed');
  const [picId, setPicId] = useState('alvi');
  const [priority, setPriority] = useState('High');
  const [deadline, setDeadline] = useState('2026-11-25T17:00');
  const [draftLink, setDraftLink] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Harap isi judul deliverable/task.");
      return;
    }

    addDeliverable({
      campaignId,
      title: title.trim(),
      category,
      picId,
      priority,
      deadline: deadline || '2026-11-30T17:00:00',
      status: 'In Progress',
      draftLink: draftLink.trim() || 'https://canva.com/example-asset',
      notes: notes.trim() || 'Task baru ditambahkan dari Campaigns Hub.'
    });

    // Reset and close
    setTitle('');
    setNotes('');
    setDraftLink('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#1B365D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F26522] flex items-center justify-center text-white">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Tambah Task / Deliverable Baru</h3>
              <p className="text-[11px] text-slate-300">Penugasan tim marketing Yen's Baby & Kid Shop</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Campaign Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Program / Campaign:</label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#F26522] focus:outline-none font-semibold text-slate-800"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brandPartner} &bull; {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul Task / Deliverable: <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cth: Video Reels Unboxing Hadiah Lucky Draw Libby"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium text-slate-800"
            />
          </div>

          {/* Grid: PIC & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assign ke PIC:</label>
              <select
                value={picId}
                onChange={(e) => setPicId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium"
              >
                {teamMembers.filter(m => m.id !== 'riki').map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.roleLabel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium"
              >
                <option value="Content/SocMed">Content/SocMed</option>
                <option value="Store Collateral/POSM">Store Collateral/POSM</option>
                <option value="Admin/B2B">Admin/B2B</option>
                <option value="Event/Activation">Event/Activation</option>
                <option value="KOL/Partnership">KOL/Partnership</option>
              </select>
            </div>
          </div>

          {/* Grid: Priority & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Prioritas:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tenggat Waktu (Deadline):</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Draft Link */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Link Draft / Preview Asset (Opsional):</label>
            <input
              type="url"
              value={draftLink}
              onChange={(e) => setDraftLink(e.target.value)}
              placeholder="https://canva.com/... atau https://drive.google.com/..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium text-slate-800"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi & Catatan Pengerjaan:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi pengerjaan, spesifikasi ukuran banner/rasio reels, atau target audiens..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#F26522] focus:outline-none font-medium text-slate-800"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F26522] hover:bg-[#D95314] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Deliverable</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
