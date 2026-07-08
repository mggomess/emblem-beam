import { UF_LIST } from "@/lib/uf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UFSelect({
  value,
  onChange,
  placeholder = "Selecione o estado",
}: {
  value?: string;
  onChange: (uf: string) => void;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {UF_LIST.map((uf) => (
          <SelectItem key={uf.sigla} value={uf.sigla}>
            {uf.nome} ({uf.sigla})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
