import React from "react";
import {Container, Spacer, Text} from "@nextui-org/react";

export const Page = ({titulo, descripcion, children}) => {

    return (
        <Container>
            <Spacer y={3}/>
            <section>
                <Text h1>{titulo}</Text>
                <Text>{descripcion}</Text>
                <Spacer y={3}/>
                {children}
            </section>
            <Spacer y={3}/>
        </Container>
    );
}