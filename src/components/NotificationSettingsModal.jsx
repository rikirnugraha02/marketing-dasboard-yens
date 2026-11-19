import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Check, 
  HelpCircle, 
  ExternalLink,
  Smartphone,
  Bot,
  Globe
} from 'lucide-react';
import { 
  getNotificationSettings, 
  saveNotificationSettings, 
  openWhatsAppDirect,
  dispatchAutomatedAlert 
} from '../utils/notificationDispatcher';

export const NotificationSettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(getNotificationSettings());
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getNotificationSettings());
      setTestSent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveNotificationSettings(settings);
    alert("Pengaturan notifikasi berhasil disimpan!");
    onClose();
  };

  const handleTestWhatsApp = () => {
    openWhatsAppDirect({
      phone: settings.rikiPhone,
      message: `🔔 *TEST NOTIFIKASI YEN'S MARKETING HQ*\nKoneksi WhatsApp Command Center berhasil disiapkan! (19 Nov 2026)`
    });
  };

  const handleTestTelegram = async () => {
    if (!settings.telegramBotToken || !settings.telegramChatId) {
      alert("Harap isi Telegram Bot Token dan Chat ID terlebih dahulu.");
      return;
    }
    await dispatchAutomatedAlert({
      title: "Test Alert",
      message: "🔔 *TEST NOTIFIKASI YEN'S MARKETING HQ*\nKoneksi Telegram Bot Command Center berhasil! (19 Nov 2026)",
      type: "test"
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#1B365D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Notifikasi WhatsApp & Telegram</h3>
              <p className="text-[11px] text-slate-300">Pusat integrasi alert blocker & permohonan approval</p>
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
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Section 1: WhatsApp */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>1. Nomor WhatsApp Riki (Head of Marketing)</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                1-Click Direct
              </span>
            </div>

            <p className="text-[11px] text-emerald-800">
              Nomor tujuan saat tim mengklik tombol <em>"Kirim Alert ke WA Riki"</em> untuk kendala blocker atau persetujuan materi.
            </p>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp (dengan kode 62):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.rikiPhone}
                  onChange={(e) => handleChange('rikiPhone', e.target.value)}
                  placeholder="6281123456789"
                  className="flex-1 p-2 rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Test WA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Telegram Bot (Optional) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs">
                <Bot className="w-4 h-4 text-blue-600" />
                <span>2. Telegram Group Bot Alert (Opsional)</span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTelegram}
                  onChange={(e) => handleChange('enableTelegram', e.target.checked)}
                  className="rounded text-[#1B365D]"
                />
                <span className="text-[11px] font-bold text-slate-600">Aktifkan</span>
              </label>
            </div>

            {settings.enableTelegram && (
              <div className="space-y-2.5 pt-1 animate-in fade-in duration-150">
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Telegram Bot Token:</label>
                  <input
                    type="text"
                    value={settings.telegramBotToken}
                    onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                    placeholder="123456789:ABCdefGhIJKlmNoPQRstu..."
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Telegram Chat ID (User / Grup Marketing):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.telegramChatId}
                      onChange={(e) => handleChange('telegramChatId', e.target.value)}
                      placeholder="-100123456789 atau @channelname"
                      className="flex-1 p-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{testSent ? 'Terkirim!' : 'Test Bot'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Webhook Gateway (Fonnte / Wablas / Make) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs">
                <Globe className="w-4 h-4 text-purple-600" />
                <span>3. Webhook Otomatis (Fonnte / Wablas / Make)</span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAutoWebhook}
                  onChange={(e) => handleChange('enableAutoWebhook', e.target.checked)}
                  className="rounded text-[#1B365D]"
                />
                <span className="text-[11px] font-bold text-slate-600">Aktifkan</span>
              </label>
            </div>

            {settings.enableAutoWebhook && (
              <div className="pt-1 animate-in fade-in duration-150">
                <label className="block font-bold text-slate-600 mb-0.5">Webhook URL:</label>
                <input
                  type="url"
                  value={settings.webhookUrl}
                  onChange={(e) => handleChange('webhookUrl', e.target.value)}
                  placeholder="https://hook.eu2.make.com/... atau https://api.fonnte.com/send"
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs"
                />
              </div>
            )}
          </div>

          {/* Footer Buttons */}
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
              className="px-5 py-2 bg-[#1B365D] hover:bg-[#24477A] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Pengaturan Notifikasi</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
