import { Mic } from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

export const MainBody = () => {
  return (
    <Box
      sx={{
        height: "92vh",
        m: 0,
      }}
    >
      <Grid container spacing={0} sx={{ height: "100%" }}>
        <Grid size={{xs:12, sm:12, md:6}} sx={{border: "2px solid", borderColor: "primary.main"}}>
          <Box
            sx={{
              height: "100%",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(255, 0, 0, 0.5)",
            }}
          >
            <Box
              sx={{
                width: "95%",
                height: "90%",
                background: "linear-gradient(45deg, #111, #222)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
              }}
            >
              Loading your camera...
            </Box>

            <Box
              position="absolute"
              bottom={80}
              left={12}
              bgcolor="rgba(0,0,0,0.7)"
              px={2}
              py={0.5}
              borderRadius={2}
            >
              <Typography color="#fff" fontWeight="bold">
                You
              </Typography>
            </Box>

            <Box
              position="absolute"
              bottom={12}
              left="50%"
              sx={{
                transform: "translateX(-50%)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "30px",
                px: 2,
                py: 1,
                display: "flex",
                gap: 2,
              }}
            >
              <IconButton sx={{ color: "#fff" }}>
                <Mic fontSize="large" />
              </IconButton>
             
            </Box>
          </Box>
        </Grid>
        <Grid size={{xs:12, sm:12, md:6}} sx={{border: "2px solid", borderColor: "primary.main"}}>
          <Box
            sx={{
              height: "100%",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#222",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
            }}
          >
            <Box
              sx={{
                width: "95%",
                height: "90%",
                background: "linear-gradient(45deg, #222, #333)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
              }}
            >
              Waiting for participant...
            </Box>

            <Box
              position="absolute"
              bottom={80}
              left={12}
              bgcolor="rgba(0,0,0,0.7)"
              px={2}
              py={0.5}
              borderRadius={2}
            >
              <Typography color="#fff" fontWeight="bold">
                Friend
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};




