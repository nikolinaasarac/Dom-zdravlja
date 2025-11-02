// PreglediRoute.tsx
import { useParams } from "react-router-dom";
import PrikazSvihPregleda from "../features/PrikazPacijenata/PrikazSvihPregleda";

export default function PreglediRoute() {
  const { id } = useParams<{ id: string }>();
  const pacijentId = id ? parseInt(id) : undefined;

  return <PrikazSvihPregleda pacijentId={pacijentId} />;
}
