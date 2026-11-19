export const formatIDR = (value) => {
  if (value === undefined || value === null) return "Rp 0";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatIDRShort = (value) => {
  if (!value) return "Rp 0";
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} Rb`;
  }
  return `Rp ${value}`;
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + " WIB";
  } catch {
    return dateStr;
  }
};

export const formatDateOnly = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Approved':
    case 'Published':
    case 'Published/Done':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
    case 'Need Approval':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20 animate-pulse';
    case 'Revision':
      return 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-700/20';
    case 'In Progress':
    case 'Briefed':
    case 'Draft Review':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20';
    case 'Slot Empty':
    case 'Overdue':
    case 'Blocked':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
    case 'Planning':
      return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20';
  }
};

export const getPriorityBadgeStyle = (priority) => {
  switch (priority) {
    case 'Urgent':
    case 'High':
      return 'bg-red-50 text-red-600 border-red-200';
    case 'Medium':
      return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'Low':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};
