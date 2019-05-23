import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Create from './Create';
import List from './List';
import "./style.css";

class Comment extends Component {

  constructor (props) {
    super(props);

    this.state = {
      newComment: '',
    }
  }

  onCreate = (message) => {
    if (message.status) {
      this.setState({
        newComment: message.message
      });
    } else {
      this.props.onError(message.message);
    }
  };

  render() {
    const { article } = this.props;
    const { newComment } = this.state;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Create article={article._id} onSubmit={this.onCreate} />
          <List article={article._id} newComment={newComment}/>
        </Grid>
      </Grid>
    )
  }
}

Comment.propTypes = {
  article: PropTypes.object.isRequired,
  onError: PropTypes.func.isRequired,
};

export default Comment;