import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import API from '../../Components/api';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Avatar from '../../Components/ProfileAvatar';
import Event from './Tabs/Event';
import News, { type } from '../../Components/News/index';
import Tabs from '../../Components/TabsBar';
import Group from './Tabs/Group';
import Followers from './Tabs/Followers'
import Followings from './Tabs/Followings'
import Subscribers from './Tabs/Subscribers'
import Subscribings from './Tabs/Subscribings'
import './profile.css';
import Popup from "reactjs-popup";
import Payments from '../../Components/Payment/Payments';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';


export const ProfileType = {
  USER: 'user',
  GROUP: 'group',
};

const sList =  {
  float : 'left',
  width : '8em',
}

const currentUser = JSON.parse(localStorage.getItem('user'));

class Profile extends Component{

  constructor (props) {
    super(props);

    const id = parseInt(this.props.match.params.id, 10);
    this.state = {
      id: id ? id : currentUser.id,
      isGet: false,
      value: 0,
      user: null,
      page: 1,
      isPrivate: false,
      isMe: false,
      edit: false,
      isFollowings : null,
      isSubcribings : null,
      list : false,
      nameList : '',
      listContent : [],
      amountSub: 0,
    };
    this.getProfile();


    this.handleChange = this.handleChange.bind(this);
    this.handleClickFollow = this.handleClickFollow.bind(this);
    this.handleClickUnfollow = this.handleClickUnfollow.bind(this);
    this.handleFollowers = this.handleFollowers.bind(this)
    this.handleFollowings = this.handleFollowings.bind(this)
    this.handleSubcriber = this.handleSubcriber.bind(this)
    this.handleSubcription = this.handleSubcription.bind(this)
  }

  getProfile = async () => {
    const { id } = await this.state;

    if (id && id !== currentUser.id) {
      const user = await API.get('/users/' + id, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (data) {
          return data.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      const isFollowings = await API.get('/me/followings/' + id, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(function (res) {
        return res.data.data.result
      });

      const isSubcribings = await API.get('/me/subscriptions/' + id, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(function (res) {
        return res.data.data.result
      });

      this.setState({
        user: user,
        isPrivate: true,
        isFollowings : isFollowings,
        isSubcribings : isSubcribings,
        isGet: true,
      });
    }
    else {
      const user = await API.get('/me', {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (data) {
          return data.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      this.setState({
        user: user,
        isGet: true,
      })
    }
  };

  handleClickFollow(){
    let self = this;
    API.put('/me/followings/' + this.state.id, {}, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(function () {
        self.setState({
          isFollowings : true
        })
      }).catch(function (error) {
      console.log(error);
      alert('Une erreur est survenue veuillez essayer plus tard.');
    });
  }

  handleClickUnfollow(){
    let self = this;
    API.delete('/me/followings/' + this.state.id, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(function () {
        self.setState({
          isFollowings : false
        })
      }).catch(function (error) {
      console.log(error);
      alert('Une erreur est survenue veuillez essayer plus tard.');
    });
  }

  handleFollowers(){
    if (!this.state.user)
      this.state.user = currentUser
    this.setState({
      list : true,
      nameList : 'Fan',
      listContent : <Followers user={this.state.user} />,
    })
    console.log(this.state)
  }

  handleFollowings(){
    if (!this.state.user)
      this.state.user = currentUser
    this.setState({
      list : true,
      nameList : 'Fan de',
      listContent : <Followings user={this.state.user} />,
    })
    console.log(this.state)
  }

  handleSubcriber(){
    if (!this.state.user)
      this.state.user = currentUser
    this.setState({
      list : true,
      nameList : 'Abonnés',
      listContent : <Subscribers user={this.state.user} />,
    })
    console.log(this.state)
  }

  handleSubcription(){
    if (!this.state.user)
      this.state.user = currentUser
    this.setState({
      list : true,
      nameList : 'Abonnements',
      listContent : <Subscribings user={this.state.user} />,
    })
    console.log(this.state)
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  editProfile = () => {
    // window.location = '/profile/edit';
  };

  render() {
    const { isPrivate, page, isFollowings, isSubcribings, isGet } = this.state;
    let { id, user, list, nameList, listContent} = this.state;

    return (
      <Grid container className="profile-page" justify="center">
        <Grid item xs={12} md={10} lg={8}>
          <Grid container className="profile-banner">
            { !isPrivate ? <Link className="edit-button" to={'/profile/edit'}>Modifier le profil</Link> :
              <div >
                {isSubcribings ?  <Button className="suivre-button">Abonné</Button> : <Popup trigger={<Button className="suivre-button">
                  <span>S'abonner</span>
                </Button>} modal>
                  {close => (
                    <div className="modal">
                      <a className="close" onClick={close}>
                        &times;
                      </a>
                      <div className="header"> S'Abonner </div>
                      <div className="content">
                        <p>
                          {" "}
                          Définir le montant de l'abonnment</p>

                        <InputLabel htmlFor="lastname">Montant en Euro</InputLabel><br />
                        <Input
                          id="amountSub"
                          name="amountSub"
                          type="number"
                          value={this.state.amountSub}
                          onChange={this.handleChange}
                        />€
                      </div>
                      <div className="actions">
                        <Payments id={this.state.id} price={this.state.amountSub } type={1}/>

                      </div>
                    </div>
                  )}
                </Popup>}
                {isFollowings ?  <Button className="edit-button" onClick={this.handleClickUnfollow}>Suivis</Button> : <Button className="edit-button" onClick={this.handleClickFollow}>Suivre</Button>}
              </div>}
            <div className="follower-list" onClick=""> <div><span style={sList}>Fans </span><a className='number-list' onClick={this.handleFollowers}>{user ? user.follower_count : '0'}</a></div> <div><span style={sList}>Fan de </span><a className='number-list' onClick={this.handleFollowings}>{user ? user.following_count + user.following_group_count: '0'}</a></div>
              {!isPrivate ?  <div><div><span style={sList}> Abonnés </span><a className='number-list' onClick={this.handleSubcriber}>{user ? user.subscriber_count : '0'}</a></div> <div><span style={sList}>Abonnements </span><a className='number-list' onClick={this.handleSubcription}>{user ? user.subscription_count + user.subscription_group_count: '0'}</a></div></div>: ''}</div>
            {/*<Button className="edit-button" onClick={this.editProfile()}>Modifier le profil</Button>*/}
            <Grid item xs={12} lg={3}>
              <Avatar isPrivate={true} avatar={user && user.avatarurl ? user.avatarurl : ''} classes={{avatar: 'profile big'}}/>
            </Grid>
            <Grid item xs={12} lg={9}>
              <h1 className="user-username">{user ? user.username : ''}</h1>
              <p className={user && user.description ? 'user-description' : 'user-description no-description'}>
                {user && user.description ? user.description : ''}
                {/*{!isPrivate ? (user && user.description ? user.description : 'Ajoutez une description') : ''}*/}
                {/*{!isPrivate && user && !user.description ? <Icon className="icon">edit</Icon> : ''}*/}
              </p>
            </Grid>
          </Grid>
          <Tabs pages={list ? ['Actualités', 'Évenement', 'Groupes', nameList] : ['Actualités', 'Évenement', 'Groupes']}>
            <News id={id && isGet ? `${id}` : '0'} page={page} limit={5} type={type.USER} isEmpty="Fil d'actualité vide."/>
            <Event user={user} isPrivate={isPrivate}/>
            <Group user={user} isPrivate={isPrivate}/>
            {
              list ? listContent : <div></div>
            }
          </Tabs>
        </Grid>
      </Grid>
    )
  }
}

Profile.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
};

export default Profile;