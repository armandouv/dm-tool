import React from "react";
import {Grid} from "@nextui-org/react";
import {Page} from "../components/Page";
import {StartCard} from "../components/StartCard";
import imgEda from "../assets/img/eda.png";
import imgPca from "../assets/img/pca.png";

export const Inicio = () => {

    return (<Page
        titulo={"Inicio"}
        descripcion={"Elige un componente a ejecutar del proceso de Minería de Datos:"}>
        <Grid.Container gap={2} justify="center">
            <Grid xs={12} sm={6} md={4}>
                <StartCard
                    titulo="Análisis Exploratorio de Datos"
                    imagen={imgEda}
                    link="/analisis-exploratorio"
                />
            </Grid>
            <Grid xs={12} sm={6} md={4}>
                <StartCard
                    titulo="Análisis de Componentes Principales"
                    imagen={imgPca}
                    link="/analisis-componentes-principales"
                />
            </Grid>
        </Grid.Container>
    </Page>);
};
