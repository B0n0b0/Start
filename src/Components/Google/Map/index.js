import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import './map.css'

const style = {
    position : 'relative',
    display : 'flex',
    width: '100%',
    height: '-webkit-fill-available',
    maxHeight : '50%',
};

const styleG = {
    position : 'relative', 
    margin : 'auto'
};


export class MapContainer extends Component {


    constructor (props) {
        super(props);
        this.state = {
            addMarker: (this.props.addMarker),
            position: {
            },
            zoom: this.props.zoom
        };
    }

    componentWillReceiveProps(props) {

        this.setState({
            position: {
                lat : props.initialCenter.lat,
                lng : props.initialCenter.lng
            },
            zoom: props.zoom
        });
    }

    renderChildren() {
        const {children} = this.props;

        if (!children)
            return;

        return React.Children.map(children, child => {
            return React.cloneElement(child, {
                map: this.map,
                google: this.props.google,
                mapCenter: this.props.initialCenter
            })
        })
    }
    
    centerMoved(mapProps, map) {
  console.log('center moved 2')// ...
}


    render () {
        let { initialCenter } = this.props;

        const children = this.renderChildren();

        return (
            <div className='MapDiv' style={styleG}>
                <Map google={this.props.google} zoom={this.state.zoom} initialCenter={initialCenter} center={initialCenter} style={style} onDragend={this.props.onDragend} onClick={this.props.onClick}>
                    { children }
                </Map>
            </div>
        )
    }
}

MapContainer.propTypes = {
    google: PropTypes.object,
    addMarker: PropTypes.bool,
    zoom: PropTypes.number.isRequired,
    initialCenter: PropTypes.object.isRequired
};

export default GoogleApiWrapper({
    apiKey: ('AIzaSyB4EIBjMcnEXFpiJUd0vb_16LErfBcA4HM'),
    libraries: ['places']
}) (MapContainer);