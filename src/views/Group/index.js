import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import API from "../../Components/api";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '../../Components/ProfileAvatar';
import Tabs from '../../Components/TabsBar';
import CreateNews from '../../Components/News/Create';
import News, { type } from '../../Components/News';
import Table from '../../Components/Table';
import SearchArtist, {SearchType} from '../../Components/SearchInput';
import Popup from "reactjs-popup";
import Payments from '../../Components/Payment/Payments';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import UserList from '../../Components/UserList';
import Toast from '../../Components/Toast';

export default class Group extends Component {

  constructor(props) {
    super(props);

    this.state = {
      group: null,
      user: JSON.parse(localStorage.getItem('user')),
      isPrivate: false,
      isFollowings : null,
      isSubcribings : null,
      amountSub : 0,
      page: 1,
      members: [],
      error: null,
    };

    this.getGroup();
    this.handleChange = this.handleChange.bind(this)
    this.handleClickFollow = this.handleClickFollow.bind(this);
    this.handleClickUnfollow = this.handleClickUnfollow.bind(this);

  }

  getGroup = async () => {
    const { user } = this.state;
    const { id } = this.props.match.params;

    if (id) {
      let group = await API.get('/group/' + id, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {
          return res.data.data
        })
        .catch(function (error) {
          console.log(error)
        });

      let members = [];
      await members.push(group.leader[0]);
      if (group.members) {
        for (let i = 0; i < group.members.length; i++) {
          members.push(group.members[i]);
        }
      }

      const isFollowings = await API.get('/me/group/followings/' + id, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(function (res) {
        return res.data.data.result
      });

      const isSubcribings = await API.get('/me/group_subscriptions/' + id, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(function (res) {
        return res.data.data.result
      });

      this.setState({
        group: group,
        members: members,
        isFollowings: isFollowings,
        isSubcribings: isSubcribings
      });

      if (user.id === group.leader_id) {
        this.setState({
          isPrivate: true
        });
      }
    }
  };


  handleClickFollow(){
    let self = this;
    API.put('/me/group/followings/' + this.state.group.id, {}, {
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
    API.delete('/me/group/followings/' + this.state.group.id, {
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

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  updateGroup = (newGroup) => {
    let { group } = this.state;

    group.groupName = newGroup.groupName;
    group.logo = newGroup.logourl;
    group.frontPageImage = newGroup.bannerurl;

    // this.setState({
    //
    // })

  };

  changePage = (event, value) => {
    this.setState({
      pageId: value
    })
  };

  onCreated = async (message) => {

    if (message.status) {
      await this.getGroup();
    } else {
      this.setState({
        news: null,
        error: {
          message: message.message,
        }
      });
    }
  };

  closeError = () => {
    this.setState({
      news: null,
      error: null,
    })
  };

  onSelectedSuggestion = async (suggestion) => {

    let members = this.state.members;
    let exist = await members.find(function (element) {
      return suggestion.id === element.id

    });

    if (!exist) {
      let artist = {
        artist_id: suggestion.id,
        group_id: this.state.group.id
      };

      API.put('group/artists', artist, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(function (res) {
        console.log(res);
      }).catch(function (error) {
        console.log(error);
      });
      members.push(suggestion);
      this.setState({
        members: members
      });
    }
  };

  removeMember = (id) => {

    if (id) {

      let artist = {
        artist_id: id,
        group_id: this.state.group.id
      };

      let self = this;
      API.delete('group/artists', {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        data: artist
      }).then(function (res) {
        console.log(res);
        self.getGroup();
      }).catch(function (error) {
        console.log(error);
      })
    }
  };

  onError = (message) => {
    this.setState({
      error: {
        message: message,
      }
    })
  };

  render() {

    const { group, isPrivate, page, members, isFollowings, isSubcribings, error } = this.state;

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

    let items = [];
    members.map((member, i) => {
      if (i === 0) {
        items.push(
          <TableRow key={member.id} classes={{root: 'tr-user'}}>
            <TableCell className="artist-cell">
              <Link to={'/profile/' + member.id} className="user-link">
                <Grid container className="">
                  <Grid item sm={5}>
                    <Avatar className="profile-avatar-small" avatar={member.avatarurl} isPrivate={true}/>
                  </Grid>
                  <Grid item sm={7} className="grid-username">
                    <div className="suggest-username">{member.username}</div>
                  </Grid>
                </Grid>
              </Link>
            </TableCell>
            <TableCell className="artist-cell">{member.email}</TableCell>
            <TableCell colSpan={2}>Créateur</TableCell>
          </TableRow>
        );
      } else {
        items.push(
          <TableRow key={member.id} classes={{root: 'tr-user'}}>
            <TableCell className="artist-cell">
              <Link to={'/profile/' + member.id} className="user-link">
                <Grid container className="">
                  <Grid item sm={5}>
                    <Avatar className="profile-avatar-small" avatar={member.avatarurl} isPrivate={true}/>
                  </Grid>
                  <Grid item sm={7} className="grid-username">
                    <div className="suggest-username">{member.username}</div>
                  </Grid>
                </Grid>
              </Link>
            </TableCell>
            <TableCell className="artist-cell">{member.email}</TableCell>
            <TableCell>Membre</TableCell>
            <TableCell>
              <Button onClick={this.removeMember.bind(this, member.id)}><Icon>delete</Icon></Button>
            </TableCell>
          </TableRow>
        );
      }
      return items;
    });

    if (members.length === 0) {
      items = (
        <TableRow>
          <TableCell colSpan={4} className="table-cell empty">Ce groupe n'a aucun membre.</TableCell>
        </TableRow>
      )
    }

    const banner = (group && group.frontPageImage) ? group.frontPageImage : '';

    return (
      <Grid container className="profile-page" justify="center">
        <div className="banner" style={{backgroundImage: `url("${banner}")`}}></div>
        <Grid item xs={12} md={10} lg={8}>
          <Grid container className="profile-banner group">
            { isPrivate ? <Link className="edit-button" to={'/group/edit/' + group.id }>Modifier le profil</Link> : <div >
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
                      <Payments id={group.id} price={this.state.amountSub } type={3}/>

                    </div>
                  </div>
                )}
              </Popup>}
              {isFollowings ?  <Button className="edit-button" onClick={this.handleClickUnfollow}>Suivis</Button> : <Button className="edit-button" onClick={this.handleClickFollow}>Suivre</Button>}
            </div>}
            <Grid item xs={12} md={3}>
              <Avatar isPrivate={true} avatar={group && group.logo ? group.logo : ''} classes={{avatar: 'profile big'}}/>
            </Grid>
            <Grid item xs={12} md={9}>
              <h1 className="user-username">{group ? group.groupName : ''}</h1>
              {/*<p className={user && user.description ? 'user-description' : 'user-description no-description'}>*/}
              {/*{!isPrivate ? (user && user.description ? user.description : 'Ajoutez une description') : ''}*/}
              {/*{!isPrivate && user && !user.description ? <Icon className="icon">edit</Icon> : ''}*/}
            </Grid>
          </Grid>
          {!isPrivate ? <div>
            <Tabs pages={['Actualités', 'Fan', 'Membres']}>

              <div>
                <News id={group ? group.id : '0'} page={page} limit={5} type={type.GROUP} isEmpty="Fil d'actualité vide."/>
              </div>
              <UserList
                user={group ? group : ''}
                url={group ? '/group/' +  group.id + '/followers' : ''}
                isEmpty={ group ? 'Aucune personne ne suit ' + group.groupName + ' actuellement.' : ''}
              />
              <div>
                <Table headers={['Nom', 'Email', 'Role', 'Actions']}
                       paginate={false}
                >
                  { items }
                </Table>
              </div>
            </Tabs> </div> : <div>           <
            Tabs pages={['Actualités', 'Fan', 'Abonnés', 'Membres']}>

            <div>
              <CreateNews onCreated={this.onCreated} type={'1'}/>
              <News id={group ? group.id : '0'} page={page} limit={5} type={type.GROUP} isEmpty="Fil d'actualité vide." onError={this.onError}/>
            </div>
            <UserList
              user={group ? group : ''}
              url={group ? '/group/' +  group.id + '/followers' : ''}
              isEmpty={ group ? 'Aucune personne ne suit ' + group.groupName + ' actuellement.' : ''}
            />
            <UserList
              user={group ? group : ''}
              url={group ? '/group/' +  group.id + '/group_subscribers' : ''}
              isEmpty={ group ? 'Aucune personne n\'est abonné à ' + group.groupName + ' actuellement.' : ''}
            />
            <div>

              <SearchArtist placeholder={'Rechercher un artiste'} classes={{root: 'artist-search'}} type={SearchType.ARTIST} onSelect={this.onSelectedSuggestion} suggest={true}/>
              <Table headers={['Nom', 'Email', 'Role', 'Actions']}
                     paginate={false}
                     classes={{header: 'artist-cell'}}
              >
                { items }
              </Table>
            </div>
          </Tabs> </div>}
        </Grid>
        { toast }
      </Grid>
    )
  }
}