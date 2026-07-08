import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, BookOpen } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/app/cursos")({
  head: () => ({ meta: [{ title: "Cursos — Certifica" }] }),
  component: CursosPage,
});

const schema = z.object({
  name: z.string().min(2),
  workload: z.coerce.number().min(1),
  description: z.string().optional(),
});
type Values = z.infer<typeof schema>;

function CursosPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => (await supabase.from("courses").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const { data: counts = {} } = useQuery({
    queryKey: ["courses-counts", courses.map((c) => c.id).join(",")],
    enabled: courses.length > 0,
    queryFn: async () => {
      const { data } = await supabase.from("students").select("course_id");
      const map: Record<string, number> = {};
      (data ?? []).forEach((s: { course_id: string | null }) => {
        if (s.course_id) map[s.course_id] = (map[s.course_id] ?? 0) + 1;
      });
      return map;
    },
  });

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { workload: 40 } });

  const onSubmit = async (v: Values) => {
    if (!user) return;
    const { error } = await supabase.from("courses").insert({
      owner_id: user.id,
      name: v.name,
      workload: v.workload,
      description: v.description || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Curso criado");
    setOpen(false);
    form.reset({ workload: 40 });
    qc.invalidateQueries({ queryKey: ["courses"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir curso?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["courses"] });
  };

  return (
    <AppLayout title="Cursos">
      <PageHeader
        title="Cursos"
        description="Cadastre e organize sua grade de cursos."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-xl"><Plus className="mr-1 size-4" /> Novo Curso</Button></DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>Novo curso</DialogTitle></DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label>Nome *</Label>
                  <Input {...form.register("name")} className="rounded-xl" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Carga horária (h) *</Label>
                  <Input type="number" {...form.register("workload")} className="rounded-xl" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Descrição</Label>
                  <Textarea {...form.register("description")} className="rounded-xl" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit">Criar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-border/60 shadow-soft">
        {courses.length === 0 ? (
          <div className="p-6"><EmptyState title="Nenhum curso" description="Crie seu primeiro curso." icon={<BookOpen className="size-5" />} /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Carga horária</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.workload}h</TableCell>
                  <TableCell>{counts[c.id] ?? 0}</TableCell>
                  <TableCell><Badge variant={c.active ? "default" : "secondary"} className="rounded-full">{c.active ? "Ativo" : "Inativo"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="rounded-lg text-destructive" onClick={() => remove(c.id)}>
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
