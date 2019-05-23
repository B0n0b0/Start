import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from "../../../Components/api";
import { Link } from 'react-router-dom';
import Moment from "react-moment";
import Grid from '@material-ui/core/Grid';
import Map from '../../../Components/Google/Map'
import {Marker} from "../../../Components/Marker";
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import Popup from "reactjs-popup";
import Payments from '../../../Components/Payment/Payments';

const styleMap = {
  height : "300px",
  paddingTop : "12px"
}

class Event extends Component {

  constructor (props) {
    super(props);

    this.handleFollow = this.handleFollow.bind(this);

  };

  handleFollow(){
    API.put('/me/events/'+ this.props.event.id + '/join', '' , {                  
      headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')}
      })
      console.log('bonjour')
  }

  render() {
    const { event} = this.props;
    console.log(event);
    return (
      <div id="event-public">
        <div style={{backgroundImage: `url("${event.cover}")`}} className="event-banner"></div>
        <Grid container justify="center">
          <Grid item xs={12} lg={8} className="event-content">
            <div  className="price ">
            {event.price}€ <br></br>
            {event.ticket_left ? 
              <div>{event.price ? <Popup trigger={<Button className="acheter-button">
                  Acheter
                  <AddShoppingCartIcon />
                </Button> } modal>
                  {close => (
                    <div className="modal">
                      <a className="close" onClick={close}>
                        &times;
                      </a>
                      <div className="header"> Acheter un billet à {event.price}€</div>
                      <div className="actions">
                      <Payments id={event.id} price={event.price} type={2}/>

                      </div>
                    </div>
                  )}
              </Popup> : 
                <Button className="acheter-button" onClick={this.handleFollow}>
                  Participer
                </Button>} 
              </div> :
              <Button className="full" disabled > Complet <RemoveShoppingCartIcon /></Button>
             }
            </div>

            
            <h1>{event ? event.name : ''}</h1>
            <p className="description">{event.description}</p>
            <p className="address">{event.street_address}</p>

            <div>
              Du <Moment className="date" format="DD/MM/YYYY">{event.start_time}</Moment> au <Moment className="date" format="DD/MM/YYYY">{event.end_time}</Moment>
              {/*<Moment className="date" to={event.start_time}>{event.end_time}</Moment>*/}
            </div>
          </Grid>
          <Grid item xs={12} lg={8} className="event-map event-content" style={styleMap}>
          <div style={styleMap}>
            <Map
              initialCenter={{
                lat: event.latitude,
                lng: event.longitude,
              }}
              zoom={15}
            >
              <Marker lat={event.latitude} lng={event.longitude}/>
            </Map>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
};

export default Event;