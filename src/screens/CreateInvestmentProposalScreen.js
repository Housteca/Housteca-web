import React from 'react';
import { getHoustecaContract } from "../utils/contracts";
import { getWeb3 } from "../utils/web3";
import {
    Button,
    Form
} from "semantic-ui-react";


class CreateInvestmentProposalScreen extends React.Component {
    state = {hasPermission: false};

    componentDidMount = async () => {
        const contract = await getHoustecaContract();
        const web3 = await getWeb3();
        const account = web3.eth.defaultAccount;
        const isLocalNode = await contract.methods.isLocalNode(account).call();
        this.setState({hasPermission: isLocalNode});
    };

    submitForm = async () => {

    };

    renderForm() {
        if (!this.state.hasPermission) {
            return <p>Acceso denegado a esta sección</p>
        }
        return (
            <Form>
                <Form.Field
                    label='Dirección del prestatario'
                    control='input'
                    placeholder='Ej: 0xF7F7bB5D2ff382142aEeE014A3380340481E360d'
                />
                <Form.Field
                    label='Token'
                    control='input'
                    placeholder='Símbolo del token. Ej: DAI, USDC...'
                />
                <Form.Field
                    label='Porcentaje del inmueble que cubre la entrada inicial'
                    control='input'
                    type="number"
                    placeholder='0%, 10%, 20%...'
                />
                <Form.Field
                    label='Cantidad total a financiar'
                    control='input'
                    type="number"
                    placeholder='Amount to be funded in token units'
                />
                <Form.Field
                    label='Número de mensualidades'
                    control='input'
                    type="number"
                    placeholder='50, 100, 150...'
                />
                <Form.Field
                    label='Número de mensualidades cubiertas por el seguro de impago'
                    control='input'
                    type="number"
                    placeholder='6, 12, 24...'
                />
                <Form.Field
                    label='Mensualidad a pagar en tokens'
                    control='input'
                    type="number"
                    placeholder='500, 650, 1200...'
                />
                <Form.Field
                    label='Tasa de interés'
                    control='input'
                    type="number"
                    placeholder='1.20%, 6.45%, 15%...'
                />
                <Form.Field control={Button} onclick={this.submitForm}>
                    Crear proposiciónd de financiación
                </Form.Field>
            </Form>
        );
    }

    render() {
        return (
            this.renderForm()
        );
    }
}

export default CreateInvestmentProposalScreen;
