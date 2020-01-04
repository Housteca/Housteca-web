import React from 'react';
import { withRouter } from "react-router-dom";
import { getLoanContract } from "../utils/contracts";
import emptyImage from "../images/empty.png";
import ImageViewer from "../components/ImageViewer";


class InvestmentDetailScreen extends React.Component {
    state = {
        contract: null,
        images: [],
        details: {}
    };

    componentDidMount = async () => {
        const contractAddress = this.props.location.pathname.replace('/details/', '').replace('/', '');
        const contract = await getLoanContract(contractAddress);
        const details = await contract.methods.details().call();
        let images = await contract.methods.images().call();
        if (images.length === 0) {
            images = [emptyImage];
        } else {
            images = images.map(hash => `https://ipfs.io/ipfs/${hash}`);
        }
        this.setState({contract, images, details});
    };

    renderImageViewer = () => {
        const {images} = this.state;
        if (images.length  > 0) {
            return <ImageViewer images={images}/>;
        }
    };

    render() {
        const {details} = this.state;
        return (
            <div>
                {this.renderImageViewer()}
            </div>
        );
    }
}

export default withRouter(InvestmentDetailScreen);
