import React, { Component } from 'react';
import API from '../../../Components/api';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Popup from "reactjs-popup";
import Payments from '../../../Components/Payment/Payments'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Avatar from '../../../Components/ProfileAvatar';

class Banner extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            username: '',
            description: '',
            avatar: '',
            dialogOpen: false,
            follow: false,
            subscriptions: false,
            amountSub : 0,
        };

        this.handleClickAvatar = this.handleClickAvatar.bind(this);
        this.handleClickFollow = this.handleClickFollow.bind(this);
        this.handleClickUnfollow = this.handleClickUnfollow.bind(this);
        this.handleClickSubscribe = this.handleClickSubscribe.bind(this);
    }

    componentWillReceiveProps(props) {

        this.setState({
            id: (props.user && props.user.id)?props.user.id:'',
            username: (props.user && props.user.username)?props.user.username:'',
            description: (props.user && props.user.description)?props.user.description:'',
            avatar: (props.user && props.user.avatarurl)?props.user.avatarurl:''
        });

        if (!props.isMe && props.user.id) {
            let self = this;
            API.get('/me/followings/' + props.user.id, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(function (res) {
                self.setState({
                    follow: res.data.data.result
                });
            });
        }
        if (!props.isMe && props.user.id) {
            let self = this;
            API.get('/me/subscriptions/' + props.user.id, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(function (res) {
                self.setState({
                    subscriptions: res.data.data.result
                });
            });
        }
    }

    handleClickFollow() {
        let self = this;
        API.put('/me/followings/' + this.props.user.id, {}, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (res) {
                self.setState({
                    follow: true
                });
                // alert('Vous suivez maintenant ' + user.username + '.');
            }).catch(function (error) {
            console.log(error);
            alert('Une erreur est survenue veuillez essayer plus tard.');
        });
    }

    handleClickUnfollow() {
        let self = this;
        API.delete('/me/followings/' + this.props.user.id, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (res) {
                self.setState({
                    follow: false
                });
                // alert('Vous ne suivez plus ' + user.username + '.');
            }).catch(function (error) {
            console.log(error);
            alert('Une erreur est survenue veuillez essayer plus tard.');
        });
    }

    handleClickSubscribe() {
        console.log('sub');
    }

    handleClickAvatar(avatar) {

        const user = {
            avatarurl: avatar
        };

        API.put('/users', user, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (res) {
                API.get('/me', {
                    headers: {
                        'authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(function (res) {
                        localStorage.setItem('user', JSON.stringify(res.data.data));
                        alert('Votre profil a bien été mis à jour.');
                        window.location.pathname = '/profile'
                    })
                    .catch(function (error) {
                        console.log(error);
                        alert('Une erreur est survenue veuillez essayer plus tard.');
                    });
            })
            .catch(function (error) {
                alert('Une erreur est survenue veuillez essayer plus tard.');
                console.log(error);
            });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    };

    render() {

        const { isPrivate, isMe } = this.props;

        let buttons = null;
        let buttonsSub = null;
        if (!isMe) {
            if (!this.state.follow && !this.state.subscriptions) {
                buttons = <div className="profile-banner-btn">
                    <Button className="btn-start-art btn-small btn-rounded btn-contained" onClick={this.handleClickFollow}>
                        <Icon>add</Icon>&nbsp;<span>Suivre</span>
                    </Button>

                    <Popup trigger={<Button className="btn-start-art btn-small btn-rounded btn-contained">
                        <Icon>add</Icon>&nbsp;<span>S'abonner</span>
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
                                    <Payments id={this.state.id} amountSub={this.state.amountSub}/>

                                </div>
                            </div>
                        )}
                    </Popup>

                </div>
            }
            else if (this.state.follow && !this.state.subscriptions){
                buttons = <div className="profile-banner-btn">
                    <Button className="btn-start-art btn-small btn-rounded btn-contained" onClick={this.handleClickUnfollow}>
                        <Icon>check</Icon>&nbsp;<span>Suivi</span>
                    </Button>

                    <Popup trigger={<Button className="btn-start-art btn-small btn-rounded btn-contained">
                        <Icon>add</Icon>&nbsp;<span>S'abonner</span>
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
                                    <Payments id={this.state.id} amountSub={this.state.amountSub}/>

                                </div>
                            </div>
                        )}
                    </Popup>
                </div>
            }

            else if (!this.state.follow && this.state.subscriptions){
                buttons = <div className="profile-banner-btn">
                    <Button className="btn-start-art btn-small btn-rounded btn-contained" onClick={this.handleClickFollow}>
                        <Icon>add</Icon>&nbsp;<span>Suivre</span>
                    </Button>
                    <Button className="btn-start-art btn-small btn-rounded btn-contained">
                        <Icon>check</Icon>&nbsp;<span>Abonné</span>
                    </Button>
                </div>
            }
            else
                buttons = <div className="profile-banner-btn">
                    <Button className="btn-start-art btn-small btn-rounded btn-contained" onClick={this.handleClickUnfollow}>
                        <Icon>check</Icon>&nbsp;<span>Suivi</span>
                    </Button>
                    <Button className="btn-start-art btn-small btn-rounded btn-contained">
                        <Icon>check</Icon>&nbsp;<span>Abonné</span>
                    </Button> </div>

        }

        return (
            <div className="profile-banner">
                <Avatar isPrivate={isPrivate} onClick={this.handleClickAvatar} avatar={this.state.avatar}/>
                <h2 className="profile-user-name">{this.state.username}</h2>
                <p className="profile-user-description">{this.state.description}</p>
                { buttons }
            </div>
        )
    }
}

export default Banner;