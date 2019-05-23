import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const style = {
    width: '100%',
    height: '500px',
    maxHeight : '50%',
    display: 'flex',
};

const evtNames = ['click'];

export default class StartMap extends Component {

    constructor (props) {
        super(props);

        this.state = {
            position: {
                lat : this.props.initialCenter.lat,
                lng :this.props.initialCenter.lng
            }
        };

        // console.log('test')

    }

    componentDidMount() {
        this.loadMap();
    }

    componentWillReceiveProps(props) {

        this.setState({
            position: {
                lat : props.initialCenter.lat,
                lng : props.initialCenter.lng
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps);

        if (prevProps.google !== this.props.google) {
            console.log(this);
            this.loadMap();
        }
    }

    loadMap() {
        if (this.props && this.props.google) {
            // google is available
            const {google} = this.props;
            const maps = google.maps;

            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);

            let {initialCenter, zoom} = this.props;
            const {lat, lng} = initialCenter;
            const center = new maps.LatLng(lat, lng);
            const mapConfig = Object.assign({}, {
                center: center,
                zoom: zoom
            });
            this.map = new maps.Map(node, mapConfig);

            evtNames.forEach(e => {
                if (e === 'click' && this.props.addMarker)
                    this.map.addListener('click', this.addMarker.bind('click'))
                // this.map.addListener(e, this.handleEvent.bind(e));
            });
        }
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

    render () {
        const children = this.renderChildren();

        return (
            <div ref='map' className="map-google" style={style}>
                { children }
            </div>
        )
    }
};