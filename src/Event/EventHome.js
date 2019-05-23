import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MapContainer from '../Components/Google/Map';
import API from '../Components/api';
import {Marker} from 'google-maps-react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

        
const style = {
    position : 'relative',
    width : '100%',
}

const sEvent = {
    maxWidth : '80%',
    display : 'flex',
    margin : 'auto',
    paddingBottom : '20px',
    paddingTop: '20px'
}

  const card =  {
    display: 'flex',
    textAlign : 'Center'
  }
  const  details = {
    display: 'flex',
    flexDirection: 'column',
  }
  const content = {
    flex: '1 0 auto',
  }
  const cover = {
    width: 352,
  }
  const controls = {
    display: 'flex',
    alignItems: 'center',
    margin : 'auto',
  }



class EventHome extends Component {
    
    constructor(props) {
        super(props);
            
            this.state = {
                scale : [10, 10, 10, 10, 10, 10, 10, 10, 10, 5, 2,1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01],
                markers : [{lat : 50, lng : 2},
                           {lat : 49, lng : 2}],
                myEvents : [],
                geoEvents : [],
                showingInfoWindow: false,
                activeMarker: {},
                selectedPlace: {},
            }
        let self = this;
        //API.get('/users/' + parseInt(JSON.parse(localStorage.getItem('user')).id) + '/events/owner')

            API.get('/users/' + parseInt(JSON.parse(localStorage.getItem('user')).id) + '/events/owner')
                .then (function (res) {
                    console.log('MyEvent ' + res.data)
                    self.setState({
                        myEvents : res.data.data.results
                        })
                    console.log('MyEvent1 ' + self.state.myEvents)
                }).catch(function(error) {
                    console.log(error);
                    alert('une erreur est survenue');
                })
                
        
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.setState({
                    centerLat : position.coords.latitude ,
                    centerLng : position.coords.longitude
                    })
                API.get('/geosearch?latitude='+ this.state.centerLat + '&longitude=' + this.state.centerLng + '&radius=' + this.state.scale[12 - 1] * 8)
                    .then (function (res) {
                        console.log('GeoEvent ' + res.data.data.results)
                        self.setState({
                            geoEvents : res.data.data.results
                            })
                    }).catch(function(error) {
                        console.log(error);
                        alert('une erreur est survenue');
                        })
                    console.log('position == ' + position.coords.latitude + '--' + position.coords.longitude)
                },
                error => console.log(error));
        

        
        console.log(this.state.markers[0].lat)  

    }
     
    onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      open: true,
    });
    }

    handleClose = () => {
        this.setState({ open: false });
      };

    onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        selectedPlace: {},
      })
    }
  };
    
    handleClick = () => {
        window.location.pathname = '/event/Create';
    }

        handleInfo = (id) => {
        window.location.pathname = '/event/' + id;
    }
    
    toggleCoor = () => {
        console.log('coor' + this.state.lat + ' -- ' + this.state.lng)
    }
    
    getEvent = () => {
        console.log('get Event')
        this.setState({
            test: 1,
        })
        console.log(this.state.test)
    }
    
    getTest = () => {
        console.log(this.state.test)
    }
    
    centerMoved(mapProps, map) {
        console.log(map.getZoom())
        this.setState({
            centerLat : map.getCenter().lat(),
            centerLng : map.getCenter().lng(),
        })
        let self = this
        API.get('/geosearch?latitude='+ this.state.centerLat + '&longitude=' + this.state.centerLng + '&radius=' + this.state.scale[map.getZoom() - 1] * 9.2)
                    .then (function (res) {
                        console.log('GeoEvent 2' + res.data.data.results)
                        self.setState({
                            geoEvents : res.data.data.results
                            })
                    }).catch(function(error) {
                        console.log(error);
                        alert('une erreur est survenue');
                        })
}
    render() {
        
        console.log('selectedPlace --' + this.state.selectedPlace)
        
        let markers = []
            this.state.geoEvents.map((marker) =>  {
                let pos = {
                    lat : marker.latitude,
                    lng : marker.longitude
                }
                console.log(marker)
                markers.push(<Marker
                        onClick={this.onMarkerClick}
                        name={marker.name}
                        type={marker.category}
                        position={pos} 
                        id={marker.id}
                        description={marker.description}
                        cover={marker.cover}/>
                            );
                return markers
            });



        console.log('cover -- ' + this.state.selectedPlace.cover)

        let selectedEvent = ''
        if (this.state.selectedPlace.name){
            selectedEvent = 
                            <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <div style={sEvent}>
                                <Card style={card }>
                                    <CardMedia
                                        style={cover}
                                        image={this.state.selectedPlace.cover}
                                        title={this.state.selectedPlace.name}
                                    />
                                    <div style={details}>
                                        <CardContent style={content}>
                                            <Typography variant="headline">{this.state.selectedPlace.name}</Typography>
                                            <Typography variant="subheading">
                                                {this.state.selectedPlace.type}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary">
                                                {this.state.selectedPlace.description}
                                            </Typography>
                                        </CardContent>
                                        <div style={controls}>
                                            <Button 
                                            size="small" 
                                            color="primary"
                                            onClick={() => this.handleInfo(this.state.selectedPlace.id)}>
                                                Plus d'information
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
        </Dialog>
        }
    
        console.log('myevent -- ' + this.state.myEvents)
        return (
            <div className="EventPage">
            <MapContainer zoom={12} initialCenter={{lat : this.state.centerLat, lng :this.state.centerLng}} onDragend={this.centerMoved.bind(this)} style={style} onClick={this.onMapClicked}>
            {markers}

                    </MapContainer>
{selectedEvent}
            </div>

        )
    }
}

export default EventHome;