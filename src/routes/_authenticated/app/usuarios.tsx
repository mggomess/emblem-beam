import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/app/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — Certifica" }] }),
  component: () => (
    <AppLayout title="Usuários">
      <PageHeader title="Usuários" description="Controle de acesso: Administrador, Parceiro e Usuário." />
      <Card className="border-border/60 p-6 shadow-soft">
        <EmptyState title="Gestão de usuários em preparação" description="Convide membros e configure permissões em breve." icon={<Users className="size-5" />} />
      </Card>
    </AppLayout>
  ),
});
