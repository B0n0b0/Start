import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Login from '../Login/index';
import Register from '../Register/index';

class Selector extends Component{

  constructor(props) {
    super(props);

    this.state = {
      loginForm: false,
    };
  }

  clickRegister = (event) => {
    this.setState({
      loginForm: !this.state.loginForm
    })
  };

  clickLogin = (event) => {
    this.setState({
      loginForm: !this.state.loginForm
    })
  };

  getResponse = (message) => {
    if (message.status) {
      this.setState({
        loginForm: !this.state.loginForm,
      })
    }
    this.props.onError(message);
  };

  render() {

    const { loginForm } = this.state;

    if (localStorage.getItem('token')) {
      return <Redirect to="/"/>
    }

    return (
      <div className="sign-selector">
        <Login
          className={{
            login: (!loginForm) ? 'hide' : '',
            form: 'form-login-page login-form',
          }}
          action={this.clickRegister}
          onError={this.getResponse}
        />
        <Register
          className={{
            register: (loginForm) ? 'hide' : '',
            form: 'form-login-page login-form',
          }}
          action={this.clickLogin}
          onError={this.getResponse}
        />
      </div>
    );
  }
}

export default Selector;