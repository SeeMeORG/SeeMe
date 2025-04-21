import { Box } from "@mui/material";
import { RefObject } from "react";
import { GenericLoader } from "../shared/GenericComponents";

interface VideoBoxProps {
    videoRef: RefObject<HTMLVideoElement | null>; // <-- allow null here
    label: string;
    isLoading?: boolean;
    isMuted?: boolean;
  }

export const GVideo = ({
  videoRef,
  isLoading = false,
  isMuted = false,
}: VideoBoxProps) => {
  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
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
    </Box>
  );
};
