import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from '../../../../../Components/api';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

class Form extends Component{

  constructor (props) {
    super(props);

    const { user } = this.props;

    this.state = {
      type: '',
      project: '',
      description: (user.description)?user.description:'',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = async (event) => {
    await event.preventDefault();

    const ret = await API.post('/me/artist/', {}, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(async (res) => {

        const ret = API.get('/me', {
          headers: {
            'authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
          .then(function (res) {
            const info = res.data.data;
            let data = {
              avatarurl: info.avatarurl,
              email: info.email,
              follower_count: info.follower_count,
              following_count: info.following_count,
              gender: info.gender,
              id: info.id,
              status: info.status,
              username: info.username,
              birthdate: info.birthdate,
              description: info.description,
              firstname: info.firstname,
              lastname: info.lastname,
            };
            localStorage.setItem('user', JSON.stringify(data));
            return {
              message: 'Votre demande a bien été envoyée.',
            };
          })
          .catch(function (error) {
            console.log(error)
          });

        return ret;
        // console.log(res);
        // window.location.pathname = '/profile'
      })
      .catch(function (error) {
        console.log(error);
        return {
          message: 'Cette opération a échoué veuillez essayer plus tard.',
        };
      });

    this.props.onError(ret);
  };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <form className="profile-identity-form" onSubmit={this.handleSubmit}>
        <FormControl fullWidth={true} required={true}>
          <InputLabel htmlFor="type">Type d'art</InputLabel>
          <Input
            id="type"
            name="type"
            type="text"
            value={this.state.type}
            onChange={this.handleChange}
          />
        </FormControl>
        <FormControl fullWidth={true} required={true}>
          <InputLabel htmlFor="project">Projet achevé(s)</InputLabel>
          <Input
            id="project"
            name="project"
            type="text"
            value={this.state.project}
            onChange={this.handleChange}
          />
        </FormControl>
        {/*<FormControl fullWidth={true} required={true}>*/}
        {/*<InputLabel htmlFor="description">Description</InputLabel>*/}
        {/*<Input*/}
        {/*id="description"*/}
        {/*name="description"*/}
        {/*type="text"*/}
        {/*value={this.state.description}*/}
        {/*onChange={this.handleChange}*/}
        {/*/>*/}
        {/*</FormControl>*/}
        <input
          type="submit"
          value="DEVENIR ARTISTE"
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