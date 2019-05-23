import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import API from '../../../../Components/api';
import Grid from '@material-ui/core/Grid';
import List from "./List";
import "./style.css";

class Event extends Component {

  constructor (props) {
    super(props);

    this.state = {
      eventLimit: 4,
      eventPage: 1,
      eventPageAttendee: 1,
      myEvent: [],
      myEventAttendee: [],
      moreEvent: true,
      moreEventAttendee: true,
    };

  };

  componentWillReceiveProps = (props) => {
    this.getMyEvents();
    this.getMyEventsAttendee();
  };

  getMyEvents = async () => {
    const { eventLimit, eventPage } = this.state;
    const { user } = this.props;

    if (user) {
      const events = await API.get(`/users/${user.id}/events/owner`, {
        params: {
          limit: eventLimit,
          page: eventPage,
        }
      })
        .then(function (res) {
          return res.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      if (events) {
        let items = await this.state.myEvent;
        for (let i = 0; i < events.results.length; i++) {
          items.push(events.results[i]);
        }

        this.setState({
          myEvent: items,
          eventPage: eventPage + 1,
          moreEvent: events.total > items.length,
        });
      }
    }
  };

  getMyEventsAttendee = async () => {
    const { eventLimit, eventPageAttendee } = this.state;
    const { user } = this.props;

    if (user) {
      const events = await API.get(`/users/${user.id}/events/attendee`, {
        params: {
          limit: eventLimit,
          page: eventPageAttendee,
        }
      })
        .then(function (res) {
          return res.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      if (events) {
        let items = await this.state.myEventAttendee;
        for (let i = 0; i < events.results.length; i++) {
          items.push(events.results[i]);
        }

        this.setState({
          myEventAttendee: items,
          eventPageAttendee: eventPageAttendee + 1,
          moreEventAttendee: events.total > items.length,
        });
      }
    }
  };

  render() {
    const { myEvent, moreEvent, myEventAttendee, moreEventAttendee } = this.state;
    const { user, isPrivate } = this.props;

    let buttons = [];
    let events = [];
    if (user && user.status === 2 && !isPrivate) {
      buttons.push(<Link key={0} to="/event/edit" className="create-event-button">Créer un évenement</Link>);
      events.push(<h1 key={0}>Mes évenements</h1>);
      events.push(<List key={1} list={myEvent} editable={true} moreFunc={moreEvent ? this.getMyEvents : null} empty="Vous n'avez créé aucun évenement."/>);
    }

    return (
      <Grid container className="event-tabs">
        <Grid item xs={12}>
          { buttons }
          { events }
          <h1>Les évenements suivis</h1>
          <List list={myEventAttendee} editable={false} moreFunc={moreEventAttendee ? this.getMyEventsAttendee : null} empty={`${user ? user.username : ''} n'est inscrit à aucun événement.`}/>
        </Grid>
      </Grid>
    )
  }
}

Event.propTypes = {
  user: PropTypes.object,
  isPrivate: PropTypes.bool.isRequired,
};

export default Event;