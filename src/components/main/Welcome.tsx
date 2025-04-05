import { Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { WelcomeContainer } from "../../style/CommonStyles";
import { muiTheme } from "../../style/muiTheme";
import { IWelcomeProps } from "../interface";

export const Welcome = ({ setWelcome }: IWelcomeProps) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    setTimeout(() => {
      setCount(count - 1);
      if (count == 0) {
        setWelcome(false);
      }
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <Dialog open fullScreen>
      <WelcomeContainer
        sx={{ background: muiTheme.palette.background.default }}
      >
        <Typography
          variant="h4"
          color="primary.dark"
          fontWeight="bold"
          textAlign="center"
          sx={{
            textShadow: `0 0 5px ${muiTheme.palette.text.secondary}`,
          }}
        >
          Welcome Getting ready in {count}
        </Typography>
      </WelcomeContainer>
    </Dialog>
  );
};
