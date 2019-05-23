import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import API from '../../Components/api';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import './style.css';

const sProfil = {
    display : 'flex',
    marginRight : 'auto',
    marginLeft : 'auto',
    paddingLeft: '20px',
    paddingTop : '20px',
    paddingRight : '20px',
    textAlign : 'center',
    width : '-webkit-fill-available',
}

  const card =  {
    display: 'flex',
    textAlign : 'Center',
    width : '-webkit-fill-available',
    paddingRight: '40px'
  }
  const  details = {
    display: 'flex',
    flexDirection: 'column',
  }
  const content = {
    width : '100%',
    textAlign : 'center'
  }
  const cover = {
    display: 'flex',
    width: 100,
  }
  const controls = {
    display: 'flex',
    alignItems: 'center',
    width: '100px'
  }
    

class Recommendation extends Component {
    
    constructor(props) {
        super(props);
            
            this.state = {
                myRecommendation : [],
            }
        let self = this;

            API.get('/recommendations', {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then (function (res) {
                    console.log('MyRecommendation ', res.data)
                    self.setState({
                        myRecommendation : res.data.data
                        })
                    console.log('MyEvent1 ', self.state.myRecommendation.length)
                }).catch(function(res) {
                    console.log('error -- ' + res);
                })
    }
    
    goToProfil = (id) => {
                window.location.pathname = '/profile/' + id;
    }
    
    render () {

                let rProfil = [];
                if(this.state.myRecommendation.length){
        this.state.myRecommendation.map((profil) => {
            if (!profil.avatarurl)
                {
                    profil.avatarurl = "http://via.placeholder.com/100x100?text=Aucune+image"
                }
            rProfil.push(
                            <div style={sProfil}>
                                <Card className="Profil" style={card} onClick={() => this.goToProfil(profil.id)}>
                                    <CardMedia
                                        style={cover}
                                        image={profil.avatarurl}
                                        title={profil.username}
                                    />
                                    <div style={details}>
                                        <CardContent style={content}>
                                            <Typography variant="headline">{profil.username}</Typography>
                                            <Typography variant="subheading">
                                                {profil.description}
                                            </Typography>
                                        </CardContent>
                                    </div>
                                </Card>
                            </div>
                        );
        return profil
    });}
        else{
            console.log("no reocmmendaiton")

            rProfil = <div style={sProfil}> Aucune recommendation
            </div>
        }
        
                      
        return (
            <div> {rProfil}</div>
            )
    }
}

export default Recommendation;