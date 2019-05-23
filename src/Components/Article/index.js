import React, { Component } from 'react';
import Proptypes from 'prop-types'
import Moment from 'react-moment';
import 'moment/locale/fr';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Youtube from 'react-youtube';
import Icon from '@material-ui/core/Icon';
import Avatar from '../ProfileAvatar';
import Comment from "./Comment/index";

class Article extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  handleExpandClick () {
    this.setState({ expanded: !this.state.expanded });
  }

  onError = (message) => {
    this.props.onError(message);
  };

  render() {

    const { expanded } = this.state;
    const { article, className } = this.props;

    let style = {
      backgroundImage: "url(" + article.content_url + ")"
    };

    let opts = {
      width: '100%',
      height: '360'
    };

    let media = null;
    switch (article.content_type) {
      case 1:
        media = <Youtube
          videoId={article.content_url.replace('https://www.youtube.com/watch?v=', '')}
          opts={ opts }
        />;
        break;
      case 2:
        media = <div className="article-image" style={style}></div>;
        break;
      case 3:
        break;
      default:
        break;
    }

    return (
      <Card className={"article " + (className ? className : '')}>
        <div className="article-header">
          <div className="article-header-item">
            <a href={`/profile/${article.user_id}`}>
              <Avatar isPrivate={true} avatar={article.avatar && article.avatar.avatarurl ? article.avatar.avatarurl : ''}/>
            </a>
          </div>
          <div className="article-header-item text">
            <p className="article-title">{ article.title }</p>
            <Moment fromNow locale="fr" className="article-time">{ article.date }</Moment>
          </div>
          <a href={`/profile/${article.user_id}`} className="article-user">{ article.username }</a>
        </div>
        <CardContent className="article-content">
          { media }
          <div className="article-description">
            { article.content }
          </div>
        </CardContent>
        <CardActions disableActionSpacing className="article-button">
          <Button className="article-button-comemnt" onClick={this.handleExpandClick}><Icon>chat-bubble-outline</Icon>&nbsp;Commentaires</Button>
          {/*<Button><Icon>share</Icon>&nbsp;Partager</Button>*/}
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          { article ? <Comment article={article} onError={this.onError}/> : '' }
        </Collapse>
      </Card>
    )
  }
}

Article.propTypes = {
  article: Proptypes.object.isRequired,
  onError: Proptypes.func,
};

export default Article;