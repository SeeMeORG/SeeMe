import { AppBar, Toolbar } from "@mui/material";
import logo from "../../assets/LOGO.png";

export const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <img height={40} src={logo} />
      </Toolbar>
    </AppBar>
  );
};
