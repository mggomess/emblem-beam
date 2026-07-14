import Draggable from "react-draggable";
import { useRef } from "react";
import { RotateCw } from "lucide-react";
import type { MecStamp } from "./types";

type Props = {
  mec: MecStamp;
  onChange: (m: MecStamp) => void;
  draggable?: boolean;
};

/** Carimbo MEC — arrastável na tela, imprime na mesma posição/rotação. Sem borda/sombra. */
export function MecStampBlock({ mec, onChange, draggable = true }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null!);
  if (!mec.enabled) return null;

  const rotate = mec.rotation || 0;

  const inner = (
    <div
      className="relative w-[210px] p-3 text-center"
      style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "center" }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-center bg-no-repeat opacity-10"
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
    </div>
  );

  const body = (
    <div
      ref={nodeRef}
      className="absolute z-20"
      style={{ left: draggable ? undefined : mec.x, top: draggable ? undefined : mec.y }}
    >
      {inner}
      {draggable && (
        <div className="no-print absolute -top-8 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] text-neutral-600 opacity-0 shadow-sm ring-1 ring-neutral-200 transition group-hover:opacity-100">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-[#1D3557]"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ ...mec, rotation: (rotate + 15) % 360 });
            }}
          >
            <RotateCw className="size-3" /> {rotate}°
          </button>
        </div>
      )}
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
      <div ref={nodeRef} className="group absolute z-20 cursor-move">
        {inner}
        <div className="no-print absolute -top-7 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[10px] text-neutral-600 opacity-0 shadow-sm ring-1 ring-neutral-200 transition group-hover:opacity-100">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-[#1D3557]"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ ...mec, rotation: (rotate + 15) % 360 });
            }}
          >
            <RotateCw className="size-3" /> girar {rotate}°
          </button>
        </div>
      </div>
    </Draggable>
  );
}
