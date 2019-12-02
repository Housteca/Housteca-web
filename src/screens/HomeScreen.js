import React from 'react';
import {withRouter} from "react-router-dom";


class HomeScreen extends React.Component {
    componentDidMount() {
        // TODO: determine whether the user is a borrower or an investor and navigate to the next screen
    }

    render() {
        return (
            <div>
                <h1>HOME SCREEN</h1>
            </div>
        );
    }
}

export default withRouter(HomeScreen);
