import React from 'react';
import { withRouter } from "react-router-dom";
import {
    getLoanContract,
    parseDatetime,
    parseStatus
} from "../utils/contracts";
import emptyImage from "../images/empty.png";
import ImageViewer from "../components/ImageViewer";
import {
    Button,
    List,
    Table
} from "semantic-ui-react";
import {
    fromAmount,
    fromRatio,
    getDefaultAccount
} from "../utils/web3";


class InvestmentDetailScreen extends React.Component {
    state = {
        contract: null,
        images: [],
        borrower: '',
        status: '',
        localNode: '',
        targetAmount: '',
        totalPayments: '',
        timesPaid: '',
        timesDefault: '',
        nextPayment: '',
        stakeDepositDeadLine: '',
        fundingDeadline: '',
        signingDeadline: '',
        insuredPayments: '',
        downpaymentRatio: '',
        paymentAmount: '',
        perPaymentInterestRatio: '',
        amortizedAmount: '',
        investedAmount: '',
        localNodeSignature: '',
        borrowerSignature: '',
        documentHash: '',
        localNodeFeeAmount: '',
        houstecaFeeAmount: '',
    };

    componentDidMount = async () => {
        const contractAddress = this.props.location.pathname.replace('/details/', '').replace('/', '');
        const contract = await getLoanContract(contractAddress);
        let images = await contract.methods.images().call();
        if (images.length === 0) {
            images = [emptyImage];
        } else {
            images = images.map(hash => `https://ipfs.io/ipfs/${hash}`);
        }
        this.setState({contract, images});

        const account = await getDefaultAccount();
        const borrower = await contract.methods._borrower().call();
        const status = await contract.methods._status().call();
        const localNode = await contract.methods._localNode().call();
        const targetAmount = await contract.methods._targetAmount().call();
        const totalPayments = await contract.methods._totalPayments().call();
        const timesPaid = await contract.methods._timesPaid().call();
        const timesDefault = await contract.methods._timesDefault().call();
        const paymentAmount = await contract.methods._paymentAmount().call();
        const nextPayment = await contract.methods._nextPayment().call();
        const stakeDepositDeadline = await contract.methods._stakeDepositDeadline().call();
        const fundingDeadline = await contract.methods._fundingDeadline().call();
        const signingDeadline = await contract.methods._signingDeadline().call();
        const insuredPayments = await contract.methods._insuredPayments().call();
        const downpaymentRatio = await contract.methods._downpaymentRatio().call();
        const perPaymentInterestRatio = await contract.methods._perPaymentInterestRatio().call();
        const amortizedAmount = await contract.methods._amortizedAmount().call();
        const investedAmount = await contract.methods._investedAmount().call();
        const localNodeSignature = await contract.methods._localNodeSignature().call();
        const borrowerSignature = await contract.methods._borrowerSignature().call();
        const documentHash = await contract.methods._documentHash().call();
        const localNodeFeeAmount = await contract.methods._localNodeFeeAmount().call();
        const houstecaFeeAmount = await contract.methods._houstecaFeeAmount().call();

        const isLocalNode = account === localNode;
        const isBorrower = account === borrower;
        const isVerifiedInvestor = await contract.methods.isVerifiedInvestor(account).call();
        const amountInvested = await contract.methods._investments(account).call();
        const isInvestor = amountInvested > 0;
        this.setState({
            account, isLocalNode, isBorrower, isVerifiedInvestor, isInvestor, amountInvested,
            borrower, status, localNode, targetAmount, totalPayments, timesPaid, timesDefault,
            nextPayment, stakeDepositDeadline, fundingDeadline, signingDeadline, insuredPayments,
            downpaymentRatio, perPaymentInterestRatio, amortizedAmount, investedAmount, paymentAmount,
            localNodeSignature,borrowerSignature, documentHash, localNodeFeeAmount, houstecaFeeAmount
        })
    };

    sendStake = async () => {

    };

    renderImageViewer = () => {
        const {images} = this.state;
        if (images.length  > 0) {
            return <ImageViewer images={images}/>;
        }
    };

    renderButtons = () => {
        const {status, isLocalNode, isBorrower, isInvestor} = this.state;
        console.log(status, isBorrower);
        switch (status) {
            case 0:  // AWAITING_STAKE
                if (isBorrower) {
                    return (
                        <Button onClick={this.sendStake} color="green">
                            Enviar stake inicial
                        </Button>
                    );
                }
                break;

        }
    };

    render() {
        const {borrower, status, localNode, targetAmount, totalPayments, timesPaid, timesDefault,
        nextPayment, stakeDepositDeadLine, fundingDeadline, signingDeadline, insuredPayments,
        downpaymentRatio, paymentAmount, perPaymentInterestRatio, amortizedAmount, investedAmount,
        localNodeSignature, borrowerSignature, documentHash, localNodeFeeAmount, houstecaFeeAmount} = this.state;
        const yearlyInterest = fromRatio(parseFloat(perPaymentInterestRatio) * 12);
        console.log(stakeDepositDeadLine, fundingDeadline, signingDeadline);
        return (
            <div>
                {this.renderImageViewer()}
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

                    <br/>

                    <List.Item>
                        <List.Header>Cantidad financiada</List.Header>
                        <List.Description>{fromAmount(targetAmount)}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Mensualidades</List.Header>
                        <List.Description>{totalPayments}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Pagos realizados</List.Header>
                        <List.Description>{timesPaid}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Entrada inicial</List.Header>
                        <List.Description>{fromRatio(downpaymentRatio)}%</List.Description>
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
                        <List.Header>Cantidad amortizada</List.Header>
                        <List.Description>{fromAmount(amortizedAmount)}</List.Description>
                    </List.Item>

                    <br/>

                    <List.Item>
                        <List.Header>Cantidad invertida</List.Header>
                        <List.Description>{fromAmount(investedAmount)}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Veces default</List.Header>
                        <List.Description>{timesDefault}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Fecha stake</List.Header>
                        <List.Description>{parseDatetime(stakeDepositDeadLine)}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Próximo pago</List.Header>
                        <List.Description>{nextPayment}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Fecha inversión</List.Header>
                        <List.Description>{parseDatetime(fundingDeadline)}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Fecha firma</List.Header>
                        <List.Description>{parseDatetime(signingDeadline)}</List.Description>
                    </List.Item>

                    <br/>

                    <List.Item>
                        <List.Header>Pagos asegurados</List.Header>
                        <List.Description>{insuredPayments}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Comisión nodo local</List.Header>
                        <List.Description>{fromAmount(localNodeFeeAmount)}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Comisión Housteca</List.Header>
                        <List.Description>{fromAmount(houstecaFeeAmount)}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Hash documento</List.Header>
                        <List.Description>{documentHash}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Firma nodo local</List.Header>
                        <List.Description>{localNodeSignature}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Firma prestatario</List.Header>
                        <List.Description>{borrowerSignature}</List.Description>
                    </List.Item>
                </List>

                <br/>
                <br/>

                {this.renderButtons()}
            </div>
        );
    }
}

export default withRouter(InvestmentDetailScreen);
