import {BrowserRouter, Route, Switch,} from 'react-router-dom';

import React from "react";
import './index.css';

import Housteca from "./utils/Housteca.json"
import HomeScreen from "./screens/HomeScreen";
import InvestorScreen from "./screens/InvestorScreen";
import BorrowerScreen from "./screens/BorrowerScreen";

import getWeb3 from "./utils/getWeb3";

class App extends React.Component {
    state = {web3: null, account: null};

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            web3.eth.defaultAccount = account;
            web3.eth.transactionConfirmationBlocks = 1;
            web3.eth.defaultBlock = 'latest';

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Housteca.networks[networkId];
            const instance = new web3.eth.Contract(
                Housteca.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Refresh the state in case of metamask switching accounts
            web3.currentProvider.on('accountsChanged', () => {
                console.log('Switching accounts');
                window.location.reload();
            });

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({web3, account});
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
        }
    };

    render() {
        if (!this.state.web3) {
            return <div/>;
        }
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/investor">
                        <InvestorScreen/>
                    </Route>
                    <Route path="/borrower">
                        <BorrowerScreen/>
                    </Route>
                    <Route path="/">
                        <HomeScreen/>
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    };
}

export default App;
