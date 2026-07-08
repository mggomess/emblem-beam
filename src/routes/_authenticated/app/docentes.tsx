import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, UserCog, Upload } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/app/docentes")({
  head: () => ({ meta: [{ title: "Docentes — Certifica" }] }),
  component: DocentesPage,
});

const schema = z.object({
  full_name: z.string().min(2),
  cpf: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  titulation: z.string().optional(),
});
type Values = z.infer<typeof schema>;

function DocentesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [signature, setSignature] = useState<File | null>(null);

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => (await supabase.from("teachers").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const form = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: Values) => {
    if (!user) return;
    let signature_url: string | null = null;
    if (signature) {
      const path = `${user.id}/signatures/${crypto.randomUUID()}-${signature.name}`;
      const up = await supabase.storage.from("institution-assets").upload(path, signature);
      if (up.error) return toast.error(up.error.message);
      signature_url = path;
    }
    const { error } = await supabase.from("teachers").insert({
      owner_id: user.id,
      full_name: v.full_name,
      cpf: v.cpf || null,
      email: v.email || null,
      titulation: v.titulation || null,
      signature_url,
    });
    if (error) return toast.error(error.message);
    toast.success("Docente cadastrado");
    setOpen(false);
    setSignature(null);
    form.reset();
    qc.invalidateQueries({ queryKey: ["teachers"] });
  };

  return (
    <AppLayout title="Docentes">
      <PageHeader
        title="Docentes"
        description="Docentes disponíveis para assinar certificados."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-xl"><Plus className="mr-1 size-4" /> Novo Docente</Button></DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>Novo docente</DialogTitle></DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-1.5"><Label>Nome *</Label><Input {...form.register("full_name")} className="rounded-xl" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5"><Label>CPF</Label><Input {...form.register("cpf")} className="rounded-xl" /></div>
                  <div className="grid gap-1.5"><Label>Titulação</Label><Input {...form.register("titulation")} placeholder="MSc, PhD..." className="rounded-xl" /></div>
                </div>
                <div className="grid gap-1.5"><Label>Email</Label><Input type="email" {...form.register("email")} className="rounded-xl" /></div>
                <div className="grid gap-1.5">
                  <Label>Assinatura digital (PNG)</Label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border/70 p-3 text-sm text-muted-foreground hover:bg-accent">
                    <Upload className="size-4" />
                    {signature ? signature.name : "Clique para enviar"}
                    <input type="file" accept="image/png,image/jpeg" hidden onChange={(e) => setSignature(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit">Cadastrar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-border/60 shadow-soft">
        {teachers.length === 0 ? (
          <div className="p-6"><EmptyState title="Nenhum docente" description="Cadastre docentes para assinar certificados." icon={<UserCog className="size-5" />} /></div>
        ) : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Titulação</TableHead><TableHead>Assinatura</TableHead><TableHead />
            </TableRow></TableHeader>
            <TableBody>
              {teachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.full_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.email ?? "—"}</TableCell>
                  <TableCell>{t.titulation ?? "—"}</TableCell>
                  <TableCell>{t.signature_url ? "✓" : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost" size="icon" className="rounded-lg text-destructive"
                      onClick={async () => {
                        if (!confirm("Excluir docente?")) return;
                        await supabase.from("teachers").delete().eq("id", t.id);
                        qc.invalidateQueries({ queryKey: ["teachers"] });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </AppLayout>
  );
}
