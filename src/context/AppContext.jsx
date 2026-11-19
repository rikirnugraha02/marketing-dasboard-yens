import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CURRENT_DATE,
  TEAM_MEMBERS,
  INITIAL_CAMPAIGNS,
  INITIAL_DELIVERABLES,
  INITIAL_KOL_SLOTS,
  INITIAL_CHECKINS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { 
  supabase, 
  isSupabaseConfigured 
} from '../lib/supabaseClient';
import {
  fromDbCampaign, toDbCampaign,
  fromDbDeliverable, toDbDeliverable,
  fromDbKol, toDbKol,
  fromDbCheckin, toDbCheckin,
  fromDbAudit, toDbAudit
} from '../utils/supabaseAdapter';

const AppContext = createContext();

const STORAGE_KEYS = {
  ROLE: 'yens_active_role',
  CAMPAIGNS: 'yens_campaigns',
  DELIVERABLES: 'yens_deliverables',
  KOL_SLOTS: 'yens_kol_slots',
  CHECKINS: 'yens_checkins',
  AUDIT_LOGS: 'yens_audit_logs'
};

export const AppProvider = ({ children }) => {
  // Active User / Role
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'riki';
  });

  // Main state with localStorage fallback
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [deliverables, setDeliverables] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DELIVERABLES);
    return saved ? JSON.parse(saved) : INITIAL_DELIVERABLES;
  });

  const [kolSlots, setKolSlots] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KOL_SLOTS);
    return saved ? JSON.parse(saved) : INITIAL_KOL_SLOTS;
  });

  const [checkins, setCheckins] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState('command-center');
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to LocalStorage (Always acts as offline backup)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELIVERABLES, JSON.stringify(deliverables));
  }, [deliverables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KOL_SLOTS, JSON.stringify(kolSlots));
  }, [kolSlots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Fetch initial data from Supabase if configured
  const fetchCloudData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      setIsSyncing(true);

      const [cRes, dRes, kRes, chRes, aRes] = await Promise.all([
        supabase.from('campaigns').select('*').order('created_at', { ascending: true }),
        supabase.from('deliverables').select('*').order('created_at', { ascending: false }),
        supabase.from('kol_slots').select('*').order('created_at', { ascending: true }),
        supabase.from('checkins').select('*').order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false })
      ]);

      if (cRes.data && cRes.data.length > 0) {
        setCampaigns(cRes.data.map(fromDbCampaign));
      }
      if (dRes.data && dRes.data.length > 0) {
        setDeliverables(dRes.data.map(fromDbDeliverable));
      }
      if (kRes.data && kRes.data.length > 0) {
        setKolSlots(kRes.data.map(fromDbKol));
      }
      if (chRes.data && chRes.data.length > 0) {
        setCheckins(chRes.data.map(fromDbCheckin));
      }
      if (aRes.data && aRes.data.length > 0) {
        setAuditLogs(aRes.data.map(fromDbAudit));
      }
    } catch (err) {
      console.warn("Supabase fetch warning, continuing with local state:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Supabase Realtime Listener Setup
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    fetchCloudData();

    // Subscribe to all changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deliverables' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDeliverables(prev => [fromDbDeliverable(payload.new), ...prev.filter(x => x.id !== payload.new.id)]);
          } else if (payload.eventType === 'UPDATE') {
            setDeliverables(prev => prev.map(x => x.id === payload.new.id ? fromDbDeliverable(payload.new) : x));
          } else if (payload.eventType === 'DELETE') {
            setDeliverables(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'checkins' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCheckins(prev => [fromDbCheckin(payload.new), ...prev.filter(x => x.id !== payload.new.id)]);
          } else if (payload.eventType === 'UPDATE') {
            setCheckins(prev => prev.map(x => x.id === payload.new.id ? fromDbCheckin(payload.new) : x));
          } else if (payload.eventType === 'DELETE') {
            setCheckins(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kol_slots' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setKolSlots(prev => [...prev.filter(x => x.id !== payload.new.id), fromDbKol(payload.new)]);
          } else if (payload.eventType === 'UPDATE') {
            setKolSlots(prev => prev.map(x => x.id === payload.new.id ? fromDbKol(payload.new) : x));
          } else if (payload.eventType === 'DELETE') {
            setKolSlots(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'audit_logs' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAuditLogs(prev => [fromDbAudit(payload.new), ...prev.filter(x => x.id !== payload.new.id)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCloudData]);

  const currentUser = TEAM_MEMBERS.find(m => m.id === currentUserId) || TEAM_MEMBERS[0];

  // Actions with Supabase Cloud Sync
  const approveDeliverable = async (deliverableId, note = "Approved by Head of Marketing") => {
    const updatedStatus = 'Approved';
    
    // Optimistic local update
    setDeliverables(prev =>
      prev.map(item => item.id === deliverableId ? { ...item, status: updatedStatus, revisionNotes: '' } : item)
    );

    const target = deliverables.find(d => d.id === deliverableId);
    const newLog = {
      id: `log-${Date.now()}`,
      deliverableId,
      deliverableTitle: target?.title || deliverableId,
      action: 'Approved',
      actorId: currentUser.id,
      actorName: `${currentUser.name} (${currentUser.roleLabel})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: note || "Deliverable approved for rollout."
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Push to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      await supabase.from('deliverables').update({
        status: updatedStatus,
        revision_notes: ''
      }).eq('id', deliverableId);

      await supabase.from('audit_logs').insert(toDbAudit(newLog));
    }
  };

  const requestRevision = async (deliverableId, revisionNote) => {
    if (!revisionNote) return;

    // Optimistic local update
    setDeliverables(prev =>
      prev.map(item => item.id === deliverableId ? { ...item, status: 'Revision', revisionNotes: revisionNote } : item)
    );

    const target = deliverables.find(d => d.id === deliverableId);
    const newLog = {
      id: `log-${Date.now()}`,
      deliverableId,
      deliverableTitle: target?.title || deliverableId,
      action: 'Revision Requested',
      actorId: currentUser.id,
      actorName: `${currentUser.name} (${currentUser.roleLabel})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: revisionNote
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Push to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      await supabase.from('deliverables').update({
        status: 'Revision',
        revision_notes: revisionNote
      }).eq('id', deliverableId);

      await supabase.from('audit_logs').insert(toDbAudit(newLog));
    }
  };

  const updateDeliverableStatus = async (deliverableId, newStatus) => {
    setDeliverables(prev =>
      prev.map(item => item.id === deliverableId ? { ...item, status: newStatus } : item)
    );

    if (isSupabaseConfigured && supabase) {
      await supabase.from('deliverables').update({
        status: newStatus
      }).eq('id', deliverableId);
    }
  };

  const addDeliverable = async (newDeliverable) => {
    const item = {
      ...newDeliverable,
      id: `del-${Date.now()}`,
      status: newDeliverable.status || 'In Progress',
      priority: newDeliverable.priority || 'High',
      submittedAt: new Date().toISOString()
    };
    
    // Optimistic local update
    setDeliverables(prev => [item, ...prev]);

    const newLog = {
      id: `log-${Date.now()}`,
      deliverableId: item.id,
      deliverableTitle: item.title,
      action: 'Created',
      actorId: currentUser.id,
      actorName: `${currentUser.name} (${currentUser.roleLabel})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Added task under campaign: ${item.campaignId}`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Push to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      await supabase.from('deliverables').insert(toDbDeliverable(item));
      await supabase.from('audit_logs').insert(toDbAudit(newLog));
    }
  };

  const addOrUpdateKolSlot = async (kolData) => {
    let finalItem = kolData;

    if (kolData.id) {
      setKolSlots(prev => prev.map(k => k.id === kolData.id ? { ...k, ...kolData } : k));
    } else {
      finalItem = {
        ...kolData,
        id: `kol-${Date.now()}`
      };
      setKolSlots(prev => [...prev, finalItem]);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('kol_slots').upsert(toDbKol(finalItem));
    }
  };

  const submitCheckin = async (checkinData) => {
    const newCheckin = {
      ...checkinData,
      id: `chk-${Date.now()}`,
      userId: currentUser.id,
      date: CURRENT_DATE,
      timestamp: new Date().toISOString(),
      resolved: !checkinData.hasBlocker
    };

    setCheckins(prev => [newCheckin, ...prev]);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('checkins').insert(toDbCheckin(newCheckin));
    }
  };

  const resolveBlocker = async (checkinId) => {
    setCheckins(prev =>
      prev.map(c => (c.id === checkinId ? { ...c, resolved: true } : c))
    );

    if (isSupabaseConfigured && supabase) {
      await supabase.from('checkins').update({ resolved: true }).eq('id', checkinId);
    }
  };

  const updateCampaign = async (updatedCampaign) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('campaigns').upsert(toDbCampaign(updatedCampaign));
    }
  };

  const resetAllData = async () => {
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEYS.DELIVERABLES);
    localStorage.removeItem(STORAGE_KEYS.KOL_SLOTS);
    localStorage.removeItem(STORAGE_KEYS.CHECKINS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);

    setCurrentUserId('riki');
    setCampaigns(INITIAL_CAMPAIGNS);
    setDeliverables(INITIAL_DELIVERABLES);
    setKolSlots(INITIAL_KOL_SLOTS);
    setCheckins(INITIAL_CHECKINS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  // Derived Alerts
  const pendingApprovals = deliverables.filter(d => d.status === 'Need Approval');
  const revisionsCount = deliverables.filter(d => d.status === 'Revision');
  const emptyKolSlots = kolSlots.filter(k => k.status === 'Slot Empty' || !k.kolName);
  
  const overdueDeliverables = deliverables.filter(d => {
    const isDone = d.status === 'Published/Done' || d.status === 'Approved';
    if (isDone) return false;
    const deadlineDate = d.deadline ? d.deadline.split('T')[0] : '';
    return deadlineDate && deadlineDate < CURRENT_DATE;
  });

  const activeBlockers = checkins.filter(c => c.hasBlocker && !c.resolved);

  return (
    <AppContext.Provider
      value={{
        currentDate: CURRENT_DATE,
        teamMembers: TEAM_MEMBERS,
        currentUser,
        setCurrentUserId,
        campaigns,
        deliverables,
        kolSlots,
        checkins,
        auditLogs,
        activeTab,
        setActiveTab,
        isCheckinModalOpen,
        setIsCheckinModalOpen,
        isCloudModalOpen,
        setIsCloudModalOpen,
        isCloudConnected: isSupabaseConfigured,
        isSyncing,
        selectedCampaignId,
        setSelectedCampaignId,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        approveDeliverable,
        requestRevision,
        updateDeliverableStatus,
        addDeliverable,
        addOrUpdateKolSlot,
        submitCheckin,
        resolveBlocker,
        updateCampaign,
        resetAllData,
        pendingApprovals,
        revisionsCount,
        emptyKolSlots,
        overdueDeliverables,
        activeBlockers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
