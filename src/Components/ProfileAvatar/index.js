import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './styles.css';

class ProfileAvatar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newAvatar: '',
      dialogOpen: false,
      isHover: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.handleMouseNotHover = this.handleMouseNotHover.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onAcceptDialog = this.onAcceptDialog.bind(this);
  }

  handleClickOpen() {
    this.setState({ dialogOpen: true })
  }

  handleClose() {
    this.setState({
      dialogOpen: false,
      newAvatar: ''
    });
  };

  handleMouseHover() {
    this.setState({
      isHover: true
    });
  }

  handleMouseNotHover() {
    this.setState({
      isHover: false
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  onAcceptDialog() {
    this.props.onClick(this.state.newAvatar);
    this.setState({
      dialogOpen: false
    })
  }

  render () {

    let { newAvatar, dialogOpen, isHover } = this.state;
    const { avatar, isPrivate, classes, hoverMessage } = this.props;

    let hover = null;
    if (isHover && !isPrivate) {
      hover = <div
        // className="profile-avatar-click"
        className={'avatar-hover ' + (classes && classes.hover ? classes.hover : '')}
        onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseNotHover}
        onClick={this.handleClickOpen}
      ><span>Changer l'image de profil</span></div>
    }

    return (
      <div className={'user-avatar ' + (classes && classes.avatar ? classes.avatar : '')}>
        <div
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseNotHover}
        >
          {/*<Avatar className="profile-avatar-big" src={avatar}/>*/}
          <Avatar className={'avatar'} src={avatar}/>
          {/*<Avatar className={'avatar'} src={'/assets/default_avatar.svg'}/>*/}
        </div>
        {hover}
        <Dialog
          open={dialogOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{(hoverMessage ? hoverMessage : 'Changer votre avatar')}</DialogTitle>
          <DialogContent>
            {/*<DialogContentText>*/}
            {/*Changer votre avatar.*/}
            {/*</DialogContentText>*/}
            <TextField
              autoFocus
              margin="dense"
              id="newAvatar"
              name="newAvatar"
              label="Url de l'avatar"
              type="url"
              value={newAvatar}
              onChange={this.handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Annuler
            </Button>
            <Button onClick={this.onAcceptDialog} color="primary">
              Modifier
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ProfileAvatar.propTypes = {
  avatar: PropTypes.string,
  isPrivate: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  hoverMessage: PropTypes.string,
  classes: PropTypes.object,
};

export default ProfileAvatar;