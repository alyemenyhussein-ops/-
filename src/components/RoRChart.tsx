import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { GhostCurvePoint, AnomalyItem } from '../types';
import { AlertCircle, TrendingDown, Sparkles } from 'lucide-react';

interface RoRChartProps {
  data: GhostCurvePoint[];
  anomalies: AnomalyItem[];
  firstCrackTimeSec?: number;
}

export const RoRChart: React.FC<RoRChartProps> = ({
  data,
  anomalies,
  firstCrackTimeSec,
}) => {
  const firstCrackMin = firstCrackTimeSec ? +(firstCrackTimeSec / 60).toFixed(1) : undefined;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actual = payload.find((p: any) => p.dataKey === 'actual_estimated_ror')?.value;
      const target = payload.find((p: any) => p.dataKey === 'target_ror')?.value;
      const diff = actual !== undefined && target !== undefined ? (actual - target).toFixed(1) : null;

      return (
        <div className="bg-[#161920]/95 backdrop-blur border border-[#262B36] rounded-xl p-3 shadow-2xl text-xs font-mono dir-rtl text-right">
          <p className="text-slate-400 font-semibold mb-1 text-[11px]">
            الدقيقة: <span className="text-white font-bold">{label} min</span>
          </p>
          <div className="space-y-1">
            <p className="text-[#38BDF8] flex items-center justify-between gap-3">
              <span>RoR الفعلي / المقروء:</span>
              <span className="font-bold">{actual ?? '-'} °C/min</span>
            </p>
            <p className="text-[#A855F7] flex items-center justify-between gap-3">
              <span>RoR الشبح المستهدف:</span>
              <span className="font-bold">{target ?? '-'} °C/min</span>
            </p>
            {diff !== null && (
              <p className="text-slate-400 text-[10px] border-t border-[#262B36] pt-1 mt-1 flex items-center justify-between">
                <span>الفارق الحراري:</span>
                <span className={+diff > 0 ? 'text-amber-400' : 'text-rose-400'}>
                  {+diff > 0 ? `+${diff}` : diff} °C/min
                </span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Chart Container */}
      <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36]">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-bold text-white">
              ديناميكا معدل صعود الحرارة (RoR Dynamics vs Ghost Curve)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#38BDF8] rounded" />
              <span className="text-slate-300">الـ RoR الفعلي</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#A855F7] border-dashed border-t border-[#A855F7]" />
              <span className="text-[#A855F7]">منحنى الشبح المثالي (Ghost)</span>
            </div>
          </div>
        </div>

        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262B36" opacity={0.6} />
              <XAxis
                dataKey="time_min"
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(val) => `${val}m`}
              />
              <YAxis
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                domain={[0, 'dataMax + 3']}
                unit="°"
              />
              <Tooltip content={<CustomTooltip />} />

              {firstCrackMin && (
                <ReferenceLine
                  x={firstCrackMin}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{
                    value: `FC (${firstCrackMin}m)`,
                    fill: '#F59E0B',
                    fontSize: 10,
                    position: 'top',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
              )}

              <Line
                type="monotone"
                dataKey="actual_estimated_ror"
                name="الـ RoR الفعلي"
                stroke="#38BDF8"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#38BDF8', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#38BDF8', stroke: '#0D0F12', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="target_ror"
                name="منحنى الشبح (Ghost Target)"
                stroke="#A855F7"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 2, fill: '#A855F7', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#A855F7' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[10px] text-slate-500 mt-2 text-center">
          * وحدة القياس: الدرجة المئوية لكل دقيقة (°C/min) على محور الصادات، ودقائق التحميص على محور السينات.
        </p>
      </div>

      {/* Anomalies Detected Below Chart */}
      {anomalies && anomalies.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>الشذوذ والانحرافات الحرارية المرصودة بالمنحنى:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {anomalies.map((ano, idx) => {
              const isCritical =
                ano.severity === 'حرج' ||
                ano.severity?.toLowerCase() === 'critical' ||
                ano.severity?.toLowerCase() === 'high';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                    isCritical
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isCritical ? 'bg-rose-500' : 'bg-amber-400'
                        }`}
                      />
                      {ano.anomaly_type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-black/40 text-slate-300 px-2 py-0.5 rounded border border-[#262B36]">
                        {ano.time_occurred_mm_ss}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ano.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {ano.physical_cause_ar}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
