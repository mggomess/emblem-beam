import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import QRCode from "qrcode";
import { UF_LIST, ufNome } from "./uf";

async function fetchPng(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export type CertificateInput = {
  studentName: string;
  studentCpf?: string | null;
  courseName: string;
  workload: number;
  institutionName: string;
  institutionLogoUrl?: string | null;
  uf: string;
  teacherNames: string[];
  code: string;
  issuedAt: Date;
  verifyBaseUrl?: string | null;
};

export function buildVerifyUrl(code: string, baseUrl?: string | null): string {
  const trimmed = (baseUrl ?? "").trim();
  if (trimmed) {
    // Substitui {code} se existir; caso contrário concatena
    if (trimmed.includes("{code}")) return trimmed.replace("{code}", encodeURIComponent(code));
    return `${trimmed.replace(/\/$/, "")}/${encodeURIComponent(code)}`;
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/verificar/${code}`;
}

export async function generateCertificatePdf(input: CertificateInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // A4 landscape
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Border frame
  page.drawRectangle({
    x: 20, y: 20, width: width - 40, height: height - 40,
    borderColor: rgb(0.15, 0.24, 0.72), borderWidth: 2,
  });
  page.drawRectangle({
    x: 28, y: 28, width: width - 56, height: height - 56,
    borderColor: rgb(0.43, 0.16, 0.85), borderWidth: 0.5,
  });

 const uf = input.uf.toLowerCase();
const [brasao, bandeira, watermark] = await Promise.all([
  fetchPng(`/estados/brasoes/${uf}.png`),
  fetchPng(`/estados/bandeiras/${uf}.png`),
  fetchPng(`/estados/watermarks/${uf}.png`),
]);



  // Watermark (central, low opacity)
  if (watermark) {
    try {
      const img = await pdfDoc.embedPng(watermark);
      const size = 400;
      page.drawImage(img, {
        x: (width - size) / 2,
        y: (height - size) / 2,
        width: size,
        height: size,
        opacity: 0.06,
      });
    } catch { /* fallback silently */ }
  }

  // Header: brasao (left) + logo (center) + bandeira (right)
  if (brasao) {
    try {
      const img = await pdfDoc.embedPng(brasao);
      page.drawImage(img, { x: 60, y: height - 110, width: 70, height: 70 });
    } catch { /* skip */ }
  }
  if (bandeira) {
    try {
      const img = await pdfDoc.embedPng(bandeira);
      page.drawImage(img, { x: width - 130, y: height - 100, width: 70, height: 50 });
    } catch { /* skip */ }
  }
  if (input.institutionLogoUrl) {
    const buf = await fetchPng(input.institutionLogoUrl);
    if (buf) {
      try {
        const img = await pdfDoc.embedPng(buf);
        const iw = 70, ih = 70;
        page.drawImage(img, { x: (width - iw) / 2, y: height - 110, width: iw, height: ih });
      } catch { /* skip */ }
    }
  }

  // Institution + UF header text
  page.drawText(input.institutionName.toUpperCase(), {
    x: width / 2 - (font.widthOfTextAtSize(input.institutionName.toUpperCase(), 10)) / 2,
    y: height - 130, size: 10, font: bold, color: rgb(0.2, 0.2, 0.3),
  });
  const stateLabel = `${ufNome(input.uf).toUpperCase()} — ${input.uf.toUpperCase()}`;
  page.drawText(stateLabel, {
    x: width / 2 - (font.widthOfTextAtSize(stateLabel, 8)) / 2,
    y: height - 145, size: 8, font, color: rgb(0.4, 0.4, 0.5),
  });

  // Title
  const title = "CERTIFICADO";
  page.drawText(title, {
    x: width / 2 - (bold.widthOfTextAtSize(title, 42)) / 2,
    y: height - 210, size: 42, font: bold, color: rgb(0.15, 0.24, 0.72),
  });

  // Body
  const line1 = "Certificamos que";
  page.drawText(line1, {
    x: width / 2 - (font.widthOfTextAtSize(line1, 14)) / 2,
    y: height - 260, size: 14, font, color: rgb(0.3, 0.3, 0.35),
  });

  const student = input.studentName.toUpperCase();
  page.drawText(student, {
    x: width / 2 - (bold.widthOfTextAtSize(student, 26)) / 2,
    y: height - 300, size: 26, font: bold, color: rgb(0.1, 0.1, 0.2),
  });

  if (input.studentCpf) {
    const cpfText = `CPF ${input.studentCpf}`;
    page.drawText(cpfText, {
      x: width / 2 - (font.widthOfTextAtSize(cpfText, 10)) / 2,
      y: height - 318, size: 10, font, color: rgb(0.5, 0.5, 0.55),
    });
  }

  const body = `concluiu com aproveitamento o curso de ${input.courseName}, com carga horária de ${input.workload} horas.`;
  const bodySize = 12;
  const maxWidth = 620;
  const words = body.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (font.widthOfTextAtSize(test, bodySize) > maxWidth) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  lines.forEach((ln, i) => {
    page.drawText(ln, {
      x: width / 2 - (font.widthOfTextAtSize(ln, bodySize)) / 2,
      y: height - 360 - i * 18, size: bodySize, font, color: rgb(0.25, 0.25, 0.35),
    });
  });

  // Date
  const dateStr = input.issuedAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const dateLine = `Emitido em ${dateStr}`;
  page.drawText(dateLine, {
    x: width / 2 - (italic.widthOfTextAtSize(dateLine, 11)) / 2,
    y: 150, size: 11, font: italic, color: rgb(0.35, 0.35, 0.45),
  });

  // Signatures
  const sigCount = input.teacherNames.length;
  if (sigCount > 0) {
    const slotW = 200;
    const total = sigCount * slotW;
    const startX = (width - total) / 2;
    input.teacherNames.forEach((name, i) => {
      const cx = startX + i * slotW + slotW / 2;
      page.drawLine({
        start: { x: cx - 80, y: 110 },
        end: { x: cx + 80, y: 110 },
        thickness: 0.8, color: rgb(0.3, 0.3, 0.4),
      });
      page.drawText(name, {
        x: cx - (font.widthOfTextAtSize(name, 10)) / 2,
        y: 95, size: 10, font: bold, color: rgb(0.2, 0.2, 0.3),
      });
    });
  }

  // QR Code with verification URL (external SEDU URL or internal fallback)
  const verifyUrl = buildVerifyUrl(input.code, input.verifyBaseUrl);
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 180 });
  const qrPng = await fetch(qrDataUrl).then((r) => r.arrayBuffer());
  const qrImg = await pdfDoc.embedPng(qrPng);
  page.drawImage(qrImg, { x: width - 100, y: 40, width: 70, height: 70 });
  page.drawText(input.code, {
    x: width - 100, y: 30, size: 7, font, color: rgb(0.4, 0.4, 0.5),
  });

  // Small state watermark
  page.drawText(input.uf.toUpperCase(), {
    x: 40, y: 40, size: 10, font: bold, color: rgb(0.15, 0.24, 0.72), rotate: degrees(0),
  });

  return await pdfDoc.save();
}

export function isValidUF(uf: string): boolean {
  return UF_LIST.some((u) => u.sigla === uf.toUpperCase());
}
