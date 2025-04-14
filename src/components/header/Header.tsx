import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import logo from "../../assets/LOGO.png";
import { RootState } from "../../store/store";

export const Header = () => {
  const name = useSelector((state: RootState) => state.user.name);
  const totalUsers = useSelector((state: RootState) => state.user.totalUsers);
  const availableUsers = useSelector(
    (state: RootState) => state.user.availableUsers
  );

  return (
    <AppBar
      position="sticky"
      elevation={6}
      sx={{
        background: "",
        py: 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={logo} alt="Logo" height={44} />
        </Box>

    
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            backgroundColor: "rgba(255,255,255,0.08)",
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            👤 {name || "Not Joined"}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            🌐 Total: {totalUsers}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            ✅ Available: {availableUsers}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
