import React from "react";

class List extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className="listItem">
                    <img className="listImg" src="../screens/cat.jpg"/>
                    <p>blabla</p>
                </div>
            </div>
        );
    }
}

export default List;