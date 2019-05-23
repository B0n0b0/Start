import React, { Component } from 'react';
import API from '../Components/api';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import MapContainer from '../Components/Google/Map';

const classes = {
  card: {
    width : 500,
    textAlign : 'center',
    margin : 'auto',
    paddingTop : 16
    
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  typo:{
      paddingTop: '5px',
  },
    map: {
    height : 100
}
};

class EventPage extends Component {
    
    constructor(props) {
        super(props);
        
            this.state = {
            cover : '',
            name: '',
            price: '',
            category: '',
            description: '',
            address: '',
            startDate: '',
            endDate: '',
            latitude: '',
            longitude: '',
            editState : false,
        };
        
        let self = this;
        
        if (props.location.pathname.split('/')[2]){
            API.get('/events/' + props.location.pathname.split('/')[2])
            .then(function (res){
                self.setState({
                    cover : res.data.data.cover,
                    name : res.data.data.name,
                    price : res.data.data.price,
                    category: res.data.data.category,
                    description: res.data.data.description,
                    address: res.data.data.street_address,
                    startDate: res.data.data.start_time.substr(0,10),
                    endDate: res.data.data.end_time.substr(0,10),
                    latitude : res.data.data.latitude,
                    longitude : res.data.data.longitude,
                    position : {lat : res.data.data.latitude,
                                lng : res.data.data.longitude},
                    editState : true,
                    ID : props.location.pathname.split('/')[2],
                })
                console.log('date -- ' + self.state.startDate)
            })
        }
    }
    render () {
        let eventPos = '';
        if (this.state.latitude)
        {
            console.log('latitude -- ' + this.state.latitude)
            console.log('longitude -- ' + this.state.longitude)
            eventPos = <MapContainer style={classes.map} zoom={16} initialCenter={{lat : this.state.latitude, lng : this.state.longitude}}></MapContainer>
        }

    return(

        
                        <div style={classes.card}>
                            <Card>
                                <CardMedia
                                    style={classes.media}
                                    image={this.state.cover}
                                    title={this.state.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="headline" component="h2">
                                        {this.state.category} : {this.state.name}
                                    </Typography>
                                    <Typography component="p"style={classes.typo}>
                                        {this.state.description}
                                    </Typography>
                                    <Typography component="p"style={classes.typo}>
                                        Localisation : {this.state.address}
                                    </Typography>
                                <Typography component="p"style={classes.typo}>{this.state.startDate} au {this.state.endDate}</Typography>           
                                                                        <Typography component="p"style={classes.typo}>
                                       Prix : {this.state.price}
                                    </Typography>
                         </CardContent>
                            </Card>
                        </div>
                        );
    }
}
export default EventPage