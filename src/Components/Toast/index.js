import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SnackBar from '@material-ui/core/Snackbar';

class Toast extends Component {

    render() {

        const { open, onClose, message } = this.props;

        let msg = (<span>{ (message) ? message : 'Une erreur est survenue.' }</span>);

        return (
            <SnackBar
                open={open}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                autoHideDuration={5000}
                onClose={onClose}
                message={msg}
            />
        )
    }
}

Toast.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string
};

export default Toast;