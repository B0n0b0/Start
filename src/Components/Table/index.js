import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow';
import './style.css'

class StartTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: this.props.headers
    };
  }

  renderChildren() {
    const { children } = this.props;

    if (!children)
      return false;

    let i = 0;
    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        key: i++,
        hover: true
      })
    })
  }

  render() {

    const { headers } = this.state;
    const { paginate, classes } = this.props;
    const children = this.renderChildren();
    // console.log(children);

    const headerList = headers.map((header) =>
      <TableCell key={header.toString()} className={classes && classes.header ? classes.header : ''}>{header}</TableCell>
    );

    let pagination = null;
    if (paginate) {
      pagination = (
        <TableRow>
          <TablePagination
            colSpan={3}
            count={this.props.count}
            page={this.props.page}
            onChangePage={this.props.changePage}
            rowsPerPage={this.props.rowPerPage}
            onChangeRowsPerPage={this.props.changeRowsPerPage}
          />
        </TableRow>
      );
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            { headerList }
          </TableRow>
        </TableHead>
        <TableBody>
          { children }
        </TableBody>
        <TableFooter>
          { pagination }
        </TableFooter>
      </Table>
    )
  }
}

StartTable.propTypes = {
  headers: PropTypes.array.isRequired,
  paginate: PropTypes.bool.isRequired,
  delete: PropTypes.bool,
  deleteAction: PropTypes.func,
  edit: PropTypes.bool,
  changePage: PropTypes.func,
  changeRowsPerPage: PropTypes.func,
  page: PropTypes.number,
  rowPerPage: PropTypes.number,
  count: PropTypes.number,
  classes: PropTypes.array,
};

export default StartTable;