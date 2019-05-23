import React, { Component } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class TableRowUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rows: this.props.rows,
        };
        console.log(this.state);
    }

    componentWillReceiveProps(props) {
        this.setState({
            rows: props.rows
        });
    }

    render() {

        const { rows } = this.state;

        return rows.map((row) => {
            return (
                <TableRow key={row.id} hover={true}>
                    <TableCell>{ row.name }</TableCell>
                    <TableCell>{ row.firstname }</TableCell>
                    <TableCell>{ row.lastname }</TableCell>
                    <TableCell>{ (row.gender)?'Femme':'Homme' }</TableCell>
                </TableRow>
            );
        });
    }
}

export default TableRowUser;