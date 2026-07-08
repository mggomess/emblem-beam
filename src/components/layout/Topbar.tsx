import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Topbar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 bg-background/80 px-6 backdrop-blur">
      {title && <h1 className="text-base font-semibold">{title}</h1>}
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Pesquisar..." className="w-72 rounded-xl pl-9" />
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Bell className="size-4" />
        </Button>
      </div>
    </header>
  );
}
