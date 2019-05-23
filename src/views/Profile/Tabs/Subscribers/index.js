import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import UserList from '../../../../Components/UserList';

class Subscribers extends Component{
    render() {
        return (

                    <UserList
                        user={this.props.user}
                        url={'/users/' + this.props.user.id + '/subscribers'}
                        isEmpty={'Aucune personne n\'abonné à ' + this.props.user.username + ' actuellement.'}
                    />
        )
    }
}

export default Subscribers;