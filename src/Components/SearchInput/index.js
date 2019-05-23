import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Grid from '@material-ui/core/Grid';
import Avatar from '../../Components/ProfileAvatar';
import API from "../api";

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
  <Grid container className="suggestion-user">
    <Grid item sm={2}>
      <Avatar className="profile-avatar-small" avatar={suggestion.avatarurl} isPrivate={true}/>
    </Grid>
    <Grid item sm={9} className="grid-username">
      <div className="suggest-username">{suggestion.username}</div>
    </Grid>
  </Grid>
);

export const SearchType = {
  ALLUSER: 0,
  POST: 1,
  GROUP: 2,
  ARTIST: 3,
};

class SearchInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      suggestions: []
    }
  }

  onChange = (event, { newValue }) => {
    this.setState({
      name: newValue
    });
  };

  onEnter = (event) => {
    if (event.key === 'Enter' && !this.state.suggest) {
      window.location = `/search/${this.state.name}`
    }
  };

  getSuggestions = async (value) => {
    const { type, suggest } = this.props;

    if (suggest) {
      const inputLength = await value.length;
      if (inputLength === 0) {
        return [];
      }

      const search = await {
        limit: 100,
        page: 1,
        searchType: this.props.type,
        searchTerm: value
      };

      const list = await API.put('/search', search, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(function (res) {
        const data = res.data;
        if (type === SearchType.ARTIST) {
          return data.artists.docs;
        } else if (type === SearchType.ALLUSER) {
          return data.results.docs;
        }
        return [];
      }).catch(function (error) {
        console.log(error);
      });

      return list.map(function (elem) {
        if (elem.avatarurl && !elem.avatarurl.match(/^(http|https):/g)) {
          elem.avatarurl = '';
        }

        return elem;
      });
    }
    return [];
  };

  onSelectedSuggestion = async (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {

    this.props.onSelect(suggestion);
    // let members = this.state.members;
    // let exist = await members.find(function (element) {
    //   return suggestion.id === element.id
    // });
    //
    // if (!exist) {
    //   let artist = {
    //     artist_id: suggestion.id,
    //     group_id: this.state.group.id
    //   };
    //
    //   API.put('group/artists', artist, {
    //     headers: {
    //       'authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(function (res) {
    //     console.log(res);
    //   }).catch(function (error) {
    //     console.log(error);
    //   });
    //   members.push(suggestion);
    //   this.setState({
    //     members: members
    //   });
    // }
  };

  fetchSuggestions = async ({ value }) => {
    const list = await this.getSuggestions(value);

    this.setState({
      suggestions: list
    });
  };

  clearSuggestions = () => {
    this.setState({
      suggestions: []
    });
  };

  render () {

    let { name, suggestions } = this.state;
    let { placeholder, classes } = this.props;

    const inputProps = {
      placeholder: placeholder ? placeholder : 'Rechercher',
      value: (name) ? name : '',
      onChange: this.onChange,
      onKeyUp: this.onEnter,
      className: classes && classes.root ? classes.root : ''
      // onKeyUp: this.props.search
    };

    return (
      <div>
        <Autosuggest
          // className="navbar-search"
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.fetchSuggestions}
          onSuggestionsClearRequested={this.clearSuggestions}
          onSuggestionSelected={this.onSelectedSuggestion}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    )
  }
}

SearchInput.propTypes = {
  type: PropTypes.number.isRequired,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  classes: PropTypes.object,
  suggest: PropTypes.bool
};

export default SearchInput;