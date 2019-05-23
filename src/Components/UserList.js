import React, { Component } from 'react';
import API from './api';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            limit: 10,
            users: [],
            hasMore: true
        };
    }

    handleClick(id) {
        // console.log(id);
        window.location.pathname = '/profile/' + id;
    }

    loadMore() {

        let self = this;
        API.get(this.props.url, {
            params: {
                limit: this.state.limit,
                page: this.state.page
            }
        })
            .then(function (res) {

                console.log('res -- ', res)

                let result = res.data.data;

                let users = self.state.users;
                for (let i = 0; i < result.results.length; i++) {
                    users.push(result.results[i]);
                }

                self.setState({
                    users: users,
                    page: self.state.page + 1,
                    hasMore: !(self.state.users.length >= result.total)
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        console.log(this.props.type)

        const { isEmpty } = this.props;
        const { users } = this.state;

        let items = [];
        users.map((user, i) => {
            items.push(
                <ListItem key={user.id} button dense onClick={this.handleClick.bind(this, user.id)}>
                    <Avatar className="profile-avatar-small" src={user.avatarurl}/>
                    <ListItemText primary={(user.firstname && user.lastname) ? user.firstname + ' ' + user.lastname:user.username} />
                </ListItem>
            );
            return items;
        });

        if (this.state.hasMore || users.length > 0) {
            return (
                <List>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.loadMore.bind(this)}
                        hasMore={this.state.hasMore}
                        loader={<CircularProgress key={items.length} className="" />}
                    >
                        { items }
                        {/*<ListItem key={user.id} button dense onClick={this.handleClick.bind(this, user.id)}>*/}
                        {/*</ListItem>*/}
                    </InfiniteScroll>
                </List>
            )
        }
        else {
            return (
                <List>
                     <ListItem>
                         <ListItemText primary={isEmpty} />
                     </ListItem>
                 </List>
            )
        }
    }
}

export default UserList;