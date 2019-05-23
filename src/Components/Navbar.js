import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Reorder from '@material-ui/icons/Reorder';

const languages = [
    // {
    //     name: 'C',
    //     year: 1972
    // },
    // {
    //     name: 'Elm',
    //     year: 2012
    // },
];

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
    </div>
);

class Navbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            auth: true,
            anchorEl: null,
            isLoggedIn: (localStorage.getItem('token')),
            // search variable
            value: '',
            suggestions: []
        };

        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.logOut = this.logOut.bind(this);
        this.profile = this.profile.bind(this);
    }

    profile() {
        window.location.pathname = '/profile'
    }

    handleMenu(event)  {
        this.setState({
            anchorEl: event.currentTarget,
            //open: true
        });
        let state = this.state;
        setTimeout(function () {
            console.log(Boolean(state.anchorEl));
        }, 1000);
    };

    handleClose() {
        this.setState({ anchorEl: null });
    };

    // onChangeResearch(event, newValue) {
    //     this.setState({
    //         suggestions: newValue
    //     })
    // }

    onChangeResearch = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    logOut() {
        localStorage.clear();

        this.setState({ anchorEl: null });
        window.location.pathname = '/login';
    }

    render() {
        const { anchorEl, value, suggestions } = this.state;
        //const open = Boolean(this.state.anchorEl);

        const inputProps = {
            placeholder: 'Rechercher',
            value,
            onChange: this.onChangeResearch,
            onKeyUp: this.props.search
        };

        return (
            <AppBar position="sticky">
                <Toolbar>
                    <Button color="inherit" onClick={this.props.sidenav}><Reorder/></Button>
                    <Typography variant="title" color="inherit" className="navbar-title">
                        ST'ART
                    </Typography>
                    <Autosuggest
                        className="navbar-search"
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />
                    <div className="navbar-button">
                        <IconButton
                            aria-owns={anchorEl ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            //aria-owns={this.anchorEl ? 'navbar-button' : null}
                            //aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.profile}>Profil</MenuItem>
                            <MenuItem onClick={this.props.logout}>Déconnexion</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Navbar;