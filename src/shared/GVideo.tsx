import { Box, Grid, Typography } from "@mui/material";
import { GenericLoader } from "../shared/GenericComponents";
import { muiTheme } from "../style/muiTheme";
import { IGVideoProps } from "./interface";
import { StyledVideoContainer } from "../style/CommonStyles";

export const GVideo = ({
  videoRef,
  label,
  isLoading = false,
  isMuted = false,
}: IGVideoProps) => {
  return (
    <Grid
      size={{ xs: 12, sm: 12, md: 6 }}
      sx={{
        border: "2px solid",
        borderColor: "primary.main",
        height: { xs: "50%", sm: "50%", md: "100%" },
      }}
    >
      <StyledVideoContainer>
        {isLoading && <GenericLoader text="Finding someone for you..." />}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: isLoading ? "none" : "block",
          }}
        />
        <Box
          position="absolute"
          left={12}
          bgcolor={muiTheme.palette.info.light}
          px={2}
          py={0.5}
          borderRadius={2}
          sx={{
            backdropFilter: "blur(6px)",
            bottom: { xs: 40, sm: 80 },
          }}
        >
          <Typography
            color={muiTheme.palette.background.paper}
            fontWeight="bold"
          >
            {label}
          </Typography>
        </Box>
      </StyledVideoContainer>
    </Grid>
  );
};
