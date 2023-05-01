import React, {useState} from "react";
import {Page} from "../components/Page";
import {Container, Text} from "@nextui-org/react";
import Papa from "papaparse";
import {DatasetDisplay, getHeader} from "../components/DatasetDisplay";
import {InsertCsvForm} from "../components/InsertCsvForm";
import {ErrorModal} from "../components/ErrorModal";
import {LoadingModal} from "../components/LoadingModal";
import {ComponentData} from "../components/ComponentData";
import {ComponentStep} from "../components/ComponentStep";
import {ComponentPlot} from "../components/ComponentPlot";
import {DataPreparationForm} from "../components/DataPreparationForm";

const API = process.env.REACT_APP_API_URL;


export const AnalisisExploratorio = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOutputReady, setIsOutputReady] = useState(false);
    const [isDataPrepReady, setIsDataPrepReady] = useState(false);

    const [csv, setCsv] = useState(null);
    const [head, setHead] = useState(null);
    const [shape, setShape] = useState([]);
    const [types, setTypes] = useState(null);
    const [nullCount, setNullCount] = useState(null);
    const [hist, setHist] = useState(null);
    const [describe, setDescribe] = useState(null);
    const [boxPlots, setBoxPlots] = useState({});
    const [describeObject, setDescribeObject] = useState(null);
    const [categoricalHists, setCategoricalHists] = useState({});
    const [categoricalGroupings, setCategoricalGroupings] = useState({});
    const [correlationMatrix, setCorrelationMatrix] = useState(null);
    const [heatmap, setHeatmap] = useState(null);
    const [trimmedHeatmap, setTrimmedHeatmap] = useState(null);

    const [newNullCount, setNewNullCount] = useState(null);
    const [newBoxPlots, setNewBoxPlots] = useState({});
    const [newCsv, setNewCsv] = useState(null);

    const queryEDA = async (form) => {
        setIsLoading(true);
        setIsOutputReady(false);
        setIsDataPrepReady(false);

        const formData = new FormData(form.current);
        setCsv(formData.get("dataset"));
        try {
            const res = await fetch(API + "analisis-exploratorio", {
                method: "POST", body: formData, rejectUnauthorized: false
            });

            const infoRes = await res.json();

            if (res.ok) {
                const headData = Papa.parse(infoRes["head"], {header: true}).data;
                const shapeData = infoRes["shape"];
                const typesData = Papa.parse(infoRes["types"], {header: true}).data;
                const nullCountData = Papa.parse(infoRes["null_count"], {header: true}).data;
                const histData = infoRes["hist"];
                const describeData = Papa.parse(infoRes["describe"], {header: true}).data;
                const boxPlotsData = infoRes["box_plots"];
                const describeObjectData = infoRes["describe_object"] ?
                    Papa.parse(infoRes["describe_object"], {header: true}).data : null;
                const categoricalHistsData = infoRes["categorical_hists"];
                const categoricalGroupingsData = Object.entries(infoRes["categorical_groupings"]).reduce(
                    (result, [key, value]) => {
                        result[key] = Papa.parse(value, {header: true}).data;
                        return result;
                    }, {});
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
                setErrorMsg("Error en la respuesta del servidor: " + infoRes["error"]);
            }
        } catch (error) {
            setErrorMsg("Error al contactar al servidor");
        }

        setIsLoading(false);
    };

    const queryDataPrep = async (dataPrepRequest) => {
        setIsLoading(true);
        setIsDataPrepReady(false);
        const formData = new FormData();
        formData.append("json", JSON.stringify(dataPrepRequest));
        formData.append("dataset", csv);

        try {
            const res = await fetch(API + "analisis-exploratorio/preparacion-datos", {
                method: "POST", body: formData, rejectUnauthorized: false
            });

            const infoRes = await res.json();

            if (res.ok) {
                const newNullCountData = Papa.parse(infoRes["null_count"], {header: true}).data;
                const newBoxPlotsData = infoRes["box_plots"];
                const newCsvData = Papa.parse(infoRes["new_csv"], {header: true}).data;

                setNewNullCount(newNullCountData);
                setNewBoxPlots(newBoxPlotsData);
                setNewCsv(newCsvData);

                setIsDataPrepReady(true);
            } else {
                setErrorMsg("Error en la respuesta del servidor: " + infoRes["error"]);
            }
        } catch (error) {
            setErrorMsg("Error al contactar al servidor");
        }

        setIsLoading(false);
    };

    return (<Page
        titulo="Análisis Exploratorio de Datos"
        descripcion={"Al utilizar este componente podrás analizar tu dataset para encontrar información relevante, como la estructura de los datos, valores faltantes, valores atípicos, variables correlacionadas, así como llevar a cabo la preparación de datos."}
    >
        <InsertCsvForm executeComponent={queryEDA} isLoading={isLoading}/>

        {errorMsg && (<ErrorModal
            setErrorMsg={setErrorMsg}
            errorMsg={errorMsg}
        />)}

        <LoadingModal visible={isLoading}/>

        {isOutputReady && <Container>


            <ComponentStep title={"Paso 1: Descripción de la estructura de los datos"}
                           description="Antes que nada, es necesario comprender la naturaleza y estructura de nuestro conjunto de datos.">
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
                    title={"Tipos de datos (variables)"}
                    description={"Se muestran los tipos de datos de cada columna (variables y tipos)."}
                    filename={"eda_types"}
                    data={types}/>
            </ComponentStep>


            <ComponentStep title={"Paso 2: Identificación de datos faltantes"}
                           description="Los valores faltantes pueden causar problemas al momento de analizar nuestro dataset.">
                <DatasetDisplay title="Valores nulos"
                                description="Es necesario identificar si nuestro conjunto de datos tiene datos faltantes o nulos. A continuación, se muestra una tabla con el conteo de valores nulos para cada variable."
                                filename={"null_count"}
                                data={nullCount}/>
            </ComponentStep>

            <ComponentStep title={"Paso 3: Detección de valores atípicos"}
                           description="Al igual que los valores faltantes, los valores atípicos pueden causar problemas al momento de analizar nuestro dataset. Se pueden utilizar gráficos para tener una idea general de las distribuciones de los datos, y se sacan estadísticas para resumir los datos. Estas dos estrategias son recomendables y se complementan. La distribución se refiere a cómo se distribuyen los valores en una variable o con qué frecuencia ocurren. Para las variables numéricas, se observa cuántas veces aparecen grupos de números en una columna. Mientras que para las variables categóricas, son las clases de cada columna y su frecuencia.">
                <ComponentPlot title={"Histograma (distribución de variables numéricas)"}
                               description="Para analizar la distribución de variables numéricas, se utiliza un histograma, que agrupa los números en rangos."
                               imgData={hist} alt={"Histograma (distribución de variables numéricas)"}/>

                <DatasetDisplay
                    title={"Resumen estadístico de variables numéricas (describe)"}
                    description={"Se obtienen algunas estadísticas que \"resumen\" las variables numéricas. Se incluye un recuento, media, desviación, valor mínimo, valor máximo, percentil inferior (25%), 50% y percentil superior (75%). Por defecto, el percentil 50 es lo mismo que la mediana. Se observa que para cada variable, el recuento también ayuda a identificar variables con valores perdidos."}
                    filename={"eda_describe"}
                    data={describe}/>

                <ComponentData title="Diagramas para detectar posibles valores atípicos"
                               description="Se generan diagramas de cajas para detectar más fácilmente los valores atípicos:">
                    {Object.entries(boxPlots).map(([key, value]) => {
                        const title = "Diagrama de cajas para variable " + key;
                        return (<ComponentPlot title={title} key={title} imgData={value} alt={title}/>);
                    })}
                </ComponentData>

                {describeObject && <DatasetDisplay
                    title={"Distribución de variables categóricas"}
                    description="Se refiere a la observación de las clases de cada columna (variable) y su frecuencia. Aquí, los gráficos ayudan para tener una idea general de las distribuciones, mientras que las estadísticas dan números reales."
                    filename={"eda_describe_object"}
                    data={describeObject}/>}

                {Object.entries(categoricalHists).map(([key, value]) => {
                    const title = "Histograma de variable categórica " + key;
                    return (<ComponentPlot title={title} key={title} imgData={value} alt={title}/>);
                })}

                {Object.keys(categoricalGroupings).length !== 0 &&
                    (<ComponentData title="Agrupación por variables categóricas"
                                    description="Se agrupan los datos respecto a cada variable categórica, y se calcula la media de las variables numéricas respecto a la variable categórica agrupada.">
                        {Object.entries(categoricalGroupings).map(([key, value]) => {
                            const title = "Medias obtenidas con los datos agrupados respecto a la variable " + key;
                            return (<DatasetDisplay
                                title={title}
                                key={title}
                                filename={"grouped"}
                                data={value}/>);
                        })}
                    </ComponentData>)}
            </ComponentStep>


            <ComponentStep title={"Paso 4: Identificación de relaciones entre pares variables"}
                           description="Es importante comprender qué variables se encuentran relacionadas entre sí para poder extraer información valiosa en futuras etapas del proceso de Minería de Datos.">
                <DatasetDisplay
                    title={"Matriz de correlación"}
                    description="Una matriz de correlaciones es útil para analizar la relación entre las variables numéricas. Una correlación es un valor entre -1 y 1 que equivale a qué tan cerca se mueven simultáneamente los valores de dos variables. Una correlación positiva significa que a medida que una característica aumenta, la otra también aumenta. Una correlación negativa significa que a medida que una característica disminuye, la otra también disminuye. Las correlaciones cercanas a 0 indican una relación débil, mientras que las más cercanas a -1 o 1 significan una relación fuerte."
                    filename={"eda_corr"}
                    data={correlationMatrix}/>

                <ComponentPlot title="Mapa de calor"
                               description="Se muestra el mapa de calor de la matriz obtenida. Los colores cercanos al rojo indican una correlación positiva, proporcional a la intensidad del color, mientras que los colores cercanos al azul indican una correlación negativa, de nueva cuenta proporcional a la intensidad del color, como se muestra en la escala."
                               imgData={heatmap} alt="Mapa de calor"/>
                <ComponentPlot title="Mapa de calor reducido"
                               description={"Se muestra el mapa de calor \"resumido\""}
                               imgData={trimmedHeatmap} alt="Mapa de calor reducido"/>
            </ComponentStep>


            <ComponentStep title={"Paso 5: Preparación de los datos"}
                           description="Para que nuestro conjunto de datos tenga datos íntegros, completos y correctos, es posible remover las entradas que posiblemente afecten a este objetivo. Dos de estos casos podrían tratarse de valores atípicos y nulos.">
                <DataPreparationForm executeComponent={queryDataPrep}
                                     header={correlationMatrix ? getHeader(correlationMatrix) : []}/>

                {isDataPrepReady && <Container>
                    <DatasetDisplay title="Valores nulos actualizados"
                                    description="Si se eliminaron los valores nulos, se puede observar que el conteo para todas las variables es de 0."
                                    filename={"new_null_count"}
                                    data={newNullCount}/>

                    {Object.keys(newBoxPlots).length !== 0 &&
                        (<ComponentData title="Diagramas para detectar posibles valores atípicos"
                                        description="Se observa que ahora los puntos se encuentran distribuidos de mejor forma en los diagramas de cajas.">
                            {Object.entries(newBoxPlots).map(([key, value]) => {
                                const title = "Diagrama de cajas para variable " + key;
                                return (<ComponentPlot title={title} key={title} imgData={value} alt={title}/>);
                            })}
                        </ComponentData>)}

                    <DatasetDisplay title="Dataset preparado"
                                    description="Ahora puedes obtener tu dataset listo para las futuras etapas del proceso de Minería de Datos."
                                    filename={"prepared_dataset"}
                                    data={newCsv}
                                    hidden/>
                </Container>}
            </ComponentStep>
        </Container>}
    </Page>);
};
