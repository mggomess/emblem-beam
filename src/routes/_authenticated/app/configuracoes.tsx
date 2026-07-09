import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { UFSelect } from "@/components/common/UFSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/app/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Certifica" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: institution } = useQuery({
    queryKey: ["institution"],
    queryFn: async () => (await supabase.from("institutions").select("*").limit(1).maybeSingle()).data,
  });

  const [form, setForm] = useState({
    name: "", cnpj: "", email: "", phone: "", address: "", city: "", state: "",
    verification_base_url: "",
  });

  useEffect(() => {
    if (institution) {
      const inst = institution as typeof institution & { verification_base_url?: string | null };
      setForm({
        name: institution.name ?? "",
        cnpj: institution.cnpj ?? "",
        email: institution.email ?? "",
        phone: institution.phone ?? "",
        address: institution.address ?? "",
        city: institution.city ?? "",
        state: institution.state ?? "",
        verification_base_url: inst.verification_base_url ?? "",
      });
    }
  }, [institution]);

  const save = async () => {
    if (!user) return;
    const payload = { ...form, owner_id: user.id };
    const q = institution
      ? await supabase.from("institutions").update(payload).eq("id", institution.id)
      : await supabase.from("institutions").insert(payload);
    if (q.error) return toast.error(q.error.message);
    toast.success("Configurações salvas");
    qc.invalidateQueries({ queryKey: ["institution"] });
    qc.invalidateQueries({ queryKey: ["primary-institution"] });
  };

  const uploadLogo = async (file: File) => {
    if (!user) return;
    const path = `${user.id}/logos/${crypto.randomUUID()}-${file.name}`;
    const up = await supabase.storage.from("institution-assets").upload(path, file);
    if (up.error) return toast.error(up.error.message);
    if (institution) await supabase.from("institutions").update({ logo_url: path }).eq("id", institution.id);
    toast.success("Logo enviado");
    qc.invalidateQueries({ queryKey: ["institution"] });
  };

  return (
    <AppLayout title="Configurações">
      <PageHeader title="Configurações" description="Personalize sua instituição e modelos." />
      <Tabs defaultValue="instituicao">
        <TabsList className="rounded-xl">
          <TabsTrigger value="instituicao" className="rounded-lg">Instituição</TabsTrigger>
          <TabsTrigger value="portarias" className="rounded-lg">Portarias</TabsTrigger>
          <TabsTrigger value="assinaturas" className="rounded-lg">Assinaturas</TabsTrigger>
          <TabsTrigger value="modelos" className="rounded-lg">Modelos</TabsTrigger>
          <TabsTrigger value="carteirinhas" className="rounded-lg">Carteirinhas</TabsTrigger>
          <TabsTrigger value="imagens" className="rounded-lg">Imagens</TabsTrigger>
          <TabsTrigger value="sistema" className="rounded-lg">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="instituicao" className="mt-4">
          <Card className="border-border/60 shadow-soft">
            <CardHeader><CardTitle className="text-base">Dados da instituição</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-1.5 md:col-span-2"><Label>Nome *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" /></div>
              <div className="grid gap-1.5"><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} className="rounded-xl" /></div>
              <div className="grid gap-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" /></div>
              <div className="grid gap-1.5"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" /></div>
              <div className="grid gap-1.5"><Label>Cidade</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl" /></div>
              <div className="grid gap-1.5 md:col-span-2"><Label>Endereço</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl" /></div>
              <div className="grid gap-1.5"><Label>Estado (UF)</Label>
                <UFSelect value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
              </div>
              <div className="grid gap-1.5"><Label>Logo</Label>
                <Input type="file" accept="image/png,image/jpeg" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} className="rounded-xl" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={save} className="rounded-xl">Salvar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {["portarias", "assinaturas", "modelos", "carteirinhas", "imagens", "sistema"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card className="border-border/60 p-8 text-center shadow-soft">
              <p className="text-sm text-muted-foreground">Configurações de {tab} em preparação.</p>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </AppLayout>
  );
}
