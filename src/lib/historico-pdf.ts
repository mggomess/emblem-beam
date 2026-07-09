import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { ufNome } from "./uf";
import { buildVerifyUrl } from "./certificate-pdf";

async function fetchPng(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export type HistoricoCourseRow = {
  courseName: string;
  workload: number;
  issuedAt: Date;
  certificateCode: string;
  uf: string;
};

export type HistoricoInput = {
  studentName: string;
  studentCpf?: string | null;
  studentEmail?: string | null;
  institutionName: string;
  institutionLogoUrl?: string | null;
  uf: string; // UF principal (institucional) para brasão/bandeira/marca d'água
  rows: HistoricoCourseRow[];
  code: string; // código único do histórico
  issuedAt: Date;
  verifyBaseUrl?: string | null;
};

export async function generateHistoricoPdf(input: HistoricoInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // A4 retrato
  let page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Borda
  page.drawRectangle({
    x: 20, y: 20, width: width - 40, height: height - 40,
    borderColor: rgb(0.15, 0.24, 0.72), borderWidth: 1.5,
  });

  const uf = input.uf.toLowerCase();
  const [brasao, bandeira] = await Promise.all([
    fetchPng(`/estados/brasoes/${uf}.png`),
    fetchPng(`/estados/bandeiras/${uf}.png`),
  ]);

  // Marca d'água central usando o próprio brasão do estado
  if (brasao) {
    try {
      const img = await pdfDoc.embedPng(brasao);
      const size = 380;
      page.drawImage(img, {
        x: (width - size) / 2,
        y: (height - size) / 2,
        width: size, height: size, opacity: 0.06,
      });
    } catch { /* ignore */ }
  }

  // Cabeçalho: bandeira (esquerda), logo (centro), brasão (direita)
  if (bandeira) {
    try {
      const img = await pdfDoc.embedPng(bandeira);
      page.drawImage(img, { x: 45, y: height - 90, width: 55, height: 40 });
    } catch { /* skip */ }
  }
  if (brasao) {
    try {
      const img = await pdfDoc.embedPng(brasao);
      page.drawImage(img, { x: width - 100, y: height - 100, width: 55, height: 55 });
    } catch { /* skip */ }
  }
  if (input.institutionLogoUrl) {
    const buf = await fetchPng(input.institutionLogoUrl);
    if (buf) {
      try {
        const img = await pdfDoc.embedPng(buf);
        page.drawImage(img, { x: (width - 55) / 2, y: height - 100, width: 55, height: 55 });
      } catch { /* skip */ }
    }
  }

  // Cabeçalho textual
  const instName = input.institutionName.toUpperCase();
  page.drawText(instName, {
    x: width / 2 - bold.widthOfTextAtSize(instName, 11) / 2,
    y: height - 115, size: 11, font: bold, color: rgb(0.15, 0.15, 0.25),
  });
  const stateLabel = `${ufNome(input.uf).toUpperCase()} — ${input.uf.toUpperCase()}`;
  page.drawText(stateLabel, {
    x: width / 2 - font.widthOfTextAtSize(stateLabel, 8) / 2,
    y: height - 128, size: 8, font, color: rgb(0.4, 0.4, 0.5),
  });

  // Título
  const title = "HISTÓRICO ESCOLAR";
  page.drawText(title, {
    x: width / 2 - bold.widthOfTextAtSize(title, 20) / 2,
    y: height - 165, size: 20, font: bold, color: rgb(0.15, 0.24, 0.72),
  });

  // Dados do aluno
  let y = height - 205;
  const drawField = (label: string, value: string) => {
    page.drawText(label, { x: 50, y, size: 9, font: bold, color: rgb(0.35, 0.35, 0.45) });
    page.drawText(value, { x: 130, y, size: 10, font, color: rgb(0.15, 0.15, 0.2) });
    y -= 16;
  };
  drawField("Aluno:", input.studentName);
  if (input.studentCpf) drawField("CPF:", input.studentCpf);
  if (input.studentEmail) drawField("Email:", input.studentEmail);
  drawField("Emitido em:", input.issuedAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }));

  // Tabela de cursos concluídos
  y -= 10;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 0.6, color: rgb(0.15, 0.24, 0.72) });
  y -= 16;
  const headers = [
    { text: "Curso", x: 50 },
    { text: "Carga", x: 340 },
    { text: "Emissão", x: 400 },
    { text: "Código", x: 470 },
  ];
  headers.forEach((h) => page.drawText(h.text, { x: h.x, y, size: 9, font: bold, color: rgb(0.3, 0.3, 0.4) }));
  y -= 6;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 0.3, color: rgb(0.7, 0.7, 0.8) });
  y -= 14;

  let totalWorkload = 0;
  for (const row of input.rows) {
    if (y < 140) {
      // nova página
      page = pdfDoc.addPage([595, 842]);
      y = height - 60;
    }
    totalWorkload += row.workload;
    // Nome do curso truncado
    let name = row.courseName;
    while (font.widthOfTextAtSize(name, 10) > 280 && name.length > 3) name = name.slice(0, -1);
    if (name !== row.courseName) name = name.slice(0, -1) + "…";
    page.drawText(name, { x: 50, y, size: 10, font, color: rgb(0.15, 0.15, 0.2) });
    page.drawText(`${row.workload}h`, { x: 340, y, size: 10, font, color: rgb(0.15, 0.15, 0.2) });
    page.drawText(row.issuedAt.toLocaleDateString("pt-BR"), { x: 400, y, size: 9, font, color: rgb(0.3, 0.3, 0.4) });
    page.drawText(row.certificateCode.slice(0, 14), { x: 470, y, size: 8, font, color: rgb(0.4, 0.4, 0.5) });
    y -= 16;
  }

  y -= 4;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 0.3, color: rgb(0.7, 0.7, 0.8) });
  y -= 18;
  const totalLabel = `Carga horária total: ${totalWorkload}h`;
  page.drawText(totalLabel, {
    x: width - 45 - bold.widthOfTextAtSize(totalLabel, 11),
    y, size: 11, font: bold, color: rgb(0.15, 0.24, 0.72),
  });

  // Rodapé: código + QR
  const footer = `Código do histórico: ${input.code}`;
  page.drawText(footer, {
    x: 50, y: 70, size: 9, font: italic, color: rgb(0.35, 0.35, 0.45),
  });
  const verifyUrl = buildVerifyUrl(input.code, input.verifyBaseUrl);
  page.drawText("Escaneie o QR Code para validar este histórico:", {
    x: 50, y: 55, size: 8, font, color: rgb(0.45, 0.45, 0.55),
  });

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 160 });
  const qrPng = await fetch(qrDataUrl).then((r) => r.arrayBuffer());
  const qrImg = await pdfDoc.embedPng(qrPng);
  page.drawImage(qrImg, { x: width - 110, y: 40, width: 65, height: 65 });

  return await pdfDoc.save();
}
