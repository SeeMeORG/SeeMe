import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { App } from "./App";
import { MainBody } from "./components/main/MainBody";
import { NotFound } from "./components/main/NotFound";

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
        <Route index element={<MainBody />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
);
