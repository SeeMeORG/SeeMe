import { Box, styled } from "@mui/material";
import { muiTheme } from "./muiTheme";

export const WelcomeContainer = styled(Box)`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledVideoContainer = styled(Box)`
  height: 100%;
  position: relative;
  display: flex;
  alignitems: center;
  justifycontent: center;
  overflow: hidden;
  background-color: ${muiTheme.palette.info.light};
  color: ${muiTheme.palette.text.secondary}
`;

export const StyledNameContainer = styled(Box)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${muiTheme.palette.info.light};
  color: ${muiTheme.palette.background.paper};
`;
