import React from "react";
import Layout from "./components/Layout";
import getWeb3 from "./utils/getWeb3";

class App extends React.Component {
    state = {web3: null, account: null, isOwner: false, contract: null};

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            web3.eth.defaultAccount = accounts[0];
            web3.eth.transactionConfirmationBlocks = 1;
            web3.eth.defaultBlock = 'latest';

            // Refresh the state in case of metamask switching accounts
            web3.currentProvider.on('accountsChanged', () => {
                console.log('Switching accounts');
                window.location.reload();
            });
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
        }
    };

    render() {
        return (
            <Layout/>
        );
    };
}

export default App;
