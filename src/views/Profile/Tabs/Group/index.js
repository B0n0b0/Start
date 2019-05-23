import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import API from "../../../../Components/api";
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '../../../../Components/ProfileAvatar';
import Table from '../../../../Components/Table/index';

class Group extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      limit: 10,
      groups: [],
      hasMore: true,
      total: 0
    };

  }

  componentWillReceiveProps(props) {
    this.reloadList();
  }

  reloadList() {

    const { user } = this.props;

    if (user) {
      let self = this;
      API.get(`/group/${user.id}/${(this.state.page + 1)}/${this.state.limit}`, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(function (res) {
          let { data } = res.data;
          let result = data.docs;

          self.setState({
            total: data.total,
            groups: result
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  changePage(event, page) {
    this.reloadList();
    this.setState({
      page: page
    });
  }

  changeRowsPerPage(event) {
    this.reloadList();
    this.setState({
      limit: event.target.value
    })
  }

  isLeader = () => {
    const { groups } = this.state;
    const { user, isPrivate } = this.props;

    if (groups && user) {

      if (isPrivate || user.status !== 2) {
        return true;
      }

      for (let i = 0; i < groups.length; i++) {
        let result = groups[i].leader.findIndex((element) => {
          return element.id === user.id;
        });

        if (result >= 0) {
          return true;
        }
      }
    }

    return false;
  };

  handleClick(id) {
    // console.log(id)
    window.location.pathname = '/group/' + id;
  }

  render () {

    const { groups, page, limit, total } = this.state;
    const { isPrivate, user } = this.props;

    let items = [];
    groups.map((group, i) => {
      items.push(
        <TableRow key={i} onClick={this.handleClick.bind(this, group.id)} classes={{root: 'tr-user'}}>
          {/*<TableCell>{ (i + 1) + (page * limit) }</TableCell>*/}
          <TableCell><Avatar isPrivate={true} avatar={ group.logo }/></TableCell>
          <TableCell>{ group.groupName }</TableCell>
          <TableCell>{ (group && group.members ? group.members.length : 0) + group.leader.length }</TableCell>
        </TableRow>
      );
      return items;
    });

    if (groups.length === 0) {
      items = (
        <TableRow>
          <TableCell colSpan={3} className="table-cell empty">{!isPrivate ? "Vous n'êtes dans aucun groupe actuellement." : "Aucun groupe actuellement."}</TableCell>
        </TableRow>
      )
    }

    return (
      <Grid container justify="center">
        <Grid item xs={12}>
          <Table
            headers={['Logo', 'nom', 'membres']}
            changePage={this.changePage.bind(this)}
            changeRowsPerPage={this.changeRowsPerPage.bind(this)}
            count={total}
            page={page}
            rowPerPage={limit}
            paginate={true}
          >
            { items }
          </Table>
          {
            this.isLeader() ? '' : <Link to="/group/edit" className="add-group">Créer un groupe</Link>
          }
        </Grid>
      </Grid>
    )

  }
}

Group.propTypes = {
  isPrivate: PropTypes.bool,
  user: PropTypes.object,
};

export default Group;