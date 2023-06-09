import React from "react";
import {Button, Modal, Row, Text} from "@nextui-org/react";

export const ErrorModal = ({ errorMsg, setErrorMsg }) => {
    const [visible, setVisible] = React.useState(true);

    const closeHandler = () => {
        setVisible(false);
        setErrorMsg("");
    };

    return (
        <div>
            <Modal aria-labelledby="modal-title" open={visible}>
                <Modal.Header>
                    <Text id="modal-title" size={20}>
                        Se ha producido un&nbsp;
                        <Text b color="error" size={20}>
                            error
                        </Text>
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Row justify="center" align="center">
                        <Text size={16}>{errorMsg}</Text>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};