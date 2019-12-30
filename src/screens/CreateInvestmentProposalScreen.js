import React from 'react';
import { getHoustecaContract } from "../utils/contracts";
import getWeb3 from "../utils/getWeb3";
import { Form } from "semantic-ui-react";


class CreateInvestmentProposalScreen extends React.Component {
    state = {hasPermission: false};

    componentDidMount = async () => {
        const contract = await getHoustecaContract();
        const web3 = await getWeb3();
        const account = web3.eth.defaultAccount;
        const isLocalNode = await contract.methods.isLocalNode(account).call();
        this.setState({hasPermission: isLocalNode});
    };

    renderForm() {
        if (!this.state.hasPermission) {
            return <p>You have no permission to create investment proposals</p>
        }
        return (
            <Form>

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
