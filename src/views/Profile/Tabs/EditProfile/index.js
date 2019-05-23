import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IdentityForm from './IdentityForm';
import ArtistForm from './ArtistForm';
import Image from '../../../../Components/ImageInput';
import Toast from '../../../../Components/Toast';
import API from "../../../../Components/api";

const currentUser = JSON.parse(localStorage.getItem('user'));

class EditProfile extends Component {

  constructor (props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  onLogoChange(logo) {
    if (logo) {
      const self = this;
      const user = {
        avatarurl: logo,
      };

      API.put('/users', user, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {
          currentUser.avatarurl = logo;
          localStorage.setItem('user', JSON.stringify(currentUser));
          window.location.pathname = '/profile/edit'
        })
        .catch(function (error) {
            self.setState({
              error: {
                  message: 'Une erreur est survenue veuillez essayer plus tard.'
              }
            });
          console.log(error);
        });
    }
  }

  setError = async (error) => {
    await this.setState({
      error: error
    });
  };

  closeError = () => {
    this.setState({
      error: null
    });
  };

  render() {

    const { error } = this.state;

    let toast = null;
    if (error) {
      toast = (
        <Toast
          open={true}
          onClose={this.closeError}
          message={error ? error.message : ''}
        />
      )
    }

    console.log(currentUser);
    const logoStyle = {
      image: (currentUser && currentUser.avatarurl) ? 'logo-image fill' : 'logo-image',
      dialog: 'test'
    };

    return (
      <Grid id="" container justify="center">
        <Grid item xs={12} md={10}>
          <h1>Modifier votre profil</h1>
          <Image image={currentUser.avatarurl} onClick={this.onLogoChange.bind(this)} style={logoStyle}/>
          <ExpansionPanel className="profile-expand">
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className="">Données personnelles</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <IdentityForm user={currentUser} onError={this.setError}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {
            (currentUser && currentUser.status !== 2) ?
              <ExpansionPanel className="profile-expand">
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="">Devenir artiste</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <ArtistForm user={currentUser} onError={this.setError}/>
                </ExpansionPanelDetails>
              </ExpansionPanel> : null
          }
        </Grid>
        { toast }
      </Grid>
    )
  }
}

export default EditProfile;