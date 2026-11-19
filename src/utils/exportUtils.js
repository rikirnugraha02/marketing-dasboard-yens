// CSV / Excel Export Utilities for Yen's Marketing Command Center

export const exportDeliverablesToCSV = (deliverables, teamMembers, campaigns) => {
  const headers = [
    "ID Deliverable",
    "Brand / Campaign",
    "Judul Deliverable",
    "Kategori",
    "PIC",
    "Deadline",
    "Prioritas",
    "Status",
    "Catatan",
    "Link Draf",
    "Catatan Revisi"
  ];

  const rows = deliverables.map((d) => {
    const pic = teamMembers.find(m => m.id === d.picId);
    const camp = campaigns.find(c => c.id === d.campaignId);

    return [
      `"${d.id}"`,
      `"${camp ? camp.brandPartner + ' - ' + camp.title : d.campaignId}"`,
      `"${(d.title || '').replace(/"/g, '""')}"`,
      `"${d.category}"`,
      `"${pic ? pic.name + ' (' + pic.roleLabel + ')' : d.picId}"`,
      `"${d.deadline || ''}"`,
      `"${d.priority}"`,
      `"${d.status}"`,
      `"${(d.notes || '').replace(/"/g, '""')}"`,
      `"${d.draftLink || ''}"`,
      `"${(d.revisionNotes || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  downloadBlob(csvContent, `Yens-Deliverables-Nov2026-${getTimestampStr()}.csv`, "text/csv;charset=utf-8;");
};

export const exportCampaignFinancialsToCSV = (campaigns) => {
  const headers = [
    "ID Campaign",
    "Brand Partner",
    "Judul Campaign",
    "Periode Mulai",
    "Periode Selesai",
    "Label KPI",
    "Target Angka",
    "Realisasi (19 Nov)",
    "Pencapaian (%)",
    "Cakupan Outlet",
    "Status"
  ];

  const rows = campaigns.map((c) => {
    const percent = Math.min(100, Math.round((c.actualValue / c.targetValue) * 100));
    return [
      `"${c.id}"`,
      `"${c.brandPartner}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.periodStart}"`,
      `"${c.periodEnd}"`,
      `"${c.kpiLabel}"`,
      c.targetValue,
      c.actualValue,
      `"${percent}%"`,
      `"${(c.stores || []).join(', ')}"`,
      `"${c.status}"`
    ];
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  downloadBlob(csvContent, `Yens-Campaign-KPI-Nov2026-${getTimestampStr()}.csv`, "text/csv;charset=utf-8;");
};

const downloadBlob = (content, filename, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getTimestampStr = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
};
