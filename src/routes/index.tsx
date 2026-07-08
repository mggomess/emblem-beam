import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, FileCheck2, IdCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Certifica — Gestão Acadêmica e Certificados Digitais" },
      {
        name: "description",
        content:
          "SaaS moderno para instituições emitirem certificados e carteirinhas digitais com validação por QR Code.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Sparkles className="size-4" />
          </div>
          <span className="font-semibold">Certifica</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" asChild><Link to="/auth">Entrar</Link></Button>
          <Button asChild className="rounded-xl">
            <Link to="/auth">Começar grátis <ArrowRight className="ml-1 size-4" /></Link>
          </Button>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <ShieldCheck className="size-3 text-success" /> Certificação digital com QR Code
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
            A plataforma acadêmica<br />
            <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
              feita para escalar
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Gerencie alunos, cursos e docentes. Emita certificados e carteirinhas digitais
            em segundos, com brasões oficiais de todos os estados brasileiros.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" asChild className="rounded-xl">
              <Link to="/auth">Criar conta gratuita</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-xl">
              <Link to="/app">Acessar painel</Link>
            </Button>
          </div>
        </motion.div>
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { icon: FileCheck2, title: "Certificados", desc: "PDFs profissionais com QR Code de validação." },
            { icon: IdCard, title: "Carteirinhas", desc: "Emita cartões digitais em segundos." },
            { icon: ShieldCheck, title: "27 UFs", desc: "Brasões, bandeiras e marcas d'água por estado." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border/60 bg-card p-5 text-left shadow-soft">
              <div className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
