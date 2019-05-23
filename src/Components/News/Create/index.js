import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from '../../api';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import TagInput from '../../TagInput';

const currentUser = JSON.parse(localStorage.getItem('user'));

class Create extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      contentType: 0,
      contentUrl: '',
      tags: [],
      showUrlField: false
    };
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    let { title, tags, contentType, contentUrl, content } = this.state;
    const { type } = this.props;

    if (!this.state.contentUrl) {
      this.setState({
        contentType: 0
      })
    }

    if (!title) {
      this.props.onCreated({
        status: false,
        message: 'Aucun titre pour cet article.',
      });
      return;
    }

    if (contentType === 1 && contentUrl && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(contentUrl)) {
      this.props.onCreated({
        status: false,
        message: 'L\'url que vous avez entré ne correspond pas a une vidéo Youtube',
      });
      return;
    }

    if (!content && !contentUrl) {
      this.props.onCreated({
        status: false,
        message: 'Aucun contenu dans l\'article',
      });
      return;
    }

    let post = await {
      title: title,
      content: content,
      tags: tags,
      content_url: contentUrl,
      content_type: contentType
    };

    let message = null;
    if (type === '0') {
       message = await API.post('/me/posts', post, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(function (res) {
        return {
          status: true,
          message: 'success',
        };
      }).catch(function (error) {
        console.log(error);
        return {
          status: false,
          message: 'Cette opération a échoué veuillez essayer plus tard.',
        };
      });

      if (message.status) {
        message.message = post;
      }
    } else {
      message = await API.post('/group/post', post, {
          headers: {
            'authorization': 'Bearer ' + localStorage.getItem('token')
          }
      }).then(function (res) {
        return {
          status: true,
          message: 'success',
        };
      }).catch(function (error) {
        console.log(error);
        return {
          status: false,
          message: 'Cette opération a échoué veuillez essayer plus tard.',
        };
      });

      if (message.status) {
        post = {
          title: post.title,
          avatar: {
            avatarurl: currentUser.avatarurl,
          },
          content: post.content,
          tags: post.tags,
          content_url: post.content_url,
          content_type: post.content_type
        };

        message.message = post;
      }
    }

    await this.props.onCreated(message);

    await this.setState({
      title: '',
      content: '',
      contentType: 0,
      contentUrl: '',
      tags: [],
      showUrlField: false
    });
  };

  updateTag = (tags) => {
    this.setState({
      tags: tags
    })
  };

  changeType(type) {
    this.setState({
      showUrlField: true,
      contentType: type
    });
  };

  disableEnter = (event) => {

    if (event.which === 13) {
      event.preventDefault();
    }
  };

  render() {

    const { tags } = this.state;

    return (
      <div className="article-item">
        <Card className="article">
          <CardContent>
            <form onSubmit={this.handleSubmit} onKeyPress={this.disableEnter} >
              <FormControl fullWidth={true}
                           // required={true}
              >
                <InputLabel htmlFor="title">Titre</InputLabel>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl fullWidth={true}
                           // required={true}
              >
                <TextField
                  id="content"
                  name="content"
                  label="Contenu"
                  multiline={true}
                  rows={4}
                  type="text"
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </FormControl>
              <TagInput updateTag={this.updateTag} tags={tags}/>
              <div className="button-field">
                <Button className="image-btn" size="small" onClick={this.changeType.bind(this, 2)}><Icon>panorama</Icon>&nbsp;Image</Button>
                <Button className="youtube-btn" size="small" onClick={this.changeType.bind(this, 1)}><Icon>play_arrow</Icon>&nbsp;Youtube</Button>
              </div>
              {
                this.state.showUrlField ?
                  <FormControl fullWidth={true}
                               // required={false}
                  >
                    <InputLabel htmlFor="contentUrl">Url</InputLabel>
                    <Input
                      id="contentUrl"
                      name="contentUrl"
                      type="url"
                      value={this.state.contentUrl}
                      onChange={this.handleChange}
                    />
                  </FormControl> : null
              }
              <Input
                type="submit"
                value="PUBLIER"
                className="btn-start-art btn-contained btn-article-form"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
}

Create.propTypes = {
  onCreated: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default Create;