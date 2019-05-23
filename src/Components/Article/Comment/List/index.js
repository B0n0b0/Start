import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import API from "../../../api";
import ListMaterial from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '../../../ProfileAvatar';

const currentUser = JSON.parse(localStorage.getItem('user'));

class List extends Component {

  constructor (props) {
    super(props);

    this.state = {
      comments: [],
      limit: 5,
      page: 1,
      hasMore: true,
    };

    this.getComment();
  }

  getComment = async () => {
    const { article } = this.props;
    const { limit, page } = this.state;

    if (article) {
      let comments = await API.get(`/comments/${article}`, {
        params: {
          nbperpage: limit,
          pagenumber: page,
        }
      })
        .then(function (res) {
          return res.data.comments;
        })
        .catch(function (error) {
          console.log(error);
        });

      let items = await this.state.comments;
      for (let i = 0; i < comments.docs.length; i++) {
        items.push(comments.docs[i]);
      }

      this.setState({
        comments: items,
        page: page + 1,
        hasMore: comments.total > items.length,
      })
    }
  };

  render() {

    const { newComment } = this.props;
    const { comments, hasMore } = this.state;

    let items = [];
    if (newComment) {
      items.push(
        <ListItem key={0} className="li-comment">
          <Link to={`/profile/${currentUser.id}`}>
            <Avatar
              isPrivate={true}
              avatar={currentUser && currentUser.avatarurl ? currentUser.avatarurl : ''}
              classes={{
                avatar: 'avatar-comment'
              }}
            />
          </Link>
          <div className="comment-message">
            <Link to={`/profile/${currentUser.id}`} className="comment-user-name">
              { currentUser && currentUser.username ? currentUser.username : '' }
            </Link>
            { newComment }
          </div>
        </ListItem>
      );
    }

    if (comments) {
      comments.map((elem, i) => {
        items.push(
          <ListItem key={i + (newComment ? 1 : 0)} className="li-comment">
            <Link to={`/profile/${elem.user_id}`}>
              <Avatar
                isPrivate={true}
                avatar={elem && elem.avatarurl ? elem.avatarurl : ''}
                classes={{
                  avatar: 'avatar-comment'
                }}
              />
            </Link>
            <div className="comment-message">
              <Link to={`/profile/${elem.user_id}`} className="comment-user-name">
                { elem && elem.username ? elem.username : '' }
              </Link>
              { elem.content }
            </div>
          </ListItem>
        );
        return items;
      });
    }

    return (
      <ListMaterial className="comment-list">
        { items }
        { hasMore ? <button className="comment-more" onClick={this.getComment}>Voir plus de commentaire</button> : '' }
      </ListMaterial>
    )
  }
}

List.propTypes = {
  article: PropTypes.string.isRequired,
  newComment: PropTypes.string.isRequired,
};

export default List;