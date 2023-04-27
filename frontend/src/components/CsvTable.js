import React from "react";
import {Table} from "@nextui-org/react";

export const CsvTable = ({data, cols}) => {
    return (
        <Table>
            <Table.Header columns={cols}>
                {(column) => (
                    <Table.Column key={column.key}>{column.label}</Table.Column>
                )}
            </Table.Header>
            <Table.Body items={data}>
                {(item) => (
                    <Table.Row key={item[""]}>
                        {(columnKey) => (
                            <Table.Cell>{item[columnKey]}</Table.Cell>
                        )}
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    );
};
