import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import {
  AppBar,
  Box,
  Divider,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import logo from "../../assets/LOGO.png";
import {
  availableUsers,
  joinedUser,
  totalUsers,
} from "../../store/userSlice";

export const Header = () => {
  const joinedUserName = useSelector(joinedUser);
  const totalUsersList = useSelector(totalUsers);
  const availUsersList = useSelector(availableUsers);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="sticky" elevation={6} sx={{ py: 1 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "nowrap",
        }}
      >
        {/* Logo on left */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={logo} alt="Logo" height={47} />
        </Box>

        {/* Info section on right */}
        {joinedUserName && (
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.08)",
              px: { xs: 2, sm: 3 },
              py: { xs: 0.5, sm: 1 },
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={isMobile ? 1 : 2}
              divider={<Divider orientation="vertical" flexItem />}
              alignItems="center"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PersonIcon fontSize={isMobile ? "small" : "medium"} />
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontSize={isMobile ? "0.75rem" : "1rem"}
                >
                  {joinedUserName || "Not Joined"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PublicIcon fontSize={isMobile ? "small" : "medium"} />
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontSize={isMobile ? "0.75rem" : "1rem"}
                >
                  Total: {totalUsersList}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CheckCircleIcon fontSize={isMobile ? "small" : "medium"} />
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontSize={isMobile ? "0.75rem" : "1rem"}
                >
                  Available: {availUsersList}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
