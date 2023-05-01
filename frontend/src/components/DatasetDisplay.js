import {Container, Spacer, Text} from "@nextui-org/react";
import {CsvTable} from "./CsvTable";
import {CSVLink} from "react-csv";
import React from "react";


function getHeader(parsedData) {
    const tableHeaders = [];
    const arrayHead = Object.keys(parsedData[0]);
    for (const i in arrayHead) {
        tableHeaders.push({
            key: arrayHead[i],
            label: arrayHead[i].toUpperCase(),
        });
    }
    return tableHeaders;
}


export const DatasetDisplay = ({title, filename, data}) => {

    return (
        <Container>
            <Spacer y={2}/>
            <Text h3>
                {title}
            </Text>
            <CSVLink
                data={data}
                target="_blank"
                filename={
                    filename +
                    ".csv"
                }
            >
                Descargar CSV
                <box-icon
                    type="solid"
                    name="download"
                ></box-icon>
            </CSVLink>
            <CsvTable
                data={data}
                cols={getHeader(data)}
            />
        </Container>
    )

};
