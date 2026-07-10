import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { UF_LIST, ufNome } from "./uf";

const GOLD = rgb(0.76, 0.60, 0.33);
const GOLD_DARK = rgb(0.55, 0.42, 0.18);
const BLACK = rgb(0, 0, 0);

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
  /** Nome do colégio que abrirá o texto do cabeçalho legal. */
  nomeColegio: string;
  /** Data de emissão (livre para edição pelo usuário, ex: "10 de julho de 2026"). */
  dataEmissao: string;
  /** Data de conclusão do curso a ser inserida no final do texto jurídico. */
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
  const outerMargin = 22;
  const innerMargin = 34;

  // Linha externa grossa dourada
  page.drawRectangle({
    x: outerMargin,
    y: outerMargin,
    width: width - outerMargin * 2,
    height: height - outerMargin * 2,
    borderColor: GOLD,
    borderWidth: 3,
  });

  // Linha interna fina paralela
  page.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: width - innerMargin * 2,
    height: height - innerMargin * 2,
    borderColor: GOLD_DARK,
    borderWidth: 0.6,
  });

  // Arabescos geométricos simulados nos 4 cantos
  const cornerSize = 40;
  const corners: Array<[number, number, number, number]> = [
    [innerMargin, height - innerMargin, 1, -1],   // sup-esq
    [width - innerMargin, height - innerMargin, -1, -1], // sup-dir
    [innerMargin, innerMargin, 1, 1],             // inf-esq
    [width - innerMargin, innerMargin, -1, 1],    // inf-dir
  ];

  for (const [cx, cy, dx, dy] of corners) {
    // Diagonais decorativas
    for (let i = 0; i < 4; i++) {
      const off = 6 + i * 6;
      page.drawLine({
        start: { x: cx + dx * off, y: cy },
        end: { x: cx, y: cy + dy * off },
        thickness: 0.5,
        color: GOLD_DARK,
      });
    }
    // Pequeno losango
    const lz = cornerSize - 10;
    page.drawLine({ start: { x: cx + dx * lz, y: cy }, end: { x: cx + dx * (lz + 6), y: cy + dy * 6 }, thickness: 0.7, color: GOLD });
    page.drawLine({ start: { x: cx + dx * (lz + 6), y: cy + dy * 6 }, end: { x: cx, y: cy + dy * (lz + 6) }, thickness: 0.7, color: GOLD });
    // Ponto central
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
      x: (width - size) / 2,
      y: (height - size) / 2,
      width: size,
      height: size,
      opacity: 0.05,
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

  // Selo da República — canto superior esquerdo
  if (simbolo) {
    try {
      const img = await pdfDoc.embedPng(simbolo);
      page.drawImage(img, { x: 70, y: topY, width: imgSize, height: imgSize });
    } catch { /* skip */ }
  }

  // Brasão do estado — canto superior direito
  if (brasao) {
    try {
      const img = await pdfDoc.embedPng(brasao);
      page.drawImage(img, { x: width - 70 - imgSize, y: topY, width: imgSize, height: imgSize });
    } catch { /* skip */ }
  }

  // Título centralizado
  const title = "CERTIFICADO";
  const titleSize = 40;
  const titleWidth = bold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: topY + 18,
    size: titleSize,
    font: bold,
    color: BLACK,
  });
}

/**
 * Quebra o texto em linhas caindo em maxWidth e desenha centralizado.
 * Retorna o Y logo abaixo do último baseline.
 */
function drawCenteredParagraph(
  page: PDFPage,
  text: string,
  opts: {
    font: PDFFont;
    size: number;
    lineHeight: number;
    y: number;
    maxWidth: number;
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
    } else {
      cur = test;
    }
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

function drawSignatures(page: PDFPage, font: PDFFont, bold: PDFFont, studentName: string, directorName?: string) {
  const { width } = page.getSize();
  const yLine = 90;
  const slotW = 260;
  const leftCx = width / 2 - slotW / 2 - 20;
  const rightCx = width / 2 + slotW / 2 + 20;

  const drawSlot = (cx: number, cargo: string, nome?: string) => {
    page.drawLine({
      start: { x: cx - 110, y: yLine },
      end: { x: cx + 110, y: yLine },
      thickness: 0.8,
      color: BLACK,
    });
    if (nome) {
      const wN = font.widthOfTextAtSize(nome, 10);
      page.drawText(nome, { x: cx - wN / 2, y: yLine + 4, size: 10, font, color: BLACK });
    }
    const wC = bold.widthOfTextAtSize(cargo, 10);
    page.drawText(cargo, { x: cx - wC / 2, y: yLine - 14, size: 10, font: bold, color: BLACK });
  };

  drawSlot(leftCx, "DIRETOR ESCOLAR", directorName);
  drawSlot(rightCx, "CONCLUINTE / ALUNO", studentName);
}

/* ============================================================
 * Função principal
 * ============================================================ */

export async function generateCertificatePdf(input: CertificateInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // A4 paisagem
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Moldura clássica dourada
  drawClassicFrame(page);

  const uf = input.uf.toLowerCase();
  const [brasao, simbolo] = await Promise.all([
    fetchPng(`/estados/brasoes/${uf}.png`),
    fetchPng(`/simbolo.png`),
  ]);

  // Marca d'água central (brasão do estado)
  await drawWatermark(page, pdfDoc, brasao);

  // Cabeçalho simétrico
  await drawHeader(page, pdfDoc, simbolo, brasao, bold);

  // Subtítulo — UF
  const stateLabel = `${ufNome(input.uf).toUpperCase()} — ${input.uf.toUpperCase()}`;
  const stateW = font.widthOfTextAtSize(stateLabel, 9);
  page.drawText(stateLabel, {
    x: (width - stateW) / 2,
    y: height - 130,
    size: 9,
    font,
    color: BLACK,
  });

  // Corpo do texto — jurídico e dinâmico
  const dataConclusao = input.dataConclusao ?? input.issuedAt.toLocaleDateString("pt-BR");
  const legal =
    `${input.nomeColegio}, com fundamento na Lei Federal nº 9.394/96, Decreto Federal 5.104/04, ` +
    `Resoluções CNE/CEB 04/99 e 01/05, Parecer CNE/CEB 11/08, indicações CEE 08/2000, ` +
    `o despacho no Regimento Escolar e as respectivas datas de conclusão, ` +
    `confere o presente CERTIFICADO ao(à) aluno(a):`;

  let y = height - 175;
  y = drawCenteredParagraph(page, legal, {
    font, size: 11, lineHeight: 16, y, maxWidth: 640, color: BLACK,
  });

  // Nome do aluno em destaque
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

  // Conclusão + data de conclusão
  y -= 6;
  const conclusao =
    `por haver concluído o curso de ${input.courseName}, com carga horária total de ` +
    `${input.workload} horas, em ${dataConclusao}.`;
  y = drawCenteredParagraph(page, conclusao, {
    font, size: 11, lineHeight: 16, y, maxWidth: 640, color: BLACK,
  });

  // Frase oficial de emissão
  y -= 18;
  const emissao = `Emitido em: ${input.dataEmissao}`;
  const emW = italic.widthOfTextAtSize(emissao, 11);
  page.drawText(emissao, { x: (width - emW) / 2, y, size: 11, font: italic, color: BLACK });

  // Assinaturas
  drawSignatures(page, font, bold, input.studentName, input.directorName);

  // QR Code de validação
  try {
    const verifyUrl = buildVerifyUrl(input.code, input.verifyBaseUrl);
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 180 });
    const qrPng = await fetch(qrDataUrl).then((r) => r.arrayBuffer());
    const qrImg = await pdfDoc.embedPng(qrPng);
    page.drawImage(qrImg, { x: width - 105, y: 45, width: 62, height: 62 });
    page.drawText(input.code, { x: width - 105, y: 36, size: 7, font, color: BLACK });
  } catch { /* skip */ }

  return await pdfDoc.save();
}

export function isValidUF(uf: string): boolean {
  return UF_LIST.some((u) => u.sigla === uf.toUpperCase());
}
