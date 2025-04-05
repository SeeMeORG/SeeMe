import { Box, Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import video from "../../assets/WelcomeVideo.mp4";
import { muiTheme } from "../../style/muiTheme";
import { IWelcomeProps } from "../interface";

export const Welcome = ({ setWelcome }: IWelcomeProps) => {
  const [count, setCount] = useState(10);

  useEffect(() => {
    setTimeout(() => {
      setCount(count - 1);
      if (count == 0) {
        setWelcome(false);
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <Dialog open fullScreen>
      <Box bgcolor="primary.main" width="100%" height="100%">
        <video
          autoPlay
          muted
          loop
          width="100%"
          height="100%"
          style={{ position: "fixed" }}
        >
          <source src={video} type="video/mp4" />
        </video>
        <Box position="fixed" bottom={300} right={400}>
          <Typography
            variant="h4"
            color="primary.dark"
            fontWeight="bold"
            textAlign="center"
            sx={{
              textShadow: `0 0 5px ${muiTheme.palette.text.secondary}`,
            }}
          >
            Welcome
          </Typography>
          <Typography
            variant="h4"
            color="primary.dark"
            fontWeight="bold"
            sx={{
              textShadow: `0 0 5px ${muiTheme.palette.text.secondary}`,
            }}
          >
            Getting ready in {count}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};
