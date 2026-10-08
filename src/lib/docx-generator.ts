import { Document, Paragraph, TextRun, HeadingLevel, Packer, ExternalHyperlink, AlignmentType } from 'docx';
import { TailoredCv } from '@/types/career';

const FONT_FAMILY = 'Calibri';
const COLOR_PRIMARY = '000000'; // Siyah
const COLOR_LINK = '0563C1'; // Standart mavi link rengi

export class DocxGenerator {
  static async generateCv(cvData: TailoredCv, stealthModeEnabled: boolean = false): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                bottom: 720,
                left: 720,
                right: 720,
              },
            },
          },
          children: [
            ...(stealthModeEnabled ? [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "*** GİZLİ ARAMA & MASKELENMİŞ CV ***",
                    bold: true,
                    color: "FF0000",
                    size: 18,
                    font: FONT_FAMILY
                  }),
                ]
              })
            ] : []),
            // İletişim Bilgileri Başlığı
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: cvData.fullName.toUpperCase(),
                  bold: true,
                  size: 44, // 22pt (Half-points)
                  font: FONT_FAMILY,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [
                new TextRun({ text: cvData.contactInfo.email, font: FONT_FAMILY, size: 21 }),
                cvData.contactInfo.phone ? new TextRun({ text: ` | ${cvData.contactInfo.phone}`, font: FONT_FAMILY, size: 21 }) : new TextRun({ text: '' }),
                cvData.contactInfo.linkedin ? new TextRun({ text: ` | LinkedIn`, font: FONT_FAMILY, size: 21 }) : new TextRun({ text: '' }),
                cvData.contactInfo.github ? new TextRun({ text: ` | GitHub`, font: FONT_FAMILY, size: 21 }) : new TextRun({ text: '' }),
              ],
            }),

            // Profesyonel Özet
            this.createSectionHeading('PROFESYONEL ÖZET'),
            new Paragraph({
              spacing: { after: 200, line: 276 }, // Satır aralığı 1.15 (~276 twips)
              children: [
                new TextRun({ text: cvData.summary, font: FONT_FAMILY, size: 21 }),
              ],
            }),

            // İş ve Proje Deneyimi
            this.createSectionHeading('İŞ VE PROJE DENEYİMİ'),
            ...cvData.experiences.flatMap((exp) => [
              new Paragraph({
                spacing: { before: 100, after: 50 },
                children: [
                  new TextRun({ text: exp.position, bold: true, font: FONT_FAMILY, size: 22 }),
                  new TextRun({ text: ` - ${exp.company}`, font: FONT_FAMILY, size: 22 }),
                  new TextRun({ text: ` | ${exp.startDate} – ${exp.endDate || 'Devam Ediyor'}`, font: FONT_FAMILY, size: 22, italics: true }),
                ],
              }),
              ...exp.description.map(desc => new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 50, line: 276 },
                children: [
                  new TextRun({ text: desc, font: FONT_FAMILY, size: 21 }),
                ]
              }))
            ]),

            // Projeler
            ...(cvData.projects && cvData.projects.length > 0 ? [
              this.createSectionHeading('ÖZEL PROJELER VE KANITLAR'),
              ...cvData.projects.flatMap((proj) => [
                new Paragraph({
                  spacing: { before: 100, after: 50 },
                  children: [
                    new TextRun({ text: proj.name, bold: true, font: FONT_FAMILY, size: 22 }),
                    new TextRun({ text: ` | Teknolojiler: ${proj.technologies.join(', ')}`, font: FONT_FAMILY, size: 21 }),
                  ],
                }),
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 50, line: 276 },
                  children: [
                    new TextRun({ text: proj.description, font: FONT_FAMILY, size: 21 }),
                  ]
                }),
                ...(proj.proofUrl ? [
                  new Paragraph({
                    spacing: { after: 150 },
                    children: [
                      new ExternalHyperlink({
                        children: [
                          new TextRun({
                            text: "[Doğrulanmış Kanıt]",
                            style: "Hyperlink", // Bu stil docx'te varsayılan olarak desteklenir veya aşağıdaki renk kurallarıyla çalışır
                            color: COLOR_LINK,
                            underline: {},
                            bold: true,
                            font: FONT_FAMILY,
                            size: 21
                          })
                        ],
                        link: proj.proofUrl
                      })
                    ]
                  })
                ] : [])
              ])
            ] : []),

            // Yetkinlikler
            this.createSectionHeading('TEKNİK VE SOSYAL YETKİNLİKLER'),
            new Paragraph({
              spacing: { after: 200, line: 276 },
              children: [
                new TextRun({ text: cvData.skills.join(', '), font: FONT_FAMILY, size: 21 }),
              ],
            }),

            // Eğitim
            this.createSectionHeading('EĞİTİM'),
            ...cvData.education.map(edu => new Paragraph({
              spacing: { before: 100, after: 100 },
              children: [
                new TextRun({ text: edu.institution, bold: true, font: FONT_FAMILY, size: 22 }),
                new TextRun({ text: ` | ${edu.degree} - ${edu.fieldOfStudy}`, font: FONT_FAMILY, size: 21 }),
                new TextRun({ text: ` | Mezuniyet: ${edu.graduationDate}`, font: FONT_FAMILY, size: 21, italics: true }),
              ],
            })),
            
            // Sertifikalar (Eğer varsa)
            ...(cvData.certifications && cvData.certifications.length > 0 ? [
              this.createSectionHeading('SERTİFİKALAR VE BAŞARILAR'),
              new Paragraph({
                spacing: { after: 200, line: 276 },
                children: [
                  new TextRun({ text: cvData.certifications.join(', '), font: FONT_FAMILY, size: 21 }),
                ],
              }),
            ] : []),
          ],
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  private static createSectionHeading(text: string): Paragraph {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
      border: {
        bottom: { color: "000000", space: 1, style: "single", size: 6 }
      },
      children: [
        new TextRun({
          text: text,
          bold: true,
          size: 24, // 12pt
          font: FONT_FAMILY,
          color: COLOR_PRIMARY,
        }),
      ],
    });
  }
}
