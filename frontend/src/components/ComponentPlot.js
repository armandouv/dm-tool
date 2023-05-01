import {Image} from "@nextui-org/react";
import React from "react";
import {ComponentData} from "./ComponentData";


export const ComponentPlot = ({title, description, imgData, alt}) => {
    return (
        <ComponentData title={title}
                       description={description}>
            <Image src={`data:image/png;base64,${imgData}`}
                   alt={alt}/>
        </ComponentData>
    )
};
