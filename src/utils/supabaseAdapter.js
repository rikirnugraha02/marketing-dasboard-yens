// Adapters to map between PostgreSQL snake_case and React camelCase

export const fromDbCampaign = (c) => ({
  id: c.id,
  title: c.title,
  brandPartner: c.brand_partner,
  periodStart: c.period_start,
  periodEnd: c.period_end,
  kpiLabel: c.kpi_label,
  targetValue: Number(c.target_value) || 0,
  actualValue: Number(c.actual_value) || 0,
  stores: Array.isArray(c.stores) ? c.stores : [],
  status: c.status || 'Active',
  brief: c.brief || '',
  eventReadiness: c.event_readiness || {}
});

export const toDbCampaign = (c) => ({
  id: c.id,
  title: c.title,
  brand_partner: c.brandPartner,
  period_start: c.periodStart,
  period_end: c.periodEnd,
  kpi_label: c.kpiLabel,
  target_value: c.targetValue,
  actual_value: c.actualValue,
  stores: c.stores,
  status: c.status,
  brief: c.brief,
  event_readiness: c.eventReadiness
});

export const fromDbDeliverable = (d) => ({
  id: d.id,
  campaignId: d.campaign_id,
  title: d.title,
  category: d.category,
  picId: d.pic_id,
  deadline: d.deadline,
  priority: d.priority,
  status: d.status,
  draftLink: d.draft_link || '',
  notes: d.notes || '',
  revisionNotes: d.revision_notes || '',
  submittedAt: d.submitted_at || ''
});

export const toDbDeliverable = (d) => ({
  id: d.id,
  campaign_id: d.campaignId,
  title: d.title,
  category: d.category,
  pic_id: d.picId,
  deadline: d.deadline,
  priority: d.priority,
  status: d.status,
  draft_link: d.draftLink,
  notes: d.notes,
  revision_notes: d.revisionNotes || '',
  submitted_at: d.submittedAt
});

export const fromDbKol = (k) => ({
  id: k.id,
  campaignId: k.campaign_id,
  week: k.week,
  kolName: k.kol_name || '',
  picId: k.pic_id || 'fanny',
  status: k.status,
  publishDate: k.publish_date || '',
  deliverableType: k.deliverable_type || 'IG Reel + Story',
  followers: k.followers || '-',
  er: k.er || '-',
  link: k.link || ''
});

export const toDbKol = (k) => ({
  id: k.id,
  campaign_id: k.campaignId,
  week: k.week,
  kol_name: k.kolName || '',
  pic_id: k.picId || 'fanny',
  status: k.status,
  publish_date: k.publishDate || '',
  deliverable_type: k.deliverableType || 'IG Reel + Story',
  followers: k.followers || '-',
  er: k.er || '-',
  link: k.link || ''
});

export const fromDbCheckin = (ch) => ({
  id: ch.id,
  date: ch.date,
  userId: ch.user_id,
  doneYesterday: ch.done_yesterday,
  focusToday: ch.focus_today,
  hasBlocker: Boolean(ch.has_blocker),
  blockerDetail: ch.blocker_detail || '',
  resolved: Boolean(ch.resolved),
  timestamp: ch.timestamp
});

export const toDbCheckin = (ch) => ({
  id: ch.id,
  date: ch.date,
  user_id: ch.userId,
  done_yesterday: ch.doneYesterday,
  focus_today: ch.focusToday,
  has_blocker: ch.hasBlocker,
  blocker_detail: ch.blockerDetail || '',
  resolved: ch.resolved,
  timestamp: ch.timestamp
});

export const fromDbAudit = (a) => ({
  id: a.id,
  deliverableId: a.deliverable_id,
  deliverableTitle: a.deliverable_title,
  action: a.action,
  actorId: a.actor_id,
  actorName: a.actor_name,
  timestamp: a.timestamp,
  note: a.note || ''
});

export const toDbAudit = (a) => ({
  id: a.id,
  deliverable_id: a.deliverableId,
  deliverable_title: a.deliverableTitle,
  action: a.action,
  actor_id: a.actorId,
  actor_name: a.actorName,
  timestamp: a.timestamp,
  note: a.note || ''
});
