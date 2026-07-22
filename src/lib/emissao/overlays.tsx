import Draggable from "react-draggable";
import { useRef } from "react";
import type { DocOverlay, DocOverlayTarget } from "./types";

type Props = {
  overlays: DocOverlay[];
  target: Exclude<DocOverlayTarget, "both">;
  editable?: boolean;
  onChange?: (id: string, patch: Partial<DocOverlay>) => void;
};

/**
 * Camada de assinaturas/carimbos sobrepostos ao documento.
 * Renderiza dentro de um wrapper `position:relative` de 210mm de largura,
 * cobrindo a folha inteira (297mm). Arrastável no preview; posição/rotação
 * gravadas em `state.overlays` são preservadas na impressão.
 */
export function OverlayLayer({ overlays, target, editable = false, onChange }: Props) {
  const visible = overlays.filter((o) => o.target === target || o.target === "both");
  if (visible.length === 0) return null;

  return (
    <div
      className="no-print-events"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "210mm",
        height: "297mm",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {visible.map((o) => (
        <OverlayItem key={o.id} overlay={o} editable={editable} onChange={onChange} />
      ))}
    </div>
  );
}

function OverlayItem({
  overlay,
  editable,
  onChange,
}: {
  overlay: DocOverlay;
  editable?: boolean;
  onChange?: (id: string, patch: Partial<DocOverlay>) => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null!);

  const inner = (
    <img
      src={overlay.src}
      alt={overlay.label}
      draggable={false}
      style={{
        width: `${overlay.widthMm}mm`,
        height: "auto",
        transform: `rotate(${overlay.rotation}deg)`,
        transformOrigin: "center",
        userSelect: "none",
        pointerEvents: editable ? "auto" : "none",
        display: "block",
      }}
    />
  );

  if (!editable) {
    return (
      <div
        style={{
          position: "absolute",
          left: overlay.x,
          top: overlay.y,
        }}
      >
        {inner}
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: overlay.x, y: overlay.y }}
      onStop={(_e, d) => onChange?.(overlay.id, { x: d.x, y: d.y })}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className="group"
        style={{
          position: "absolute",
          cursor: "move",
          pointerEvents: "auto",
        }}
      >
        {inner}
      </div>
    </Draggable>
  );
}
