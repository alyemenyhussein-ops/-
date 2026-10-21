import React, { useState } from 'react';
import { SavedRoastRecord } from '../types';
import {
  Archive,
  Search,
  Trash2,
  ExternalLink,
  Calendar,
  Layers,
  Thermometer,
  Coffee,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeftRight,
  CheckSquare,
  Square,
  Scale,
} from 'lucide-react';
import { RoastComparisonModal } from './RoastComparisonModal';

interface RoastVaultProps {
  records: SavedRoastRecord[];
  onSelectRecord: (record: SavedRoastRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNewDiagnosis: () => void;
}

export const RoastVault: React.FC<RoastVaultProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onNewDiagnosis,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPTIMAL' | 'NEEDS_ADJUSTMENT' | 'CRITICAL_DEFECT'>('ALL');
  const [selectedIdsForCompare, setSelectedIdsForCompare] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleSelectForCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIdsForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // Keep the second one and add the new one
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const selectedRoastA = records.find((r) => r.id === selectedIdsForCompare[0]);
  const selectedRoastB = records.find((r) => r.id === selectedIdsForCompare[1]);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.beanProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.diagnosis.summary_headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sensoryDefect.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || r.diagnosis.overall_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'NEEDS_ADJUSTMENT':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'CRITICAL_DEFECT':
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-6 shadow-xl flex flex-col gap-6 relative">
      {/* Side by side comparison modal */}
      {selectedRoastA && selectedRoastB && (
        <RoastComparisonModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          roastA={selectedRoastA}
          roastB={selectedRoastB}
          onSelectRecord={onSelectRecord}
        />
      )}
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#262B36] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-[#D97724]" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              سجل التحميصات المحفوظة (Roast Vault)
            </h2>
            <span className="font-mono text-xs bg-[#0D0F12] text-[#38BDF8] px-2 py-0.5 rounded-full border border-[#262B36]">
              {records.length} مسار
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            أرشيف التجارب السابقة ومقارنة استجابة حبوب القهوة للمعاملات الحرارية
          </p>
        </div>

        <button
          onClick={onNewDiagnosis}
          className="px-4 py-2 rounded-xl bg-[#D97724] hover:bg-[#b86118] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <span>تشخيص مسار جديد</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="البحث باسم المحصول، النتيجة الحسية، أو الخلل الحراري..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0F12] border border-[#262B36] rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D97724]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
              statusFilter === 'ALL'
                ? 'bg-[#262B36] text-white border-slate-500'
                : 'bg-[#0D0F12] text-slate-400 border-[#262B36] hover:text-white'
            }`}
          >
            الكل ({records.length})
          </button>
          <button
            onClick={() => setStatusFilter('OPTIMAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
              statusFilter === 'OPTIMAL'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-[#0D0F12] text-slate-400 border-[#262B36] hover:text-emerald-400'
            }`}
          >
            مثالي
          </button>
          <button
            onClick={() => setStatusFilter('NEEDS_ADJUSTMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
              statusFilter === 'NEEDS_ADJUSTMENT'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-[#0D0F12] text-slate-400 border-[#262B36] hover:text-amber-400'
            }`}
          >
            يحتاج ضبط
          </button>
          <button
            onClick={() => setStatusFilter('CRITICAL_DEFECT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
              statusFilter === 'CRITICAL_DEFECT'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-[#0D0F12] text-slate-400 border-[#262B36] hover:text-rose-400'
            }`}
          >
            شذوذ حرج
          </button>
        </div>
      </div>

      {/* Comparison Sticky Selection Bar */}
      {selectedIdsForCompare.length > 0 && (
        <div className="bg-[#0D0F12] border-2 border-[#D97724]/60 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D97724]/20 border border-[#D97724]/40 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-[#D97724]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  وضع المقارنة ({selectedIdsForCompare.length} / 2 مسارات محددة)
                </span>
                {selectedIdsForCompare.length === 2 && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                    جاهز للمقارنة
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedIdsForCompare.length === 1
                  ? 'اضغط على مربع "تحديد للمقارنة" في تحميصة أخرى لبدء التحليل المقارن.'
                  : `مقارنة: "${selectedRoastA?.title}" مقابل "${selectedRoastB?.title}"`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSelectedIdsForCompare([])}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#262B36] transition"
            >
              إلغاء التحديد
            </button>
            <button
              onClick={() => setIsCompareOpen(true)}
              disabled={selectedIdsForCompare.length < 2}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                selectedIdsForCompare.length === 2
                  ? 'bg-gradient-to-r from-[#D97724] to-[#c76518] hover:from-[#e5832e] hover:to-[#d46f1d] text-white cursor-pointer'
                  : 'bg-[#262B36] text-slate-500 cursor-not-allowed border border-[#262B36]'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>مقارنة المسارين جنباً إلى جنب</span>
            </button>
          </div>
        </div>
      )}

      {/* Records Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#0D0F12] border border-[#262B36] rounded-xl p-10 text-center flex flex-col items-center justify-center gap-3">
          <Archive className="w-10 h-10 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-300">
            {records.length === 0 ? 'السجل فارغ حالياً' : 'لا توجد نتائج مطابقة لبحثك'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {records.length === 0
              ? 'عند إتمام أي تشخيص لمسار تحميص، يمكنك الضغط على زر "حفظ في السجل" للرجوع إليه ومقارنته لاحقاً.'
              : 'جرب تغيير كلمات البحث أو المرشحات لعرض السجلات.'}
          </p>
          {records.length === 0 && (
            <button
              onClick={onNewDiagnosis}
              className="mt-2 px-4 py-2 rounded-xl bg-[#262B36] hover:bg-[#D97724] text-white text-xs font-bold transition"
            >
              تشخيص أول مسار تحميص
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((record) => {
            const isSelected = selectedIdsForCompare.includes(record.id);
            const selectionIndex = selectedIdsForCompare.indexOf(record.id);
            const selectionBadgeColor = selectionIndex === 0 ? 'bg-[#38BDF8] text-black' : 'bg-[#D97724] text-white';

            const dateStr = new Date(record.timestamp).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={record.id}
                className={`bg-[#0D0F12] border rounded-xl p-4 transition flex flex-col justify-between gap-3 group relative ${
                  isSelected
                    ? selectionIndex === 0
                      ? 'border-[#38BDF8] shadow-lg shadow-[#38BDF8]/10'
                      : 'border-[#D97724] shadow-lg shadow-[#D97724]/10'
                    : 'border-[#262B36] hover:border-[#D97724]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                          record.diagnosis.overall_status
                        )}`}
                      >
                        صحة التحميص: {record.diagnosis.roast_health_score}/100
                      </span>
                      {(record.diagnosis.sca_cupping_analysis?.calibrated_sca_score || record.cuppingScores?.total_score) && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          SCA: {record.diagnosis.sca_cupping_analysis?.calibrated_sca_score || record.cuppingScores?.total_score}
                        </span>
                      )}
                      {(record.appearance?.whole_bean_agtron || record.diagnosis.agtron_appearance_analysis?.agtron_reading_whole) && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                          Agtron: {record.appearance?.whole_bean_agtron || record.diagnosis.agtron_appearance_analysis?.agtron_reading_whole}/{record.appearance?.ground_agtron || record.diagnosis.agtron_appearance_analysis?.agtron_reading_ground}
                        </span>
                      )}
                    </div>

                    {/* Compare Select Checkbox */}
                    <button
                      onClick={(e) => toggleSelectForCompare(record.id, e)}
                      className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border transition ${
                        isSelected
                          ? `${selectionBadgeColor} border-transparent`
                          : 'bg-[#161920] text-slate-400 hover:text-white border-[#262B36]'
                      }`}
                      title="تحديد للمقارنة جنباً إلى جنب"
                    >
                      {isSelected ? (
                        <>
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>مسار {selectionIndex === 0 ? 'A' : 'B'}</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3.5 h-3.5" />
                          <span>مقارنة</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-[#D97724] transition line-clamp-1">
                    {record.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {record.diagnosis.summary_headline}
                  </p>
                </div>

                <div className="border-t border-[#262B36] pt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span>
                      Drying: <strong className="text-amber-400">{record.diagnosis.phase_ratios.drying_percent}%</strong>
                    </span>
                    <span>
                      DTR: <strong className="text-purple-400">{record.diagnosis.phase_ratios.dtr_percent}%</strong>
                    </span>
                    <span>
                      ΔT: <strong className="text-sky-400">{record.diagnosis.extracted_metrics.temp_development_delta_c}°C</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="حذف من السجل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectRecord(record)}
                      className="px-2.5 py-1 rounded-lg bg-[#161920] hover:bg-[#D97724] text-slate-200 hover:text-white text-xs font-semibold transition flex items-center gap-1 border border-[#262B36]"
                    >
                      <span>عرض</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
