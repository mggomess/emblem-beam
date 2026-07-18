import { QRCodeCanvas } from "qrcode.react";

export function QrBlock({
  code,
  size = 110,
}: {
  code: string;
  size?: number;
}) {
  const value = `https://check-my-cred.lovable.app/certificado/${encodeURIComponent(code)}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <QRCodeCanvas
        value={value}
        size={size}
        includeMargin
        level="H"
      />

      <div className="text-center text-[9px] font-bold uppercase tracking-wider text-[#0d1b3d]">
        VERIFIQUE A AUTENTICIDADE
        <br />
        COD: {code}
      </div>
    </div>
  );
}
