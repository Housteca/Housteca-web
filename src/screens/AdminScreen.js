import React from 'react';
import {
    Button,
    Form,
    Grid,
    Input
} from "semantic-ui-react";
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
            feeRatio: 0
        },
        newToken: {
            symbol: '',
            address: ''
        }
    };

    componentDidMount = async () => {
        const contract = await getHoustecaContract();
        const defaultAccount = await getDefaultAccount();
        const isAdmin = await contract.methods.isAdmin(defaultAccount).call();
        const houstecaFeeRatio = await contract.methods._houstecaFeeRatio().call() / 1e18;
        this.setState({contract, defaultAccount, hasPermission: isAdmin, houstecaFeeRatio});
    };

    addAdmin = async () => {
        const address = this.state.newAdmin;
        this.state.contract.methods.addAdmin(address, 254, 0).send({from: this.state.defaultAccount});
    };

    addLocalNode = async () => {
        const {address, feeRatio} = this.state.newLocalNode;
        const ratio = (feeRatio * 1e18).toString();
        this.state.contract.methods.addAdmin(address, 253, ratio).send({from: this.state.defaultAccount});
    };

    addToken = async () => {
        const {address, symbol} = this.state.newToken;
        this.state.contract.methods.addToken(symbol, address).send({from: this.state.defaultAccount});
    };

    changeHoustecaFeeRatio = async () => {
        const ratio = (this.state.houstecaFeeRatio * 1e18).toString();
        this.state.contract.methods.setHoustecaFeeRatio(ratio).send({from: this.state.defaultAccount});
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
                    <Form>
                        <h3>Nuevo token</h3>
                        <Form.Group widths='equal' style={{minWidth: 750}}>
                            <Form.Field
                                control={Input}
                                label='Símbolo'
                                size="big"
                                placeholder='Símbolo del token'
                                onChange={event => this.setState({
                                    newToken: {
                                        ...this.state.newToken,
                                        symbol: event.target.value
                                    }
                                })}
                            />
                            <Form.Field
                                control={Input}
                                label='Contrato'
                                size="big"
                                placeholder='Dirección del contrato del token ERC20 o ERC777'
                                onChange={event => this.setState({
                                    newToken: {
                                        ...this.state.newToken,
                                        address: event.target.value
                                    }
                                })}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Field control={Button} color="blue" onClick={this.addToken}>Enviar</Form.Field>
                    </Form>
                    <br/>
                    <br/>
                    <Form>
                        <h3>Nuevo nodo local</h3>
                        <Form.Group widths='equal' style={{minWidth: 750}}>
                            <Form.Field
                                control={Input}
                                label='Dirección'
                                size="big"
                                placeholder='Dirección Ethereum'
                                onChange={event => this.setState({
                                    newLocalNode: {
                                        ...this.state.newLocalNode,
                                        address: event.target.value
                                    }
                                })}
                            />
                            <Form.Field
                                control={Input}
                                label='Fee %'
                                size="big"
                                type="number"
                                placeholder='Fee % for the new local node'
                                onChange={event => this.setState({
                                    newLocalNode: {
                                        ...this.state.newLocalNode,
                                        feeRatio: event.target.value
                                    }
                                })}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Field control={Button} color="blue" onClick={this.addLocalNode}>Enviar</Form.Field>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}

export default AdminScreen;
