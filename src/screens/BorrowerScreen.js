import React from "react";
import {withRouter} from "react-router-dom";

import List from "../components/List"
import MainView from '../MainView';


class BorrowerScreen extends MainView {
    constructor(props) {                                                                             
        super(props);                                                                                
        this.state = {                                                                               
            ...this.state,                                                                           
            title: 'Borrower',                                                                       
            items: ['new exchange', 'funds', 'authorization']                                        
        };                                                                                           
    }

    renderSelectedComponent = () => {
        return (
            <div>
              <MainView/>
                  <List/>
                  <List/>
            </div>
          );
    };
}

export default withRouter(BorrowerScreen);
