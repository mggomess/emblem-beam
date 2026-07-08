# Plano: SaaS Acadêmico + Certificados Digitais

Stack real do template (equivalências ao pedido):
- Next.js 15 → **TanStack Start** (mesmo modelo SSR + server functions)
- Prisma + Postgres → **Lovable Cloud (Supabase Postgres)** via migrations
- NextAuth → **Lovable Cloud Auth** (email/senha + Google)
- React Hook Form, Zod, TanStack Query, TailwindCSS, shadcn/ui, Framer Motion, Lucide → já usados / adicionados
- Framer Motion instalado

## Fase 1 — Fundação (esta entrega)
1. **Habilitar Lovable Cloud** e configurar auth (email/senha + Google).
2. **Design system premium** em `src/styles.css`:
   - Fundo `#F7F8FA`, cards brancos, radius 18px, sombras suaves
   - Tokens: primary `#2563EB`, secondary `#6D28D9`, success `#10B981`, destructive `#EF4444`
   - Dark mode
   - Fontes: Inter (via @fontsource)
3. **Schema do banco** (migration única):
   - `profiles`, `app_role` enum + `user_roles` (admin/parceiro/usuario) + `has_role()`
   - `institutions`, `courses`, `classes`, `students`, `teachers`
   - `certificate_templates`, `signatures`, `certificates` (com **coluna `estado VARCHAR(2)`**), `student_cards`
   - `activity_logs`, `credits_ledger`, `payments`, `settings`
   - RLS + GRANTs para authenticated/service_role em todas
4. **Storage buckets**: `logos`, `signatures`, `certificates`, `student-cards` (privados) e `estados` (público).
5. **Layout base**:
   - `AppLayout` com `Sidebar` fixa (seções Painel/Acadêmico/Documentação/Sistema) + footer (tema, perfil, créditos, suporte, sair)
   - `Topbar` limpa
   - Rota gate `_authenticated`
6. **Componentes reutilizáveis**: `DataTable`, `StatsCard`, `PageHeader`, `SearchInput`, `ConfirmDialog`, `EmptyState`, `Pagination`, `Modal/Drawer`, `FormField`, `UploadImage`, `QRCode`, `PDFViewer` (via iframe/pdf-lib).
7. **Dashboard** com StatsCards, gráfico mensal (recharts), últimas emissões, últimos alunos, atividades.
8. **Alunos**: CRUD com tabela + filtros + modal de cadastro (foto opcional).
9. **Cursos**: CRUD com contagem de alunos.
10. **Docentes**: CRUD com upload de assinatura digital.
11. **Emissão de Certificados** (foco especial):
    - Tabela com filtros (aluno/curso/data/status), ações (download/visualizar/reemitir/cancelar).
    - **Modal "Nova emissão"** com fluxo: aluno → modelo → assinaturas → **Estado (UF) obrigatório** → gerar.
    - Componente `UFSelect` com as 27 UFs.
    - Geração de PDF client-side com `pdf-lib` usando:
      - `/estados/brasoes/${uf}.png` (canto esquerdo)
      - `/estados/bandeiras/${uf}.png` (canto direito)
      - `/estados/watermarks/${uf}.png` (central, opacity 6%, ~400px)
      - Logo da instituição, textos, assinaturas, QRCode com URL de verificação
    - Botão **Gerar PDF** desabilitado enquanto UF não estiver preenchida (Zod: `estado: z.string().length(2)`).
    - Salva certificado no banco com `estado`, `codigo`, URL do PDF em storage.
    - Página de visualização carrega imagens dinamicamente pela sigla (sem `if/switch`).
12. **Carteirinhas**: dashboard + tabela + fluxo de emissão.
13. **Usuários**: gestão de perfis/roles/créditos.
14. **Logs**: tabela com filtros + export CSV/PDF.
15. **Faturamento**: saldo, histórico, placeholder para PIX/Cartão/Boleto (integração real posterior).
16. **Configurações**: abas (Instituição, Portarias, Assinaturas, Modelos, Carteirinhas, Imagens, Sistema, Diploma Digital).
17. **Placeholders de UF**: gerar PNGs para os 27 estados (brasão, bandeira, watermark) em `public/estados/*`.

## Detalhes técnicos
- Server functions em `src/lib/*.functions.ts` com `requireSupabaseAuth`.
- Loaders só em rotas `_authenticated/*`.
- SEO: head específico por rota, sitemap + robots.
- Acessibilidade: labels, aria, foco visível.
- Lazy loading nas rotas pesadas (Certificados PDF).

## Escopo desta primeira entrega (para caber em uma iteração)
Vou implementar: **Fases 1–11 completas + placeholders de UF + Configurações (aba Instituição)**. Carteirinhas, Faturamento, Logs completos, Usuários e demais abas de Configurações ficam como stubs funcionais navegáveis (páginas com estrutura pronta, CRUD nas próximas iterações) para não estourar o tamanho. Você me diz "continua" e eu completo cada módulo.

## Confirmação
Prossigo com esse escopo? Se quiser priorizar outros módulos antes (ex.: Carteirinhas completas em vez de Docentes), me diga agora.