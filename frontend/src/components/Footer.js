import React from "react";
import {Container, Spacer, Text} from "@nextui-org/react";

export const Footer = () => {
    return (<Container justify={"center"}>
        <footer>
            <Text style={{textAlign: "center"}}>Sitio web implementado por Armando Ugalde Velasco y Diego Santiago
                Gutiérrez | 2023</Text>
        </footer>
        <Spacer y={2}/>
    </Container>)
};
