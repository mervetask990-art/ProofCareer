import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function GhostJobMeter({ score, analysis }: { score?: number, analysis?: string }) {
  if (score === undefined || score === null) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700">Radar Verisi Bulunamadı</h3>
        <p className="text-xs text-slate-500 mt-2 font-medium">Bu özelliği test edebilmek için lütfen sohbete yeni bir iş ilanı yapıştırın.</p>
      </div>
    );
  }
  const isHighRisk = score < 40;
  const isMediumRisk = score >= 40 && score < 75;
  const isSafe = score >= 75;

  let BadgeIcon = ShieldCheck;
  let badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let label = "Güvenli İlan";

  if (isHighRisk) {
    BadgeIcon = ShieldAlert;
    badgeColor = "text-rose-700 bg-rose-50 border-rose-200";
    label = "Yüksek Risk";
  } else if (isMediumRisk) {
    BadgeIcon = AlertTriangle;
    badgeColor = "text-amber-700 bg-amber-50 border-amber-200";
    label = "Orta Risk";
  }

  // Calculate SVG stroke offset for gauge
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * (circumference / 2); // Half circle gauge

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-2">
          Ghost Job Radar
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${badgeColor}`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          {label}
        </span>
      </div>
      
      <div className="mt-6 flex items-center gap-6">
        <div className="relative flex justify-center items-end" style={{ width: 80, height: 40 }}>
          <svg className="absolute top-0 left-0" width="80" height="80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference / 2}
              strokeLinecap="round"
              transform="rotate(180 40 40)"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke={isHighRisk ? "#E11D48" : isMediumRisk ? "#D97706" : "#059669"}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(180 40 40)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute bottom-0 text-xl font-bold font-mono tabular-nums text-slate-900 leading-none">
            %{score}
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">İK Analist Notu</p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {analysis || "İlan verisi yeterli değil."}
          </p>
        </div>
      </div>
    </div>
  );
}
