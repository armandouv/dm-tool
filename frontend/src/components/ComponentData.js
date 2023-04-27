import {Container, Spacer, Text} from "@nextui-org/react";
import React from "react";


export const ComponentData = ({title, children}) => {
    return (
        <Container>
            <Spacer y={2}/>
            <Text h3>{title}</Text>
            {children}
        </Container>
    )
};
