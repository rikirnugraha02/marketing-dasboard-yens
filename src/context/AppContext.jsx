import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CURRENT_DATE,
  TEAM_MEMBERS,
  INITIAL_CAMPAIGNS,
  INITIAL_DELIVERABLES,
  INITIAL_KOL_SLOTS,
  INITIAL_CHECKINS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

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

  // Campaigns
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  // Deliverables
  const [deliverables, setDeliverables] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DELIVERABLES);
    return saved ? JSON.parse(saved) : INITIAL_DELIVERABLES;
  });

  // KOL Slots
  const [kolSlots, setKolSlots] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KOL_SLOTS);
    return saved ? JSON.parse(saved) : INITIAL_KOL_SLOTS;
  });

  // Daily Check-ins
  const [checkins, setCheckins] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState('command-center');
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync to LocalStorage
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

  const currentUser = TEAM_MEMBERS.find(m => m.id === currentUserId) || TEAM_MEMBERS[0];

  // Actions
  const approveDeliverable = (deliverableId, note = "Approved by Head of Marketing") => {
    setDeliverables(prev =>
      prev.map(item => {
        if (item.id === deliverableId) {
          return {
            ...item,
            status: 'Approved',
            revisionNotes: ''
          };
        }
        return item;
      })
    );

    const target = deliverables.find(d => d.id === deliverableId);
    if (target) {
      const newLog = {
        id: `log-${Date.now()}`,
        deliverableId,
        deliverableTitle: target.title,
        action: 'Approved',
        actorId: currentUser.id,
        actorName: `${currentUser.name} (${currentUser.roleLabel})`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        note: note || "Deliverable approved for rollout."
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  const requestRevision = (deliverableId, revisionNote) => {
    if (!revisionNote) return;

    setDeliverables(prev =>
      prev.map(item => {
        if (item.id === deliverableId) {
          return {
            ...item,
            status: 'Revision',
            revisionNotes: revisionNote
          };
        }
        return item;
      })
    );

    const target = deliverables.find(d => d.id === deliverableId);
    if (target) {
      const newLog = {
        id: `log-${Date.now()}`,
        deliverableId,
        deliverableTitle: target.title,
        action: 'Revision Requested',
        actorId: currentUser.id,
        actorName: `${currentUser.name} (${currentUser.roleLabel})`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        note: revisionNote
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  const updateDeliverableStatus = (deliverableId, newStatus) => {
    setDeliverables(prev =>
      prev.map(item => {
        if (item.id === deliverableId) {
          return {
            ...item,
            status: newStatus
          };
        }
        return item;
      })
    );
  };

  const addDeliverable = (newDeliverable) => {
    const item = {
      ...newDeliverable,
      id: `del-${Date.now()}`,
      status: newDeliverable.status || 'In Progress',
      priority: newDeliverable.priority || 'High',
      submittedAt: new Date().toISOString()
    };
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
  };

  const addOrUpdateKolSlot = (kolData) => {
    if (kolData.id) {
      setKolSlots(prev => prev.map(k => k.id === kolData.id ? { ...k, ...kolData } : k));
    } else {
      const newSlot = {
        ...kolData,
        id: `kol-${Date.now()}`
      };
      setKolSlots(prev => [...prev, newSlot]);
    }
  };

  const submitCheckin = (checkinData) => {
    const newCheckin = {
      ...checkinData,
      id: `chk-${Date.now()}`,
      userId: currentUser.id,
      date: CURRENT_DATE,
      timestamp: new Date().toISOString(),
      resolved: !checkinData.hasBlocker
    };
    setCheckins(prev => [newCheckin, ...prev]);
  };

  const resolveBlocker = (checkinId) => {
    setCheckins(prev =>
      prev.map(c => (c.id === checkinId ? { ...c, resolved: true } : c))
    );
  };

  const updateCampaign = (updatedCampaign) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };

  const resetAllData = () => {
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
