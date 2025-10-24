import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";
import type { Pregled } from "../../models/Pregled";
import PregledForm from "../doktor/PregledForm";

type Props = {
    pregledi: Pregled[];
    refetch: () => void;
    enableEdit?: boolean;
};

export default function PreglediTable({ pregledi, refetch, enableEdit }: Props) {
    function PregledRow({ p }: { p: Pregled }) {
        const [open, setOpen] = useState(false);
        const [openDialog, setOpenDialog] = useState(false);

        return (
            <>
                <TableRow hover>
                    <TableCell width={50}>
                        <IconButton size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </TableCell>
                    <TableCell>{p.pacijentIme} {p.pacijentPrezime}</TableCell>
                    <TableCell>{new Date(p.datumPregleda).toLocaleDateString()}</TableCell>
                    <TableCell>{p.vrstaPregleda}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{p.doktorIme} {p.doktorPrezime}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, border: "none" }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2, p: 2, backgroundColor: "#fafafa", borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                                    Detalji pregleda
                                </Typography>

                                <Typography><b>Opis simptoma:</b> {p.opisSimptoma ?? "-"}</Typography>
                                <Typography><b>Dijagnoza:</b> {p.dijagnoza ?? "-"}</Typography>
                                <Typography><b>Terapija:</b> {p.terapija ?? "-"}</Typography>
                                <Typography><b>Napomena:</b> {p.napomena ?? "-"}</Typography>

                                {enableEdit && (
                                    <Button
                                        variant="outlined"
                                        sx={{ mt: 1 }}
                                        onClick={() => setOpenDialog(true)}
                                    >
                                        Unesi detalje
                                    </Button>
                                )}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>

                {enableEdit && (
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Unesi detalje pregleda</DialogTitle>
                        <DialogContent>
                            <PregledForm pregled={p} setEditMode={() => setOpenDialog(false)} refetch={refetch} />
                        </DialogContent>
                    </Dialog>
                )}
            </>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ background: "transparent", boxShadow: "none" }}>
            <Table sx={{ borderSpacing: "0 12px", borderCollapse: "separate" }}>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell sx={{ fontWeight: "bold" }}>Pacijent</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Datum pregleda</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Vrsta pregleda</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Doktor</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pregledi.map((p: Pregled) => (
                        <PregledRow key={p.id} p={p} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
