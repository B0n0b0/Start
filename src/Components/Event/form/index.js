import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Image from '../../ImageInput';
import Pickers from "../../Pickers";
import Place from "../../PlaceInput";
import SearchArtist, {SearchType} from '../../../Components/SearchInput';
import Table from "../../Table";

const currentUser = JSON.parse(localStorage.getItem('user'));

class FormEvent extends Component {

  constructor (props) {
    super(props);

    this.state = {
      cover : '',
      name: '',
      ticket: '',
      price: '',
      category: '',
      description: '',
      address: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      latitude: '',
      longitude: '',
      place: null,
      artists: [],
      admins: [],
    };

  };

  componentWillReceiveProps = (props) => {
    if (props && props.event) {
      const { event, artists } = props;

      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);
      startDate.setHours(startDate.getUTCHours());
      endDate.setHours(endDate.getUTCHours());
      this.setState({
        name: event.name,
        cover: event.cover,
        ticket: event.ticket_left ? event.ticket_left : '',
        price: event.price,
        category: event.category,
        description: event.description,
        address: event.street_address,
        startDate: startDate,
        startTime: startDate,
        endDate: endDate,
        endTime: endDate,
        latitude: event.latitude,
        longitude: event.longitude,
        artists: artists,
        admins: event.admins,
      });
    }
  };

  onSubmit = (event) => {
    event.preventDefault();

    const { cover, name, description, ticket, price, category, address, startDate, startTime, endDate, endTime, latitude, longitude, place } = this.state;

    let data = {};
    if (!endDate || !endTime) {
      data = {
        status: 'fail',
        data: {
          message: 'Veuillez ajouter une date de début de l\'évenement.'
        }
      };
    }

    if (!startDate || !startTime) {
      data = {
        status: 'fail',
        data: {
          message: 'Veuillez ajouter une date de début de l\'évenement.'
        }
      };
    }

    if (!address || !latitude || !longitude) {
      data = {
        status: 'fail',
        data: {
          message: 'Veuillez ajouter une adresse.'
        }
      };
    }

    if (!category) {
      data = {
        status: 'fail',
        data: {
          message: 'Veuillez ajouter une categorie.'
        }
      };
    }

    if (!description) {
      data = {
        status: 'fail',
        data: {
          message: 'Veuillez ajouter une description.'
        }
      };
    }

    if (!name) {
      data = {
        status: 'fail',
        data: {
          message: 'Veuillez ajouter un nom.'
        }
      };
    }

    if (!cover) {
      data = {
        status: 'fail',
        data: {
          message: 'Veuillez ajouter une bannière.'
        }
      };
    }

    if (cover && name && description && ticket && price && category && address && startDate && startTime && endDate && endTime && latitude && longitude) {
      const start = `${moment(startDate).format('YYYY-MM-DD')}T${moment(startTime).format('HH:mm:00')}Z`;
      const end = `${moment(endDate).format('YYYY-MM-DD')}T${moment(endTime).format('HH:mm:00')}Z`;

      if (new Date(start) >= new Date(end)) {
        data = {
          status: 'fail',
          data: {
            message: 'La date de début doit être avant la date de fin.'
          }
        };
      } else {
        let dataAddress = {};
        if (place) {
          for (let i = 0; i < place.address_components.length; i++) {
            const type = place.address_components[i].types[0];
            if (type === 'postal_code') {
              dataAddress.zip_code = place.address_components[i].long_name;
            }
            if (type === 'locality') {
              dataAddress.city = place.address_components[i].long_name;
            }
            if (type === 'country') {
              dataAddress.country = place.address_components[i].long_name;
            }
          }


          data = {
            status: 'success',
            data: {
              name: name,
              category: category,
              description: description,
              cover: cover,
              start_time: start,
              end_time: end,
              ticket_left: ticket,
              price: price,
              street_address: address,
              latitude: latitude,
              longitude: longitude,
              zip_code: (dataAddress.zip_code) ? dataAddress.zip_code: '',
              city: (dataAddress.city) ? dataAddress.city: '',
              country: (dataAddress.country) ? dataAddress.country: '',
              artists: this.state.artists,
              admins: this.state.admins,
            },
          };
        } else {
          data = {
            status: 'success',
            data: {
              name: name,
              category: category,
              description: description,
              cover: cover,
              start_time: start,
              end_time: end,
              ticket_left: ticket,
              price: price,
              street_address: address,
              latitude: latitude,
              longitude: longitude,
              artists: this.state.artists,
              admins: this.state.admins,
            },
          };
        }
      }
    }

    this.props.onSubmit(data);
  };

  onCoverChange(cover) {
    if (cover) {
      this.setState({
        cover: cover
      });
    }
  }

  startChange = (value) => {
    if (value.type === 'date') {
      this.setState({
        startDate: value.value,
      });
    } else {
      this.setState({
        startTime: value.value,
      });
    }
  };

  endChange = (value) => {
    if (value.type === 'date') {
      this.setState({
        endDate: value.value,
      });
    } else {
      this.setState({
        endTime: value.value,
      });
    }
  };

  placeSelected = (place) => {
    this.setState({
      address: place.address.formatted_address,
      place: place.address,
      latitude: place.latLng.lat,
      longitude: place.latLng.lng,
    });
  };

  selectArtist = async (artist) => {
    const { artists } = this.state;
    // console.log(artist)
    let exist = await artists.find((element) => {
      return artist.id === element.id
    });

    if (!exist) {
      artists.push(artist);
      this.setState({
        artists: artists,
      });
      // console.log(this.state);
    }
  };

  isAdmin = (id) => {
    let { admins } = this.state;
    const isAdmin = admins.find((element) => {
      return element === id;
    });

    return isAdmin ? true : false;
  };

  toggleAdmin = (id) => {
    let { admins } = this.state;
    const isAdmin = admins.findIndex((element) => {
      return element === id;
    });

    if (isAdmin >= 0) {
      admins.splice(isAdmin, 1);
    } else {
      admins.push(id);
    }

    this.setState({
      admins: admins,
    });
  };

  removeArtist = (id) => {
    let { artists } = this.state;
    const isArtist = artists.findIndex((element) => {
      return element.id ? element.id === id : element.user_id === id;
    });

    if (isArtist >= 0) {
      artists.splice(isArtist, 1);
    }

    this.setState({
      artists: artists,
    });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  };

  render() {

    const { artists } = this.state;

    let items = [];
    artists.map((artist, i) => {
      items.push(
        <TableRow key={i}>
          <TableCell className="artist-cell">
            <Link to={`/profile/${artist.id ? artist.id : artist.user_id}`} className="artist-link">
              { artist.id ? artist.id : artist.user_id }
            </Link>
          </TableCell>
          {/*<TableCell>*/}
            {/*<CheckBox*/}
              {/*checked={this.isAdmin(artist.id ? artist.id : artist.user_id)}*/}
              {/*onChange={this.toggleAdmin.bind(this, artist.id ? artist.id : artist.user_id)}*/}
              {/*disabled={artist.id ? artist.id === currentUser.id : artist.user_id === currentUser.id}*/}
            {/*/>*/}
          {/*</TableCell>*/}
          <TableCell className="artist-cell">
            <Button disabled={artist.id ? artist.id === currentUser.id : artist.user_id === currentUser.id} onClick={this.removeArtist.bind(this, artist.id ? artist.id : artist.user_id)}><Icon>delete</Icon></Button>
          </TableCell>
        </TableRow>
      )
    });

    return (
      <form onSubmit={this.onSubmit}>
        <Image image={this.state.cover} onClick={this.onCoverChange.bind(this)} button={true} style={{image: 'event-banner-image'}}/>
        <TextField
          id="name"
          name="name"
          type="text"
          fullWidth={true}
          classes={{
            root: "event-edit-input",
          }}
          label="Nom"
          // placeholder="Nom"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <TextField
          id="description"
          name="description"
          type="text"
          fullWidth={true}
          classes={{
            root: "event-edit-input",
          }}
          label="Description"
          multiline={true}
          rows={4}
          // placeholder="Nom"
          value={this.state.description}
          onChange={this.handleChange}
        />
        <Pickers
          label="Date de début"
          classes={{
            root: "event-edit-input",
          }}
          date={this.state.startDate}
          time={this.state.startTime}
          onChange={this.startChange}
        />
        <Pickers
          classes={{
            root: "event-edit-input",
          }}
          label="Date de fin"
          date={this.state.endDate}
          time={this.state.endTime}
          onChange={this.endChange}
        />
        <TextField
          id="ticket"
          name="ticket"
          fullWidth={true}
          classes={{
            root: "event-edit-input",
          }}
          label="Nombre de ticket"
          type="number"
          // placeholder="Nom"
          value={this.state.ticket}
          onChange={this.handleChange}
        />
        <TextField
          id="price"
          name="price"
          fullWidth={true}
          classes={{
            root: "event-edit-input",
          }}
          label="Prix"
          type="number"
          // placeholder="Nom"
          value={this.state.price}
          onChange={this.handleChange}
        />
        <FormControl
          fullWidth={true}
          classes={{
            root: "event-edit-input",
          }}
        >
          <InputLabel htmlFor="Categorie">Categorie</InputLabel>
          <Select
            value={this.state.category}
            onChange={this.handleChange}
            inputProps={{
              name: 'category',
              id: 'category',
            }}
          >
            <MenuItem value={'concert'}>Concert</MenuItem>
            <MenuItem value={'exposition'}>Exposition</MenuItem>
            <MenuItem value={'festival'}>Festival</MenuItem>
            <MenuItem value={'spectacle'}>Spectacle</MenuItem>
            <MenuItem value={'salon'}>Salon</MenuItem>
            <MenuItem value={'autre'}>Autre</MenuItem>
          </Select>
        </FormControl>
        <Place
          classes={{
            root: "event-edit-input",
          }}
          address={this.state.address}
          onSelect={this.placeSelected}
        />
        { this.props.event ?
          <div>
            <SearchArtist type={SearchType.ARTIST} classes={{root: 'artist-search'}} onSelect={this.selectArtist} placeholder="Ajouter un artiste" suggest={true}/>
            <Table headers={['id', 'Supprimer']} paginate={false} classes={{header: 'artist-cell'}}>
              { items }
            </Table>
          </div> : ''
        }

        <input
          type="submit"
          value="Enregistrer"
          className="create-event-button event-save-btn btn-form"
        />
      </form>
    );
  }
}

FormEvent.propTypes = {
  artists: PropTypes.array,
  event: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default FormEvent;