import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Profile from "./views/Profile";
import EditProfile from "./views/Profile/Tabs/EditProfile";
import Error from "./views/Error";
import Sidenav from "./views/Sidenav/index";
import Actuality from "./views/Actuality";
import Event from './Components/Event';
import Map from './Event/EventHome';
import EventPage from './views/Event';
import PaymentPage from './Components/Payment/PaymentPage'
import Search from "./views/Search";
import Group from "./views/Group";
import EditGroup from "./views/Group/Edit";
import Recommendation from "./views/Recommendation";
import './Components/core.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
      isLoggedIn: Boolean(localStorage.getItem('token')),
      sidenavOpen: true,
      // search
      hasSearch: false,
      searchValue: ''
    };

    this.logOut = this.logOut.bind(this);
    this.toggleSidenav = this.toggleSidenav.bind(this);
  }

  logOut() {
    localStorage.clear();

    this.setState({
      isLoggedIn: false
    });
    window.location.pathname = '/login';
  }

  toggleSidenav() {
    console.log('test');
    this.setState({
      sidenavOpen: !(this.state.sidenavOpen)
    });
  }

  doSearch = (event) => {
    if (event.keyCode === 13 && event.target.value !== '') {
      window.location.pathname = '/search/user/' + event.target.value;
      // this.setState({
      //     hasSearch: true,
      //     searchValue: event.target.value
      // });
    }
  };

  resetSearch() {
    this.setState({
      hasSearch: false,
      searchValue: ''
    })
  }

  render() {

    const { isLoggedIn, user, sidenavOpen, hasSearch } = this.state;

    const routes = isLoggedIn ? (
      <Switch>
        {/*<Route exact path="/" component={Home} />*/}
        {/*<Route exact path="/news" component={Home} />*/}
        <Route exact path="/" component={Actuality}/>
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile/edit" component={EditProfile} />
        <Route exact path="/profile/:id" component={Profile} />
        <Route exact path="/recommendation" component={Recommendation} />
        <Route exact path="/event/edit/:id" component={Event}/>
        <Route exact path="/event/edit" component={Event}/>
        <Route exact path="/event/:id" component={EventPage}/>
        {/*<Route path="/Payment" component={PaymentPage}/>*/}
        <Route exact path="/event" component={Map}/>
        <Route path="/search/:str" component={Search}/>
        <Route path="/group/edit/:id" component={EditGroup}/>
        <Route path="/group/edit" component={EditGroup}/>
        <Route path="/group/:id" component={Group}/>
        <Route component={Error}/>
      </Switch>
    ) : (
      <Redirect to="/login"/>
    );

    return (
      <div className="App">
        {/*<Navbar logout={this.logOut} sidenav={this.toggleSidenav} search={this.doSearch.bind(this)}/>*/}
        <Sidenav user={user} open={sidenavOpen} search={this.doSearch}/>
        <div className={(sidenavOpen)?'page open':'page close'}>
          {/*<div className={(this.state.hasSearch)?'show':'hide'}>*/}
          {/*<Search value={this.state.searchValue} reset={this.resetSearch.bind(this)}/>*/}
          {/*</div>*/}
          <div className={(!hasSearch)?'show':'hide'}>
            { routes }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
