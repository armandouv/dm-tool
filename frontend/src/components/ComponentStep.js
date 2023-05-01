import {Container, Spacer, Text} from "@nextui-org/react";
import React from "react";


export const ComponentStep = ({title, description, children}) => {
    return (
        <Container>
            <Spacer y={5}/>
            <Text h2>{title}</Text>
            <Text>{description}</Text>
            {children}
        </Container>
    )
};
