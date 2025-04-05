import { Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { WelcomeContainer } from "../../style/CommonStyles";
import { muiTheme } from "../../style/muiTheme";
import { IWelcomeProps } from "../interface";

export const Welcome = ({ setWelcome }: IWelcomeProps) => {
  const [count, setCount] = useState(4);

  useEffect(() => {
    setTimeout(() => {
      setCount(count - 1);
      if (count == 0) {
        setWelcome(false);
      }
    }, 50000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <Dialog open fullScreen>
      <WelcomeContainer bgcolor="background.default">
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
      </WelcomeContainer>
    </Dialog>
  );
};
