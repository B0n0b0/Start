import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './style.css';

class ImageInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            image: '',
            imageInput: '',
            dialogOpen: false,
            isHover: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.handleMouseNotHover = this.handleMouseNotHover.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onAcceptDialog = this.onAcceptDialog.bind(this);
    }

    handleChange(event) {
        this.setState({
            image: event.target.value
        })
    }

    handleOpen() {
        this.setState({
            dialogOpen: true
        });
    };

    handleClose() {
        this.setState({
            dialogOpen: false,
        });
    };

    onAcceptDialog() {
        this.props.onClick(this.state.image);
        this.setState({
            imageInput: this.state.image,
            dialogOpen: false
        })
    }

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

    render () {

        const { imageInput, dialogOpen, isHover } = this.state;
        const { image, style, button } = this.props;

        let changeImage = null;
        if (isHover && !button) {
            changeImage = <div
                className="image-hover"
                onMouseEnter={this.handleMouseHover}
                onMouseLeave={this.handleMouseNotHover}
                onClick={this.handleOpen}
            ><span>Modifier l'image</span></div>
        }
        else if (button) {
            changeImage = <Button className="image-button" onClick={this.handleOpen}>Modifier l'image</Button>
        }

        return (
            <div>
                <div style={{backgroundImage: 'url('+ (image ? image : imageInput) +')'}}
                     className={(style && style.image) ? style.image : ''}
                     onMouseEnter={this.handleMouseHover}
                     onMouseLeave={this.handleMouseNotHover}
                >
                    { (button && !image && !imageInput) ? <span className="image-msg">Ajouter une bannière</span> : null }
                    { changeImage }
                </div>
                <Dialog
                    open={dialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    className={(style && style.dialog) ? style.dialog : ''}
                >
                    <DialogTitle id="form-dialog-title">Changer votre avatar</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="newAvatar"
                            name="newAvatar"
                            label="Url de l'avatar"
                            type="url"
                            value={this.state.image}
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

ImageInput.propTypes = {
    image: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    button: PropTypes.bool,
};

export default ImageInput;