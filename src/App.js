import {BrowserRouter, Route, Switch,} from 'react-router-dom';

import React from "react";
import HomeScreen from "./screens/HomeScreen";
import InvestorScreen from "./screens/InvestorScreen";
import BorrowerScreen from "./screens/BorrowerScreen";


class App extends React.Component {
    render() {
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
