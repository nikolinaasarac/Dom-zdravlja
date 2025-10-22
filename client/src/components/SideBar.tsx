import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  if (!id) return null;

  const navItems = [
    { label: "Svi pacijenti", to: "/pacijenti", icon: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z" /></svg> },
    { label: "Lični podaci", to: `/pacijenti/${id}`, icon: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" /></svg> },
    { label: "Vakcinacije", to: `/pacijenti/${id}/vakcine`, icon: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M21.71 11.29l-3-3-1.42 1.42 3 3L21.71 11.29zM14.71 18.29l-3-3-1.42 1.42 3 3L14.71 18.29zM2 21h4l9-9-4-4-9 9v4z" /></svg> },
    { label: "Pregledi", to: `/pregledi/${id}`, icon: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" /></svg> },
    { label: "Karton", to: `/pacijenti/${id}/uputnice`, icon: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 2h9l5 5v15c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm9 5V3.5L18.5 7H15z" /></svg> },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(200,230,255,0.7))",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "0 15px 15px 0",
          boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
          paddingTop: "20px",
        },
      }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor:
                  location.pathname === item.to
                    ? "rgba(127,212,212,0.4)"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    location.pathname === item.to
                      ? "rgba(127,212,212,0.5)"
                      : "rgba(127,212,212,0.25)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transform: "translateX(2px)",
                  transition: "all 0.2s ease-in-out",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <ListItemIcon sx={{ color: "#333" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ color: "#333", fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
