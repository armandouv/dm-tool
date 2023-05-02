import {Button, Container, Input, Spacer} from "@nextui-org/react";
import {PaperUpload} from "react-iconly";
import React, {useRef, useState} from "react";


export function InsertCsvForm({executeComponent, children}) {
    const [filenameLabel, setFilenameLabel] = useState("");

    const inputFile = useRef(null);
    const form = useRef(null);

    const selectFile = () => {
        inputFile.current.click();
    };
    const handleFileInput = (e) => {
        const filepath = inputFile.current.value.split("\\");
        const filename = filepath[filepath.length - 1];
        setFilenameLabel(filename);
    };
    const validateFileExt = (value) => {
        return value.match(/.\.csv$/);
    };
    const fileHelper = React.useMemo(() => {
        if (filenameLabel === "")
            return {
                text: "",
                color: "",
            };
        const fileIsValid = validateFileExt(filenameLabel);
        return {
            text: fileIsValid
                ? "Archivo .csv válido"
                : "Se debe ingresar un archivo .csv",
            color: fileIsValid ? "success" : "error",
        };
    }, [filenameLabel]);


    return (
        <Container>
            <form ref={form}>
                <input
                    ref={inputFile}
                    type="file"
                    name="dataset"
                    style={{display: "none"}}
                    onChange={handleFileInput}
                ></input>
                <Button onClick={selectFile}>
                    Selecciona un archivo .csv para analizar
                    <Spacer x={0.5}/>
                    <PaperUpload set="light" primaryColor="white"/>
                </Button>
                <Spacer y={1}/>
                <Input
                    readOnly
                    labelLeft="Archivo"
                    initialValue={filenameLabel}
                    helperColor={fileHelper.color}
                    status={fileHelper.color}
                    helperText={fileHelper.text}
                    style={{cursor: "not-allowed"}}
                />
                <Spacer y={1.5}/>
                {children}
                <Spacer y={1}/>
                <Button
                    flat
                    size={"lg"}
                    color="primary"
                    disabled={fileHelper.color !== "success"}
                    type="button"
                    onPress={() => executeComponent(form)}
                >
                    Ejecutar
                </Button>
            </form>

        </Container>
    );
}
