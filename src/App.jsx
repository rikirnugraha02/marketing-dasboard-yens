import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandCenter } from './components/CommandCenter';
import { CampaignsHub } from './components/CampaignsHub';
import { ApprovalCenter } from './components/ApprovalCenter';
import { DailyCheckinBoard } from './components/DailyCheckinBoard';
import { MonthlyReportView } from './components/MonthlyReportView';
import { UserManagement } from './components/UserManagement';
import { LoginScreen } from './components/LoginScreen';
import { CheckinModal } from './components/CheckinModal';
import { CloudConfigModal } from './components/CloudConfigModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const App = () => {
  const { 
    currentUser,
    activeTab, 
    setActiveTab,
    isCloudModalOpen, 
    setIsCloudModalOpen, 
    isNotifModalOpen, 
    setIsNotifModalOpen 
  } = useApp();

  // Redirect if current active tab is not allowed for the user
  useEffect(() => {
    if (currentUser) {
      const allowed = currentUser.allowedTabs || ['command-center'];
      if (!currentUser.isSuperAdmin && !allowed.includes(activeTab)) {
        setActiveTab(allowed[0] || 'command-center');
      }
    }
  }, [currentUser, activeTab, setActiveTab]);

  // If not authenticated, show Login Screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Check tab permission
  const isAllowed = currentUser.isSuperAdmin || (currentUser.allowedTabs && currentUser.allowedTabs.includes(activeTab));

  const renderActiveView = () => {
    if (!isAllowed) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">Akses Modul Dibatasi</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Akun Anda (<strong>{currentUser.name}</strong>) tidak memiliki izin untuk membuka halaman ini. Hubungi <strong>Riki (Super Admin)</strong> jika Anda memerlukan akses tambahan.
          </p>
          <button
            onClick={() => setActiveTab(currentUser.allowedTabs?.[0] || 'command-center')}
            className="mt-6 px-5 py-2.5 bg-[#1B365D] hover:bg-[#24477A] text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Workspace Saya</span>
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'command-center':
        return <CommandCenter />;
      case 'campaigns-hub':
        return <CampaignsHub />;
      case 'approval-center':
        return <ApprovalCenter />;
      case 'daily-checkins':
        return <DailyCheckinBoard />;
      case 'monthly-report':
        return <MonthlyReportView />;
      case 'user-management':
        return <UserManagement />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by sidebar width on lg) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Header */}
        <Header />

        {/* Dynamic Page Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global 30s Check-in Modal */}
      <CheckinModal />

      {/* Supabase Cloud Connection & Realtime Modal */}
      <CloudConfigModal 
        isOpen={isCloudModalOpen} 
        onClose={() => setIsCloudModalOpen(false)} 
      />

      {/* WhatsApp & Telegram Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />
    </div>
  );
};

export default App;
