import React, { useState } from 'react';
import { BookOpen, Target, Lightbulb, MessageSquare, Code2, AlertTriangle } from 'lucide-react';
import { JobAnalysis } from '@/types/career';

interface InterviewPrepProps {
  analysis: JobAnalysis | null;
}

interface PrepGuide {
  technicalTopics: { topic: string; description: string }[];
  expectedQuestions: { question: string; howToAnswer: string }[];
  studyAdvice: string[];
}

export default function InterviewPrep({ analysis }: InterviewPrepProps) {
  const [guide, setGuide] = useState<PrepGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateGuide = async () => {
    if (!analysis) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis })
      });
      if (res.ok) {
        const data = await res.json();
        setGuide(data);
      } else {
        setError('Rehber oluşturulurken bir hata oluştu.');
      }
    } catch (e) {
      setError('Bağlantı hatası.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!analysis) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <MessageSquare className="w-12 h-12 opacity-50 mb-4" />
        <p className="text-sm font-medium">Teknik hazırlık rehberini oluşturmak için önce bir ilan analizi yapın.</p>
      </div>
    );
  }

  if (!guide && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Teknik Mülakat Hazırlık Radarı</h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md font-medium">
          Yapay zeka, ilanın gereksinimlerini ve senin eksik/kısmi yetkinliklerini analiz ederek mülakatta karşına çıkması en muhtemel teknik konuları ve senaryo sorularını çıkarır.
        </p>
        <button 
          onClick={generateGuide}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
        >
          Özel Hazırlık Rehberimi Oluştur
        </button>
        {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-75" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-150" />
        </div>
        <p className="text-sm font-mono font-semibold uppercase text-blue-600 tracking-wider">Rehber Derleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Teknik Mülakat Stratejisi
        </h3>
        <p className="text-sm text-slate-600 mt-1 font-medium">Eksiklerine özel olarak hazırlanmış mülakat hayatta kalma rehberi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Beklenen Zorlayıcı Sorular
          </h4>
          <div className="space-y-4">
            {guide?.expectedQuestions.map((eq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:border-emerald-300">
                <p className="text-sm font-semibold text-slate-900 mb-4">{eq.question}</p>
                <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-emerald-500">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 mb-1 block">Nasıl Cevaplanmalı?</span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{eq.howToAnswer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              Gözden Geçirilmesi Gereken Konular
            </h4>
            <div className="grid gap-3">
              {guide?.technicalTopics.map((topic, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                  <h5 className="text-sm font-bold text-slate-900 mb-1">{topic.topic}</h5>
                  <p className="text-sm font-medium text-slate-600">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Eksikler İçin Acil Eylem Planı
            </h4>
            <ul className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3 shadow-sm">
              {guide?.studyAdvice.map((advice, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-amber-900 leading-relaxed">{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
