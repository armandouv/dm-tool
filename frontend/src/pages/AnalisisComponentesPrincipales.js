import React, {useState} from "react";
import {Page} from "../components/Page";
import {Container, Radio, Text} from "@nextui-org/react";
import Papa from "papaparse";
import {DatasetDisplay} from "../components/DatasetDisplay";
import {InsertCsvForm} from "../components/InsertCsvForm";
import {ErrorModal} from "../components/ErrorModal";
import {LoadingModal} from "../components/LoadingModal";
import {ComponentData} from "../components/ComponentData";
import {ComponentStep} from "../components/ComponentStep";
import {ComponentPlot} from "../components/ComponentPlot";

const API = process.env.REACT_APP_API_URL;


export const AnalisisComponentesPrincipales = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOutputReady, setIsOutputReady] = useState(false);

    const [standardization, setStandardization] = useState("Standard");

    const [csv, setCsv] = useState(null);
    const [head, setHead] = useState(null);
    const [correlationMatrix, setCorrelationMatrix] = useState([]);
    const [shape, setShape] = useState([]);
    const [trimmedHeatmap, setTrimmedHeatmap] = useState(null);
    const [standardizedDataset, setStandardizedDataset] = useState(null);
    const [eigenvectors, setEigenvectors] = useState(null);
    const [explainedVariances, setExplainedVariances] = useState(null);
    const [candidateVariances, setCandidateVariances] = useState(null);
    const [cumulativeVariancesGraph, setCumulativeVariancesGraph] = useState(null);
    const [relevanceProportion, setRelevanceProportion] = useState(null);
    const [componentsLoad, setComponentsLoad] = useState(null);
    const [absComponentsLoad, setAbsComponentsLoad] = useState(null);

    const queryPCA = async (form) => {
        setIsLoading(true);
        setIsOutputReady(false);
        //setIsDataPrepReady(false);

        const formData = new FormData(form.current);
        setCsv(formData.get("dataset"));
        formData.append("min_max", standardization === "MinMax" ? "true" : "false");

        try {
            const res = await fetch(API + "analisis-componentes-principales", {
                method: "POST", body: formData, rejectUnauthorized: false
            });

            const infoRes = await res.json();

            if (res.ok) {
                const headData = Papa.parse(infoRes["head"], {header: true}).data;
                const shapeData = infoRes["shape"];
                const correlationMatrixData = Papa.parse(infoRes["correlation_matrix"], {header: true}).data;
                const trimmedHeatmapData = infoRes["trimmed_heatmap"];
                const standardizedDatasetData = Papa.parse(infoRes["standardized_dataset"], {header: true}).data;
                const eigenvectorsData = infoRes["eigenvectors"];
                const explainedVariancesData = infoRes["explained_variances"];
                const candidateVariancesData = infoRes["candidate_variances"];
                const cumulativeVariancesGraphData = infoRes["cumulative_variances_graph"];
                const relevanceProportionData = Papa.parse(infoRes["relevance_proportion"], {header: true}).data;
                const componentsLoadData = Papa.parse(infoRes["components_load"], {header: true}).data;
                const absComponentsLoadData = Papa.parse(infoRes["abs_components_load"], {header: true}).data;

                setHead(headData);
                setShape(shapeData);
                setCorrelationMatrix(correlationMatrixData);
                setTrimmedHeatmap(trimmedHeatmapData);
                setStandardizedDataset(standardizedDatasetData);
                setEigenvectors(eigenvectorsData);
                setExplainedVariances(explainedVariancesData);
                setCandidateVariances(candidateVariancesData);
                setCumulativeVariancesGraph(cumulativeVariancesGraphData);
                setRelevanceProportion(relevanceProportionData);
                setComponentsLoad(componentsLoadData);
                setAbsComponentsLoad(absComponentsLoadData);

                setIsOutputReady(true);
            } else {
                setErrorMsg("Error en la respuesta del servidor: " + infoRes["error"]);
            }
        } catch (error) {
            setErrorMsg("Error al contactar al servidor");
        }

        setIsLoading(false);
    };

    return (<Page
        titulo="Análisis de Componentes Principales"
        descripcion={"El análisis de componentes principales (ACP o PCA, Principal Component Analysis) es un algoritmo para " +
            "reducir la cantidad de variables de conjuntos de datos, mientras se conserva la mayor cantidad de " +
            "información posible. " +
            "Estos componentes principales (vectores o factores) son combinaciones lineales, no correlacionadas entre sí, " +
            "que retienen la mayor cantidad de varianza. El dataset no debe contener valores nulos, por lo que se " +
            "recomienda realizar el proceso de EDA antes."}
    >

        <InsertCsvForm executeComponent={queryPCA} isLoading={isLoading}>
            <Radio.Group label="Estandarización" value={standardization} onChange={setStandardization}>
                <Radio size="sm" value="Standard">StandardScaler</Radio>
                <Radio size="sm" value="MinMax">MinMaxScaler</Radio>
            </Radio.Group>
        </InsertCsvForm>

        {errorMsg && (<ErrorModal
            setErrorMsg={setErrorMsg}
            errorMsg={errorMsg}
        />)}

        <LoadingModal visible={isLoading}/>

        {isOutputReady && <Container>

            <ComponentStep title={"Paso 1: Evidencia de variables posiblemente correlacionadas."}
                           description="Se describe brevemente la estructura de los datos y se obtiene su matriz de correlaciones para encontrar variables relacionadas entre sí.">
                <DatasetDisplay
                    title={"Parte superior del dataset (head)"}
                    description={"Se muestran algunas filas del dataset para observar su estructura"}
                    filename={"eda_head"}
                    data={head}/>

                <ComponentData title={"Shape (forma de los datos)"}
                               description={"Se muestra la estructura general del conjunto de datos, incluyendo la cantidad de filas y columnas que tiene."}>
                    <Text><Text b>Filas:</Text> {shape[0]}</Text>
                    <Text><Text b>Columnas:</Text> {shape[1]}</Text>
                </ComponentData>

                <DatasetDisplay
                    title={"Matriz de correlación"}
                    description="Una matriz de correlaciones es útil para analizar la relación entre las variables numéricas. Una correlación es un valor entre -1 y 1 que equivale a qué tan cerca se mueven simultáneamente los valores de dos variables. Una correlación positiva significa que a medida que una característica aumenta, la otra también aumenta. Una correlación negativa significa que a medida que una característica disminuye, la otra también disminuye. Las correlaciones cercanas a 0 indican una relación débil, mientras que las más cercanas a -1 o 1 significan una relación fuerte."
                    filename={"eda_corr"}
                    data={correlationMatrix}/>

                <ComponentPlot title="Mapa de calor reducido"
                               description={"Se muestra el mapa de calor \"resumido\""}
                               imgData={trimmedHeatmap} alt="Mapa de calor reducido"/>

            </ComponentStep>
        </Container>}
    </Page>);
};
