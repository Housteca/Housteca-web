import React from 'react';
import {
    Button,
    Form,
    Grid,
    Input
} from "semantic-ui-react";
import ConfigurationField from "../components/ConfigurationField";
import { getHoustecaContract } from "../utils/contracts";
import {
    getDefaultAccount,
    toRatio
} from "../utils/web3";


class AdminScreen extends React.Component {
    state = {
        hasPermission: false,
        contract: null,
        defaultAccount: '',
        newAdmin: '',
        newInvestor: '',
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
        const houstecaFeeRatio = await contract.methods._houstecaFeeRatio().call() / 1e16;
        this.setState({contract, defaultAccount, hasPermission: isAdmin, houstecaFeeRatio});
    };

    addAdmin = async () => {
        const address = this.state.newAdmin;
        this.state.contract.methods.addAdmin(address, 254, 0).send({from: this.state.defaultAccount});
    };

    addInvestor = async () => {
        const address = this.state.newInvestor;
        this.state.contract.methods.addInvestor(address).send({from: this.state.defaultAccount});
    };

    addLocalNode = async () => {
        const {address, feeRatio} = this.state.newLocalNode;
        const ratio = toRatio(feeRatio);
        this.state.contract.methods.addAdmin(address, 253, ratio).send({from: this.state.defaultAccount});
    };

    addToken = async () => {
        const {address, symbol} = this.state.newToken;
        this.state.contract.methods.addToken(symbol, address).send({from: this.state.defaultAccount});
    };

    changeHoustecaFeeRatio = async () => {
        const ratio = toRatio(this.state.houstecaFeeRatio);
        this.state.contract.methods.setHoustecaFeeRatio(ratio).send({from: this.state.defaultAccount});
    };

    render() {
        if (!this.state.hasPermission) {
            return <p>Acceso denegado a esta sección</p>
        }
        const {houstecaFeeRatio} = this.state;
        return (
            <Grid divided="vertically">
                <Grid.Column width={5}>
                    <ConfigurationField placeholder="Dirección de Ethereum"
                                        onChange={event => this.setState({newAdmin: event.target.value})}
                                        label="Añadir un nuevo administrador"
                                        onClick={this.addAdmin}/>
                    <br/>
                    <br/>
                    <ConfigurationField placeholder="Dirección de Ethereum"
                                        onChange={event => this.setState({newInvestor: event.target.value})}
                                        label="Añadir un nuevo inversor"
                                        onClick={this.addInvestor}/>
                    <br/>
                    <br/>
                    <ConfigurationField placeholder="Comisión"
                                        onChange={event => this.setState({houstecaFeeRatio: event.target.value})}
                                        label="% comisión Housteca"
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
                                label='% comisión'
                                size="big"
                                type="number"
                                placeholder='% de comisión para el nodo local'
                                onChange={event => this.setState({
                                    newLocalNode: {
                                        ...this.state.newLocalNode,
                                        feeRatio: event.target.value
                                    }
                                })}
                            />
                        </Form.Group>
                        <Form.Field control={Button} color="blue" onClick={this.addLocalNode}>Enviar</Form.Field>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}

export default AdminScreen;
