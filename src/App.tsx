import { Box } from "@mui/material";
import { Header } from "./components/header/Header";
import { MainBody } from "./components/main/MainBody";
import { useState } from "react";
import { Welcome } from "./components/main/Welcome";

export const App = () => {
  const [openWelcome, setWelcome]  = useState(true);

  return (
    <Box>
      <Header />
      <MainBody />
      {openWelcome && <Welcome setWelcome={setWelcome} />}
    </Box>
  );
};
