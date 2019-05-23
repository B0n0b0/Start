import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import './tabsBar.css';

class TabsBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      index: 0
    }
  }

  changePage = (event, value) => {
    const { index } = this.state;
    if (index !== value) {
      this.setState({
        index: value
      });
    }
  };

  renderChildren() {
    const { index } = this.state;
    const { children } = this.props;

    if (!children)
      return false;

    let i = 0;
    return React.Children.map(children, child => {
      let page = (<div className={i === index ? '' : 'hide'}>
        { React.cloneElement(child, {}) }
      </div>);
      ++i;
      return page
    })
  }

  render () {
    const {index} = this.state;
    const {pages} = this.props;
    const children = this.renderChildren();

    let items = [];
    pages.map((page, i) => {
      items.push(
        <BottomNavigationAction key={i} label={page} classes={{root: 'nav-button', selected: 'selected'}}/>
      );
      return true;
    });

    return (
      <div>
        <BottomNavigation
          value={index}
          onChange={this.changePage}
          showLabels
          className="profile-tabs"
        >
          {items}
        </BottomNavigation>
        <div className="tabs-children">
          { children }
        </div>
      </div>
    )
  }
}

TabsBar.propTypes = {
  children: PropTypes.array.isRequired,
  pages: PropTypes.array.isRequired
};

export default TabsBar;