import React from 'react';
import { withRouter } from "react-router-dom";
import { List } from "semantic-ui-react";
import { getHoustecaContract } from "../utils/contracts";


class HomeScreen extends React.Component {
    state = {loans: [], contract: null};

    componentDidMount = async () => {
        const contract = await getHoustecaContract();
        const loans = await contract.methods.loans().call();
        console.log(loans);
        this.setState({contract, loans});
    };

    renderItems = () => {
        return this.state.loans.map(loan => {
            return (
                <List.Item>
                    loan
                </List.Item>
            );
        });
    };

    render() {
        return (
            <List divided relaxed>
                {this.renderItems()}
            </List>
        );
    }
}

export default withRouter(HomeScreen);
