import { QRCodeCanvas } from "qrcode.react";

interface QrBlockProps {
  code: string;
  /** Base completa da URL de verificação, incluindo o caminho. */
  sedUrlBase?: string;
  /** Compatibilidade: base sem caminho (usa /verificar). */
  verificationBaseUrl?: string;
  size?: number;
}

const DEFAULT_BASE = "https://www.sedugov.com.br/certificado";

export function QrBlock({
  code,
  sedUrlBase,
  verificationBaseUrl,
  size = 110,
}: QrBlockProps) {
  const normalizedCode = code.trim();

  const base = (
    sedUrlBase ??
    (verificationBaseUrl
      ? `${verificationBaseUrl.replace(/\/+$/, "")}/verificar`
      : DEFAULT_BASE)
  ).replace(/\/+$/, "");

  const qrUrl = `${base}/${encodeURIComponent(normalizedCode)}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeCanvas value={qrUrl} size={size} level="H" includeMargin />

      <div className="max-w-[220px] text-center text-[9px] leading-tight text-[#0d1b3d]">
        <div className="font-bold uppercase tracking-wider">
          Verifique a autenticidade
        </div>

        <div className="mt-1 break-all">{qrUrl}</div>

        <div className="mt-1 font-bold">Código:</div>

        <div className="break-all font-mono tracking-wider">
          {normalizedCode}
        </div>
      </div>
    </div>
  );
}
