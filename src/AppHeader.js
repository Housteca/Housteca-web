import React, { Component } from 'react';
import { Header, Menu } from "semantic-ui-react";
import { getHoustecaContract } from "./utils/contracts"


class AppHeader extends Component {
    state = { isAuthorized: null };

    componentDidMount = async () => {
        const contract = await getHoustecaContract();
        //const isAuthorized = await contract.methods.isAuthorized().call();
        //this.setState({ True });
    };

    render() {
        const { title, address } = this.props;
        //const color = this.state.isAuthorized ? 'green' : 'red';
        const color = 'green';
        return (
            <Menu>
                <Menu.Item>
                    <Header as={"h1"}>Euro Exchange</Header>
                </Menu.Item>
                <Menu.Menu position={"right"}>
                    <Menu.Item>
                        <Header as={"h3"}>{title}</Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Header as={"h3"} color={color}>{address}</Header>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default AppHeader;