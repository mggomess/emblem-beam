import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IdCard, Plus, Printer, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatsCard } from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UFSelect } from "@/components/common/UFSelect";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { QrBlock } from "@/lib/emissao/qr-block";

export const Route = createFileRoute("/_authenticated/app/carteirinhas")({
  head: () => ({ meta: [{ title: "Carteirinhas — Certifica" }] }),
  component: Page,
});

type Card = {
  id: string;
  code: string;
  student_id: string;
  course_id: string | null;
  estado: string | null;
  valid_until: string;
  status: string;
  created_at: string;
};

function Page() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [printId, setPrintId] = useState<string | null>(null);
  const [form, setForm] = useState({
    student_id: "",
    course_id: "",
    estado: "SP",
    valid_until: new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10),
  });

  const { data: cards = [], refetch } = useQuery({
    queryKey: ["cards"],
    queryFn: async () =>
      ((await supabase.from("student_cards").select("*").order("created_at", { ascending: false })).data ?? []) as Card[],
  });
  const { data: students = [] } = useQuery({
    queryKey: ["students-lite"],
    queryFn: async () => (await supabase.from("students").select("id, full_name, cpf, photo_url, course_id")).data ?? [],
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["courses-lite"],
    queryFn: async () => (await supabase.from("courses").select("id, name")).data ?? [],
  });

  const studentsById = useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);
  const coursesById = useMemo(() => new Map(courses.map((c) => [c.id, c])), [courses]);

  const criar = async () => {
    if (!user?.id) return toast.error("Sessão expirada.");
    if (!form.student_id) return toast.error("Selecione um aluno.");
    const code = crypto.randomUUID();
    const { error } = await supabase.from("student_cards").insert({
      owner_id: user.id,
      student_id: form.student_id,
      course_id: form.course_id || null,
      estado: form.estado,
      valid_until: form.valid_until,
      status: "ativa",
      code,
    });
    if (error) return toast.error(error.message);
    toast.success("Carteirinha emitida.");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["cards"] });
  };

  const remover = async (id: string) => {
    if (!confirm("Excluir carteirinha?")) return;
    const { error } = await supabase.from("student_cards").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removida.");
    refetch();
  };

  const printCard = cards.find((c) => c.id === printId);
  const printStudent = printCard ? studentsById.get(printCard.student_id) : null;
  const printCourse = printCard?.course_id ? coursesById.get(printCard.course_id) : null;

  const ativas = cards.filter((c) => c.status === "ativa").length;

  return (
    <AppLayout title="Carteirinhas">
      <div className="no-print">
        <PageHeader
          title="Carteirinhas"
          description="Emissão de carteirinhas estudantis padrão CR80 (85,6 × 53,98 mm) com frente e verso."
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl"><Plus className="mr-1 size-4" /> Nova Carteirinha</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Emitir carteirinha</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Aluno</Label>
                    <Select value={form.student_id} onValueChange={(v) => setForm({ ...form, student_id: v, course_id: studentsById.get(v)?.course_id ?? form.course_id })}>
                      <SelectTrigger><SelectValue placeholder="Selecionar aluno…" /></SelectTrigger>
                      <SelectContent>
                        {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Curso</Label>
                    <Select value={form.course_id} onValueChange={(v) => setForm({ ...form, course_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecionar curso…" /></SelectTrigger>
                      <SelectContent>
                        {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>UF</Label>
                      <UFSelect value={form.estado} onChange={(v) => setForm({ ...form, estado: v })} />
                    </div>
                    <div>
                      <Label>Válida até</Label>
                      <Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button onClick={criar}>Emitir</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <StatsCard label="Total emitidas" value={cards.length} icon={<IdCard className="size-5" />} />
          <StatsCard label="Ativas" value={ativas} icon={<ShieldCheck className="size-5" />} />
          <StatsCard label="Padrão" value="CR80 85,6×53,98mm" icon={<IdCard className="size-5" />} />
        </div>

        {cards.length === 0 ? (
          <Card className="border-border/60 p-6 shadow-soft">
            <EmptyState
              title="Nenhuma carteirinha emitida"
              description="Clique em Nova Carteirinha para emitir a primeira."
              icon={<IdCard className="size-5" />}
            />
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => {
              const st = studentsById.get(c.student_id);
              const co = c.course_id ? coursesById.get(c.course_id) : null;
              return (
                <Card key={c.id} className="p-4 shadow-soft border-border/60 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold">{st?.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{co?.name ?? "Sem curso"}</div>
                    </div>
                    <Badge variant={c.status === "ativa" ? "default" : "secondary"}>{c.status}</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono break-all">{c.code.slice(0, 18)}…</div>
                  <div className="text-xs">Validade: <b>{new Date(c.valid_until).toLocaleDateString("pt-BR")}</b></div>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { setPrintId(c.id); setTimeout(() => window.print(), 250); }}>
                      <Printer className="mr-1 size-3.5" /> Imprimir
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remover(c.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Área de impressão CR80 */}
      {printCard && (
        <div className="print-root">
          <CarteirinhaFrenteVerso
            code={printCard.code}
            estado={printCard.estado ?? "SP"}
            validUntil={printCard.valid_until}
            nome={printStudent?.full_name ?? "—"}
            cpf={printStudent?.cpf ?? "—"}
            foto={printStudent?.photo_url ?? null}
            curso={printCourse?.name ?? "—"}
          />
        </div>
      )}
    </AppLayout>
  );
}

function CarteirinhaFrenteVerso({
  code, estado, validUntil, nome, cpf, foto, curso,
}: {
  code: string; estado: string; validUntil: string; nome: string; cpf: string; foto: string | null; curso: string;
}) {
  const CARD: React.CSSProperties = {
    width: "85.6mm",
    height: "53.98mm",
    borderRadius: "3.18mm",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
    background: "#fff",
    color: "#0f172a",
    fontFamily: "Inter, Arial, sans-serif",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    breakInside: "avoid",
    pageBreakInside: "avoid",
  };

  return (
    <div className="doc-sheet a4-portrait" style={{ padding: "20mm", background: "#fff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8mm", alignItems: "start" }}>
        {/* FRENTE */}
        <div style={CARD}>
          <div style={{ height: "12mm", background: "linear-gradient(135deg,#1e3a8a,#3b82f6)", color: "#fff", display: "flex", alignItems: "center", padding: "0 4mm", justifyContent: "space-between" }}>
            <div style={{ fontSize: "2.6mm", fontWeight: 700, letterSpacing: "0.5mm" }}>CARTEIRA DE ESTUDANTE</div>
            <div style={{ fontSize: "2.2mm", opacity: 0.9 }}>{estado}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "22mm 1fr", padding: "3mm 4mm", gap: "3mm" }}>
            <div style={{ width: "22mm", height: "28mm", border: "1px solid #cbd5e1", borderRadius: "1mm", background: "#f1f5f9", display: "grid", placeItems: "center", overflow: "hidden" }}>
              {foto ? <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "2mm", color: "#94a3b8" }}>FOTO</span>}
            </div>
            <div style={{ fontSize: "2.2mm", lineHeight: 1.4 }}>
              <div style={{ fontSize: "1.9mm", color: "#64748b", textTransform: "uppercase" }}>Nome</div>
              <div style={{ fontWeight: 700, fontSize: "2.4mm" }}>{nome}</div>
              <div style={{ fontSize: "1.9mm", color: "#64748b", textTransform: "uppercase", marginTop: "1.2mm" }}>Curso</div>
              <div style={{ fontSize: "2.2mm" }}>{curso}</div>
              <div style={{ fontSize: "1.9mm", color: "#64748b", textTransform: "uppercase", marginTop: "1.2mm" }}>CPF</div>
              <div style={{ fontSize: "2.2mm", fontFamily: "monospace" }}>{cpf}</div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "2mm", right: "3mm", fontSize: "2mm", color: "#334155" }}>
            Válida até <b>{new Date(validUntil).toLocaleDateString("pt-BR")}</b>
          </div>
        </div>

        {/* VERSO */}
        <div style={CARD}>
          <div style={{ height: "8mm", background: "#0f172a", color: "#fff", display: "flex", alignItems: "center", padding: "0 4mm", fontSize: "2.2mm", fontWeight: 600 }}>
            AUTENTICAÇÃO
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 22mm", gap: "3mm", padding: "3mm 4mm" }}>
            <div style={{ fontSize: "2mm", lineHeight: 1.4, color: "#334155" }}>
              <div>Esta carteirinha é pessoal e intransferível.</div>
              <div>Consulte a autenticidade escaneando o QR ou acessando:</div>
              <div style={{ marginTop: "1.5mm", wordBreak: "break-all", fontSize: "1.8mm", color: "#0f172a" }}>
                {typeof window !== "undefined" ? window.location.origin : ""}/verificar/{code.slice(0, 12)}…
              </div>
              <div style={{ marginTop: "2mm", fontFamily: "monospace", fontSize: "1.7mm" }}>{code}</div>
            </div>
            <div style={{ display: "grid", placeItems: "center" }}>
              <QrBlock code={code} sedUrlBase={typeof window !== "undefined" ? window.location.origin : ""} size={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
