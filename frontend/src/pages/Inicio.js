import React from "react";
import {Grid} from "@nextui-org/react";
import {Page} from "../components/Page";
import {StartCard} from "../components/StartCard";
import imgEda from "../assets/img/eda.png";

export const Inicio = () => {

    return (<Page
        titulo={"DM-Tool"}
        descripcion={"Utilidades de Minería de Datos a tu alcance"}>
        <Grid.Container gap={2} justify="center">
            <Grid xs={12} sm={6} md={4}>
                <StartCard
                    titulo="Análisis Exploratorio de Datos"
                    imagen={imgEda}
                    link="/analisis-exploratorio"
                />
            </Grid>
        </Grid.Container>
    </Page>);
};
