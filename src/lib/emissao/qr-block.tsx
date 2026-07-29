import { QRCodeCanvas } from "qrcode.react";

interface QrBlockProps {
  code: string;
  verificationBaseUrl?: string;
  size?: number;
}

export function QrBlock({
  code,
  verificationBaseUrl = "https://check-my-cred.lovable.app",
  size = 110,
}: QrBlockProps) {
  const normalizedCode = code.trim();
  const baseUrl = verificationBaseUrl.replace(/\/+$/, "");

  // O check-my-cred consulta a tabela certificados pelo campo "codigo"
  const qrUrl = `${baseUrl}/certificado/${encodeURIComponent(
    normalizedCode
  )}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeCanvas
        value={qrUrl}
        size={size}
        level="H"
        includeMargin
      />

      <div className="max-w-[220px] text-center text-[9px] leading-tight text-[#0d1b3d]">
        <div className="font-bold uppercase tracking-wider">
          Verifique a autenticidade
        </div>

        <div className="mt-1 break-all">
          {qrUrl}
        </div>

        <div className="mt-1 font-bold">
          Código:
        </div>

        <div className="break-all font-mono tracking-wider">
          {normalizedCode}
        </div>
      </div>
    </div>
  );
}
