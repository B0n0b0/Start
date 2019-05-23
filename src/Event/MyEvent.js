import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import API from '../Components/api';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const sEvent = {
    display : 'flex',
    marginRight : 'auto',
    marginLeft : 'auto',
    paddingLeft: '20px',
    paddingTop : '20px',
    textAlign : 'center'
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
    display: 'flex',
    width: 500,
  }
  const controls = {
    display: 'flex',
    alignItems: 'center',
  }
    

class MyEvent extends Component {
    
    constructor(props) {
        super(props);
            
            this.state = {
                myEvents : [],
            }
        let self = this;

            API.get('/users/' + parseInt(JSON.parse(localStorage.getItem('user')).id) + '/events/owner')
                .then (function (res) {
                    console.log('MyEvent ' + res.data)
                    self.setState({
                        myEvents : res.data.data.results
                        })
                    console.log('MyEvent1 ' + self.state.myEvents)
                }).catch(function(res) {
                    console.log('error -- ' + res);
                })
    }
    
    EditEvent = (id) => {
                window.location.pathname = '/event/edit/' + id;
    }
    
            handleInfo = (id) => {
        window.location.pathname = '/event/' + id;
    }
    
    render () {

                let myEvents = [];
        this.state.myEvents.map((myEvent) => {
            if (!myEvent.cover)
                {
                    myEvent.cover = "http://via.placeholder.com/350x150?text=Aucune+image"
                }
            myEvents.push(
                            <div style={sEvent}>
                                <Card style={card}>
                                    <CardMedia
                                        style={cover}
                                        image={myEvent.cover}
                                        title={myEvent.name}
                                    />
                                    <div style={details}>
                                        <CardContent style={content}>
                                            <Typography variant="headline">{myEvent.name}</Typography>
                                            <Typography variant="subheading">
                                                {myEvent.category}
                                            </Typography>
                                        </CardContent>
                                        <div style={controls}>
                                            <Button size="small" color="primary" onClick={() => this.handleInfo(myEvent.id)}>
                                                Plus d'information
                                            </Button>
                                            <Button size="small" color="primary"  onClick={() => this.EditEvent(myEvent.id)}>
                                                Modifier
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
        return myEvents
    });
        
                      
        return (
            <div> {myEvents}</div>
            )
    }
}

export default MyEvent;