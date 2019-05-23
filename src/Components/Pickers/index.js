import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateFormatInput, TimeFormatInput } from 'material-ui-next-pickers'
import Grid from '@material-ui/core/Grid';

class Pickers extends Component {

  constructor (props) {
    super(props);

    this.state = {
    };

  };

  dateChange = (value) => {
    this.props.onChange({
      type: 'date',
      value: value,
    });
  };

  timeChange = (value) => {
    this.props.onChange({
      type: 'time',
      value: value,
    });
  };

  render() {

    const { label, date, time } = this.props;

    return (
      <Grid container className={this.props.classes.root ? this.props.classes.root : ''}
      >
        <Grid item xs={12}>
          <label>{ label }</label>
        </Grid>
        <Grid item xs={12} lg={4}>
          <DateFormatInput
            name="startDate"
            value={date}
            dateFormat="dd/MM/yyyy"
            onChange={this.dateChange}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TimeFormatInput
            name="startTime"
            value={time}
            onChange={this.timeChange}
          />
        </Grid>
      </Grid>
    );
  }
}

Pickers.propTypes = {
  label: PropTypes.string.isRequired,
  classes: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default Pickers;