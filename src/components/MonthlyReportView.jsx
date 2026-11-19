import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  Store, 
  Sparkles, 
  Calendar,
  Award,
  ChevronRight,
  BarChart2,
  Table
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatIDRShort, formatDateOnly } from '../utils/formatters';
import { exportDeliverablesToCSV, exportCampaignFinancialsToCSV } from '../utils/exportUtils';
import { AnalyticsCharts } from './AnalyticsCharts';

export const MonthlyReportView = () => {
  const { campaigns, deliverables, kolSlots, checkins, teamMembers } = useApp();
  const [reportTab, setReportTab] = useState('summary'); // 'summary' | 'charts'

  // Aggregate Metrics
  const totalSalesTarget = campaigns.reduce((acc, c) => acc + (c.targetValue > 1000 ? c.targetValue : 0), 0);
  const totalSalesActual = campaigns.reduce((acc, c) => acc + (c.targetValue > 1000 ? c.actualValue : 0), 0);
  const salesPercentage = totalSalesTarget > 0 ? Math.round((totalSalesActual / totalSalesTarget) * 100) : 0;

  const totalDeliverables = deliverables.length;
  const completedDeliverables = deliverables.filter(d => d.status === 'Published/Done' || d.status === 'Approved').length;
  const taskCompletionRate = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

  const totalKOL = kolSlots.length;
  const publishedKOL = kolSlots.filter(k => k.status === 'Published').length;
  const inReviewKOL = kolSlots.filter(k => k.status === 'Draft Review' || k.status === 'Briefed').length;
  const emptyKOL = kolSlots.filter(k => k.status === 'Slot Empty' || !k.kolName).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (Hidden during print) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F26522]" />
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Executive Summary & Monthly Report (November 2026)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Laporan performa penjualan retail, utilisasi sumber daya tim, dan visualisasi analitik interaktif.
          </p>
        </div>

        {/* Action Buttons: Export CSV & Print */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* CSV Deliverables */}
          <button
            onClick={() => exportDeliverablesToCSV(deliverables, teamMembers, campaigns)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            title="Download Spreadsheet Deliverables (.csv)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Tasks CSV</span>
          </button>

          {/* CSV Financials */}
          <button
            onClick={() => exportCampaignFinancialsToCSV(campaigns)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            title="Download Spreadsheet Keuangan Campaign (.csv)"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Sales CSV</span>
          </button>

          {/* Print PDF */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#1B365D] hover:bg-[#24477A] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher: Executive Document vs Interactive Visual Charts */}
      <div className="no-print flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setReportTab('summary')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            reportTab === 'summary'
              ? 'bg-[#1B365D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Laporan Eksekutif Resmi</span>
        </button>

        <button
          onClick={() => setReportTab('charts')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            reportTab === 'charts'
              ? 'bg-[#1B365D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Grafik & Analitik Visual</span>
        </button>
      </div>

      {/* VIEW 1: INTERACTIVE CHARTS */}
      {reportTab === 'charts' && (
        <div className="no-print">
          <AnalyticsCharts 
            campaigns={campaigns} 
            deliverables={deliverables} 
            kolSlots={kolSlots} 
          />
        </div>
      )}

      {/* VIEW 2: OFFICIAL PRINTABLE EXECUTIVE DOCUMENT (Always printable) */}
      <div className={`${reportTab === 'summary' ? 'block' : 'hidden print:block'} bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8`}>
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#F26522] flex items-center justify-center text-white font-extrabold text-lg">
                Y
              </div>
              <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                Yen's Baby & Kid Shop
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#1B365D] tracking-tight">
              MARKETING COMMAND CENTER REPORT
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cabang: Setiabudi (HQ), Dakota, TKI, Lembang, Tokem &bull; Periode: 1–30 November 2026
            </p>
          </div>

          <div className="sm:text-right text-xs text-slate-500 font-medium">
            <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg text-slate-800 font-bold mb-1">
              Cut-off: 19 November 2026
            </div>
            <div>Prepared by: <strong>Riki (Head of Marketing)</strong></div>
            <div>Distribusi: Direksi & Store Managers</div>
          </div>
        </div>

        {/* 1. Executive Highlights (3 Big KPIs) */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            I. RINGKASAN EKSEKUTIF & KPI AGREGAT
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Sales Aggregate */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">Total Net Sales Program</span>
              <div className="text-2xl font-black text-[#1B365D] mt-1">
                {formatIDRShort(totalSalesActual)}
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                <div className="bg-[#1B365D] h-full rounded-full" style={{ width: `${salesPercentage}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{salesPercentage}% dari Target</span>
                <span>Target: {formatIDRShort(totalSalesTarget)}</span>
              </div>
            </div>

            {/* Task Completion */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">Deliverables Completion Rate</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {taskCompletionRate}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${taskCompletionRate}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{completedDeliverables} Selesai</span>
                <span>Total: {totalDeliverables} Deliverables</span>
              </div>
            </div>

            {/* KOL Push Progress */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">KOL Activation Rate</span>
              <div className="text-2xl font-black text-[#F26522] mt-1">
                {publishedKOL} / {totalKOL}
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                <div className="bg-[#F26522] h-full rounded-full" style={{ width: `${(publishedKOL / totalKOL) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{inReviewKOL} On Progress</span>
                <span className={emptyKOL > 0 ? "text-rose-600 font-bold" : ""}>{emptyKOL} Slot Kosong</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Program Breakdown Table */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            II. DETAIL PERFORMA PROGRAM PARTNER
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B365D] text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Program & Partner</th>
                  <th className="py-3 px-4">Outlet</th>
                  <th className="py-3 px-4">Target KPI</th>
                  <th className="py-3 px-4">Realisasi (19 Nov)</th>
                  <th className="py-3 px-4">Pencapaian</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((camp) => {
                  const percent = Math.min(100, Math.round((camp.actualValue / camp.targetValue) * 100));
                  const isCurrency = camp.targetValue > 1000;

                  return (
                    <tr key={camp.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block">{camp.title}</span>
                        <span className="text-[10px] font-bold text-[#F26522] uppercase">{camp.brandPartner}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {camp.stores.join(', ')}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {isCurrency ? formatIDR(camp.targetValue) : `${camp.targetValue} Peserta`}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {isCurrency ? formatIDR(camp.actualValue) : `${camp.actualValue} Peserta`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{percent}%</span>
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-[#1B365D] h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {camp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Activation Highlights */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            III. HIGHLIGHT OPERASIONAL & AKTIVASI MINGGUAN
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#F26522]" />
                Pigeon Fun Fair & Clearance Wagon Libby
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Antusiasme konsumen terhadap Buy 1 Get 1 Pigeon di Setiabudi sangat tinggi. Gerobak clearance Libby di area depan telah menyerap 46,2 Juta transaksi dalam 7 hari pertama. Perlu penambahan stok botol T-Ester.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#F26522]" />
                Event Readiness: Molagi Clay Art (28 Nov 2026)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                14 dari 30 kuota anak usia 3-6 tahun sudah terdaftar melalui WhatsApp marketing. Menunggu pencairan invoice sponsor Rp 3.000.000 untuk pengadaan 35 clay pack dan goodie bags.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Executive Sign-Off Block */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          <div className="text-slate-400 max-w-sm">
            <p className="italic">
              Dokumen ini dihasilkan secara otomatis oleh Yen's Marketing Command Center dan dapat diverifikasi langsung melalui database real-time.
            </p>
          </div>

          <div className="text-center sm:text-right min-w-[200px]">
            <p className="text-slate-500 mb-8">Bandung, 19 November 2026</p>
            <div className="font-bold text-slate-900 text-sm">Riki</div>
            <div className="text-slate-500 text-xs">Head of Marketing &bull; Yen's Baby & Kid Shop</div>
          </div>
        </div>

      </div>

    </div>
  );
};
