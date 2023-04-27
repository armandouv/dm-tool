import React, {useState} from "react";
import {Page} from "../components/Page";
import {Container, Text} from "@nextui-org/react";
import Papa from "papaparse";
import {DatasetDisplay} from "../components/DatasetDisplay";
import {InsertCsvForm} from "../components/InsertCsvForm";
import {ErrorModal} from "../components/ErrorModal";
import {LoadingModal} from "../components/LoadingModal";
import {ComponentData} from "../components/ComponentData";

const API = process.env.REACT_APP_API_URL;


export const AnalisisExploratorio = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOutputReady, setIsOutputReady] = useState(false);

    const [head, setHead] = useState("");
    const [shape, setShape] = useState([]);
    const [types, setTypes] = useState("");
    const [nullCount, setNullCount] = useState("");
    const [hist, setHist] = useState(null);
    const [describe, setDescribe] = useState("");
    const [boxPlots, setBoxPlots] = useState([]);
    const [describeObject, setDescribeObject] = useState("");
    const [categoricalHists, setCategoricalHists] = useState([]);
    const [categoricalGroupings, setCategoricalGroupings] = useState([]);
    const [correlationMatrix, setCorrelationMatrix] = useState("");
    const [heatmap, setHeatmap] = useState(null);
    const [trimmedHeatmap, setTrimmedHeatmap] = useState(null);

    const queryEDA = async (form) => {
        setIsLoading(true);

        const formData = new FormData(form.current);
        const res = await fetch(API + "analisis-exploratorio", {
            method: "POST", body: formData, rejectUnauthorized: false
        });
        const infoRes = await res.json();

        if (!("error" in infoRes)) {
            const headData = Papa.parse(infoRes["head"], {header: true}).data;
            const shapeData = infoRes["shape"];
            const typesData = Papa.parse(infoRes["types"], {header: true}).data;
            const nullCountData = Papa.parse(infoRes["null_count"], {header: true}).data;
            const histData = infoRes["hist"];
            const describeData = Papa.parse(infoRes["describe"], {header: true}).data;
            const boxPlotsData = infoRes["box_plots"];
            const describeObjectData = Papa.parse(infoRes["describe_object"], {header: true}).data;
            const categoricalHistsData = infoRes["categorical_hists"];
            const categoricalGroupingsData = infoRes["categorical_groupings"];
            const correlationMatrixData = Papa.parse(infoRes["correlation_matrix"], {header: true}).data;
            const heatmapData = infoRes["heatmap"];
            const trimmedHeatmapData = infoRes["trimmed_heatmap"];


            setHead(headData);
            setShape(shapeData);
            setTypes(typesData);
            setNullCount(nullCountData);
            setHist(histData);
            setDescribe(describeData);
            setBoxPlots(boxPlotsData);
            setDescribeObject(describeObjectData);
            setCategoricalHists(categoricalHistsData);
            setCategoricalGroupings(categoricalGroupingsData);
            setCorrelationMatrix(correlationMatrixData);
            setHeatmap(heatmapData);
            setTrimmedHeatmap(trimmedHeatmapData);

            setIsOutputReady(true);

        } else {
            setErrorMsg(infoRes["error"]);
            setIsOutputReady(false);
        }
        setIsLoading(false);
    };

    return (<Page
        titulo="Análisis Exploratorio de Datos"
        descripcion={"Al utilizar este componente podrás analizar tu dataset para encontrar información relevante, como " +
            "la estructura de los datos, valores faltantes, valores atípicos, variables correlacionadas, así como " +
            "llevar a cabo la preparación de datos."}
    >
        <InsertCsvForm executeComponent={queryEDA} isLoading={isLoading}/>

        {errorMsg && (<ErrorModal
            setErrorMsg={setErrorMsg}
            errorMsg={errorMsg}
        />)}

        <LoadingModal visible={isLoading}/>

        {isOutputReady && <Container>
            <DatasetDisplay
                title={"Parte superior del dataset (head)"}
                filename={"eda_head"}
                data={head}/>

            <ComponentData title={"Shape"}>
                <Text><Text b>Filas:</Text> {shape[0]}</Text>
                <Text><Text b>Columnas:</Text> {shape[1]}</Text>
            </ComponentData>

            <DatasetDisplay title="Valores nulos"
                            filename={"null_count"}
                            data={nullCount}/>

            <DatasetDisplay
                title={"Diccionario de datos"}
                filename={"eda_types"}
                data={types}/>

            <DatasetDisplay
                title={"Describe"}
                filename={"eda_describe"}
                data={describe}/>

            <DatasetDisplay
                title={"Describe object"}
                filename={"eda_describe_object"}
                data={describeObject}/>

            <DatasetDisplay
                title={"Matriz de correlación"}
                filename={"eda_corr"}
                data={correlationMatrix}/>
        </Container>}
    </Page>);
};
