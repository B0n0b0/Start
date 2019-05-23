import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '../../Components/ProfileAvatar';
import Recommendation from "../Recommendation"
import Search, {SearchType} from '../../Components/SearchInput';
import './style.css';

class Sidenav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      displayEvent : false,
      recommendation : false, 
    }
  }

  logOut = () => {
    localStorage.clear();

    // this.setState({ anchorEl: null });
    window.location.pathname = '/login';
  };

  toggleDrawer = (open) => {
    this.setState({
      recommendation: open,
    });
    console.log("ok --- ", this.state.recommendation)
  };

  handleProfileClick = () => {
    window.location.pathname = '/profile'
  };

  hideEvent = () => {
    this.setState({
      displayEvent : false,
    })
  };

  displayEvent = () => {
    this.setState({
      displayEvent : true,
    })
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ open: !state.open}));
  };

  render() {
    const { user } = this.props;

    // let createEvent= '';
    // let myEvent = '';
    //
    // if (this.state.displayEvent)
    //     {
    //         createEvent = <NavLink to="/event/create" className="sidenav-button">Créer événement</NavLink>;
    //         myEvent = <NavLink to="/event/perso" className="sidenav-button">Mes événements</NavLink>;
    //     }

    return (
      <nav>
        <Hidden smDown implementation="css">
          <Drawer
            open
            // className={(this.props.open)?'sidenav open':'sidenav close'}
            className={'sidenav'}
            classes={{paper: 'background-light-grey'}}
            variant="permanent"
            // anchor="left"
          >
            <div onClick={this.handleProfileClick}>
              <Grid container className="user-sidenav">
                <Grid item xs={12} className="user-info">
                  <Avatar isPrivate={true} avatar={(user && user.avatarurl ? user.avatarurl : '')} onClick={this.handleProfileClick} classes={{avatar: 'sidenav'}}/>
                  <span className="user-username">{ user ? user.username : '' }</span>
                  {/*<span className="user-name">Thomas Bono</span>*/}
                </Grid>
                <Grid item xs={12}>
                  <span className="user-email">{ user ? user.email : '' }</span>
                </Grid>
              </Grid>
            </div>
            {/*<Divider/>*/}
            {/*<SearchBar getSuggestions={this.getSuggestions} suggestionSelected={this.onSelectedSuggestion} renderSuggestions={(<div></div>)}/>*/}
            <Divider className="divider-margin-bottom"/>
            <Search classes={{root: 'sidenav-search'}} type={SearchType.ALLUSER}/>
            {/*<NavLink to="/" exact className="sidenav-button" onClick={this.hideEvent}>Accueil</NavLink>*/}
            <NavLink to="/" exact className="sidenav-button" onClick={this.hideEvent}><Icon>web</Icon><span className="btn-name">Votre fil</span></NavLink>
            <NavLink to="/event" className="sidenav-button" onClick={this.displayEvent}><Icon>map</Icon><span className="btn-name">Découvrir</span></NavLink>
            <a href="#" className="sidenav-button" onClick={() => this.toggleDrawer(true)}><Icon>star</Icon><span className="btn-name">Recommendation</span></a>
            <a href="#" className="sidenav-button" onClick={this.logOut}><Icon>power_settings_new</Icon><span className="btn-name">Déconnexion</span></a>
            {/*{createEvent}*/}
            {/*{myEvent}*/}
            <img className="start-logo" src={'/assets/logo.png'}/>
            {/*<div>test</div>*/}
          </Drawer>
          <Drawer anchor="right" open={this.state.recommendation} onClose={() => this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.toggleDrawer(false)}
            onKeyDown={() => this.toggleDrawer(false)}
          >
            <Recommendation />
          </div>
        </Drawer>
        </Hidden>
        <Hidden lgUp implementation="css">
          <AppBar position="fixed" className="mobile-navbar">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
              >
                <Icon>menu</Icon>
              </IconButton>
              {/*<Typography variant="h6" color="inherit" noWrap>*/}
                {/*Responsive drawer*/}
              {/*</Typography>*/}
            </Toolbar>
          </AppBar>
          <Drawer
            open={this.state.open}
            // className={(this.props.open)?'sidenav open':'sidenav close'}
            className={'sidenav'}
            classes={{paper: 'background-light-grey'}}
            onClose={this.handleDrawerToggle}
            // anchor="left"
          >
            <Link to="/profile">
              <Grid container className="user-sidenav">
                <Grid item xs={12} className="user-info">
                  <Avatar isPrivate={true} avatar={(user && user.avatarurl ? user.avatarurl : '')} onClick={this.handleProfileClick} classes={{avatar: 'sidenav'}}/>
                  <span className="user-username">{ user ? user.username : '' }</span>
                  {/*<span className="user-name">Thomas Bono</span>*/}
                </Grid>
                <Grid item xs={12}>
                  <span className="user-email">{ user ? user.email : '' }</span>
                </Grid>
              </Grid>
            </Link>
            {/*<Divider/>*/}
            {/*<SearchBar getSuggestions={this.getSuggestions} suggestionSelected={this.onSelectedSuggestion} renderSuggestions={(<div></div>)}/>*/}
            <Divider className="divider-margin-bottom"/>
            {/*<NavLink to="/" exact className="sidenav-button" onClick={this.hideEvent}>Accueil</NavLink>*/}
            <NavLink to="/" exact className="sidenav-button" onClick={this.hideEvent}><Icon>web</Icon><span className="btn-name">Votre fil</span></NavLink>
            <NavLink to="/event" className="sidenav-button" onClick={this.displayEvent}><Icon>map</Icon><span className="btn-name">Découvrir</span></NavLink>
            <a href="#" className="sidenav-button" onClick={() => this.toggleDrawer(true)}><Icon>star</Icon><span className="btn-name">Recommendation</span></a>
            <a href="#" className="sidenav-button" onClick={this.logOut}><Icon>power_settings_new</Icon><span className="btn-name">Déconnexion</span></a>
            {/*{createEvent}*/}
            {/*{myEvent}*/}
            <img className="start-logo" src={'/assets/logo.png'}/>
          </Drawer>
          <Drawer anchor="right" open={this.state.recommendation} onClose={() => this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.toggleDrawer(false)}
            onKeyDown={() => this.toggleDrawer(false)}
          >
            <Recommendation />
          </div>
        </Drawer>
        </Hidden>
      </nav>
    )
  }
}

Sidenav.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default Sidenav;