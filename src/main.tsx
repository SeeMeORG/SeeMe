import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import { Provider } from "react-redux";
import { muiTheme } from "./style/muiTheme.ts";
import { store } from "./features/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <RouterProvider router={routes} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
