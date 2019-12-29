import React from 'react';
import {
    Header,
    Image,
    Menu
} from "semantic-ui-react";
import icon from '../images/housteca.jpeg';
import getWeb3 from "../utils/getWeb3";


class AppHeader extends React.Component {
    state = {address: ''};

    componentDidMount = async () => {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        this.setState({address});
    };

    render() {
        const {address} = this.state;
        return (
            <Menu>
                <Menu.Item>
                    <Header as="h1">
                        <Image src={icon} />
                    </Header>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Header as="h3">{address}</Header>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}


export default AppHeader;
