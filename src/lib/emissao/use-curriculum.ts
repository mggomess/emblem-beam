import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UniversidadeHist, DisciplinaSuperior } from "./types";

export type CurriculumMatrix = {
  id: string;
  universidade: string;
  curso: string;
  versao: string;
  carga_horaria: number;
};

export type CurriculumDiscipline = {
  id: string;
  matrix_id: string;
  ordem: number;
  periodo: string;
  codigo: string;
  nome: string;
  carga_horaria: number;
};

export function useMatrices(universidade: UniversidadeHist) {
  const [data, setData] = useState<CurriculumMatrix[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    supabase
      .from("curriculum_matrices")
      .select("*")
      .eq("universidade", universidade)
      .order("curso", { ascending: true })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          console.error(error);
          setData([]);
        } else {
          setData((data as CurriculumMatrix[]) ?? []);
        }
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [universidade]);

  return { matrices: data, loading };
}

export async function fetchDisciplinesForMatrix(matrixId: string): Promise<DisciplinaSuperior[]> {
  const { data, error } = await supabase
    .from("curriculum_disciplines")
    .select("*")
    .eq("matrix_id", matrixId)
    .order("ordem", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return ((data as CurriculumDiscipline[]) ?? []).map((d) => ({
    periodo: d.periodo,
    codigo: d.codigo,
    descricao: d.nome,
    ch: String(d.carga_horaria ?? ""),
    perLetivo: "",
    media: "",
    frequencia: "",
    situacao: "AP",
    fromMatrix: true,
  }));
}

/** Soma CH das disciplinas cursadas (AP, AE, DS). */
export function calcularChCumprida(disciplinas: DisciplinaSuperior[]): number {
  const validas = new Set(["AP", "AE", "DS"]);
  return disciplinas.reduce((sum, d) => {
    if (!validas.has((d.situacao || "").toUpperCase())) return sum;
    const n = parseInt(d.ch, 10);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
}
