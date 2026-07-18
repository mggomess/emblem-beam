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
  // Remove "/" do final da URL
  const baseUrl = verificationBaseUrl.replace(/\/+$/, "");

  // URL que será gravada no QR Code
  const qrUrl = `${baseUrl}/verificar/${encodeURIComponent(code)}`;

  // Apenas para depuração
  console.log("QR Code URL:", qrUrl);

  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeCanvas
        value={qrUrl}
        size={size}
        level="H"
        includeMargin
      />

      <div className="text-center text-[9px] leading-tight text-[#0d1b3d]">
        <div className="font-bold uppercase tracking-wider">
          VERIFIQUE A AUTENTICIDADE
        </div>

        <div className="mt-1 break-all">
          {qrUrl}
        </div>

        <div className="mt-1 font-bold">
          Código:
        </div>

        <div className="tracking-widest">
          {code}
        </div>
      </div>
    </div>
  );
}
