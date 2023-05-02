import * as React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Inicio} from "./pages/Inicio";
import {PageNotFound} from "./pages/PageNotFound";
import {NextUIProvider} from "@nextui-org/react";
import {Footer} from "./components/Footer";
import {AnalisisExploratorio} from "./pages/AnalisisExploratorio";
import {SiteNavbar} from "./components/SiteNavbar/SiteNavbar";
import {AnalisisComponentesPrincipales} from "./pages/AnalisisComponentesPrincipales";


function App() {
    return (<NextUIProvider>
        <BrowserRouter>
            <SiteNavbar/>
            <Routes>
                <Route
                    path="/"
                    element={<Inicio/>}
                />
                <Route
                    path="/analisis-exploratorio"
                    element={<AnalisisExploratorio/>}
                />
                <Route
                    path="/analisis-componentes-principales"
                    element={<AnalisisComponentesPrincipales/>}
                />
                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    </NextUIProvider>);

}

export default App;