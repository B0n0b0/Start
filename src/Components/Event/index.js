import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import API from '../../Components/api';
import { GoogleApiWrapper } from 'google-maps-react';
import Grid from '@material-ui/core/Grid';
import FormEvent from './form';
import Toast from '../Toast';
import './style.css';

class Event extends Component {

  constructor (props) {
    super(props);

    const id = this.props.match.params.id;
    this.state = {
      id: id ? id : '',
      event: null,
      error: null,
    };

    this.getEvent();
  };

  getEvent = async () => {
    const { id } = this.state;

    if (id) {
      const event = await API.get(`/events/${id}`)
        .then(function (res) {
          return res.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      this.setState({
        event: event
      });
    }
  };

  closeError = () => {
    this.setState({
      error: null
    });
  };

  toggleArtist = (list, artists, isAdd) => {
    const { event } = this.state;

    for (let i = 0; i < list.length; i++) {
      const id = list[i].id ? list[i].id : list[i].user_id;
      let exist = artists.findIndex((element) => {
        const elemId = element.id ? element.id : element.user_id;
        return elemId === id;
      });

      if (exist < 0) {
        const data = {
          user_id: list[i].id ? list[i].id : list[i].user_id,
        };
        if (isAdd) {
          API.put(`/events/${event.id}/artists`, data, {
            headers: {
              'authorization': 'Bearer ' + localStorage.getItem('token')
            }
          })
            .then(function (data) {
              console.log(data);
            }).catch(function (error) {
            console.log(error);
          });
        } else {
          API.delete(`/events/${event.id}/artists`, {
            headers: {
              'authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: data,
          })
            .then(function (data) {
              console.log(data);
            }).catch(function (error) {
            console.log(error);
          });
          console.log('removed');
        }
      }
    }
  };

  createEvent = async (event) => {
    let message = await API.post('/events', event, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(function (res) {
      return 'Évenement créé.'
    }).catch(function (error) {
      console.log(error);
      return 'Le site rencontre actuellement un problème veuillez réessayer plus tard.'
    });

    this.setState({
      error: {
        message: message,
      }
    });
  };

  editEvent = async (event) => {
    const { artists } = event;
    const eventArtists = this.state.event.artists;
    const self = this;

    let message = await API.put(`/events/${this.state.id}`, event, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(function (res) {
      self.toggleArtist(artists, eventArtists, true);
      self.toggleArtist(eventArtists, artists, false);
      return 'Évenement modifié avec succès.'
    }).catch(function (error) {
      console.log(error);
      return 'Le site rencontre actuellement un problème veuillez réessayer plus tard.'
    });

    this.setState({
      event: event,
      error: {
        message: message,
      }
    });
  };

  onSubmit = (data) => {
    if (data.status === 'fail') {
      this.setState({
        error: {
          message: data.data.message,
        }
      });
    } else {
      if (this.state.id) {
        this.editEvent(data.data);
      } else {
        this.createEvent(data.data);
      }
    }
  };

  render() {
    const { event, error } = this.state;
    const artists = event ? event.artists.slice() : null;

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

    return (
      <Grid container justify="center">
        {/*<Link to={'/profile'}>Retour au profil</Link>*/}
        <Grid item xs={12} lg={9} className="event-edit">
          <h1>{ this.state.id ? 'Modifier l\'' : 'Nouvel ' }évenement</h1>
          <Link to={'/profile'} className="event-btn">Revenir au profil</Link>
          <FormEvent event={event} artists={artists} onSubmit={this.onSubmit}/>
        </Grid>
        { toast }
      </Grid>
    );
  }
}

Event.propTypes = {
};

export default GoogleApiWrapper({
  apiKey: ('AIzaSyB4EIBjMcnEXFpiJUd0vb_16LErfBcA4HM'),
  libraries: ['places']
}) (Event);