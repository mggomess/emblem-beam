import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2, Pencil, GraduationCap, FileText } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { generateHistoricoPdf } from "@/lib/historico-pdf";

export const Route = createFileRoute("/_authenticated/app/alunos")({
  head: () => ({ meta: [{ title: "Alunos — Certifica" }] }),
  component: AlunosPage,
});

const schema = z.object({
  full_name: z.string().min(2, "Nome muito curto"),
  cpf: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  course_id: z.string().optional(),
  status: z.enum(["ativo", "inativo", "concluido"]),
});
type FormValues = z.infer<typeof schema>;

function AlunosPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const { data: courses = [] } = useQuery({
    queryKey: ["courses-select"],
    queryFn: async () => (await supabase.from("courses").select("id, name")).data ?? [],
  });

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: async () =>
      (await supabase.from("students").select("*, courses(name)").order("created_at", { ascending: false })).data ?? [],
  });

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !search ||
        s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (s.cpf ?? "").includes(search);
      const matchStatus = statusFilter === "todos" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [students, search, statusFilter]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: "ativo" },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    const { error } = await supabase.from("students").insert({
      owner_id: user.id,
      full_name: values.full_name,
      cpf: values.cpf || null,
      email: values.email || null,
      phone: values.phone || null,
      course_id: values.course_id || null,
      status: values.status,
    });
    if (error) return toast.error(error.message);
    toast.success("Aluno cadastrado!");
    setOpen(false);
    form.reset({ status: "ativo" });
    qc.invalidateQueries({ queryKey: ["students"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este aluno?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Aluno excluído");
    qc.invalidateQueries({ queryKey: ["students"] });
  };

  return (
    <AppLayout title="Alunos">
      <PageHeader
        title="Alunos"
        description="Gerencie o cadastro completo dos seus alunos."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl"><Plus className="mr-1 size-4" /> Novo Aluno</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-lg">
              <DialogHeader><DialogTitle>Cadastrar aluno</DialogTitle></DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
                <div className="grid gap-1.5">
                  <Label>Nome completo *</Label>
                  <Input {...form.register("full_name")} className="rounded-xl" />
                  {form.formState.errors.full_name && (
                    <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>CPF</Label>
                    <Input {...form.register("cpf")} className="rounded-xl" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Telefone</Label>
                    <Input {...form.register("phone")} className="rounded-xl" />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label>Email</Label>
                  <Input type="email" {...form.register("email")} className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Curso</Label>
                    <Select onValueChange={(v) => form.setValue("course_id", v)}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select defaultValue="ativo" onValueChange={(v) => form.setValue("status", v as FormValues["status"])}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou CPF..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full rounded-xl sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Nenhum aluno encontrado"
              description="Cadastre seu primeiro aluno para começar a emitir certificados."
              icon={<GraduationCap className="size-5" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {s.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{s.full_name}</div>
                          <div className="text-xs text-muted-foreground">{s.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{s.cpf ?? "—"}</TableCell>
                    <TableCell className="text-sm">{(s.courses as { name: string } | null)?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "ativo" ? "default" : "secondary"} className="rounded-full capitalize">
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="rounded-lg"><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon" className="rounded-lg text-destructive" onClick={() => remove(s.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
