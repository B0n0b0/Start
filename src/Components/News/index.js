import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from "../api";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';
import Article from "../Article";

export const type = {
  ALL: 1,
  USER: 2,
  GROUP: 3
};

class News extends Component {

  // type 0 : texte
  // type 1 : youtube
  // type 2 : image
  // type 3 : soundcloud

  constructor(props) {
    super(props);

    this.state = {
      page: this.props.page,
      limit: this.props.limit,
      news: [],
      hasMore: true
    };
  }

  componentWillReceiveProps(props) {
    if (props.post) {
      let news = this.state.news;
      news.unshift(props.post);
      this.setState({
          news: news
      });
    }
  }

  loadMore = async () => {
    const {id} = this.props;
    let self = this;

    if (id && id !== '0' && this.props.type === type.USER) {
      await API.get(`/users/posts/${id}/${this.state.page}/${this.state.limit}`, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {

          let posts = res.data.posts;

          let news = self.state.news;
          for (let i = 0; i < posts.docs.length; i++) {
            news.push(posts.docs[i]);
          }

          self.setState({
            news: news,
            page: self.state.page + 1,
            hasMore: !(self.state.news.length >= posts.total)
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else if (id && id !== '0' && this.props.type === type.GROUP) {
      await API.get('/group/' + id + '/post/' + this.state.page + '/' + this.state.limit, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {
          let posts = res.data.posts;

          let news = [];
          news.concat(self.state.news);
          for (let i = 0; i < posts.docs.length; i++) {
            news.push(posts.docs[i]);
          }

          self.setState({
            news: news,
            page: self.state.page + 1,
            hasMore: (self.state.news.length > posts.total)
          });
        })
        .catch(function (error) {
          console.log(error)
        });
    }
    else if (this.props.type === type.ALL) {
      API.put(this.props.url, {
        page: this.state.page,
        limit: this.state.limit
      }, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {

          let posts = res.data.posts;

          let news = self.state.news;
          for (let i = 0; i < posts.docs.length; i++) {
            news.push(posts.docs[i]);
          }

          self.setState({
            news: news,
            page: self.state.page + 1,
            hasMore: (self.state.news.length > posts.total)
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  onError = (message) => {
    this.props.onError(message);
  };

  render() {
    const { isEmpty } = this.props;
    const { news, hasMore } = this.state;

    let items = [];
    if (news.length > 0) {
      news.map((elem, i) => {
        items.push(
          <ListItem key={i} className="article-item">
            <Article article={elem} onError={this.onError}/>
          </ListItem>
        );
        return items;
      });
    }

    if (this.state.hasMore || news.length > 0) {
      return (
        <div>
          <List>
            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={hasMore}
              loader={<div key={items.length} className="progress-list"><CircularProgress className="circular-progress" /></div>}
            >
              { items }
            </InfiniteScroll>
          </List>
        </div>
      )
    }
    else {
      return (
        <List>
          <ListItem className="article-item">
            <ListItemText primary={isEmpty} />
          </ListItem>
        </List>
      )
    }
  }
}

News.propTypes = {
  id: PropTypes.string,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  isEmpty: PropTypes.string.isRequired,
  onError: PropTypes.func,
};

export default News;