import { Component } from 'react';
import PropTypes from 'prop-types';

export class Marker extends Component {

    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) ||
            (this.props.lat !== prevProps.lat) ||
            (this.props.lng !== prevProps.lng)) {
            this.renderMarker();
        }
    }

    renderMarker() {
        let {
            map, google, lat, lng
        } = this.props;

        let position = new google.maps.LatLng(lat, lng);

        const pref = {
            map: map,
            position: position
        };
        this.marker = new google.maps.Marker(pref);
    }

    render() {
        return null;
    }
}

Marker.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    map: PropTypes.object
};