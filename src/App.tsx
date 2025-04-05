import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/header/Header";
import { Welcome } from "./components/main/Welcome";

export const App = () => {
  const [openWelcome, setWelcome]  = useState(true);

  return (
    <Box>
      <Header />
      <Outlet />
      {openWelcome && <Welcome setWelcome={setWelcome} />}
    </Box>
  );
};
