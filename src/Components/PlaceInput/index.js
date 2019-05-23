import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';
import './style.css';

class Place extends Component {

  constructor (props) {
    super(props);

    this.state = {
      address: '',
      open: false,
    };
  };

  componentWillReceiveProps = (props) => {
    if (props) {
      this.setState({
        address: props.address,
      })
    }
  };

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = async address => {
    const place = await geocodeByAddress(address)
      .then(results => {
        return results[0];
      })
      .then(result => {
        return result;
      })
      .catch(error => console.error('Error', error));
    this.props.onSelect({
      address: place,
      latLng: await getLatLng(place),
    })
  };

  onClose = (event) => {
    this.setState({
      open: false,
    })
  };

  render() {

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="place-suggest">
            <TextField
              {...getInputProps({
                placeholder: 'Rechercher une adresse',
                className: `location-search-input ${this.props.classes.root ? this.props.classes.root : ''}`,
                fullWidth: true,
                label: 'Adresse',
              })}
            />
            {loading && <div>Loading...</div>}
            <div className="suggestion-list">
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

Place.propTypes = {
  address: PropTypes.string.isRequired,
  classes: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

export default Place;