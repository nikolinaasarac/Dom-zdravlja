import { Typography } from "@mui/material";
import { useFetchPreglediQuery } from "../doktor/doktorApi";
import type { Pregled } from "../../models/Pregled";
import { useFetchPacijentPreglediQuery } from "../PrikazPacijenata/pacijentApi";
import TabelaPregleda from "./TabelaPregleda";
import { useParams } from "react-router-dom";

type Props = {
  tip: "doktor" | "pacijent";
};

export default function Pregledi({ tip }: Props) {
  const params = useParams<{ id: string }>();
  const pacijentId = params.id ? +params.id : undefined;
  // Hookovi se uvijek pozivaju
  const { data: preglediDoktor, isLoading: loadingDoktor, refetch: refetchDoktor } = useFetchPreglediQuery();
  const { data: preglediPacijent, isLoading: loadingPacijent, refetch: refetchPacijent } = useFetchPacijentPreglediQuery(pacijentId ?? 0);

  // Odaberi koji podaci da se koriste
  const pregledi: Pregled[] = tip === "doktor" ? preglediDoktor ?? [] : preglediPacijent ?? [];
  const isLoading = tip === "doktor" ? loadingDoktor : loadingPacijent;
  const refetch = tip === "doktor" ? refetchDoktor : refetchPacijent;

  if (isLoading) return <Typography align="center">Učitavanje...</Typography>;

  return <TabelaPregleda pregledi={pregledi} refetch={refetch} enableEdit={tip === "doktor"} />;
}
