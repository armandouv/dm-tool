import {CsvTable} from "./CsvTable";
import {CSVLink} from "react-csv";
import React from "react";
import {ComponentData} from "./ComponentData";


export function getHeader(parsedData) {
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


export const DatasetDisplay = ({title, description, filename, data, hidden}) => {

    return (
        <ComponentData title={title} description={description}>
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
            {!hidden && <CsvTable
                data={data}
                cols={getHeader(data)}
            />}
        </ComponentData>
    )
};
