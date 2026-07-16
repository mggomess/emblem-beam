import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
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
  uf: string;
  rows: HistoricoCourseRow[];
  code: string;
  authUrl?: string | null;
  issuedAt: Date;
  verifyBaseUrl?: string | null;
};

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const TEXT = rgb(0.06, 0.12, 0.26);

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

function fitText(font: PDFFont, text: string, maxWidth: number, initialSize: number, minSize = 5): number {
  let size = initialSize;
  while (font.widthOfTextAtSize(text, size) > maxWidth && size > minSize) size -= 0.25;
  return size;
}

function drawCentered(
  page: PDFPage,
  font: PDFFont,
  text: string,
  centerX: number,
  y: number,
  size: number,
  maxWidth: number,
): void {
  const fitted = fitText(font, text, maxWidth, size);
  const width = font.widthOfTextAtSize(text, fitted);
  page.drawText(text, {
    x: centerX - width / 2,
    y,
    size: fitted,
    font,
    color: TEXT,
  });
}

function drawCell(
  page: PDFPage,
  font: PDFFont,
  value: string,
  x: number,
  y: number,
  width: number,
  size = 6.2,
  align: "left" | "center" = "center",
): void {
  const text = value || "";
  const fitted = fitText(font, text, width - 4, size, 4.5);
  const textWidth = font.widthOfTextAtSize(text, fitted);
  const drawX = align === "left" ? x + 2 : x + (width - textWidth) / 2;
  page.drawText(text, {
    x: drawX,
    y,
    size: fitted,
    font,
    color: TEXT,
  });
}

export async function generateHistoricoPdf(input: HistoricoInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const backgroundBuffer = await fetchPng("/images/historico-unip.png");
  if (!backgroundBuffer) {
    throw new Error(
      "Fundo do histórico não encontrado. Salve a imagem como public/images/historico-unip.png.",
    );
  }

  const background = await pdfDoc.embedPng(backgroundBuffer);
  page.drawImage(background, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });

  const issueDate = formatDate(input.issuedAt);
  const firstRow = input.rows[0];
  const courseName = firstRow?.courseName ?? "";
  const totalWorkload = input.rows.reduce((sum, row) => sum + (row.workload || 0), 0);

  // Cabeçalho e dados do aluno
  drawCentered(page, bold, input.studentName.toUpperCase(), 329, 756, 8.5, 338);
  drawCentered(page, font, issueDate, 529, 756, 7, 66);

  drawCentered(page, font, input.studentCpf ?? "", 282, 668, 7, 80);
  drawCentered(page, font, input.uf?.toUpperCase() ?? "", 409, 710, 7, 34);
  drawCentered(page, font, "BRASILEIRA", 510, 710, 7, 122);

  drawCentered(page, bold, courseName.toUpperCase(), 151, 523, 8, 254);
  drawCentered(page, font, String(totalWorkload), 539, 505, 7, 72);
  drawCentered(page, font, String(totalWorkload), 539, 478, 7, 72);

  // Relação de disciplinas. Mantém os dados existentes sem exigir nova tabela.
  // Cada certificado emitido é exibido como uma linha do histórico.
  const tableTopY = 467;
  const rowHeight = 14.2;
  const maxRows = 29;

  // Colunas aproximadas conforme o fundo 1085 x 1450.
  const columns = {
    periodo: { x: 10, width: 49 },
    codigo: { x: 59, width: 49 },
    descricao: { x: 108, width: 269 },
    ch: { x: 377, width: 37 },
    letivo: { x: 414, width: 55 },
    media: { x: 469, width: 48 },
    situacao: { x: 517, width: 68 },
  };

  input.rows.slice(0, maxRows).forEach((row, index) => {
    const y = tableTopY - index * rowHeight;
    const periodo = String(index + 1);
    const codigo = row.certificateCode.slice(0, 12);
    const periodoLetivo = String(row.issuedAt.getFullYear());

    drawCell(page, font, periodo, columns.periodo.x, y, columns.periodo.width);
    drawCell(page, font, codigo, columns.codigo.x, y, columns.codigo.width, 5.4);
    drawCell(page, font, row.courseName.toUpperCase(), columns.descricao.x, y, columns.descricao.width, 6.2, "left");
    drawCell(page, font, String(row.workload), columns.ch.x, y, columns.ch.width);
    drawCell(page, font, periodoLetivo, columns.letivo.x, y, columns.letivo.width);
    drawCell(page, font, "", columns.media.x, y, columns.media.width);
    drawCell(page, bold, "AP", columns.situacao.x, y, columns.situacao.width);
  });

  // Rodapé
  drawCentered(page, font, issueDate, 48, 69, 5.8, 68);
  drawCentered(page, font, courseName.toUpperCase(), 314, 69, 5.8, 80);

  const verifyUrl =
    (input.authUrl && input.authUrl.trim()) ||
    buildVerifyUrl(input.code, input.verifyBaseUrl);

  const validationText = `${verifyUrl} | Código: ${input.code}`;
  const validationSize = fitText(font, validationText, 220, 5.2, 4);
  page.drawText(validationText, {
    x: 360,
    y: 67,
    size: validationSize,
    font,
    color: TEXT,
    maxWidth: 220,
  });

  return await pdfDoc.save();
}
