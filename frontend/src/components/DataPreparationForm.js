import {Badge, Button, Grid, Input, Spacer, Switch} from "@nextui-org/react";
import React, {useCallback, useState} from "react";
import {ComponentData} from "./ComponentData";


export function DataPreparationForm({executeComponent, header}) {
    const [deleteNulls, setDeleteNulls] = useState(true);
    const [attributes, setAttributes] = useState({});

    // TODO: Make this more efficient
    const updateAttributes = useCallback((attribute, e) => {
        setAttributes((prevAttributes) => {
            const newAttributes = {...prevAttributes};
            if (!newAttributes[attribute]) newAttributes[attribute] = {};

            const inputValue = e.target.value.trim();
            const parsedValue = parseFloat(inputValue);

            if (inputValue !== "" && typeof parsedValue === "number" && !isNaN(parsedValue)) {
                newAttributes[attribute][e.target.name] = parsedValue;
            } else if (e.target.name in newAttributes[attribute]) {
                delete newAttributes[attribute][e.target.name];
            }

            if (Object.keys(newAttributes[attribute]).length === 0) {
                delete newAttributes[attribute];
            }

            return newAttributes;
        });
    }, []);

    return (
        <form>
            <ComponentData title={"Eliminar valores nulos"}
                           description={"Si deseas eliminar los valores nulos encontrados previamente, activa el switch de abajo."}>
                <Switch initialChecked size={"lg"} onChange={e => setDeleteNulls(e.target.checked)}/>
            </ComponentData>

            <ComponentData title={"Eliminar valores atípicos"}
                           description={"Especifica los límites inferiores y superiores para las variables numéricas que desees para eliminar valores atípicos."}>
                <Spacer y={1}/>
                {header.map(({key}) => (
                    key !== "" ? <div key={key}>
                        <Grid.Container gap={4} alignItems="flex-end">
                            <Grid>
                                <Badge variant="bordered" size={"xl"} color={"secondary"} display={"inline-block"}>
                                    {key}
                                </Badge>
                            </Grid>
                            <Grid>
                                <Input name="lower" label="Límite inferior" type="number" size={"lg"} bordered
                                       rounded onChange={e => updateAttributes(key, e)}/>
                            </Grid>
                            <Grid>
                                <Input name="upper" label="Límite superior" type="number" size={"lg"} bordered
                                       rounded onChange={e => updateAttributes(key, e)}/>
                            </Grid>
                        </Grid.Container>
                        <Spacer y={2}/>
                    </div> : null
                ))
                }
                <Spacer y={2}/>

                <Button
                    flat
                    size={"lg"}
                    color="primary"
                    type="button"
                    onPress={() => executeComponent({delete_nulls: deleteNulls, attributes: attributes})}
                >
                    Ejecutar
                </Button>
            </ComponentData>
        </form>
    );
}
