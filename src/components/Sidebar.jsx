import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  CalendarCheck, 
  FileText, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Database,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { 
    currentUser, 
    setCurrentUserId, 
    teamMembers, 
    activeTab, 
    setActiveTab, 
    pendingApprovals, 
    activeBlockers,
    emptyKolSlots,
    resetAllData,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    setIsCloudModalOpen,
    isCloudConnected
  } = useApp();

  const totalAlerts = pendingApprovals.length + activeBlockers.length + emptyKolSlots.length;

  const navItems = [
    { 
      id: 'command-center', 
      label: currentUser.role === 'head_of_marketing' ? 'Command Center' : 'My Workspace', 
      icon: LayoutDashboard,
      badge: currentUser.role === 'head_of_marketing' && totalAlerts > 0 ? totalAlerts : null,
      badgeColor: 'bg-rose-500'
    },
    { 
      id: 'campaigns-hub', 
      label: 'Campaigns Hub', 
      icon: Layers 
    },
    { 
      id: 'approval-center', 
      label: 'Approval Center', 
      icon: CheckSquare,
      badge: pendingApprovals.length > 0 ? pendingApprovals.length : null,
      badgeColor: 'bg-amber-500'
    },
    { 
      id: 'daily-checkins', 
      label: 'Daily Check-In & Stand-Up', 
      icon: CalendarCheck,
      badge: activeBlockers.length > 0 ? activeBlockers.length : null,
      badgeColor: 'bg-rose-500'
    },
    { 
      id: 'monthly-report', 
      label: 'November Report', 
      icon: FileText 
    },
  ];

  const handleRoleChange = (e) => {
    setCurrentUserId(e.target.value);
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1B365D] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F26522] flex items-center justify-center font-black text-xl shadow-md text-white tracking-wider">
              Y
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight leading-tight flex items-center gap-1.5">
                Yen's Baby & Kid
              </div>
              <div className="text-[11px] font-medium text-slate-300 tracking-wide uppercase">
                Marketing HQ
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Section */}
        <div className="p-4 mx-3 my-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F26522]" />
              Role Preview
            </span>
            <span className="text-[10px] bg-[#F26522]/30 text-amber-200 px-1.5 py-0.5 rounded font-mono font-medium">
              Live Switch
            </span>
          </div>
          
          <div className="relative">
            <select
              value={currentUser.id}
              onChange={handleRoleChange}
              className="w-full bg-[#122540] text-white text-xs font-semibold py-2.5 pl-3 pr-8 rounded-lg border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#F26522] appearance-none cursor-pointer"
            >
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id} className="bg-slate-900 text-white py-1">
                  {member.name} ({member.roleLabel})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="mt-2.5 flex items-center gap-2.5 pt-2 border-t border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#F26522] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
              {currentUser.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-300 truncate">{currentUser.roleLabel}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Campaign Stat Footer */}
        <div className="p-3 border-t border-white/10 bg-black/10">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="text-[11px] font-medium">Nov 2026 Active Cycle</span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">19 Nov</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden my-1.5">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '63%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Day 19 of 30</span>
              <span className="text-slate-200 font-semibold">63% Cycle</span>
            </div>
          </div>

          <button
            onClick={() => setIsCloudModalOpen(true)}
            className="mt-2.5 w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
            title="Konfigurasi Database Cloud (Supabase)"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#F26522]" />
              <span className="font-medium">Cloud Database</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>

          <button
            onClick={() => {
              if (window.confirm("Kembalikan seluruh data ke mock data awal (reset status, approvals, check-ins)?")) {
                resetAllData();
              }
            }}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="Reset data ke seed awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
