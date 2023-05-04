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
    const [standardizedDatasetHead, setStandardizedDatasetHead] = useState(null);
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
                const standardizedDatasetHeadData = Papa.parse(infoRes["standardized_dataset_head"],
                    {header: true}).data;
                const eigenvectorsData = Papa.parse(infoRes["eigenvectors"], {header: true}).data;
                const explainedVariancesData = Papa.parse(infoRes["explained_variances"], {header: true}).data;
                const candidateVariancesData = Papa.parse(infoRes["candidate_variances"], {header: true}).data;
                const cumulativeVariancesGraphData = infoRes["cumulative_variances_graph"];
                const relevanceProportionData = Papa.parse(infoRes["relevance_proportion"], {header: true}).data;
                const componentsLoadData = Papa.parse(infoRes["components_load"], {header: true}).data;
                const absComponentsLoadData = Papa.parse(infoRes["abs_components_load"], {header: true}).data;

                setHead(headData);
                setShape(shapeData);
                setCorrelationMatrix(correlationMatrixData);
                setTrimmedHeatmap(trimmedHeatmapData);
                setStandardizedDataset(standardizedDatasetData);
                setStandardizedDatasetHead(standardizedDatasetHeadData);
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
                    filename={"pca_head"}
                    data={head}/>

                <ComponentData title={"Shape (forma de los datos)"}
                               description={"Se muestra la estructura general del conjunto de datos, incluyendo la cantidad de filas y columnas que tiene."}>
                    <Text><Text b>Filas:</Text> {shape[0]}</Text>
                    <Text><Text b>Columnas:</Text> {shape[1]}</Text>
                </ComponentData>

                <DatasetDisplay
                    title={"Matriz de correlación"}
                    description="Una matriz de correlaciones es útil para analizar la relación entre las variables numéricas. Una correlación es un valor entre -1 y 1 que equivale a qué tan cerca se mueven simultáneamente los valores de dos variables. Una correlación positiva significa que a medida que una característica aumenta, la otra también aumenta. Una correlación negativa significa que a medida que una característica disminuye, la otra también disminuye. Las correlaciones cercanas a 0 indican una relación débil, mientras que las más cercanas a -1 o 1 significan una relación fuerte."
                    filename={"pca_corr"}
                    data={correlationMatrix}/>

                <ComponentPlot title="Mapa de calor reducido"
                               description={"Se muestra el mapa de calor \"resumido\""}
                               imgData={trimmedHeatmap} alt="Mapa de calor reducido"/>

            </ComponentStep>

            <ComponentStep title={"Paso 2: Se hace una estandarización de los datos."}
                           description="El objetivo de este paso es estandarizar (escalar o normalizar) el rango de las variables iniciales, para que cada una de éstas contribuya por igual en el análisis. La razón por la que es fundamental realizar la estandarización, antes de PCA, es que si existen diferencias entre los rangos de las variables iniciales, aquellas variables con rangos más grandes predominarán sobre las que tienen rangos pequeños (por ejemplo, una variable que oscila entre 0 y 100 dominará sobre una que oscila entre 0 y 1), lo que dará lugar a resultados sesgados. Por lo tanto, transformar los datos a escalas comparables puede evitar este problema.">
                <DatasetDisplay
                    title={"Matriz estandarizada (head)"}
                    description="Se muestran los datos estandarizados (únicamente de las variables numéricas, y sólo algunas entradas para observar su comportamiento)"
                    filename={"standardized_dataset_head"}
                    data={standardizedDatasetHead}/>

                <DatasetDisplay title="Matriz estandarizada (completa)"
                                description="Puedes descargar la matriz estandarizada completa si lo requieres."
                                filename={"standardized_dataset"}
                                data={standardizedDataset}
                                hidden/>
            </ComponentStep>

            <ComponentStep
                title={"Pasos 3 y 4: Se calcula la matriz de covarianzas o correlaciones, y se calculan los componentes (eigen-vectores) y la varianza (eigen-valores)."}
                description="Se calculan los componentes (eigen-vectores) y la varianza (eigen-valores), a partir de la matriz de covarianzas o correlaciones. Se pueden tener tantos componentes como variables, pero se busca los ejes que concentren la mayor cantidad de varianza en los datos. Por ejemplo, a partir de 10 variables se pueden generar 10 componentes. En la práctica, se elige un número de componentes principales que retienen un mayor porcentaje de la información original.">
                <DatasetDisplay
                    title={"Eigenvectores"}
                    description="Se muestran los eigenvectores obtenidos "
                    filename={"eigenvectors"}
                    data={eigenvectors}/>
            </ComponentStep>

            <ComponentStep title={"Paso 5: Se decide el número de componentes principales"}
                           description="Se decide el número de componentes mediante una evaluación de las varianzas, esto es:
                           1. Se calcula el porcentaje de relevancia, es decir, entre el 75 y 90% de varianza total.
                           2. Se identifica mediante una gráfica el grupo de componentes con mayor varianza.">
                <DatasetDisplay
                    title={"Varianzas ordenadas de mayor a menor"}
                    description="Se muestran las varianzas obtenidas para cada componente, ordenadas de mayor a menor."
                    filename={"explained_variances"}
                    data={explainedVariances}/>

                <DatasetDisplay
                    title={"Varianzas acumuladas candidatas"}
                    description="A continuación, se muestra el número de componentes a utilizar que cumple con el criterio de la varianza acumulada entre el 75 y 90% de la varianza total. Por lo tanto, el número mostrado en la primera columna es un candidato para elegir el número de componentes."
                    filename={"candidate_variances"}
                    data={candidateVariances}/>

                <ComponentPlot title="Gráfica de varianza acumulada"
                               description={"Se muestra la gráfica de varianza acumulada respecto al número de componentes a utilizar"}
                               imgData={cumulativeVariancesGraph} alt="Gráfica de varianza acumulada"/>
            </ComponentStep>

            <ComponentStep title={"Paso 6: Se examina la proporción de relevancias –cargas–"}
                           description="Se revisan los valores absolutos de los componentes principales seleccionados. Cuanto mayor sea el valor absoluto, más importante es esa variable en el componente principal.">
                <DatasetDisplay
                    title={"Proporción de relevancia"}
                    description="Se muestran los valores absolutos de los eigenvectores obtenidos previamente, para analizar la proporción de relevancia de cada componente."
                    filename={"relevance_proportion"}
                    data={relevanceProportion}/>
                <DatasetDisplay
                    title={"Carga de componentes"}
                    description="Se muestran los eigenvectores obtenidos previamente, pero ahora con los nombres respectivos para cada columna."
                    filename={"components_load"}
                    data={componentsLoad}/>
                <DatasetDisplay
                    title={"Carga de componentes (valores absolutos)"}
                    description="Se muestran los eigenvectores obtenidos previamente, con los nombres respectivos para cada columna y mostrando valores absolutos únicamente."
                    filename={"components_load_abs"}
                    data={absComponentsLoad}/>
            </ComponentStep>
        </Container>}
    </Page>);
};
