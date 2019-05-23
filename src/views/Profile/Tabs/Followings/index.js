import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
// import Index from '../Core/Index';
// import TableRowUser from '../Core/TableRowUser';
import UserList from '../../../../Components/UserList';
import GroupList from '../../../../Components/GroupList'
import Tabs from '../../../../Components/TabsBar';

class Followings extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <div>
                <Tabs pages={['Utilisateurs', 'Groupes']}>
                <UserList
                        user={this.props.user}
                        url={'/users/' + this.props.user.id + '/followings'}
                        isEmpty={this.props.user.username + ' n\'est fan de personne'}
                    />
                    <GroupList
                        user={this.props.user}
                        url={'/user/' + this.props.user.id + '/group/followings'}
                        isEmpty={this.props.user.username + ' n\'est fan d\'aucun groupe'}
                    />
                    {/*<CoreTable headers={this.state.headers} rowObject={<TableRowUser rows={this.state.rows}/>}/>*/}


                </Tabs>
 
            </div>
        )
    }
}

export default Followings;