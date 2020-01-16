import {
    Frame,
    Track,
    View,
    ViewPager
} from "react-view-pager";
import React from "react";
import {
    Button,
    Grid,
    Image
} from "semantic-ui-react";

const renderElements = elements => {
    return elements.map(element => <View key={element} className="view"><Image src={element}/></View>)
};

const renderUploadPhotoButton = (shouldRender, fn) => {
    if (shouldRender) {
        return (
            <div key="document-upload">
                <Button htmlFor="file" as="label" color="blue">
                    Subir foto
                </Button>
                <input type="file" id="file" style={{ display: "none" }}
                       onChange={event => {
                           if (fn) fn(event.target.files[0]);
                       }} />
            </div>
        );
    }
};


let track = null;
const ImageViewer = props => {
    const images = props.images || [];
    const uploadFn = props.uploadFn;
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
            <br/>
            <nav>
                <Grid columns={1}>
                    <Grid.Row centered columns={3} textAlign="center">
                        <Grid.Column>
                            <Button color="blue" onClick={() => track.prev()}>
                                {"<"}
                            </Button>
                        </Grid.Column>
                        <Grid.Column centered textAlign="center">
                            {renderUploadPhotoButton(props.canEdit, uploadFn)}
                        </Grid.Column>
                        <Grid.Column centered textAlign="right">
                            <Button color="blue" onClick={() => track.next()}>
                                {">"}
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </nav>
        </ViewPager>
    );
};

export default ImageViewer;
