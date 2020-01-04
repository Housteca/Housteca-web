import React from 'react';
import AppHeader from "./AppHeader";
import {
    Card,
    Grid,
    Header,
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
import { getHoustecaContract } from "../utils/contracts";


class Layout extends React.Component {
    state = {activeItem: 2, events: []};
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

    renderEvents = () => {
        return this.state.events.map(({title, description}) => {
            return (
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{title}</Card.Header>
                        <Card.Meta>{description}</Card.Meta>
                    </Card.Content>
                </Card>
            )
        });
    };

    componentDidMount = async () => {
        const index = this.items.map(i => i.path).indexOf(this.history.location.pathname);
        if (index >= 0) {
            this.setState({activeItem: index});
        }
        const contract = await getHoustecaContract();
        const events = await contract.getPastEvents('allEvents', {fromBlock: 0});
        const parsedEvents = events.reverse().map(event => {
            const data = event.returnValues;
            switch (event.event) {
                case 'InvestmentCreated':
                    return {title: 'Inversión creada', description: data.borrower};
                case 'AdminAdded':
                    return {title: 'Nuevo administrador', description: data.admin};
                case 'TokenAdded':
                    return {title: 'Nuevo token', description: data.symbol};
                case 'InvestorAdded':
                    return {title: 'Nuevo inversor', description: data.investor};
                case 'InvestmentProposalCreated':
                    return {title: 'Nueva proposición de inversión', description: data.borrower}
            }
        });
        this.setState({events: parsedEvents});
    };

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
                    <Grid.Column width={10}>
                        <Router history={this.history}>
                            <Switch>
                                <Route path="/new">
                                    <CreateInvestmentProposalScreen/>
                                </Route>
                                <Route path="/proposals">
                                    <ViewInvestmentProposalsScreen/>
                                </Route>
                                <Route path="/details">
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
                    <Grid.Column width={4}>
                        <Header as="h2">Últimos eventos</Header>
                        {this.renderEvents()}
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Layout;
