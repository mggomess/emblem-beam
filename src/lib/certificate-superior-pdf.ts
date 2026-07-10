import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { buildVerifyUrl } from "./certificate-pdf";

const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.35, 0.35, 0.35);

async function fetchPng(url: string): Promise<ArrayBuffer | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.arrayBuffer();
  } catch {
    return null;
  }
}

export type SuperiorCertificateInput = {
  studentName: string;
  studentCpf?: string | null;
  studentMatricula?: string | null;
  studentBirthDate?: string | null;
  studentCity?: string | null;
  courseName: string;
  courseModalidade?: string;
  portariaMec?: string;
  resolucao?: string;
  dataColacao?: string;
  titulo?: string;
  periodoInicio?: string;
  periodoFim?: string;
  cidadeExpedicao: string;
  ufExpedicao: string;
  dataExpedicao: string;
  universityName: string;
  universitySigla: string;
  universityLogoUrl?: string | null;
  poloEndereco?: string;
  poloTelefone?: string;
  poloCep?: string;
  code: string;
  verifyBaseUrl?: string | null;
  assinanteNome?: string;
  assinanteCnpj?: string;
  localAssinatura?: string;
};

function drawParagraph(
  page: PDFPage,
  text: string,
  opts: {
    font: PDFFont;
    bold: PDFFont;
    size: number;
    lineHeight: number;
    x: number;
    y: number;
    maxWidth: number;
    firstLineIndent?: number;
    boldWords?: string[];
  },
): number {
  const { font, bold, size, lineHeight, x, y, maxWidth, firstLineIndent = 0, boldWords = [] } = opts;

  // Tokenize preserving order; determine bold per token by exact match (case-sensitive)
  const words = text.split(/\s+/);
  type Tok = { w: string; b: boolean };
  const tokens: Tok[] = words.map((w) => {
    const clean = w.replace(/[.,;:()]/g, "");
    const isBold = boldWords.some((bw) => clean === bw || w.includes(bw));
    return { w, b: isBold };
  });

  const widthOf = (t: Tok) => (t.b ? bold : font).widthOfTextAtSize(t.w, size);
  const spaceW = font.widthOfTextAtSize(" ", size);

  let cy = y;
  let line: Tok[] = [];
  let lineW = firstLineIndent;
  let isFirst = true;

  const flush = () => {
    let cx = x + (isFirst ? firstLineIndent : 0);
    for (let i = 0; i < line.length; i++) {
      const t = line[i];
      page.drawText(t.w, { x: cx, y: cy, size, font: t.b ? bold : font, color: BLACK });
      cx += widthOf(t);
      if (i < line.length - 1) cx += spaceW;
    }
    cy -= lineHeight;
    line = [];
    lineW = 0;
    isFirst = false;
  };

  for (const t of tokens) {
    const tw = widthOf(t);
    const addW = (line.length ? spaceW : 0) + tw;
    if (lineW + addW > maxWidth && line.length) {
      flush();
    }
    line.push(t);
    lineW += addW;
  }
  if (line.length) flush();
  return cy;
}

export async function generateSuperiorCertificatePdf(
  input: SuperiorCertificateInput,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // A4 portrait
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ============ Cabeçalho ============
  // Logo (esquerda)
  let logoBytes: ArrayBuffer | null = null;
  if (input.universityLogoUrl) {
    logoBytes = await fetchPng(input.universityLogoUrl);
  }
  const headerY = height - 90;
  if (logoBytes) {
    try {
      let img;
      try { img = await pdfDoc.embedPng(logoBytes); }
      catch { img = await pdfDoc.embedJpg(logoBytes); }
      const targetH = 55;
      const ratio = img.width / img.height;
      const targetW = targetH * ratio;
      page.drawImage(img, { x: 45, y: headerY, width: targetW, height: targetH });
    } catch { /* ignore */ }
  } else {
    // Fallback: caixa com sigla
    page.drawRectangle({ x: 45, y: headerY, width: 130, height: 55, color: rgb(0.85, 0.1, 0.15) });
    const sig = input.universitySigla;
    const sw = bold.widthOfTextAtSize(sig, 22);
    page.drawText(sig, { x: 45 + (130 - sw) / 2, y: headerY + 20, size: 22, font: bold, color: rgb(1, 1, 1) });
  }

  // Nome da universidade (direita)
  const uniLabel = `${input.universitySigla} - ${input.universityName.toUpperCase()}`;
  const uniSize = 14;
  const uniW = bold.widthOfTextAtSize(uniLabel, uniSize);
  page.drawText(uniLabel, {
    x: width - 45 - uniW,
    y: headerY + 22,
    size: uniSize,
    font: bold,
    color: BLACK,
  });

  // ============ Título ============
  const title = "CERTIFICADO DE CONCLUSÃO";
  const titleSize = 20;
  const titleW = bold.widthOfTextAtSize(title, titleSize);
  const titleY = height - 200;
  page.drawText(title, { x: (width - titleW) / 2, y: titleY, size: titleSize, font: bold, color: BLACK });

  // ============ Corpo ============
  const bodyX = 70;
  const bodyMaxW = width - 140;
  const bodySize = 11;
  const lh = 17;
  let y = titleY - 55;

  const cpf = input.studentCpf ? input.studentCpf : "____________________";
  const matricula = input.studentMatricula ? input.studentMatricula : "____________________";
  const nascimento = input.studentBirthDate ? input.studentBirthDate : "__/__/____";
  const cidadeAluno = (input.studentCity || "____________________").toUpperCase();
  const cursoNome = input.courseName.toUpperCase();
  const portaria = input.portariaMec || "913, de 28/12/2018";
  const resolucao = input.resolucao || "1, de 15 de maio de 2006";
  const dataColacao = input.dataColacao || "__/__/____";
  const titulo = (input.titulo || "BACHAREL").toUpperCase();
  const periodo = `${input.periodoInicio || "________"} a ${input.periodoFim || "________"}`;

  // Parágrafo 1 — dados do aluno + curso
  const p1 =
    `Certificamos para os devidos fins, que ${input.studentName.toUpperCase()}, matrícula ${matricula} ` +
    `CPF nº ${cpf}, nascido(a) no dia ${nascimento}, na cidade de ${cidadeAluno}, ` +
    `concluiu nesta Universidade o Curso Superior de ${cursoNome}, ` +
    `Reconhecimento Renovado pela Portaria MEC nº ${portaria}, Resolução CNE/CP nº ${resolucao}.`;
  y = drawParagraph(page, p1, {
    font, bold, size: bodySize, lineHeight: lh, x: bodyX, y, maxWidth: bodyMaxW,
    firstLineIndent: 30,
    boldWords: [input.studentName.toUpperCase(), cidadeAluno, cursoNome],
  });

  // Parágrafo 2 — colação
  y -= 8;
  const p2 =
    `A colação de grau do(a) referido(a) graduado(a) ocorreu no dia ${dataColacao}, ` +
    `no qual recebeu o título de ${titulo}.`;
  y = drawParagraph(page, p2, {
    font, bold, size: bodySize, lineHeight: lh, x: bodyX, y, maxWidth: bodyMaxW,
    firstLineIndent: 30,
    boldWords: [dataColacao, titulo],
  });

  // Parágrafo 3 — período
  y -= 8;
  const p3 =
    `Certificamos, ainda, que o ingresso do(a) referido(a) aluno(a) nesta universidade ` +
    `deu-lhe o início em ${periodo}.`;
  y = drawParagraph(page, p3, {
    font, bold, size: bodySize, lineHeight: lh, x: bodyX, y, maxWidth: bodyMaxW,
    firstLineIndent: 30,
    boldWords: [periodo],
  });

  // Parágrafo 4 — diploma
  y -= 8;
  const p4 =
    `Certificamos também, que seu diploma encontra-se em fase de processo para expedição da segunda via.`;
  y = drawParagraph(page, p4, {
    font, bold, size: bodySize, lineHeight: lh, x: bodyX, y, maxWidth: bodyMaxW,
    firstLineIndent: 30,
  });

  // Local + data
  y -= 18;
  const localData = `${input.universityName}, ${input.cidadeExpedicao} - ${input.ufExpedicao.toUpperCase()}, ${input.dataExpedicao}.`;
  page.drawText(localData, { x: bodyX, y, size: bodySize, font, color: BLACK });

  // ============ QR + Assinatura digital ============
  const qrBlockY = 200;
  try {
    const verifyUrl = buildVerifyUrl(input.code, input.verifyBaseUrl);
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 260 });
    const qrPng = await fetch(qrDataUrl).then((r) => r.arrayBuffer());
    const qrImg = await pdfDoc.embedPng(qrPng);
    const qrSize = 95;
    const qrX = (width - qrSize) / 2 - 60;
    page.drawImage(qrImg, { x: qrX, y: qrBlockY - qrSize, width: qrSize, height: qrSize });
  } catch { /* skip */ }

  // Ícone documento (círculo cinza)
  const iconX = 130;
  const iconY = qrBlockY - 75;
  page.drawCircle({ x: iconX, y: iconY, size: 18, borderColor: GRAY, borderWidth: 1 });
  page.drawRectangle({ x: iconX - 6, y: iconY - 8, width: 12, height: 15, borderColor: GRAY, borderWidth: 0.8 });

  // Bloco de assinatura digital
  const sigX = width / 2 + 15;
  let sy = qrBlockY - 20;
  const sigSize = 9;
  const sigLh = 12;
  const assinante = input.assinanteNome || "ASSUPERO ENSINO SUPERIOR LTDA";
  const assinanteCnpj = input.assinanteCnpj || "06099229000101";
  const local = input.localAssinatura || `Secretaria Central - ${input.universitySigla}`;
  page.drawText(`Assinado digitalmente por: ${assinante}.:${assinanteCnpj}`, { x: sigX, y: sy, size: sigSize, font, color: BLACK });
  sy -= sigLh;
  page.drawText(`DATA: ${input.dataExpedicao}`, { x: sigX, y: sy, size: sigSize, font, color: BLACK });
  sy -= sigLh;
  page.drawText(`MOTIVO: Documento aprovado`, { x: sigX, y: sy, size: sigSize, font, color: BLACK });
  sy -= sigLh;
  page.drawText(`LOCAL: ${local}`, { x: sigX, y: sy, size: sigSize, font, color: BLACK });

  // ============ Rodapé ============
  const footY = 60;
  page.drawLine({
    start: { x: 45, y: footY + 42 },
    end: { x: width - 45, y: footY + 42 },
    thickness: 0.8,
    color: BLACK,
  });
  const footerLines = [
    input.poloEndereco || `${input.universitySigla} - ${input.cidadeExpedicao} - ${input.ufExpedicao.toUpperCase()}`,
    input.poloCep ? `CEP: ${input.poloCep}` : "",
    input.poloTelefone ? `TEL: ${input.poloTelefone}` : "",
  ].filter(Boolean);
  let fy = footY + 28;
  for (const ln of footerLines) {
    const w = font.widthOfTextAtSize(ln, 9);
    page.drawText(ln, { x: (width - w) / 2, y: fy, size: 9, font, color: BLACK });
    fy -= 12;
  }

  // Código pequeno no rodapé para conferência
  page.drawText(input.code, { x: 45, y: 30, size: 7, font, color: GRAY });

  return await pdfDoc.save();
}
