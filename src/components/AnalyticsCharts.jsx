import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { formatIDRShort } from '../utils/formatters';

export const AnalyticsCharts = ({ campaigns, deliverables, kolSlots }) => {
  
  // 1. Campaign Financial Data (in Millions IDR)
  const salesCampaigns = campaigns.filter(c => c.targetValue > 1000);
  const campaignChartData = salesCampaigns.map(c => ({
    name: c.brandPartner,
    Target: Math.round(c.targetValue / 1_000_000),
    Realisasi: Math.round(c.actualValue / 1_000_000),
    persen: Math.round((c.actualValue / c.targetValue) * 100)
  }));

  // 2. Deliverables Status Breakdown
  const statusCounts = deliverables.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Approved / Done', value: (statusCounts['Approved'] || 0) + (statusCounts['Published/Done'] || 0), color: '#10B981' },
    { name: 'In Progress', value: statusCounts['In Progress'] || 0, color: '#3B82F6' },
    { name: 'Need Approval', value: statusCounts['Need Approval'] || 0, color: '#F59E0B' },
    { name: 'Revision', value: statusCounts['Revision'] || 0, color: '#EF4444' }
  ].filter(x => x.value > 0);

  // 3. Store Activation Distribution
  const storeCounts = {
    'Setiabudi (HQ)': 4,
    'Dakota': 3,
    'TKI': 3,
    'Lembang': 3,
    'Tokem': 2
  };
  const storeChartData = Object.entries(storeCounts).map(([store, count]) => ({
    store,
    ProgramAktif: count
  }));

  // 4. KOL Slots Funnel
  const kolStatusCounts = kolSlots.reduce((acc, k) => {
    const s = k.status || 'Slot Empty';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const kolChartData = [
    { status: 'Published', total: kolStatusCounts['Published'] || 0, fill: '#10B981' },
    { status: 'Draft Review', total: kolStatusCounts['Draft Review'] || 0, fill: '#3B82F6' },
    { status: 'Briefed', total: kolStatusCounts['Briefed'] || 0, fill: '#8B5CF6' },
    { status: 'Slot Empty', total: kolStatusCounts['Slot Empty'] || 0, fill: '#F43F5E' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Row 1: Sales Target vs Actual & Deliverable Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left: Bar Chart Sales (Col Span 2) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800">
                Target vs Realisasi Net Sales Brand Partner (Juta Rp)
              </h3>
              <p className="text-[11px] text-slate-400">Pigeon, Libby, dan Interbat Ecosystem s/d 19 Nov 2026</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Retail Sales
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="Jt" />
                <Tooltip 
                  formatter={(value, name) => [`Rp ${value} Juta`, name]} 
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Target" fill="#1B365D" radius={[4, 4, 0, 0]} name="Target Sales" />
                <Bar dataKey="Realisasi" fill="#F26522" radius={[4, 4, 0, 0]} name="Realisasi Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Chart Deliverables (Col Span 1) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800">
              Distribusi Status Deliverables
            </h3>
            <p className="text-[11px] text-slate-400 mb-2">Total {deliverables.length} tugas & materi promosi</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-slate-600 truncate">{p.name}: <strong className="text-slate-800">{p.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Store Distribution & KOL Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Store Coverage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-slate-800">
              Aktivasi Program per Cabang Yen's
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">5 Outlet</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeChartData} layout="vertical" margin={{ top: 0, right: 20, left: 25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="store" type="category" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} />
                <Tooltip 
                  formatter={(val) => [`${val} Program Aktif`, 'Cakupan']} 
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="ProgramAktif" fill="#24477A" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KOL Matrix Funnel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-slate-800">
              Status Slot Influencer & KOL Mingguan
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{kolSlots.length} Total Slot</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kolChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} name="Jumlah Slot" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
