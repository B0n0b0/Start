import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment/locale/fr';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import './style.css';

class List extends Component {

  constructor (props) {
    super(props);

    this.state = {
    };
  };

  render() {

    const { list, editable, empty } = this.props;

    let items = [];
    if (list) {
      list.map((elem, i) => {
        items.push(
          <Grid item key={i} xs={12} lg={6} className="event-card">
            <Link to={editable ? `/event/edit/${elem.id}` : `/event/${elem.id}`} className="event-link">
              <Card>
                <CardHeader
                  classes={{
                    root: 'event-card-header',
                  }}
                  // avatar={<Avatar isPrivate={true} avatar={}/>}
                  title={elem && elem.name ? elem.name : ''}
                  subheader={elem && elem.start_time ?
                    <div>
                      <p>{ elem.street_address }</p>
                      <p><Moment format="dddd DD MMMM YYYY">{ elem.start_time }</Moment></p>
                    </div>
                    : ''}
                />
                <CardMedia
                  className="event-list-image"
                  image={elem.cover}
                />
                {/*<CardContent>*/}
                {/*{ elem.street_address }*/}
                {/*</CardContent>*/}
              </Card>
            </Link>
          </Grid>
        );
        return items;
      });

      if (!items.length) {
        items = empty
      }
    }

    return (
      <Grid container>
        { items }
        { this.props.moreFunc ? <Button onClick={this.props.moreFunc}>Voir plus</Button> : '' }
      </Grid>
    );
  }
}

List.propTypes = {
  list: PropTypes.array,
  editable: PropTypes.bool.isRequired,
  moreFunc: PropTypes.func,
  empty: PropTypes.string,
};

export default List;
