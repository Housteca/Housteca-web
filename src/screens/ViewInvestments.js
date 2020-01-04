import React from 'react';
import { withRouter } from "react-router-dom";
import {
    Card,
    Grid,
    Image,
    List
} from "semantic-ui-react";
import {
    getHoustecaContract,
    getLoanContract,
    parseStatus
} from "../utils/contracts";
import {
    fromAmount,
    fromRatio
} from "../utils/web3";
import emptyImage from "../images/empty.png";


class ViewInvestments extends React.Component {
    state = {loans: []};

    componentDidMount = async () => {
        const housteca = await getHoustecaContract();
        const loanAddresses = await housteca.methods.loans().call();
        const loans = [];
        for (let address of loanAddresses) {
            const loan = await getLoanContract(address);
            const details = await loan.methods.details().call();
            const images = await loan.methods.images().call();
            if (images.length === 0) {
                details.images = [emptyImage];
            } else {
                details.images = images.map(hash => `https://ipfs.io/ipfs/${hash}`);
            }
            details.loanAddress = address;
            loans.push(details);
            console.log(details);
            this.setState({loans});
        }
    };

    renderInvestments() {
        return this.state.loans.map((loan, index) => {
            const [
                borrower, localNode, tokenAddress, downpaymentRatio, targetAmount, totalPayments,
                insuredPayments, paymentAmount, perPaymentInterestRatio, localNodeFeeAmount,
                houstecaFeeAmount, status, images, loanAddress
            ] = Object.values(loan);
            const yearlyInterest = fromRatio(parseFloat(perPaymentInterestRatio) * 12);
            return (
                <Card fluid key={index} as="a" href={`/details/${loanAddress}`}>
                    <Card.Content>
                        <Grid>
                            <Grid.Column width={4}>
                                <Image src={images[0]}/>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Card.Header>{loanAddress}</Card.Header>
                                <br/>
                                <List horizontal>
                                    <List.Item>
                                        <List.Header>Estado</List.Header>
                                        <List.Description>{parseStatus(status)}</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Prestatario</List.Header>
                                        <List.Description>{borrower}</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Nodo local</List.Header>
                                        <List.Description>{localNode}</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Entrada inicial</List.Header>
                                        <List.Description>{fromRatio(downpaymentRatio)}%</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Cantidad financiada</List.Header>
                                        <List.Description>{fromAmount(targetAmount)}</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Total pagos</List.Header>
                                        <List.Description>{totalPayments}</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Pagos asegurados</List.Header>
                                        <List.Description>{insuredPayments}</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Pago mensual</List.Header>
                                        <List.Description>{fromAmount(paymentAmount)}</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Interés anual</List.Header>
                                        <List.Description>{yearlyInterest}%</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Comisión nodo local</List.Header>
                                        <List.Description>{fromAmount(localNodeFeeAmount)}</List.Description>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Comisión Housteca</List.Header>
                                        <List.Description>{fromAmount(houstecaFeeAmount)}</List.Description>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                        </Grid>
                    </Card.Content>
                </Card>
            );
        });
    }

    render() {
        return (
            <div>
                {this.renderInvestments()}
            </div>
        );
    }
}

export default withRouter(ViewInvestments);
