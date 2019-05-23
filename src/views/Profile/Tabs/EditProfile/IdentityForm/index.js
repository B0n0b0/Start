import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from "../../../../../Components/api";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

class Form extends Component{

  constructor (props) {
    super(props);

    const { user } = this.props;

    this.state = {
      firstname: (user.firstname)?user.firstname:'',
      lastname: (user.lastname)?user.lastname:'',
      birthdate: (user.birthdate)?user.birthdate:'',
      description: (user.description)?user.description:'',
      gender: (user.gender)?user.gender + '':'0',
      address: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSubmit = async (event) => {
    await event.preventDefault();

    const user = await {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      birthdate: this.state.birthdate,
      description: this.state.description,
      gender: this.state.gender,
    };

    const ret = await API.put('/users', user, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(async (res) => {

        const ret = await API.get('/me', {
          headers: {
            'authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
          .then(function (res) {
            localStorage.setItem('user', JSON.stringify(res.data.data));

            return {
              message: 'Votre profil a bien été mis à jour.',
            };
          })
          .catch(function (error) {
            console.log(error);
            return {
              message: 'Une erreur est survenue veuillez essayer plus tard.',
            };
          });
        return ret;
      })
      .catch(function (error) {
        console.log(error);
        return {
          message: 'Une erreur est survenue veuillez essayer plus tard.',
        };
      });

    return this.props.onError(ret);
  };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Index', error))
  };

  render() {
    return (
      <form className="profile-identity-form" onSubmit={this.handleSubmit}>
        <FormControl fullWidth={true} required={true}>
          <InputLabel htmlFor="firstname">Prénom</InputLabel>
          <Input
            id="firstname"
            name="firstname"
            type="text"
            value={this.state.firstname}
            onChange={this.handleChange}
          />
        </FormControl>
        <FormControl fullWidth={true} required={true}>
          <InputLabel htmlFor="lastname">Nom de famille</InputLabel>
          <Input
            id="lastname"
            name="lastname"
            type="text"
            value={this.state.lastname}
            onChange={this.handleChange}
          />
        </FormControl>

        <FormControl fullWidth={true} required={false}>
          <FormLabel component="legend">Genre</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            // className={classes.group}
            value={this.state.gender}
            onChange={this.handleChange}
          >
            <FormControlLabel value="0" control={<Radio color="default" />} label="Homme" />
            <FormControlLabel value="1" control={<Radio color="default" />} label="Femme" />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth={true} required={true}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            id="description"
            name="description"
            type="text"
            value={this.state.description}
            onChange={this.handleChange}
          />
        </FormControl>

        {/*<PlacesAutocomplete*/}
        {/*value={this.state.address}*/}
        {/*onChange={this.handleChange}*/}
        {/*onSelect={this.handleSelect}*/}
        {/*>*/}
        {/*{({ getInputProps, getSuggestionItemProps, suggestions }) => (*/}
        {/*<div className="autocomplete-root">*/}
        {/*<input {...getInputProps()} />*/}
        {/*<div className="autocomplete-dropdown-container">*/}
        {/*{suggestions.map(suggestion => (*/}
        {/*<div {...getSuggestionItemProps(suggestion)}>*/}
        {/*<span>{suggestion.description}</span>*/}
        {/*</div>*/}
        {/*))}*/}
        {/*</div>*/}
        {/*</div>*/}
        {/*)}*/}
        {/*</PlacesAutocomplete>*/}

        <FormControl fullWidth={true} required={false}>
          {/*<InputLabel htmlFor="birthdate">Date de naissance</InputLabel>*/}
          <TextField
            id="birthdate"
            name="birthdate"
            label="Date de naissance"
            type="date"
            value={this.state.birthdate}
            onChange={this.handleChange}
            // defaultValue=""
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <input
          type="submit"
          value="ENREGISTER"
          className="btn-start-art btn-form btn-rounded btn-contained"
        />
      </form>
    )
  }
}

Form.propTypes = {
  user: PropTypes.object.isRequired,
  onError: PropTypes.func.isRequired
};

export default Form;