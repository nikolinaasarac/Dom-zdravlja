import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link, useParams } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null; // Sidebar se ne prikazuje ako nema odabranog pacijenta

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z"/>
              </svg>
            </ListItemIcon>
            <ListItemText primary="Svi pacijenti" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to={`/pacijenti/${id}/vakcine`}>
            <ListItemIcon>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M21.71 11.29l-3-3-1.42 1.42 3 3L21.71 11.29zM14.71 18.29l-3-3-1.42 1.42 3 3L14.71 18.29zM2 21h4l9-9-4-4-9 9v4z" />
              </svg>
            </ListItemIcon>
            <ListItemText primary="Vakcinacije" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to={`/pacijenti/${id}/pregledi`}>
            <ListItemIcon>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
            </ListItemIcon>
            <ListItemText primary="Pregledi" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to={`/pacijenti/${id}/karton`}>
            <ListItemIcon>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M6 2h9l5 5v15c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm9 5V3.5L18.5 7H15z" />
              </svg>
            </ListItemIcon>
            <ListItemText primary="Karton" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
