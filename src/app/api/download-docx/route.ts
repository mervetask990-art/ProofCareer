import { NextResponse } from 'next/server';
import { DocxGenerator } from '@/lib/docx-generator';

const DEFAULT_CV = {
  fullName: "Ahmet Yılmaz (Örnek)",
  contactInfo: { email: "ahmet@example.com", phone: "+90 555 123 4567" },
  summary: "Bu bir örnek CV'dir. Gerçek veriler analiz edildikten sonra burada görüntülenecektir.",
  experiences: [
    {
      company: "Örnek Şirket",
      position: "Frontend Geliştirici",
      startDate: "2020-01",
      endDate: "Devam Ediyor",
      description: ["React ve TypeScript ile arayüz geliştirmeleri yapıldı."]
    }
  ],
  projects: [],
  skills: ["React", "TypeScript", "Tailwind CSS"],
  education: [
    {
      institution: "Örnek Üniversitesi",
      degree: "Lisans",
      fieldOfStudy: "Bilgisayar Mühendisliği",
      graduationDate: "2019"
    }
  ],
  certifications: []
};

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const stealthModeEnabled = body._stealthMode === true;
    
    // Support different payload structures
    let cvData = body.tailoredCv || body.resumeData || body;
    
    // If it's missing crucial fields, fallback to default
    if (!cvData || !cvData.fullName || !cvData.experiences) {
      console.warn("Missing CV data, using default template.");
      cvData = DEFAULT_CV;
    }

    // Generate buffer
    const buffer = await DocxGenerator.generateCv(cvData, stealthModeEnabled);

    // Return as downloadable file with correct headers
    const headers = new Headers();
    // HTTP Header'ları Türkçe karakter (ı, ş, ğ vb.) kabul etmediği için güvenli bir dosya adı oluşturuyoruz.
    const safeName = (cvData.fullName || 'ProofCareer').replace(/[^a-zA-Z0-9]/g, '_');
    headers.set('Content-Disposition', `attachment; filename="${safeName}_ProofCareer_CV.docx"`);
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    return new Response(buffer as any, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('Docx generation error:', error);
    return NextResponse.json({ error: 'CV oluşturulurken bir hata meydana geldi' }, { status: 500 });
  }
}
