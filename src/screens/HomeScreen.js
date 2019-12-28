import React from 'react';
import {
    Link,
    withRouter } from "react-router-dom";
import MainView from '../MainView';


class HomeScreen extends MainView{
    componentDidMount() {
        // TODO: determine whether the user is a borrower or an investor and navigate to the next screen
    }

    render() {
        return (
            <div>
                <div className="split left">
                    <div className="centered">
                        <Link to="/borrower"><h1><font color="white">Quiero pedir una hipoteca</font></h1></Link>
                    </div>
                </div>

                <div className="split right">
                    <div className="centered">
                        <Link to="/investor"><h1><font color="white">Quiero ser inversor</font></h1></Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(HomeScreen);
