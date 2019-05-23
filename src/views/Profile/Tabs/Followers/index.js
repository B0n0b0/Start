import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import UserList from '../../../../Components/UserList';

class Followers extends Component{
    render() {
        return (
            <div>
                    <UserList
                        user={this.props.user}
                        url={'/users/' + this.props.user.id + '/followers'}
                        isEmpty={'Aucune personne ne suit ' + this.props.user.username + ' actuellement.'}
                    />

            </div>
        )
    }
}

export default Followers;