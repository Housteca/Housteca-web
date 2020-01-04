import {
    Frame,
    Track,
    View,
    ViewPager
} from "react-view-pager";
import React from "react";
import { Image } from "semantic-ui-react";

const renderElements = elements => {
    return elements.map(element => <View key={element} className="view"><Image src={element}/></View>)
};


let track = null;
const ImageViewer = props => {
    const images = props.images || [];
    return (
        <ViewPager tag="main">
            <Frame className="frame">
                <Track
                    ref={c => track = c}
                    viewsToShow={2}
                    className="track">
                    {renderElements(images)}
                </Track>
            </Frame>
            <nav>
                <a
                    className="pager-control pager-control--prev"
                    onClick={() => track.prev()}>
                    Prev
                </a>
                <a
                    className="pager-control pager-control--next"
                    onClick={() => track.next()}>
                    Next
                </a>
            </nav>
        </ViewPager>
    );
};

export default ImageViewer;
