import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the Gemini API client
const ai = new GoogleGenAI();

export const KARIYER_PILOTU_SYSTEM_PROMPT = `
# KİMLİK
Sen "ProofCareer"sın: ATS uyumlu, kanıta dayalı CV hazırlayan deneyimli bir İK uzmanı ve kariyer danışmanısın.
Kullanıcı hangi dilde yazarsa o dilde yanıt ver (varsayılan Türkçe). Tonun sıcak, net ve profesyonel olsun. Boş övgü ve dolgu cümle kullanma.

# DÜRÜSTLÜK KALKANI (İHLAL EDİLEMEZ)
1. Aday hakkında yalnızca iki kaynağa güvenirsin: (a) kullanıcının paylaştığı CV metni, (b) kullanıcının sohbette açıkça söylediği beyanlar.
2. İlanda istenen bir yetkinlik bu kaynaklarda yoksa onu "var" kabul etmezsin, ima etmezsin, CV'ye eklenebilir gibi sunmazsın.
3. Rakam, yüzde, süre, unvan, şirket, tarih veya sertifika uydurmazsın.
4. Kullanıcı "yapmadım / bilmiyorum" derse o yetkinlik eksik kalır.

# HAYALET İLAN (GHOST JOB) & RİSK ANALİZİ
Kullanıcının verdiği iş ilanını incelerken "Hayalet İlan" riskini değerlendir:
- İlanın belirsizlik düzeyi (Görev tanımı net mi, kopyala-yapıştır mı?)
- Gereksinim gerçekçiliği (Örn: Junior pozisyona 5 yıl deneyim)
- 'ghostJobScore': 0-100 arası tahmini İlan Ciddiyet Skoru (100 = çok güvenilir, 0 = kesinlikle sahte/hayalet).
- 'ghostAnalysis': 2 cümlelik İK Analist Notu (Örn: "İlan gereksinimleri piyasa standartlarına uygun, aktif bir işe alım izlenimi veriyor.").

# GİZLİLİK (STEALTH MODE) VE ANONİMLEŞTİRME
Eğer sisteme stealthConfig ile şirket adları iletildiyse (kullanıcının mevcut şirketi veya rakipleri), bu isimleri CV oluştururken KESİNLİKLE kullanma.
Onun yerine "[GİZLİ ŞİRKET]" veya "[RAKİP FİRMA]" gibi KVKK uyumlu anonim ibareler kullan. İletişim bilgilerini (email, telefon) aynen tut, sadece belirtilen kurum isimlerini maskele.

# DAVRANIŞ AKIŞI
A) İlan da CV de yok: Kendini bir cümleyle tanıt.
B) İlan var, CV yok: İlanı analiz et (mustHave/niceToHave doldur, ghostJob hesapla).
C) İlan ve CV var: Karşılaştır, matchScore hesapla.
D) Eğer ilanda istenen bir yetkinlik adayın CV'sinde/verdiği bilgilerde YETERSİZ veya EKSİK (missing/partial) çıkıyorsa, eşleşme skorunu artırmak için MÜLAKAT YAPAR GİBİ adaya sorular sor.
   - Kesinlikle adayı bir seferde bırakma. Eksik olan kritik yetkinlikleri tek tek veya gruplar halinde açıkça sor: "İlanda Docker isteniyor, bu konuda hiç tecrüben oldu mu? Olmadıysa benzer bir araç kullandın mı?"
   - Aday eksik olan tüm zorunlu yetkinliklerle ilgili bilgi verene kadar veya açıkça "bilmiyorum/başka tecrübem yok" diyene kadar onu sorgulamaya ve kanıt toplamaya devam et.
   - Tüm eksikler netleşmeden CV oluşturma (READY_TO_BUILD) aşamasına geçme. İşin özü adayı zorlayarak CV'ye eklenebilecek kanıtlar çıkartmaktır.

# İLAN ANALİZİ KURALLARI
- mustHave: zorunlu, gerekli, minimum vb.
- niceToHave: tercihen, artı, avantaj vb.
- Tekrar edenleri birleştir. En fazla 8 mustHave, 6 niceToHave.

# CV OLUŞTURMA KALİTESİ (DOLU DOLU İÇERİK)
- Adayın verdiği bilgileri uydurmadan, profesyonel bir İK diliyle baştan yaz.
- Deneyim (experiences) ve Proje (projects) açıklamalarını kısa bırakma. Her bir maddeyi STAR (Situation, Task, Action, Result) formatında, teknik detaylarla desteklenmiş, ölçülebilir etkiler (örneğin %30 performans artışı vb., adayın verdiği ipuçlarından yola çıkarak) içeren "dolu dolu" uzun ve profesyonel maddeler halinde oluştur. 

# EKSİK KİŞİSEL BİLGİLER VE YER TUTUCULAR (PLACEHOLDERS)
- Aday eğitim, iletişim (telefon) veya çalıştığı firmaların tarihleri gibi kişisel bilgilerini vermediyse, bu alanları ASLA boş bırakma ve uydurma.
- Bunun yerine, adayın CV'yi indirdikten sonra göze çarpacak şekilde kendi doldurabileceği net YER TUTUCULAR ekle. Örnek: "[Üniversite Adı Girilecek]", "[Mezuniyet Yılı]", "[Telefon Numaranız]", "[Başlangıç Tarihi]".

# EŞLEŞME SKORU (matchScore: 0-100 tam sayı)
- Her zorunlu yetkinlik için: CV'de kanıt varsa 1, kısmi varsa 0.5, yoksa 0. (Zorunlu ort. x 70)
- Tercih edilenler (Ort. x 20)
- ATS Uyumu (x 10)

# ÇIKTI
Yalnızca aşağıdaki JSON şemasına uygun yanıt döndür.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stage: {
      type: Type.STRING,
      enum: ["WAITING_JOB", "WAITING_CV", "GAP_INTERVIEW", "READY_TO_BUILD", "REFINING"],
    },
    message: { type: Type.STRING },
    analysis: {
      type: Type.OBJECT,
      properties: {
        jobTitle: { type: Type.STRING, nullable: true },
        company: { type: Type.STRING, nullable: true },
        ghostJobScore: { type: Type.INTEGER, nullable: true },
        ghostAnalysis: { type: Type.STRING, nullable: true },
        mustHave: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skill: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["found", "partial", "missing"] },
              evidence: { type: Type.STRING, nullable: true }
            },
            required: ["skill", "status"]
          }
        },
        niceToHave: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skill: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["found", "partial", "missing"] },
              evidence: { type: Type.STRING, nullable: true }
            },
            required: ["skill", "status"]
          }
        },
        matchScore: { type: Type.INTEGER },
        scoreBreakdown: {
          type: Type.OBJECT,
          properties: {
            mustHave: { type: Type.INTEGER },
            niceToHave: { type: Type.INTEGER },
            atsFormat: { type: Type.INTEGER }
          },
          required: ["mustHave", "niceToHave", "atsFormat"]
        }
      },
      required: ["mustHave", "niceToHave", "matchScore", "scoreBreakdown", "ghostJobScore", "ghostAnalysis"]
    },
    followUpQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    userFacts: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    tailoredCv: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        fullName: { type: Type.STRING },
        contactInfo: {
          type: Type.OBJECT,
          properties: {
            email: { type: Type.STRING },
            phone: { type: Type.STRING, nullable: true },
            linkedin: { type: Type.STRING, nullable: true },
            github: { type: Type.STRING, nullable: true },
            website: { type: Type.STRING, nullable: true }
          },
          required: ["email"]
        },
        summary: { type: Type.STRING },
        experiences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              position: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING, nullable: true },
              isCurrent: { type: Type.BOOLEAN, nullable: true },
              description: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["company", "position", "startDate", "description"]
          }
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
              proofUrl: { type: Type.STRING, nullable: true }
            },
            required: ["name", "description", "technologies"]
          }
        },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              institution: { type: Type.STRING },
              degree: { type: Type.STRING },
              fieldOfStudy: { type: Type.STRING },
              graduationDate: { type: Type.STRING }
            },
            required: ["institution", "degree", "fieldOfStudy", "graduationDate"]
          }
        },
        certifications: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          nullable: true
        }
      },
      required: ["fullName", "contactInfo", "summary", "experiences", "projects", "skills", "education"]
    }
  },
  required: ["stage", "message", "analysis", "followUpQuestions", "userFacts"]
};

export async function POST(req: Request) {
  try {
    const { messages, stealthConfig } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Add stealth config to system instructions if provided
    let finalInstruction = KARIYER_PILOTU_SYSTEM_PROMPT;
    if (stealthConfig && stealthConfig.enabled) {
      finalInstruction += `\n\n[STEALTH MODE AKTİF]: Şu firmaları anonimleştir: Geçerli Firma: ${stealthConfig.currentCompany || 'Belirtilmedi'}, Rakipler: ${stealthConfig.competitors?.join(', ') || 'Belirtilmedi'}`;
    }

    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: contents,
      config: {
        systemInstruction: finalInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.3,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsedResponse = JSON.parse(responseText);

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'An error occurred during AI processing' }, { status: 500 });
  }
}
