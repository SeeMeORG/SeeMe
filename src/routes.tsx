import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { App } from "./App"
import { MainBody } from "./components/main/MainBody"

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<App />}>
                <Route index element={<MainBody />} />
            </Route>
        </Route>
    ))