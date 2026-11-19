// WhatsApp & Telegram Notification Dispatcher for Yen's Marketing HQ

const STORAGE_KEYS = {
  NOTIF_SETTINGS: 'yens_notification_settings'
};

export const getNotificationSettings = () => {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem(STORAGE_KEYS.NOTIF_SETTINGS);
  return saved ? JSON.parse(saved) : {
    rikiPhone: '6281123456789', // Default Riki (Head of Marketing)
    enableAutoWebhook: false,
    webhookUrl: '',
    enableTelegram: false,
    telegramBotToken: '',
    telegramChatId: ''
  };
};

export const saveNotificationSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.NOTIF_SETTINGS, JSON.stringify(settings));
};

// 1. Direct 1-Click WhatsApp Opener
export const openWhatsAppDirect = ({ phone, message }) => {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  const targetUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

// 2. Format Messages
export const formatBlockerMessage = ({ userName, roleLabel, blockerDetail, focusToday }) => {
  return `🚨 *[URGENT] BLOCKER ALERT - YEN'S MARKETING* 🚨\n\n` +
    `👤 *Dari:* ${userName} (${roleLabel})\n` +
    `⚠️ *Kendala / Blocker:* ${blockerDetail}\n` +
    `🎯 *Fokus Hari Ini:* ${focusToday || '-'}\n` +
    `📅 *Siklus:* November 2026 (Sprint Week 3)\n\n` +
    `_Mohon bantuan Head of Marketing untuk unblock kendala operasional ini._`;
};

export const formatApprovalRequestMessage = ({ title, category, picName, deadline, draftLink, notes }) => {
  return `📋 *PERMOHONAN APPROVAL MATERI YEN'S* 📋\n\n` +
    `📌 *Materi:* ${title}\n` +
    `📂 *Kategori:* ${category}\n` +
    `👤 *PIC:* ${picName}\n` +
    `⏰ *Deadline:* ${deadline || '-'}\n` +
    (draftLink ? `🔗 *Link Draf:* ${draftLink}\n` : '') +
    (notes ? `💬 *Catatan:* ${notes}\n` : '') +
    `\n_Mohon approval di Yen's Marketing Command Center agar materi siap ditayangkan._`;
};

export const formatRevisionMessage = ({ title, picName, revisionNotes }) => {
  return `🔄 *CATATAN REVISI DARI RIKI (HEAD OF MARKETING)* 🔄\n\n` +
    `Halo *${picName}*,\n` +
    `Materi *"${title}"* memerlukan penyesuaian:\n\n` +
    `📝 *Catatan Revisi:* "${revisionNotes}"\n\n` +
    `_Silakan update materi dan submit ulang di Command Center. Semangat!_`;
};

// 3. Automated Webhook & Telegram Dispatcher
export const dispatchAutomatedAlert = async ({ title, message, type = 'info' }) => {
  const settings = getNotificationSettings();

  // Telegram Bot Alert
  if (settings.enableTelegram && settings.telegramBotToken && settings.telegramChatId) {
    try {
      const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.warn("Telegram dispatch failed:", err);
    }
  }

  // Custom Webhook (Fonnte, Wablas, Zapier, Make, Slack, Discord)
  if (settings.enableAutoWebhook && settings.webhookUrl) {
    try {
      await fetch(settings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: "Yen's Marketing Command Center",
          type,
          title,
          message,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn("Webhook dispatch failed:", err);
    }
  }
};
