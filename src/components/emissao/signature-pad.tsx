import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eraser, PenLine } from "lucide-react";

type Props = {
  /** Recebe um PNG (data URL) com fundo transparente. */
  onSave: (dataUrl: string) => void;
  trigger?: React.ReactNode;
};

const W = 700;
const H = 260;

/** Desenho de assinatura à mão livre (mouse/touch/caneta) exportado como PNG transparente. */
export function SignaturePad({ onSave, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [thickness, setThickness] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    setEmpty(true);
  }, [open]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last.current) return;
    const p = pos(e);
    ctx.strokeStyle = "#0d1b3d";
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    setEmpty(false);
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, W, H);
    setEmpty(true);
  };

  const save = () => {
    const c = canvasRef.current;
    if (!c || empty) return;
    onSave(c.toDataURL("image/png"));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" size="sm" variant="outline" className="rounded-lg flex-1">
            <PenLine className="size-3.5 mr-1" /> Desenhar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Desenhar assinatura</DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border bg-white p-2">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full touch-none rounded-lg"
            style={{ cursor: "crosshair", aspectRatio: `${W} / ${H}` }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-xs">Espessura</Label>
          <input
            type="range"
            min={1}
            max={8}
            value={thickness}
            onChange={(e) => setThickness(Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-6 text-xs text-muted-foreground">{thickness}</span>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="outline" className="rounded-lg" onClick={clear}>
            <Eraser className="size-4 mr-1" /> Limpar
          </Button>
          <Button type="button" className="rounded-lg" onClick={save} disabled={empty}>
            Usar assinatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
