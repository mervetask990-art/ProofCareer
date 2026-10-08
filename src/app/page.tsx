"use client";

import { useState } from 'react';
import { Send, Link2, Download, ShieldCheck, CheckCircle2, AlertCircle, HelpCircle, XCircle, Terminal, Eye, Mic, Ghost, FileText, BookOpen } from 'lucide-react';
import GhostJobMeter from '@/components/GhostJobMeter';
import InterviewPrep from '@/components/InterviewPrep';
import AtsXRayPreview from '@/components/AtsXRayPreview';

export default function KariyerPilotuPage() {
  const [chatMessages, setChatMessages] = useState<{role: 'system'|'user', content: string}[]>([
    { role: 'system', content: 'Sistem Başlatıldı. CV analiz ve optimizasyon modülü devrede. Lütfen iş ilanı URL\'sini veya metnini girin.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [tailoredCv, setTailoredCv] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'ghost' | 'interview' | 'xray'>('analysis');
  
  const [stealthEnabled, setStealthEnabled] = useState(false);
  const [currentCompany, setCurrentCompany] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [showStealthConfig, setShowStealthConfig] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAnalyzing) return;

    let userText = inputMessage.trim();
    setInputMessage('');
    
    setChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsAnalyzing(true);

    if (userText.startsWith('http://') || userText.startsWith('https://')) {
      try {
        const scrapeRes = await fetch('/api/scrape-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: userText })
        });
        if (scrapeRes.ok) {
          const data = await scrapeRes.json();
          userText = `İlan Linki: ${userText}\n\nİlan Metni:\n${data.text}`;
        }
      } catch (err) {
        console.error("Scraping error:", err);
      }
    }

    try {
      const apiMessages = chatMessages.map(msg => ({
        role: msg.role === 'system' ? 'model' : 'user',
        content: msg.content
      }));
      apiMessages.push({ role: 'user', content: userText });

      const stealthConfig = {
        enabled: stealthEnabled,
        currentCompany,
        competitors: competitors.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, stealthConfig })
      });

      if (!res.ok) throw new Error('API yanıt vermedi');

      const data = await res.json();
      
      if (data.analysis && Object.keys(data.analysis).length > 0) {
         setAnalysis(data.analysis);
      }
      
      if (data.tailoredCv) {
         setTailoredCv(data.tailoredCv);
      }

      setChatMessages(prev => [...prev, { role: 'system', content: data.message }]);
      
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: 'system', content: '[SİSTEM HATASI]: API bağlantısı kurulamadı.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!tailoredCv) return;
    try {
      const payload = { ...tailoredCv, _stealthMode: stealthEnabled };
      const res = await fetch('/api/download-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ProofCareer_CV_${new Date().getTime()}.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("İndirme başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    }
  };

  const handleDemoLoad = () => {
    setTailoredCv({
      fullName: "Ahmet Yılmaz",
      contactInfo: { email: "ahmet@example.com", phone: "+90 555 123 4567" },
      summary: "React ve TypeScript konularında uzmanlaşmış, ölçeklenebilir ve duyarlı web uygulamaları geliştirme konusunda 5+ yıl deneyimli Kıdemli Frontend Geliştirici.",
      experiences: [
        {
          company: "Tech Solutions Inc.",
          position: "Kıdemli Frontend Geliştirici",
          startDate: "2021-05",
          endDate: null,
          description: [
            "React ve Next.js kullanarak B2B SaaS platformunun arayüzlerini geliştirdim.",
            "Zustand kullanarak global durum yönetimini optimize ettim ve %30 performans artışı sağladım."
          ]
        }
      ],
      projects: [
        {
          name: "E-Ticaret Dashboard",
          description: "Satıcıların ürünlerini yönetebildiği kapsamlı bir dashboard uygulaması.",
          technologies: ["React", "TypeScript", "Tailwind CSS"]
        }
      ],
      skills: ["React", "TypeScript", "Next.js", "Zustand", "Tailwind CSS", "Git"],
      education: [
        {
          institution: "Teknik Üniversite",
          degree: "Lisans",
          fieldOfStudy: "Bilgisayar Mühendisliği",
          graduationDate: "2019"
        }
      ]
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'found': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'partial': return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
      case 'missing': return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      default: return <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'found': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'partial': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'missing': return 'bg-rose-50 border-rose-200 text-rose-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const score = analysis?.matchScore || 0;
  
  const stealthCount = (currentCompany ? 1 : 0) + (competitors ? competitors.split(',').filter(Boolean).length : 0);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Top Status Bar (Mission Control Header) */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold tracking-widest uppercase text-slate-900">ProofCareer</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-bold font-mono tracking-wider text-blue-700 uppercase">Ajan Aktif</span>
          </div>
          
          {stealthEnabled && (
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-200">
              <ShieldCheck className="w-3 h-3 text-rose-600" />
              <span className="text-[10px] font-bold font-mono tracking-wider text-rose-700 uppercase">Gizlilik Modu: {stealthCount} Filtre</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono font-bold tracking-wide text-slate-500">
            SKOR: <span className="text-emerald-600 ml-1">%{score}</span>
          </div>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sol Panel: Terminal & EvidenceChat */}
        <div className="w-[45%] flex flex-col border-r border-slate-200 bg-white relative z-0">
          
          {/* Stealth Mode Config Toggle */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <button 
              onClick={() => setShowStealthConfig(!showStealthConfig)}
              className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              KVKK Bölgesel & Şirket Koruma Kalkanı
            </button>
            
            {showStealthConfig && (
              <div className="mt-4 p-4 rounded-xl border border-rose-100 bg-rose-50/50 space-y-4 animate-in fade-in slide-in-from-top-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-800">Gizli Arama & Maskeleme</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={stealthEnabled} onChange={() => setStealthEnabled(!stealthEnabled)} />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>
                {stealthEnabled && (
                  <div className="space-y-3">
                    <input 
                      type="text" placeholder="Mevcut Şirketiniz" 
                      value={currentCompany} onChange={e => setCurrentCompany(e.target.value)}
                      className="w-full bg-white border border-rose-200 rounded-md p-2.5 text-xs text-slate-800 font-medium focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none shadow-sm"
                    />
                    <input 
                      type="text" placeholder="Rakip Firmalar (Virgülle ayırın)" 
                      value={competitors} onChange={e => setCompetitors(e.target.value)}
                      className="w-full bg-white border border-rose-200 rounded-md p-2.5 text-xs text-slate-800 font-medium focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap font-medium ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100 border border-slate-200 text-slate-700'
                }`}>
                  {msg.role === 'system' && <Terminal className="w-4 h-4 text-blue-500 mb-2" />}
                  {msg.content}
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-75" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-150" />
                  <span className="text-[10px] text-slate-500 ml-2 font-bold font-mono uppercase tracking-wider">Veri İşleniyor...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="İlan URL veya yanıt girin..."
                disabled={isAnalyzing}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 shadow-sm"
              />
              <button 
                type="submit" 
                disabled={isAnalyzing || !inputMessage.trim()}
                className="shrink-0 p-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sağ Panel: Karar Odası (Right Panel) */}
        <div className="w-[55%] flex flex-col bg-slate-50 relative overflow-hidden">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-3 px-4 border-b border-slate-200 bg-white shadow-sm z-10">
            <button onClick={() => setActiveTab('analysis')} className={`px-4 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
              <FileText className="w-4 h-4" /> ATS Analizi
            </button>
            <button onClick={() => setActiveTab('ghost')} className={`px-4 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'ghost' ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
              <Ghost className="w-4 h-4" /> Ghost Radar
            </button>
            <button onClick={() => setActiveTab('interview')} className={`px-4 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'interview' ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
              <BookOpen className="w-4 h-4" /> Mülakat Hazırlığı
            </button>
            <div className="flex-1"></div>
            <button onClick={() => setActiveTab('xray')} className={`px-4 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'xray' ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
              <Eye className="w-4 h-4" /> ATS X-Ray
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            
            {!analysis && activeTab !== 'xray' && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Terminal className="w-12 h-12 opacity-30" />
                <p className="text-sm font-mono font-bold uppercase tracking-wider">Sistem Beklemede</p>
              </div>
            )}

            {/* Tab: Analysis */}
            {activeTab === 'analysis' && analysis && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{analysis.jobTitle}</h2>
                    {analysis.company && <p className="text-sm font-semibold text-slate-500 mt-1">{analysis.company}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Must Haves */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-500 mb-5 flex items-center gap-2">
                      Zorunlu Yetkinlikler
                    </h4>
                    <div className="space-y-3">
                      {analysis.mustHave?.map((item: any, i: number) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${getStatusBg(item.status)}`}>
                          <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                          <div>
                            <span className="text-sm font-semibold">{item.skill}</span>
                            {item.evidence && <p className="text-[11px] opacity-90 mt-1.5 font-medium leading-relaxed">{item.evidence}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nice to Haves & Action Items */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-500 mb-5 flex items-center gap-2">
                      Eksik Kalanlar / Aksiyon
                    </h4>
                    <div className="space-y-3">
                      {analysis.mustHave?.filter((i:any)=>i.status!=='found').concat(analysis.niceToHave?.filter((i:any)=>i.status!=='found')).map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-semibold text-amber-900">{item.skill} <span className="text-[11px] text-amber-700 ml-1 font-medium">(Mülakatta Çıkabilir)</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Ghost Radar */}
            {activeTab === 'ghost' && analysis && (
              <div className="animate-in fade-in duration-500 max-w-2xl mx-auto mt-8">
                <GhostJobMeter score={analysis.ghostJobScore} analysis={analysis.ghostAnalysis} />
              </div>
            )}

            {/* Tab: Interview Simulator */}
            {activeTab === 'interview' && (
              <div className="h-[calc(100vh-140px)] -m-8 animate-in fade-in duration-500 p-8">
                <InterviewPrep analysis={analysis} />
              </div>
            )}

            {/* Tab: ATS X-Ray */}
            {activeTab === 'xray' && (
              <div className="h-[calc(100vh-140px)] -m-8 animate-in fade-in duration-500">
                <AtsXRayPreview cvData={tailoredCv} onDownload={handleDownloadWord} onDemoLoad={handleDemoLoad} />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
