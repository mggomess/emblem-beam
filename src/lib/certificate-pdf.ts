import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { UF_LIST, ufNome } from "./uf";

const GOLD = rgb(0.76, 0.60, 0.33);
const GOLD_DARK = rgb(0.55, 0.42, 0.18);
const BLACK = rgb(0, 0, 0);
const MEC_BLUE = rgb(0.114, 0.208, 0.341); // #1D3557
const INK_BLUE = rgb(0.10, 0.18, 0.55);

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
  nomeColegio: string;
  dataEmissao: string;
  dataConclusao?: string;
  directorName?: string;
};

export function buildVerifyUrl(code: string, baseUrl?: string | null): string {
  const trimmed = (baseUrl ?? "").trim();
  if (trimmed) {
    if (trimmed.includes("{code}")) return trimmed.replace("{code}", encodeURIComponent(code));
    return `${trimmed.replace(/\/$/, "")}/${encodeURIComponent(code)}`;
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/verificar/${code}`;
}

/* ============================================================
 * Componentes de desenho
 * ============================================================ */

function drawClassicFrame(page: PDFPage) {
  const { width, height } = page.getSize();
  const outer = 22, inner = 34;

  page.drawRectangle({
    x: outer, y: outer,
    width: width - outer * 2, height: height - outer * 2,
    borderColor: GOLD, borderWidth: 3,
  });
  page.drawRectangle({
    x: inner, y: inner,
    width: width - inner * 2, height: height - inner * 2,
    borderColor: GOLD_DARK, borderWidth: 0.6,
  });

  const corners: Array<[number, number, number, number]> = [
    [inner, height - inner, 1, -1],
    [width - inner, height - inner, -1, -1],
    [inner, inner, 1, 1],
    [width - inner, inner, -1, 1],
  ];
  for (const [cx, cy, dx, dy] of corners) {
    for (let i = 0; i < 4; i++) {
      const off = 6 + i * 6;
      page.drawLine({
        start: { x: cx + dx * off, y: cy },
        end: { x: cx, y: cy + dy * off },
        thickness: 0.5, color: GOLD_DARK,
      });
    }
    const lz = 30;
    page.drawLine({ start: { x: cx + dx * lz, y: cy }, end: { x: cx + dx * (lz + 6), y: cy + dy * 6 }, thickness: 0.7, color: GOLD });
    page.drawLine({ start: { x: cx + dx * (lz + 6), y: cy + dy * 6 }, end: { x: cx, y: cy + dy * (lz + 6) }, thickness: 0.7, color: GOLD });
    page.drawCircle({ x: cx + dx * 14, y: cy + dy * 14, size: 1.6, color: GOLD });
  }
}

async function drawWatermark(page: PDFPage, pdfDoc: PDFDocument, brasao: ArrayBuffer | null) {
  if (!brasao) return;
  try {
    const img = await pdfDoc.embedPng(brasao);
    const { width, height } = page.getSize();
    const size = 380;
    page.drawImage(img, {
      x: (width - size) / 2, y: (height - size) / 2,
      width: size, height: size, opacity: 0.12,
    });
  } catch { /* ignore */ }
}

async function drawHeader(
  page: PDFPage,
  pdfDoc: PDFDocument,
  simbolo: ArrayBuffer | null,
  brasao: ArrayBuffer | null,
  bold: PDFFont,
) {
  const { width, height } = page.getSize();
  const topY = height - 110;
  const imgSize = 70;

  if (simbolo) {
    try {
      const img = await pdfDoc.embedPng(simbolo);
      page.drawImage(img, { x: 73, y: topY, width: 48, height: 48 });
    } catch { /* skip */ }
  }
  if (brasao) {
    try {
      const img = await pdfDoc.embedPng(brasao);
      page.drawImage(img, { x: width - 70 - imgSize, y: topY, width: imgSize, height: imgSize });
    } catch { /* skip */ }
  }

  const title = "CERTIFICADO";
  const titleSize = 40;
  const titleWidth = bold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (width - titleWidth) / 2, y: topY + 18,
    size: titleSize, font: bold, color: BLACK,
  });
}

function drawCenteredParagraph(
  page: PDFPage,
  text: string,
  opts: {
    font: PDFFont; size: number; lineHeight: number; y: number; maxWidth: number;
    color?: ReturnType<typeof rgb>;
  },
): number {
  const { font, size, lineHeight, maxWidth, color = BLACK } = opts;
  const { width } = page.getSize();
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (cur) lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);

  let y = opts.y;
  for (const ln of lines) {
    const w = font.widthOfTextAtSize(ln, size);
    page.drawText(ln, { x: (width - w) / 2, y, size, font, color });
    y -= lineHeight;
  }
  return y;
}

/* ============================================================
 * Rodapé de validação (3 colunas)
 * ============================================================ */

function drawCenteredText(
  page: PDFPage,
  text: string,
  cx: number,
  y: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: cx - w / 2, y, size, font, color });
}

function formatFullDate(d: Date): string {
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

async function drawFooter(
  page: PDFPage,
  pdfDoc: PDFDocument,
  bold: PDFFont,
  font: PDFFont,
  brasao: ArrayBuffer | null,
  studentName: string,
  directorName: string | undefined,
) {
  const { width } = page.getSize();
  const footerTop = 175;
  const colY = 90;

  // Larguras das colunas
  const colW = (width - 120) / 3;
  const leftCx = 60 + colW / 2;
  const centerCx = width / 2;
  const rightCx = width - 60 - colW / 2;

  /* ===== COLUNA CENTRAL: bloco MEC ===== */
  // Marca d'água (brasão) atrás do bloco MEC
  if (brasao) {
    try {
      const img = await pdfDoc.embedPng(brasao);
      const size = 0;
      page.drawImage(img, {
        x: centerCx - size / 2, y: colY - 15,
        width: size, height: size, opacity: 0.0,
      });
    } catch { /* skip */ }
  }

  const dataLocal = `HORTOLÂNDIA, ${formatFullDate(new Date())}.`;
  drawCenteredText(page, dataLocal, centerCx, footerTop, 8.5, bold, BLACK);

  drawCenteredText(page, "MEC", centerCx, footerTop - 24, 26, bold, MEC_BLUE);

  const mecLines = [
    "Autorizado pelo Ministério da Educação",
    "SEB 738329 / 1998",
    "Autorizado pela Secretaria de Educação",
    "SEE 98483 / 1998",
  ];
  let my = footerTop - 44;
  for (const ln of mecLines) {
    drawCenteredText(page, ln, centerCx, my, 7.5, bold, MEC_BLUE);
    my -= 11;
  }

  /* ===== COLUNA ESQUERDA: assinatura Secretaria ===== */
  // Assinatura simulada (traço azul manuscrito)
  const sigY = colY + 8;
  page.drawSvgPath(
    "M 0 10 C 15 -5, 30 20, 45 5 S 75 15, 90 0 S 120 12, 140 4",
    {
      x: leftCx - 70, y: sigY + 12,
      borderColor: INK_BLUE, borderWidth: 1.2,
    },
  );
  // Linha
  page.drawLine({
    start: { x: leftCx - 90, y: colY },
    end: { x: leftCx + 90, y: colY },
    thickness: 0.8, color: BLACK,
  });
  drawCenteredText(page, "FLORÊNCIA MARIA ALVES", leftCx, colY - 12, 8.5, bold, BLACK);
  drawCenteredText(page, "SECRETÁRIO(A) - Nº RG: 41.114.200", leftCx, colY - 23, 7.5, font, BLACK);

  /* ===== COLUNA DIREITA: dados do concluinte ===== */
  page.drawLine({
    start: { x: rightCx - 90, y: colY },
    end: { x: rightCx + 90, y: colY },
    thickness: 0.8, color: BLACK,
  });
  const nameUp = studentName.toUpperCase();
  // Se o nome ultrapassar a linha, reduz o tamanho
  let nameSize = 10;
  while (bold.widthOfTextAtSize(nameUp, nameSize) > 175 && nameSize > 6) nameSize -= 0.5;
  drawCenteredText(page, nameUp, rightCx, colY - 12, nameSize, bold, BLACK);
  drawCenteredText(page, "CONCLUINTE", rightCx, colY - 23, 8.5, bold, BLACK);

  // Diretor Escolar (opcional, discreto acima)
  if (directorName) {
    drawCenteredText(page, `Diretor(a) Escolar: ${directorName}`, centerCx, 42, 7, font, BLACK);
  }
}

/* ============================================================
 * Função principal
 * ============================================================ */

export async function generateCertificatePdf(input: CertificateInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 paisagem
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  drawClassicFrame(page);

  const uf = input.uf.toLowerCase();
  const [brasao, simbolo] = await Promise.all([
    fetchPng(`/estados/brasoes/${uf}.png`),
    fetchPng(`/simbolo.png`),
  ]);

  await drawWatermark(page, pdfDoc, brasao);
  await drawHeader(page, pdfDoc, simbolo, brasao, bold);

  const stateLabel = `${ufNome(input.uf).toUpperCase()} — ${input.uf.toUpperCase()}`;
  const stateW = font.widthOfTextAtSize(stateLabel, 9);
  page.drawText(stateLabel, {
    x: (width - stateW) / 2, y: height - 130,
    size: 9, font, color: BLACK,
  });

  const dataConclusao = input.dataConclusao ?? input.issuedAt.toLocaleDateString("pt-BR");
  const legal =
    `${input.nomeColegio}, com fundamento na Lei Federal nº 9.394/96, Decreto Federal 5.104/04, ` +
    `Resoluções CNE/CEB 04/99 e 01/05, Parecer CNE/CEB 11/08, indicações CEE 08/2000, ` +
    `o despacho no Regimento Escolar e as respectivas datas de conclusão, ` +
    `confere o presente CERTIFICADO ao(à) aluno(a):`;

  let y = height - 175;
  y = drawCenteredParagraph(page, legal, {
    font, size: 11, lineHeight: 16, y, maxWidth: 640,
  });

  y -= 14;
  const nomeUp = input.studentName.toUpperCase();
  const nomeW = bold.widthOfTextAtSize(nomeUp, 22);
  page.drawText(nomeUp, { x: (width - nomeW) / 2, y, size: 22, font: bold, color: BLACK });
  y -= 20;

  if (input.studentCpf) {
    const cpfTxt = `CPF ${input.studentCpf}`;
    const cpfW = font.widthOfTextAtSize(cpfTxt, 10);
    page.drawText(cpfTxt, { x: (width - cpfW) / 2, y, size: 10, font, color: BLACK });
    y -= 16;
  }

  y -= 6;
  const conclusao =
    `por haver concluído o curso de ${input.courseName}, com carga horária total de ` +
    `${input.workload} horas, em ${dataConclusao}.`;
  y = drawCenteredParagraph(page, conclusao, {
    font, size: 11, lineHeight: 16, y, maxWidth: 640,
  });

  y -= 18;
  const emissao = `Emitido em: ${input.dataEmissao}`;
  const emW = italic.widthOfTextAtSize(emissao, 11);
  page.drawText(emissao, { x: (width - emW) / 2, y, size: 11, font: italic, color: BLACK });

  // Rodapé 3 colunas (sem QR Code)
  await drawFooter(page, pdfDoc, bold, font, brasao, input.studentName, input.directorName);

  return await pdfDoc.save();
}

export function isValidUF(uf: string): boolean {
  return UF_LIST.some((u) => u.sigla === uf.toUpperCase());
}
