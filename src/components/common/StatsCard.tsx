import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  icon,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "border-border/60 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card",
          className,
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
              <div className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</div>
              {trend && (
                <div className="mt-1 text-xs text-success">{trend}</div>
              )}
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
