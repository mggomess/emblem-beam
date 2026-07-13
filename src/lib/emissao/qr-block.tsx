import { QRCodeCanvas } from "qrcode.react";

export function QrBlock({
  code,
  sedUrlBase,
  size = 110,
}: {
  code: string;
  sedUrlBase: string;
  size?: number;
}) {
  const base = (sedUrlBase || "https://validar.sedu.gov.br").replace(/\/+$/, "");
  const value = code ? `${base}/validar/${encodeURIComponent(code)}` : base;
  return (
    <div className="flex flex-col items-center gap-1">
      <QRCodeCanvas value={value} size={size} includeMargin level="M" />
      <div className="text-center text-[9px] font-bold uppercase tracking-wider text-[#0d1b3d]">
        VERIFIQUE A AUTENTICIDADE
        <br />COD: {code || "—"}
      </div>
    </div>
  );
}
