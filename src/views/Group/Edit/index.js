import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from "../../../Components/api";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Toast from '../../../Components/Toast';
import Image from '../../../Components/ImageInput';
import '../group.css';

class Edit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      group: this.props.match.params.id ? this.props.match.params.id : 0,
      hasError: false,
      members: [JSON.parse(localStorage.getItem('user'))],
      memberName: '',
      suggestions: [],
      hasGroup: false,
    };

    this.getGroup();
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps(props) {
    let group = [];
    if (props.group) {
      group = {
        groupName: props.group.groupName,
        logourl: props.group.logo,
        bannerurl: props.group.frontPageImage
      };

      this.setState({
        name: props.group.groupName,
        group: group
      })
    }
  }

  onLogoChange(logo) {
    if (logo) {
      let group = {};
      if (this.state.group) {
        group = this.state.group;
      }
      group.logourl = logo;
      this.setState({
        group: group
      });
    }
  }

  onBannerChange(banner) {
    if (banner) {
      let group = {};
      if (this.state.group) {
        group = this.state.group;
      }
      group.bannerurl = banner;
      this.setState({
        group: group
      });
    }
  }

  createGroup = async () => {
    console.log('test');
    const group = await {
      groupName: this.state.name,
      bannerurl: this.state.group.bannerurl,
      logourl: this.state.group.logourl
    };

    if (group && group.groupName && group.logourl && group.bannerurl) {
      let message = await API.post('/group', group, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {
          window.location.pathname = '/group/' + res.data.group_id;
        })
        .catch(function (error) {
          console.log(error);
          return {
            message: 'Une erreur est survenu le groupe n\'a pas été créé.',
          };
        });
      this.setState({
        hasError: message,
      })
    }
    else {
      this.setState({
        hasError: {
          message: 'Veuillez completer tous les champs disponible.'
        }
      });
    }
  };

  editGroup = async () => {

    const group = await {
      groupName: this.state.name,
      bannerurl: this.state.group.bannerurl ? this.state.group.bannerurl : this.state.group.frontPageImage,
      logourl: this.state.group.logourl ? this.state.group.logourl : this.state.group.logo,
    };

    let message = await API.put('/group', group, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }})
      .then(function (res) {
        return {
          message: 'Votre profil a bien été mis à jour.',
        };
      })
      .catch(function (error) {
        console.log(error);
        return {
          message: 'Une erreur est survenu votre profile n\'a pas été mis à jour.',
        };
      });

    this.setState({
      hasError: message,
    })

    // this.props.onSubmit(group);
  };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  getGroup = async () => {
    const { id } = this.props.match.params;
    if (id) {
      let group = await API.get('/group/' + id, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {
          if (!res.data.data.length) {
            return res.data.data;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      this.setState({
        name: group.groupName,
        group: group,
        hasGroup: true,
      });
    }
  };

  closeError = () => {
    this.setState({
      hasError: false
    })
  };

  render () {

    const { name, group, hasError, hasGroup } = this.state;

    const logoStyle = {
      image: (group && group.logo) ? 'logo-image fill' : 'logo-image',
      dialog: 'test'
    };

    let toast = null;
    if (hasError) {
      toast = (
        <Toast
          open={true}
          onClose={this.closeError}
          message={hasError ? hasError.message : ''}
        />
      )
    }

    return (
      <Grid container justify="center">
        <Grid item xs={12} lg={9}>
          <h1>{(hasGroup ? 'Modifier le groupe' : 'Création de groupe')}</h1>
          <form>
            <TextField
              id="group-name"
              label="Choisir un nom"
              name='name'
              className="group-name"
              value={name}
              onChange={this.handleChange}
              // classes={style}
            />

            <Grid container>
              <Grid item xs={12} lg={3}>
                <h2 className="group-field-title">Logo</h2>
                <Image image={group.logo} onClick={this.onLogoChange.bind(this)} style={logoStyle}/>
              </Grid>
              <Grid item xs={12} lg={9}>
                <h2 className="group-field-title">Bannière</h2>
                <Image image={group.frontPageImage} onClick={this.onBannerChange.bind(this)} button={true} style={{image: 'banner-image', dialog: 'test'}}/>
              </Grid>
            </Grid>

            <Button className="btn-start btn-right" onClick={(hasGroup ? this.editGroup : this.createGroup)}>VALIDER</Button>
          </form>
        </Grid>
        { toast }
      </Grid>
    )

  }
}

Edit.propTypes = {
  group: PropTypes.object,
  onSubmit: PropTypes.func
};

export default Edit;