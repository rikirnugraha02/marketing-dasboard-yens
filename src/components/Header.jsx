import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Menu, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  PlusCircle,
  Database,
  Cloud,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDateTime } from '../utils/formatters';

export const Header = () => {
  const { 
    currentUser, 
    setIsCheckinModalOpen, 
    setIsCloudModalOpen,
    isCloudConnected,
    isSyncing,
    pendingApprovals, 
    activeBlockers, 
    emptyKolSlots, 
    overdueDeliverables,
    setActiveTab,
    setIsMobileSidebarOpen
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const totalNotifications = pendingApprovals.length + activeBlockers.length + emptyKolSlots.length + overdueDeliverables.length;

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger & Campaign Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#1B365D]/5 text-[#1B365D] border border-[#1B365D]/15 rounded-lg text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#F26522]" />
              <span>Active Cycle: <strong className="text-[#1B365D]">November 2026</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>19 Nov 2026</span>
            </div>
          </div>
        </div>

        {/* Right: Cloud Sync Chip, Quick Check-in Button & Notifications */}
        <div className="flex items-center gap-2.5">
          
          {/* Cloud Sync Status Chip */}
          <button
            onClick={() => setIsCloudModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              isCloudConnected 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Database Cloud Sync Settings"
          >
            <Database className="w-3.5 h-3.5 text-current" />
            <span className="hidden md:inline">
              {isCloudConnected ? 'Cloud Realtime' : 'Connect Cloud'}
            </span>
            <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          </button>

          {/* Quick 30s Check-In CTA */}
          <button
            onClick={() => setIsCheckinModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F26522] hover:bg-[#D95314] text-white text-xs font-bold rounded-lg shadow-xs hover:shadow transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">30s Daily Check-In</span>
            <span className="sm:hidden">Check-In</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications & Alerts"
            >
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-[10px] font-bold text-white items-center justify-center">
                    {totalNotifications}
                  </span>
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-[#1B365D] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs uppercase tracking-wider">Actionable Alerts</span>
                  </div>
                  <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    {totalNotifications} items
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {/* Pending Approvals */}
                  {pendingApprovals.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 hover:bg-amber-50/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveTab('approval-center');
                        setIsNotifOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-amber-700 font-medium">Needs Approval by Riki</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">PIC: {item.picId.toUpperCase()}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}

                  {/* Active Blockers */}
                  {activeBlockers.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 hover:bg-rose-50/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveTab('daily-checkins');
                        setIsNotifOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-600 mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-rose-800 line-clamp-1">Active Blocker ({item.userId.toUpperCase()})</p>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{item.blockerDetail}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}

                  {/* Empty KOL Slots */}
                  {emptyKolSlots.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 hover:bg-red-50/40 cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveTab('campaigns-hub');
                        setIsNotifOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">Empty KOL Slot: {item.week}</p>
                          <p className="text-[11px] text-red-600">Pigeon campaign needs an influencer locked</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}

                  {totalNotifications === 0 && (
                    <div className="p-6 text-center text-slate-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                      <p className="text-xs font-medium text-slate-600">All clear! No critical alerts.</p>
                      <p className="text-[11px] text-slate-400">Great job keeping the queue clean.</p>
                    </div>
                  )}
                </div>

                {totalNotifications > 0 && (
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setActiveTab(currentUser.role === 'head_of_marketing' ? 'approval-center' : 'command-center');
                        setIsNotifOpen(false);
                      }}
                      className="text-xs text-[#1B365D] hover:text-[#F26522] font-semibold flex items-center justify-center gap-1 w-full"
                    >
                      <span>Review in Queue</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active User Avatar Chip */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#1B365D] text-white text-xs font-bold flex items-center justify-center ring-2 ring-[#F26522]/30">
              {currentUser.avatar}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {currentUser.roleLabel}
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
