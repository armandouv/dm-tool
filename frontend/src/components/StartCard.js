import {Card, Row, Text} from "@nextui-org/react";

import {useNavigate} from "react-router-dom";

export const StartCard = ({titulo, imagen, link}) => {
    const navigate = useNavigate();
    const routeChange = () => navigate(link);

    return (<Card isPressable onClick={routeChange}>
            <Card.Body css={{p: 0}}>
                <Card.Image
                    src={imagen}
                    objectFit="cover"
                    width="100%"
                    height={340}
                    alt={titulo}
                />
            </Card.Body>
            <Card.Footer css={{justifyItems: "flex-start"}}>
                <Row wrap="wrap" justify="space-between" align="center">
                    <Text b>{titulo}</Text>
                    <Text css={{color: "$accents7", fontWeight: "$semibold", fontSize: "$sm"}}>
                        Componente
                    </Text>
                </Row>
            </Card.Footer>
        </Card>);
};
