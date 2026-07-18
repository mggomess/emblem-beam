import { QRCodeCanvas } from "qrcode.react";

export function QrBlock({
  code,
  sedUrlBase,
  size = 110,
}: {
  code: string;
  sedUrlBase?: string;
  size?: number;
}) {
  // A URL do QR aponta sempre para /verificar/{uuid} no mesmo domínio da aplicação.
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : (sedUrlBase || "https://emblem-beam.lovable.app").replace(/\/+$/, "");
  const value = code ? `${origin}/verificar/${encodeURIComponent(code)}` : origin;
  return (
    <div className="flex flex-col items-center gap-1">
      <QRCodeCanvas value={value} size={size} includeMargin level="M" />
      <div className="text-center text-[9px] font-bold uppercase tracking-wider text-[#0d1b3d]">
        VERIFIQUE A AUTENTICIDADE
        <br />COD: {code ? code.slice(0, 8) : "—"}
      </div>
    </div>
  );
}
