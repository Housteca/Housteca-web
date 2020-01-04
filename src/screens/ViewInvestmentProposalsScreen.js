import React from 'react';
import {
    getHoustecaContract,
    parseDatetime
} from "../utils/contracts";
import {
    Button,
    Card,
    List
} from "semantic-ui-react";
import {
    fromAmount,
    fromRatio,
    getDefaultAccount
} from "../utils/web3";


class ViewInvestmentProposalsScreen extends React.Component {
    state = {
        isLocalNode: false,
        account: null,
        contract: null,
        proposals: [],
    };

    loadProposals = async () => {
        const contract = await getHoustecaContract();
        const proposals = [];
        const events = await contract.getPastEvents('InvestmentProposalCreated', {fromBlock: 0});
        const keys = new Set([]);
        for (const event of events) {
            const borrower = event.returnValues.borrower;
            if (!keys.has(borrower)) {
                keys.add(borrower);
                const proposal = await contract.methods._proposals(borrower).call();
                if (parseInt(proposal.totalPayments) > 0) {
                    proposal.borrower = borrower;
                    proposals.push(proposal);
                    this.setState({proposals});
                }
            }
        }
    };

    componentDidMount = async () => {
        const contract = await getHoustecaContract();
        const account = await getDefaultAccount();
        const isLocalNode = await contract.methods.isLocalNode(account).call();
        this.setState({contract, isLocalNode, account});
        this.loadProposals();
    };

    removeProposal = async proposal => {
        const {account} = this.state;
        await this.state.contract.methods.removeInvestmentProposal(proposal.borrower).send({from: account});
        window.location.reload();
    };

    acceptProposal = async () => {
        const {account} = this.state;
        await this.state.contract.methods.createInvestment().send({from: account});
        window.location.reload();
    };

    renderButtons(proposal) {
        if (this.state.isLocalNode) {
            return (
                <Button
                    color="red"
                    onClick={() => this.removeProposal(proposal)}>
                    Eliminar
                </Button>
            )
        }
        if (this.state.account === proposal.borrower) {
            return (
                <Button
                    color="green"
                    onClick={() => this.acceptProposal()}>
                    Aceptar
                </Button>
            )
        }
    }

    renderProposals() {
        return this.state.proposals.map((proposal, index) => {
            const {
                borrower, symbol, downpaymentRatio, targetAmount, totalPayments,
                insuredPayments, paymentAmount, perPaymentInterestRatio, localNodeFeeAmount,
                houstecaFeeAmount, created
            } = proposal;
            const yearlyInterest = fromRatio(parseFloat(perPaymentInterestRatio) * 12);
            const date = parseDatetime(created);
            return (
                <Card fluid key={index}>
                    <Card.Content>
                        <Card.Header>{borrower}</Card.Header>
                        <Card.Meta>{date}</Card.Meta>
                        <br/>
                        <List horizontal>
                            <List.Item>
                                <List.Header>Token</List.Header>
                                <List.Description>{symbol}</List.Description>
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
                        <br/>
                        <br/>
                        {this.renderButtons(proposal)}
                    </Card.Content>
                </Card>
            );
        });
    }

    render() {
        return (
            <div>
                {this.renderProposals()}
            </div>
        );
    }
}

export default ViewInvestmentProposalsScreen;
