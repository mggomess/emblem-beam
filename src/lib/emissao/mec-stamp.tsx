import Draggable from "react-draggable";
import { useRef } from "react";
import type { MecStamp } from "./types";

type Props = {
  mec: MecStamp;
  onChange: (m: MecStamp) => void;
  draggable?: boolean;
};

export function MecStampBlock({ mec, onChange, draggable = true }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null!);
  if (!mec.enabled) return null;

  const body = (
    <div
      ref={nodeRef}
      className="absolute z-20"
      style={{ left: draggable ? undefined : mec.x, top: draggable ? undefined : mec.y }}
    >
      <div className="relative w-[210px] rounded-md border-2 border-[#1D3557] bg-white/95 p-3 text-center shadow-lg">
        <div
          className="absolute inset-0 bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: "url(/simbolo.png)", backgroundSize: "70%" }}
        />
        <div className="relative">
          <div className="font-cinzel text-3xl font-bold tracking-widest text-[#1D3557]">MEC</div>
          <div className="mt-1 text-[8px] font-bold leading-tight text-[#1D3557]">
            Autorizado pelo Ministério da Educação
            <br />SEB 738329 / 1998
            <br />Autorizado pela Secretaria de Educação
            <br />SEE 98483 / 1998
          </div>
        </div>
        {draggable && (
          <div className="drag-handle-hint absolute -top-5 left-0 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
            arraste
          </div>
        )}
      </div>
    </div>
  );

  if (!draggable) return body;

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: mec.x, y: mec.y }}
      onStop={(_e, d) => onChange({ ...mec, x: d.x, y: d.y })}
      bounds="parent"
    >
      {body}
    </Draggable>
  );
}
