import React from 'react';
import AppHeader from "./AppHeader";
import {
    Grid,
    Menu,
    Segment
} from "semantic-ui-react";
import {
    BrowserRouter,
    Route,
    Switch
} from "react-router-dom";
import { createBrowserHistory } from "history";
import HomeScreen from "../screens/HomeScreen";


class Layout extends React.Component {
    state = {activeItem: 1};
    history = createBrowserHistory();
    items = [
        {title: 'new investment', path: '/new'},
        {title: 'investments', path: '/'},
        {title: 'admin', path: '/admin'},
    ];

    handleItemClick = index => {
        const item = this.items[index];
        this.setState({activeItem: index});
        this.history.push(item.path)
    };

    renderItems = () => {
        return this.items.map((item, index) => <Menu.Item
            active={this.state.activeItem === index}
            name={item.title}
            key={item.title}
            onClick={() => this.handleItemClick(index)}
        />);
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
                    <Grid.Column width={13}>
                        <Segment>
                            <BrowserRouter history={this.history}>
                                <Switch>
                                    <Route path="/">
                                        <HomeScreen/>
                                    </Route>
                                </Switch>
                            </BrowserRouter>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Layout;
