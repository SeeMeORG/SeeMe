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
} from "@mui/material";
import { useSelector } from "react-redux";
import logo from "../../assets/LOGO.png";
import {
  availableUsers,
  joinedUser,
  totalUsers,
  wsGlobalLoader,
} from "../../store/userSlice";

export const Header = () => {
  const joinedUserName = useSelector(joinedUser);
  const totalUsersList = useSelector(totalUsers);
  const availUsersList = useSelector(availableUsers);
  const wsLoader = useSelector(wsGlobalLoader);

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={logo} alt="Logo" height={47} />
        </Box>

        {joinedUserName && !wsLoader && (
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 0.5, sm: 1 },
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              alignItems="center"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PersonIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight={500}>
                  {joinedUserName || "Not Joined"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PublicIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight={500}>
                  Total: {totalUsersList}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CheckCircleIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight={500}>
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
