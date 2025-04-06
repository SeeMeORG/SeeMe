import { Avatar, Box, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import logo from "../../assets/LOGO.png";
import mannu from "../../assets/MannuGit.jpg";
import vishal from "../../assets/VishalGit.jpg";
import { WelcomeContainer } from "../../style/CommonStyles";
import { muiTheme } from "../../style/muiTheme";
import { IWelcomeProps } from "../interface";

export const Welcome = ({ setWelcome }: IWelcomeProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setWelcome(false);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open fullScreen>
      <WelcomeContainer
        sx={{ background: muiTheme.palette.background.default }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100vh",
            backgroundColor: "transparent",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 1s ease-in-out",
              transform: {
                xs: animate
                  ? "translate(-50%, -250%)"
                  : "translate(-50%, -100%)",
                md: animate
                  ? "translate(-600%, -50%)"
                  : "translate(-100%, -50%)",
              },
            }}
          >
            <Avatar
              src={mannu}
              alt="Mannu Jaggi"
              sx={{ width: 70, height: 70 }}
            />
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 1s ease-in-out",
              transform: {
                xs: animate ? "translate(-50%, 150%)" : "translate(-50%, 0%)",
                md: animate ? "translate(600%, -50%)" : "translate(0%, -50%)",
              },
            }}
          >
            <Avatar
              src={vishal}
              alt="Vishal Kumar"
              sx={{ width: 70, height: 70 }}
            />
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: animate
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0)",
              transition: "transform 0.8s ease-in-out 0.4s",
            }}
          >
            <img height={100} src={logo} />
          </Box>
        </Box>
      </WelcomeContainer>
    </Dialog>
  );
};
