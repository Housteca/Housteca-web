import React from 'react';
import { withRouter } from "react-router-dom";
import {
    getERC20Contract,
    getLoanContract,
    parseDatetime,
    parseStatus
} from "../utils/contracts";
import emptyImage from "../images/empty.png";
import ImageViewer from "../components/ImageViewer";
import {
    Button,
    List
} from "semantic-ui-react";
import {
    fromAmount,
    fromRatio,
    getDefaultAccount,
    getWeb3,
    toAmount
} from "../utils/web3";
import ConfigurationField from "../components/ConfigurationField";
import { uploadFile } from "../backend";


const EMPTY_DOCUMENT = '0x0000000000000000000000000000000000000000000000000000000000000000';

class InvestmentDetailScreen extends React.Component {
    state = {
        contract: null,
        images: [],
        isBorrower: false,
        isInvestor: false,
        isLocalNode: false,
        isVerifiedInvestor: false,
        token: null,
        borrower: '',
        status: '',
        localNode: '',
        targetAmount: '',
        totalPayments: '',
        timesPaid: '',
        timesDefault: '',
        nextPayment: '',
        stakeDepositDeadline: '',
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
        input: {
            amountToInvest: '0'
        }
    };

    componentDidMount = async () => {
        const contractAddress = this.props.location.pathname.replace('/details/', '').replace('/', '');
        const contract = await getLoanContract(contractAddress);
        let images = await contract.methods.images().call() || [];
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
        const tokenAddress = await contract.methods._token().call();
        const token = await getERC20Contract(tokenAddress);

        const isLocalNode = account === localNode;
        const isBorrower = account === borrower;
        const isVerifiedInvestor = await contract.methods.isVerifiedInvestor(account).call();
        const amountInvested = await contract.methods._investments(account).call();
        const isInvestor = amountInvested > 0;
        this.setState({
            account, isLocalNode, isBorrower, isVerifiedInvestor, isInvestor, amountInvested, token,
            borrower, status, localNode, targetAmount, totalPayments, timesPaid, timesDefault,
            nextPayment, stakeDepositDeadline, fundingDeadline, signingDeadline, insuredPayments,
            downpaymentRatio, perPaymentInterestRatio, amortizedAmount, investedAmount, paymentAmount,
            localNodeSignature,borrowerSignature, documentHash, localNodeFeeAmount, houstecaFeeAmount
        })
    };

    allow = async amount => {
        const {contract, account, token} = this.state;
        await token.methods.approve(contract._address, amount).send({from: account});
    };

    sendStake = async () => {
        const {contract, account} = this.state;
        const amount = await contract.methods.initialStakeAmount().call();
        await this.allow(amount);
        await contract.methods.sendInitialStake().send({from: account});
        window.location.reload();
    };

    invest = async () => {
        const {account, contract, input} = this.state;
        const amount = toAmount(input.amountToInvest);
        await this.allow(amount);
        await contract.methods.invest(amount).send({from: account});
        window.location.reload();
    };

    collectInvestment = async () => {
        const {contract, account} = this.state;
        await contract.methods.collectInvestment().send({from: account});
    };

    pay = async () => {
        const {contract, account, paymentAmount} = this.state;
        await this.allow(paymentAmount);
        await contract.methods.pay().send({from: account});
    };

    abort = async () => {
        const {contract, account} = this.state;
        await contract.methods.abortLoan().send({from: account});
        window.location.reload();
    };

    uploadDocument = async file => {
        const documentHash = await uploadFile(file);
        const {contract, account} = this.state;
        await contract.methods.submitDocumentHash(documentHash).send({from: account});
        this.setState({documentHash});
    };

    signDocument = async () => {
        const {account, contract, documentHash} = this.state;
        if (documentHash && documentHash !== EMPTY_DOCUMENT) {
            const web3 = await getWeb3();
            const msg =  web3.eth.accounts.hashMessage(documentHash);
            const signature = await web3.eth.sign(msg, account);
            await contract.methods.signDocument(signature).send({from: account});
            window.location.reload();
        }
    };

    collectAllFunds = async () => {
        const {contract, account} = this.state;
        await contract.methods.collectAllFunds().send({from: account});
        window.location.reload();
    };

    renderImageViewer() {
        const {images} = this.state;
        if (images.length  > 0) {
            return <ImageViewer images={images}/>;
        }
    };

    renderInvestorCollectButton() {
        return (
            <Button onClick={this.collectInvestment} color="green">
                Collect investment
            </Button>
        );
    }

    renderSignDocumentButton() {
        return (
            <Button color="green" onClick={this.signDocument} key="sign">
                Firmar documento
            </Button>
        );
    }

    renderWidgets = () => {
        const {status, isLocalNode, isBorrower, isInvestor, isVerifiedInvestor, input, documentHash,
        borrowerSignature, localNodeSignature} = this.state;
        switch (parseInt(status)) {
            case 0:  // AWAITING_STAKE
                if (isBorrower) {
                    return (
                        <Button onClick={this.sendStake} color="green">
                            Enviar stake inicial
                        </Button>
                    );
                }
                break;
            case 1:  // FUNDING
                if (isInvestor) {
                    this.renderInvestorCollectButton();
                } else if (isVerifiedInvestor) {
                    return (
                        <ConfigurationField placeholder="Cantidad a invertir"
                                            onChange={event => this.setState({input: {...input, amountToInvest: event.target.value}})}
                                            label="Invertir"
                                            onClick={this.invest}/>
                    );
                } else if (isLocalNode) {
                    return (
                        <Button onClick={this.abort} color="red">
                            Abortar proceso
                        </Button>
                    );
                }
                break;
            case 2:  // AWAITING_SIGNATURES
                const components = [];
                if (isLocalNode) {
                    components.push(
                        <div key="document-upload">
                            <Button htmlFor="file" as="label" color="blue">
                                Subir contrato
                            </Button>
                            <input type="file" id="file" style={{ display: "none" }}
                                   onChange={event => this.uploadDocument(event.target.files[0])} />
                        </div>
                    );
                    components.push(
                        <Button color="red" onClick={this.abort} key="abort-process">
                            Abortar proceso
                        </Button>
                    );
                    if (documentHash !== EMPTY_DOCUMENT && !localNodeSignature) {
                        components.push(
                            this.renderSignDocumentButton()
                        )
                    } else if (borrowerSignature) {
                        components.push(
                            <Button color="green" onClick={this.collectAllFunds} key="collect-all-funds">
                                Comenzar proceso de financiación
                            </Button>
                        );
                    }
                } else if (isBorrower && !borrowerSignature) {
                    components.push(
                        this.renderSignDocumentButton()
                    )
                }
                if (components.length > 0) {
                    return (
                        <List horizontal>
                            {components.map(c => <List.Item>{c}</List.Item>)}
                        </List>
                    )
                }
                break;
            case 3:  // ACTIVE
            case 6:  // DEFAULT
                if (isInvestor) {
                    this.renderInvestorCollectButton();
                } else if (isBorrower) {
                    return (
                        <Button onClick={this.pay} color="green">
                            Pagar mensualidad
                        </Button>
                    );
                }
                break;
            case 4:  // FINISHED
            case 5:  // UNCOMPLETED
            case 7:  // BANKRUPT
                if (isInvestor) {
                    this.renderInvestorCollectButton();
                }
                break;

        }
    };

    render() {
        let {borrower, status, localNode, targetAmount, totalPayments, timesPaid, timesDefault,
        nextPayment, stakeDepositDeadline, fundingDeadline, signingDeadline, insuredPayments,
        downpaymentRatio, paymentAmount, perPaymentInterestRatio, amortizedAmount, investedAmount,
        localNodeSignature, borrowerSignature, documentHash, localNodeFeeAmount, houstecaFeeAmount} = this.state;
        const yearlyInterest = fromRatio(parseFloat(perPaymentInterestRatio) * 12);
        if (documentHash === EMPTY_DOCUMENT) {
            documentHash = '-';
        }
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
                        <List.Header>Próximo pago</List.Header>
                        <List.Description>{parseDatetime(nextPayment)}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Fecha stake</List.Header>
                        <List.Description>{parseDatetime(stakeDepositDeadline)}</List.Description>
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
                        <List.Description>{localNodeSignature || '-'}</List.Description>
                    </List.Item>
                    <List.Item>
                        <List.Header>Firma prestatario</List.Header>
                        <List.Description>{borrowerSignature || '-'}</List.Description>
                    </List.Item>
                </List>

                <br/>
                <hr/>
                <br/>

                {this.renderWidgets()}
            </div>
        );
    }
}

export default withRouter(InvestmentDetailScreen);
