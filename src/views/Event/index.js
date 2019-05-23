import React, { Component } from 'react';
import API from '../../Components/api';
import Content from './Content';
import './style.css';

class Event extends Component {

  constructor (props) {
    super(props);

    const id = this.props.match.params.id;
    this.state = {
      id: id,
      event: null,
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

  render() {
    const { event } = this.state;

    return (
      <div id="event-public">
        { event ? <Content event={event}/> : '' }
      </div>
    );
  }
}

Event.propTypes = {
};

export default Event;