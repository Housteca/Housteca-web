import React from 'react';
import AppHeader from "./AppHeader";
import {
    Grid,
    Menu
} from "semantic-ui-react";
import {
    Route,
    Router,
    Switch
} from "react-router-dom";
import { createBrowserHistory } from "history";
import HomeScreen from "../screens/ViewInvestments";
import CreateInvestmentProposalScreen from "../screens/CreateInvestmentProposalScreen";
import ViewInvestmentProposalsScreen from "../screens/ViewInvestmentProposalsScreen";
import InvestmentDetailScreen from "../screens/InvestmentDetailScreen";
import AdminScreen from "../screens/AdminScreen";


class Layout extends React.Component {
    state = {activeItem: 2};
    history = createBrowserHistory();
    items = [
        {title: 'nueva proposición de financiación', path: '/new'},
        {title: 'proposiciones de financiación', path: '/proposals'},
        {title: 'inversiones', path: '/'},
        {title: 'administración', path: '/admin'},
    ];

    handleItemClick = index => {
        const item = this.items[index];
        this.setState({activeItem: index});
        this.history.push(item.path)
    };

    renderItems = () => {
        return this.items.map((item, index) =>
            <Menu.Item
                active={this.state.activeItem === index}
                name={item.title}
                key={item.title}
                onClick={() => this.handleItemClick(index)}
            />
        );
    };

    componentDidMount() {
        const index = this.items.map(i => i.path).indexOf(this.history.location.pathname);
        if (index >= 0) {
            this.setState({activeItem: index});
        }
    }

    render() {
        return (
            <div>
                <AppHeader/>
                <Grid style={{padding: 15}}>
                    <Grid.Column width={2}>
                        <Menu fluid vertical tabular>
                            {this.renderItems()}
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={14}>
                        <Router history={this.history}>
                            <Switch>
                                <Route path="/new">
                                    <CreateInvestmentProposalScreen/>
                                </Route>
                                <Route path="/proposals">
                                    <ViewInvestmentProposalsScreen/>
                                </Route>
                                <Route path="/detail">
                                    <InvestmentDetailScreen/>
                                </Route>
                                <Route path="/admin">
                                    <AdminScreen/>
                                </Route>
                                <Route path="/">
                                    <HomeScreen/>
                                </Route>
                            </Switch>
                        </Router>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Layout;
