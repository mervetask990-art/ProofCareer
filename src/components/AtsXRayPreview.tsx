import React from 'react';
import { FileText, Download, FileJson } from 'lucide-react';
import { TailoredCv } from '@/types/career';

interface AtsXRayProps {
  cvData: TailoredCv | null;
  onDownload: () => void;
  onDemoLoad?: () => void;
}

export default function AtsXRayPreview({ cvData, onDownload, onDemoLoad }: AtsXRayProps) {
  if (!cvData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
          <FileJson className="w-10 h-10 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">ATS Ayrıştırma Hazır Değil</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mt-2 font-medium">
            Sol taraftaki asistan ile sohbet ederek iş ilanı gereksinimlerini onayladığınızda, CV'niz bu alanda gerçek zamanlı derlenecektir.
          </p>
        </div>
        {onDemoLoad && (
          <button 
            onClick={onDemoLoad}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Örnek Önizlemeyi Yükle (Demo)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex justify-center overflow-y-auto p-8 bg-slate-50">
      <div className="w-full max-w-[700px] h-fit bg-white border border-slate-200 shadow-sm rounded-sm relative">
        {/* Floating Actions */}
        <div className="absolute top-6 right-8 flex items-center gap-3">
          <button 
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded shadow-sm text-xs font-semibold transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            Word (.docx) İndir
          </button>
          <button 
            onClick={() => alert("CV'niz ATS formatında kopyalandı! Şimdi iş başvuru sayfasına yönlendiriliyorsunuz...")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm text-xs font-semibold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Hemen Başvur
          </button>
        </div>

        {/* Header Label */}
        <div className="p-8 pb-4 border-b border-slate-100">
          <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400">
            ATS Ayrıştırıcı Görünümü (Raw Plaintext View)
          </span>
        </div>
        
        {/* Document Content (Styled HTML Template) */}
        <div className="p-10 text-slate-800 selection:bg-blue-100 selection:text-blue-900">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase mb-2">
              {cvData.fullName}
            </h1>
            <div className="text-sm font-medium text-slate-600 flex items-center justify-center gap-3">
              <span>{cvData.contactInfo.email}</span>
              {cvData.contactInfo.phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{cvData.contactInfo.phone}</span>
                </>
              )}
              {cvData.contactInfo.linkedin && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{cvData.contactInfo.linkedin}</span>
                </>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-3">
              Profesyonel Özet
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {cvData.summary}
            </p>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4">
              İş ve Proje Deneyimi
            </h2>
            <div className="space-y-5">
              {cvData.experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {exp.startDate} – {exp.endDate || 'Devam Ediyor'}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-blue-700 mb-2">{exp.company}</div>
                  <ul className="list-disc list-outside ml-4 space-y-1.5">
                    {exp.description.map((desc, j) => (
                      <li key={j} className="text-sm text-slate-700 leading-relaxed pl-1">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          {cvData.projects && cvData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4">
                Özel Projeler ve Kanıtlar
              </h2>
              <div className="space-y-4">
                {cvData.projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-slate-900">{proj.name}</h3>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">
                      Teknolojiler: {proj.technologies.join(', ')}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-3">
              Teknik ve Sosyal Yetkinlikler
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {cvData.skills.join(' • ')}
            </p>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4">
              Eğitim
            </h2>
            <div className="space-y-3">
              {cvData.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{edu.institution}</h3>
                    <p className="text-sm text-slate-700">{edu.degree} - {edu.fieldOfStudy}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Mezuniyet: {edu.graduationDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Certifications */}
          {cvData.certifications && cvData.certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-3">
                Sertifikalar
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {cvData.certifications.join(' • ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
