import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import News, { type } from "../../Components/News";
import CreateNews from '../../Components/News/Create';
import Toast from '../../Components/Toast';

class Actuality extends Component {

  constructor(props) {
    super(props);

    this.state = {
      news: null,
      error: null,
      // id: (props.user)?props.user.id:0
    }
  }

  addNews = (message) => {

    if (message.status) {

      this.setState({
        news: message.message,
        error: {
          message: 'Votre article a bien été créer',
        }
      })
    } else {
      this.setState({
        news: null,
        error: {
          message: message.message,
        }
      });
    }
  };

  onError = (message) => {
    this.setState({
      error: {
        message: message,
      }
    })
  };

  closeError = () => {
    this.setState({
      news: null,
      error: null,
    })
  };

  // componentWillReceiveProps(props) {
  // this.setState({
  //     id: props.user.id
  // });
  // }

  render() {
    const { news, error } = this.state;

    let toast = null;
    if (error) {
      toast = (
        <Toast
          open={true}
          onClose={this.closeError}
          message={error ? error.message : ''}
        />
      )
    }

    return (
      <Grid container className="" justify="center">
        <Grid item xs={12} md={10} lg={6}>
          <CreateNews onCreated={this.addNews} type={'0'}/>
          <News type={type.ALL} url={'/news'} page={1} limit={10} isEmpty={'Fil d\'actualité vide.'} post={news} onError={this.onError}/>
        </Grid>
        { toast }
      </Grid>
    )
  }
}

export default Actuality;