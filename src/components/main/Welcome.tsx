import { Box, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import logo from "../../assets/LOGO.png";
import mannu from "../../assets/MannuGit.jpg";
import vishal from "../../assets/VishalGit.jpg";
import { GenericAvatar } from "../../shared/GenericComponents";
import { IWelcomeProps } from "../../shared/interface";
import { WelcomeContainer } from "../../style/CommonStyles";
import { muiTheme } from "../../style/muiTheme";

const AVATARS = [
  {
    title: "Mannu Jaggi",
    src: mannu,
    ifLeft: true,
  },
  {
    title: "Vishal Kumar",
    src: vishal,
    ifLeft: false,
  },
];

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
          {AVATARS.map((avatar) => (
            <GenericAvatar
              key={avatar.title}
              isLeft={avatar.ifLeft}
              animate={animate}
              src={avatar.src}
              alt={avatar.title}
            />
          ))}

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
