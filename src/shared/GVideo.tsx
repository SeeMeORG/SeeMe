import { Box, Typography } from "@mui/material";
import { RefObject } from "react";
import { muiTheme } from "../style/muiTheme";
import { GenericLoader } from "../shared/GenericComponents";

interface VideoBoxProps {
    videoRef: RefObject<HTMLVideoElement | null>; // <-- allow null here
    label: string;
    isLoading?: boolean;
    isMuted?: boolean;
  }

export const GVideo = ({
  videoRef,
  label,
  isLoading = false,
  isMuted = false,
}: VideoBoxProps) => {
  return (
    <Box
     
    >
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
        bottom={80}
        left={12}
        bgcolor={muiTheme.palette.info.light}
        px={2}
        py={0.5}
        borderRadius={2}
        sx={{
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography
          color={muiTheme.palette.background.paper}
          fontWeight="bold"
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};
