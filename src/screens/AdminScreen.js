import React from 'react';
import { Grid } from "semantic-ui-react";
import ConfigurationField from "../components/ConfigurationField";
import { getHoustecaContract } from "../utils/contracts";
import { getDefaultAccount } from "../utils/web3";


class AdminScreen extends React.Component {
    state = {
        hasPermission: false,
        contract: null,
        defaultAccount: '',
        newAdmin: '',
        houstecaFeeRatio: 0,
        newLocalNode: {
            address: '',
            minimumFeeAmount: 0,
            feeRatio: 0
        },

    };

    componentDidMount = async () => {
        const contract = await getHoustecaContract();
        const defaultAccount = await getDefaultAccount();
        const isAdmin = await contract.methods.isAdmin(defaultAccount).call();
        const houstecaFeeRatio = await contract.methods._houstecaFeeRatio().call();
        this.setState({contract, defaultAccount, hasPermission: isAdmin, houstecaFeeRatio});
    };

    addAdmin = async () => {
        const address = this.state.newAdmin;
        this.state.contract.methods.addAdmin(address, 254, 0, 0).send({from: this.state.defaultAccount});
    };

    addLocalNode = async () => {
        const {address, minimumFeeAmount, feeRatio} = this.state.newLocalNode;
        this.state.contract.methods.addAdmin(
            address, 253, minimumFeeAmount, feeRatio
        ).send();
    };

    changeHoustecaFeeRatio = async () => {
        const ratio = this.state.houstecaFeeRatio;
        this.state.contract.methods.setHoustecaFeeRatio(ratio * 1e18).send({from: this.state.defaultAccount});
    };

    render() {
        if (!this.state.hasPermission) {
            return <p>Acceso denegado a esta sección</p>
        }
        const {newAdmin, houstecaFeeRatio} = this.state;
        return (
            <Grid divided="vertically">
                <Grid.Column width={5}>
                    <ConfigurationField placeholder="Dirección de Ethereum"
                                        onChange={event => this.setState({newAdmin: event.target.value})}
                                        label="Añadir un nuevo administrador"
                                        onClick={this.addAdmin}
                                        defaultValue={newAdmin}/>
                    <br/>
                    <br/>
                    <ConfigurationField placeholder="Housteca % fee"
                                        onChange={event => this.setState({houstecaFeeRatio: event.target.value})}
                                        label="Fee % for Housteca"
                                        type="number"
                                        onClick={this.changeHoustecaFeeRatio}
                                        defaultValue={houstecaFeeRatio}/>
                    <br/>
                    <br/>
                </Grid.Column>
            </Grid>
        );
    }
}

export default AdminScreen;
