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

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showPassword: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    await event.preventDefault();

    const user = await {
      email: this.state.email,
      password: this.state.password
    };

    const error = await API.post('/connect', user)
      .then(function (res) {

        let token = res.data.data;
        API.get('/me', {
          headers: {
            'authorization': 'Bearer ' + token
          }
        })
          .then(function (res) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            window.location.pathname = "/";
            console.log(res)
          })
          .catch(function (error) {
            console.log(error)
          });
        return null;

      })
      .catch(function (error) {
        console.log(error);

        return {
          status: false,
          message: 'L\'adresse email ou le mot de passe est incorrect veuillez réessayer',
        };
      });

    if (error) {
      this.props.onError(error);
    }
  };

  render() {

    const { email, password, showPassword } = this.state;
    const { className } = this.props;

    return (
      <div className={className && className.login ? className.login : ''}>
        <h2>Connectez-vous ;)</h2>
        <form className={className && className.form ? className.form : ''} onSubmit={this.handleSubmit}>
          <FormControl fullWidth={true} required={true}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="logEmail"
              name="email"
              type="email"
              value={email}
              onChange={this.handleChange}
            />
          </FormControl>
          <FormControl fullWidth={true} required={true}>
            <InputLabel htmlFor="password">Mot de passe</InputLabel>
            <Input
              id="logPass"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={this.handleChange}
              endAdornment={
                <InputAdornment position="end" className="visibility-icon">
                  <Icon
                    onClick={this.handleClickShowPassword}
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </Icon>
                </InputAdornment>
              }
            />
          </FormControl>
          <div className="form-div-button">
            <Button
              className={"btn-rounded btn-outlined"}
              variant={"outlined"}
              onClick={this.props.action}
            >
              INSCRIPTION
            </Button>
            <input
              type="submit"
              value="CONNEXION"
              className="btn-start-art btn-rounded btn-contained"
            />
          </div>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  action: PropTypes.func.isRequired,
  className: PropTypes.object,
};

export default Login;