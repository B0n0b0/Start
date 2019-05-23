import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
// import StartTable from '../Core/StartTable';
// import TableRowUser from '../Core/TableRowUser';
import UserList from '../../../../Components/UserList';
import GroupList from '../../../../Components/GroupList'
import Tabs from '../../../../Components/TabsBar';

class Subscribings extends Component {

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
                        url={'/users/' + this.props.user.id + '/subscriptions'}
                        isEmpty={'Aucune personne ne suit ' + this.props.user.username + ' actuellement.'}
                    />
                    <GroupList
                        user={this.props.user}
                        url={'/users/' + this.props.user.id + '/group_subscriptions'}
                        isEmpty={this.props.user.username + ' n\'est abonné à aucun groupe'}
                    />
                    {/*<CoreTable headers={this.state.headers} rowObject={<TableRowUser rows={this.state.rows}/>}/>*/}


                </Tabs>
 
            </div>
        )
    }
}

export default Subscribings;