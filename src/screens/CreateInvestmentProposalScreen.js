import React from 'react';
import { getHoustecaContract } from "../utils/contracts";
import {
    getDefaultAccount,
    toAmount,
    toRatio
} from "../utils/web3";
import {
    Button,
    Form
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";


class CreateInvestmentProposalScreen extends React.Component {
    state = {
        hasPermission: false,
        contract: null,
        borrower: '',
        symbol: '',
        downpaymentRatio: 0,
        targetAmount: 0,
        totalPayments: 0,
        insuredPayments: 0,
        yearlyInterest: 0,
    };

    componentDidMount = async () => {
        const contract = await getHoustecaContract();
        const account = await getDefaultAccount();
        const isLocalNode = await contract.methods.isLocalNode(account).call();
        this.setState({hasPermission: isLocalNode, contract});
    };

    submitForm = async () => {
        const account = await getDefaultAccount();
        const {
            borrower, symbol, downpaymentRatio, targetAmount,
            totalPayments, insuredPayments, yearlyInterest
        } = this.state;
        const perPaymentInterestRatio = yearlyInterest / 12;
        const paymentAmount = (targetAmount * perPaymentInterestRatio/100) / (1 - Math.pow(1 + perPaymentInterestRatio/100, -totalPayments));
        console.log(paymentAmount);
        await this.state.contract.methods.createInvestmentProposal(
            borrower,
            symbol,
            toRatio(downpaymentRatio),
            toAmount(targetAmount),
            totalPayments,
            insuredPayments,
            toAmount(paymentAmount),
            toRatio(perPaymentInterestRatio)
        ).send({from: account});
        this.props.history.push('/proposals');
    };

    renderForm() {
        if (!this.state.hasPermission) {
            return <p>Acceso denegado a esta sección</p>
        }
        return (
            <Form style={{width: '40%'}}>
                <Form.Field
                    label='Dirección del prestatario'
                    control='input'
                    placeholder='Ej: 0xF7F7bB5D2ff382142aEeE014A3380340481E360d'
                    onChange={event => this.setState({borrower: event.target.value})}
                />
                <Form.Field
                    label='Token'
                    control='input'
                    placeholder='Símbolo del token. Ej: DAI, USDC...'
                    onChange={event => this.setState({symbol: event.target.value})}
                />
                <Form.Field
                    label='Porcentaje del inmueble que cubre la entrada inicial'
                    control='input'
                    placeholder='0%, 10%, 20%...'
                    onChange={event => this.setState({downpaymentRatio: event.target.value})}
                />
                <Form.Field
                    label='Cantidad total a financiar'
                    control='input'
                    type="number"
                    placeholder='Cantidad a financiar en unidades de los tokens'
                    onChange={event => this.setState({targetAmount: event.target.value})}
                />
                <Form.Field
                    label='Número de mensualidades'
                    control='input'
                    type="number"
                    placeholder='50, 100, 150...'
                    onChange={event => this.setState({totalPayments: event.target.value})}
                />
                <Form.Field
                    label='Número de mensualidades cubiertas por el seguro de impago'
                    control='input'
                    type="number"
                    placeholder='6, 12, 24...'
                    onChange={event => this.setState({insuredPayments: event.target.value})}
                />
                <Form.Field
                    label='Tasa de interés anual'
                    control='input'
                    placeholder='1.20%, 6.45%, 15%...'
                    onChange={event => this.setState({yearlyInterest: event.target.value})}
                />
                <Form.Field control={Button} color="blue" onClick={this.submitForm}>
                    Crear proposición de financiación
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

export default withRouter(CreateInvestmentProposalScreen);
