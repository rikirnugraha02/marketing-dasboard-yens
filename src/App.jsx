import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandCenter } from './components/CommandCenter';
import { CampaignsHub } from './components/CampaignsHub';
import { ApprovalCenter } from './components/ApprovalCenter';
import { DailyCheckinBoard } from './components/DailyCheckinBoard';
import { MonthlyReportView } from './components/MonthlyReportView';
import { CheckinModal } from './components/CheckinModal';

export const App = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
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
    </div>
  );
};

export default App;
