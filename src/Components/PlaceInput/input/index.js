import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PlaceInput extends Component {

  constructor (props) {
    super(props);

    this.state = {
      address: '',
    };
  };

  render() {

    const { getInputProps, suggestions, getSuggestionItemProps, loading } = this.props;
    return (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
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
    );
  }
}

PlaceInput.propTypes = {
};

export default PlaceInput;