import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from "../../../api";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

class Create extends Component {

  constructor(props) {
    super(props);

    this.state = {
      comment: '',
    };

  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { article } = this.props;
    const { comment } = this.state;

    if (comment) {
      const data = {
        post_id: article,
        content: comment,
      };

      const message = await API.post('/comments', data, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {
          return {
            status: true,
            message: comment,
          };
        })
        .catch(function (error) {
          console.log(error);
          return {
            status: false,
            message: 'Cette opération a échoué veuillez essayer plus tard.'
          };
        });

      await this.setState({
        comment: '',
      });

      await this.props.onSubmit(message);
    }
  };

  handleChange = (event) => {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  };


  render() {
    const { comment } = this.state;

    return (
      <Grid container>
        <Grid item xs={12}>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="comment"
              name="comment"
              required={true}
              fullWidth={true}
              classes={{
                root: "new-comment-input",
              }}
              InputProps={{
                disableUnderline: true,
              }}
              // label="Ajouter un"
              // multiline={true}
              // rows={4}
              type="text"
              placeholder="Ajouter un commentaire"
              value={comment}
              onChange={this.handleChange}
            />
          </form>
        </Grid>
      </Grid>
    )
  }
}

Create.propTypes = {
  article: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Create;