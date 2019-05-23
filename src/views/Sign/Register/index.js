import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from '../../../Components/api';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import '../sign.css';
import Login from "../Login";

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      valid: false,
      showPassword: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

  handleClickShowPassword() {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.state.password !== this.state.passwordConfirm) {
      this.props.onError({
        message: 'Le mot de passe et la confirmation sont differentes veuillez réessayer',
      });
      return false;
    }

    if (this.state.email &&  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)) {
      this.props.onError({
        message: 'Votre adresse email est incorrect veuillez réessayer',
      });
      return false;
    }

    const user = {
      username: this.state.nickname,
      email: this.state.email,
      password: this.state.password
    };

    const message = await API.post('/users', user)
      .then(function (res) {
        return {
          status: true,
          message: 'Votre compte a bien été créer',
        };
      })
      .catch(function (error) {
        console.log(error);
        return {
          status: false,
          message: 'Cette adresse mail est déjà utiliser.',
        };
      });
    this.props.onError(message);
  };

  render() {

    const { className } = this.props;

    return (
      <div className={className && className.register ? className.register : ''}>
        <h2>Inscrivez-vous ;)</h2>
        <form className={className && className.form ? className.form : ''} onSubmit={this.handleSubmit}>
          <FormControl fullWidth={true} required={true}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormControl>
          <FormControl fullWidth={true} required={true}>
            <InputLabel htmlFor="password">Mot de passe</InputLabel>
            <Input
              id="password"
              name="password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={this.handleChange}
              endAdornment={
                <InputAdornment position="end" className="visibility-icon">
                  <Icon
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? 'visibility_off' : 'visibility'}
                  </Icon>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl fullWidth={true} required={true}>
            <InputLabel htmlFor="email">Confirmation du mot de passe</InputLabel>
            <Input
              id="passConfirm"
              name="passwordConfirm"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.passwordConfirm}
              onChange={this.handleChange}
              endAdornment={
                <InputAdornment position="end" className="visibility-icon">
                  <Icon
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? 'visibility_off' : 'visibility'}
                  </Icon>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl fullWidth={true} required={true}>
            <InputLabel htmlFor="email">Pseudonyme</InputLabel>
            <Input
              id="nickname"
              name="nickname"
              type="text"
              value={this.state.nickname}
              onChange={this.handleChange}
            />
          </FormControl>
          <div className="form-div-button">
            <input
              type="submit"
              value="INSCRIPTION"
              className="btn-start-art btn-rounded btn-contained"
            />
            <Button
              className={"btn-rounded btn-outlined"}
              variant={"outlined"}
              onClick={this.props.action}
            >
              CONNEXION
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

Login.propTypes = {
  action: PropTypes.func.isRequired,
  className: PropTypes.object,
};

export default Register;