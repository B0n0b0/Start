import React, { Component } from 'react';
import API from '../../Components/api';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import InfiniteScroll from 'react-infinite-scroller';
import Avatar from '../../Components/ProfileAvatar';
import './search.css'

const style = {
    avatar: 'card-header-avatar',
    title: 'card-header-title'
};

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.match.params.str,
            page: 1,
            limit: 10,
            results: [],
            hasMore: true
        };
    }

    handleClick(id) {
        // console.log(id);
        window.location.pathname = '/profile/' + id;
    }

    loadMore() {

        // console.log(this.state.value);

        if (this.state.value !== '') {

            const search = {
                limit: this.state.limit,
                page: this.state.page,
                searchType: 0,
                searchTerm: this.state.value
            };

            let self = this;
            API.put('/search', search, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(function (res) {

                    let users = res.data.results;

                    let results = self.state.results;
                    for (let i = 0; i < users.docs.length; i++) {
                        users.docs[i].type = 'user';
                        results.push(users.docs[i]);
                    }

                    self.setState({
                        results: results,
                        page: self.state.page + 1,
                        hasMore: !(self.state.results.length >= users.total)
                    });

                }).catch(function (error) {
                console.log(error);
                alert("Une erreur est survenue veuillez réessayer plus tard.");
            });
        }
    }

    render() {

        const { results } = this.state

        // console.log(results);

        let items = [];
        results.map((result, i) => {
            items.push(
                <ListItem key={result.id} button dense onClick={this.handleClick.bind(this, result.id)}>
                    <Avatar avatar={result.avatarurl} isPrivate={true}/>
                    <ListItemText primary={(result.firstname && result.lastname) ? result.firstname + ' ' + result.lastname:result.username} />
                </ListItem>
            );
            return items;
        });

        return (
            <div>
                <Grid container justify="center">

                    <Grid item xs={12} md={6} className="">

                        <Card className="card-user">
                            <CardHeader
                                className="card-header-search"
                                classes={style}
                                avatar={
                                    <Icon className="card-header-icon">people</Icon>
                                }
                                // action={
                                    // <Button className="button">Voir tout</Button>
                                // }
                                title="Personnes"
                            />
                            <CardContent>
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
                            </CardContent>
                            {/*<CardActions>*/}
                                {/*<Button>Voir tout</Button>*/}
                            {/*</CardActions>*/}
                        </Card>

                    </Grid>

                </Grid>
                {/*{ this.state.value }*/}
            </div>
        )
    }
}

export default Search;