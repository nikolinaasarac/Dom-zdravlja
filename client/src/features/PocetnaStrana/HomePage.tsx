import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <div>HomePage</div>
      <Button component={Link} to={`/pacijenti`} variant="outlined">
        Prikaži pacijente
      </Button>
    </>
  );
}
