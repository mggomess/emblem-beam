import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Search, FileCheck2, Download, Eye, RefreshCw, XCircle, MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { UFSelect } from "@/components/common/UFSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { generateCertificatePdf, isValidUF } from "@/lib/certificate-pdf";
import { generateSuperiorCertificatePdf } from "@/lib/certificate-superior-pdf";
import { UNIVERSITIES, findUniversity } from "@/lib/universities";
import { ufNome } from "@/lib/uf";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/app/certificados")({
  head: () => ({ meta: [{ title: "Certificados — Certifica" }] }),
  component: CertificadosPage,
});

function CertificadosPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState<string>("");
  const [courseIdSel, setCourseIdSel] = useState<string>("");
  const [uf, setUf] = useState<string>("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [nomeColegio, setNomeColegio] = useState<string>("");
  const [dataEmissao, setDataEmissao] = useState<string>(
    new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
  );
  const [directorName, setDirectorName] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  // ==== Superior ====
  const [openSup, setOpenSup] = useState(false);
  const [supUniId, setSupUniId] = useState<string>("");
  const [supStudentId, setSupStudentId] = useState<string>("");
  const [supCourseId, setSupCourseId] = useState<string>("");
  const [supMatricula, setSupMatricula] = useState("");
  const [supNascimento, setSupNascimento] = useState("");
  const [supCidadeAluno, setSupCidadeAluno] = useState("");
  const [supPortaria, setSupPortaria] = useState("913, de 28/12/2018");
  const [supResolucao, setSupResolucao] = useState("1, de 15 de maio de 2006");
  const [supDataColacao, setSupDataColacao] = useState("");
  const [supTitulo, setSupTitulo] = useState("BACHAREL");
  const [supPeriodoInicio, setSupPeriodoInicio] = useState("");
  const [supPeriodoFim, setSupPeriodoFim] = useState("");
  const [supCidadeExp, setSupCidadeExp] = useState("");
  const [supUfExp, setSupUfExp] = useState("");
  const [supDataExp, setSupDataExp] = useState(
    new Date().toLocaleDateString("pt-BR"),
  );
  const [supPoloEndereco, setSupPoloEndereco] = useState("");
  const [supPoloCep, setSupPoloCep] = useState("");
  const [supPoloTelefone, setSupPoloTelefone] = useState("");
  const [generatingSup, setGeneratingSup] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const { data: certs = [] } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () =>
      (await supabase.from("certificates")
        .select("*, students(full_name, cpf), courses(name, workload)")
        .order("issued_at", { ascending: false })).data ?? [],
  });

  const { data: students = [] } = useQuery({
    queryKey: ["students-select"],
    queryFn: async () => (await supabase.from("students").select("id, full_name, cpf, course_id")).data ?? [],
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["courses-select-all"],
    queryFn: async () => (await supabase.from("courses").select("id, name, workload")).data ?? [],
  });
  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers-select"],
    queryFn: async () => (await supabase.from("teachers").select("id, full_name, titulation")).data ?? [],
  });
  const { data: institution } = useQuery({
    queryKey: ["primary-institution"],
    queryFn: async () => (await supabase.from("institutions").select("*").limit(1).maybeSingle()).data,
  });

  const filtered = useMemo(() => certs.filter((c) => {
    const s = search.toLowerCase();
    const matches = !s ||
      (c.students as { full_name: string } | null)?.full_name?.toLowerCase().includes(s) ||
      c.code.toLowerCase().includes(s) ||
      (c.courses as { name: string } | null)?.name?.toLowerCase().includes(s);
    const status = statusFilter === "todos" || c.status === statusFilter;
    return matches && status;
  }), [certs, search, statusFilter]);

  const selectedStudent = students.find((s) => s.id === studentId);
  const effectiveCourseId = courseIdSel || selectedStudent?.course_id || "";
  const canGenerate = !!studentId && !!effectiveCourseId && isValidUF(uf);

  const reset = () => {
    setStudentId(""); setCourseIdSel(""); setUf(""); setSelectedTeachers([]);
    setNomeColegio(""); setDirectorName("");
  };

  const handleGenerate = async () => {
    if (!user || !canGenerate) return;
    const student = students.find((s) => s.id === studentId);
    const course = courses.find((c) => c.id === effectiveCourseId);
    if (!student || !course) return toast.error("Dados incompletos");

    setGenerating(true);
    try {
      const code = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const teacherRecords = teachers.filter((t) => selectedTeachers.includes(t.id));

      let logoUrl: string | null = null;
      if (institution?.logo_url) {
        const { data } = await supabase.storage.from("institution-assets").createSignedUrl(institution.logo_url, 300);
        logoUrl = data?.signedUrl ?? null;
      }

      const pdfBytes = await generateCertificatePdf({
        studentName: student.full_name,
        studentCpf: student.cpf,
        courseName: course.name,
        workload: course.workload,
        institutionName: institution?.name ?? "Sua Instituição",
        institutionLogoUrl: logoUrl,
        uf: uf.toUpperCase(),
        teacherNames: teacherRecords.map((t) => `${t.full_name}${t.titulation ? " — " + t.titulation : ""}`),
        code,
        issuedAt: new Date(),
        verifyBaseUrl: (institution as { verification_base_url?: string | null } | null)?.verification_base_url,
        nomeColegio: nomeColegio.trim() || institution?.name || "Instituição de Ensino",
        dataEmissao,
        directorName: directorName.trim() || undefined,
      });

      const path = `${user.id}/${code}.pdf`;
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const up = await supabase.storage.from("certificates").upload(path, blob, {
        contentType: "application/pdf", upsert: true,
      });
      if (up.error) throw up.error;

      const { error } = await supabase.from("certificates").insert({
        owner_id: user.id,
        student_id: student.id,
        course_id: course.id,
        institution_id: institution?.id ?? null,
        teacher_ids: selectedTeachers,
        code,
        estado: uf.toUpperCase(),
        pdf_url: path,
        type: "certificado",
      });
      if (error) throw error;

      // Auto-download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${code}.pdf`; a.click();
      URL.revokeObjectURL(url);

      toast.success(`Certificado ${code} gerado!`);
      setOpen(false);
      reset();
      qc.invalidateQueries({ queryKey: ["certificates"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao gerar PDF");
    } finally {
      setGenerating(false);
    }
  };

  const resetSup = () => {
    setSupUniId(""); setSupStudentId(""); setSupCourseId("");
    setSupMatricula(""); setSupNascimento(""); setSupCidadeAluno("");
    setSupDataColacao(""); setSupTitulo("BACHAREL");
    setSupPeriodoInicio(""); setSupPeriodoFim("");
    setSupCidadeExp(""); setSupUfExp("");
    setSupPoloEndereco(""); setSupPoloCep(""); setSupPoloTelefone("");
  };

  const canGenerateSup = !!supUniId && !!supStudentId && !!supCourseId && !!supCidadeExp && !!supUfExp;

  const handleGenerateSuperior = async () => {
    if (!user || !canGenerateSup) return;
    const uni = findUniversity(supUniId);
    const student = students.find((s) => s.id === supStudentId);
    const course = courses.find((c) => c.id === supCourseId);
    if (!uni || !student || !course) return toast.error("Dados incompletos");

    setGeneratingSup(true);
    try {
      const code = `CERTSUP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const pdfBytes = await generateSuperiorCertificatePdf({
        studentName: student.full_name,
        studentCpf: student.cpf,
        studentMatricula: supMatricula || undefined,
        studentBirthDate: supNascimento || undefined,
        studentCity: supCidadeAluno || undefined,
        courseName: course.name,
        portariaMec: supPortaria,
        resolucao: supResolucao,
        dataColacao: supDataColacao,
        titulo: supTitulo,
        periodoInicio: supPeriodoInicio,
        periodoFim: supPeriodoFim,
        cidadeExpedicao: supCidadeExp,
        ufExpedicao: supUfExp,
        dataExpedicao: supDataExp,
        universityName: uni.nome,
        universitySigla: uni.sigla,
        poloEndereco: supPoloEndereco || undefined,
        poloCep: supPoloCep || undefined,
        poloTelefone: supPoloTelefone || undefined,
        code,
        verifyBaseUrl: (institution as { verification_base_url?: string | null } | null)?.verification_base_url,
      });

      const path = `${user.id}/${code}.pdf`;
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const up = await supabase.storage.from("certificates").upload(path, blob, {
        contentType: "application/pdf", upsert: true,
      });
      if (up.error) throw up.error;

      const { error } = await supabase.from("certificates").insert({
        owner_id: user.id,
        student_id: student.id,
        course_id: course.id,
        institution_id: institution?.id ?? null,
        teacher_ids: [],
        code,
        estado: supUfExp.toUpperCase(),
        pdf_url: path,
        type: "certificado",
      });
      if (error) throw error;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${code}.pdf`; a.click();
      URL.revokeObjectURL(url);

      toast.success(`Certificado superior ${code} gerado!`);
      setOpenSup(false);
      resetSup();
      qc.invalidateQueries({ queryKey: ["certificates"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao gerar PDF");
    } finally {
      setGeneratingSup(false);
    }
  };

  const download = async (path: string, code: string) => {
    const { data, error } = await supabase.storage.from("certificates").createSignedUrl(path, 60);
    if (error || !data) return toast.error("Não foi possível baixar");
    const a = document.createElement("a");
    a.href = data.signedUrl; a.download = `${code}.pdf`; a.target = "_blank"; a.click();
  };

  const cancel = async (id: string) => {
    if (!confirm("Cancelar este certificado?")) return;
    await supabase.from("certificates").update({ status: "cancelado" }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["certificates"] });
  };

  return (
    <AppLayout title="Emissão de Certificados">
      <PageHeader
        title="Certificados"
        description="Emita e gerencie certificados digitais com validação por QR Code."
        action={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
            <DialogTrigger asChild><Button className="rounded-xl"><Plus className="mr-1 size-4" /> Nova emissão</Button></DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Nova emissão de certificado</DialogTitle>
                <DialogDescription>
                  Preencha os dados. O <b>Estado (UF)</b> é obrigatório para carregar brasão,
                  bandeira e marca d'água do certificado.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-1.5">
                  <Label>Aluno *</Label>
                  <Select value={studentId} onValueChange={setStudentId}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione o aluno" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label>Curso *</Label>
                  <Select value={effectiveCourseId} onValueChange={setCourseIdSel}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione o curso" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.workload}h</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" /> Estado (UF) *
                  </Label>
                  <UFSelect value={uf} onChange={setUf} />
                  {uf && (
                    <p className="text-xs text-muted-foreground">
                      Brasão, bandeira e marca d'água de <b>{ufNome(uf)}</b> serão aplicados automaticamente.
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <Label>Nome do Colégio *</Label>
                  <Input
                    className="rounded-xl"
                    value={nomeColegio}
                    onChange={(e) => setNomeColegio(e.target.value)}
                    placeholder="Ex: E.E.E.F.M. Prof. João da Silva"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label>Data de Emissão *</Label>
                    <Input
                      className="rounded-xl"
                      value={dataEmissao}
                      onChange={(e) => setDataEmissao(e.target.value)}
                      placeholder="10 de julho de 2026"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Diretor Escolar</Label>
                    <Input
                      className="rounded-xl"
                      value={directorName}
                      onChange={(e) => setDirectorName(e.target.value)}
                      placeholder="Nome do diretor"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label>Assinaturas (docentes)</Label>
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-border/60 p-2">
                    {teachers.length === 0 && <p className="p-2 text-xs text-muted-foreground">Cadastre docentes primeiro.</p>}
                    {teachers.map((t) => (
                      <label key={t.id} className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-accent">
                        <Checkbox
                          checked={selectedTeachers.includes(t.id)}
                          onCheckedChange={(v) => {
                            setSelectedTeachers((prev) => v ? [...prev, t.id] : prev.filter((x) => x !== t.id));
                          }}
                        />
                        <span className="text-sm">{t.full_name} {t.titulation && <span className="text-muted-foreground">— {t.titulation}</span>}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button disabled={!canGenerate || generating} onClick={handleGenerate}>
                  {generating ? "Gerando..." : "Gerar PDF"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-border/60 shadow-soft">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por aluno, curso ou código..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full rounded-xl sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos status</SelectItem>
              <SelectItem value="emitido">Emitido</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="reemitido">Reemitido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Nenhum certificado emitido"
              description="Clique em Nova emissão para gerar o primeiro certificado."
              icon={<FileCheck2 className="size-5" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>UF</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {(c.students as { full_name: string } | null)?.full_name ?? "—"}
                    </TableCell>
                    <TableCell>{(c.courses as { name: string } | null)?.name ?? "—"}</TableCell>
                    <TableCell><Badge variant="outline" className="rounded-full">{c.estado}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.issued_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === "emitido" ? "default" : "secondary"} className="rounded-full capitalize">
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {c.pdf_url && (
                        <>
                          <Button variant="ghost" size="icon" title="Download" className="rounded-lg" onClick={() => download(c.pdf_url!, c.code)}>
                            <Download className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Visualizar" className="rounded-lg" onClick={async () => {
                            const { data } = await supabase.storage.from("certificates").createSignedUrl(c.pdf_url!, 60);
                            if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                          }}>
                            <Eye className="size-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" title="Reemitir" className="rounded-lg" onClick={() => {
                        setStudentId(c.student_id); setCourseIdSel(c.course_id); setUf(c.estado);
                        setSelectedTeachers(c.teacher_ids ?? []); setOpen(true);
                      }}>
                        <RefreshCw className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Cancelar" className="rounded-lg text-destructive" onClick={() => cancel(c.id)}>
                        <XCircle className="size-4" />
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
