import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Selector from './Selector';
import Toast from '../../Components/Toast';
import './sign.css';

class Sign extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
    }
  }

  setError = async (error) => {
      await this.setState({
        error: error
      })
  };

  closeError = () => {
    this.setState({
      error: null
    });
  };

  render() {

    const { error } = this.state;

    let toast = null;
    if (error) {
      toast = (
        <Toast
          open={true}
          onClose={this.closeError}
          message={error ? error.message : ''}
        />
      )
    }

    return (
      <Grid id="login-page" container>
        <Grid item xs={12} className="background-darken">
          <span className="logo-login">ST'ART</span>

          <Grid container className="center" justify="center">

            <Grid item xs={6} lg={4} className="login login-text">
              <div className="login-text-center">
                <h1>POUR LES ARTISTES C'EST LA OÙ TOUT COMMENCE !</h1>
                <h2>La plateforme des artistes</h2>
                <p>Venez promouvoir gratuitement votre travail et vos événements sur la plateforme ST'ART grâce à tous ses outils disponible. Vos fans vous le rendront grâce à un système d'abonnement via le quelle ils pourront vous financier d'un montant de leur choix.</p>
              </div>
            </Grid>

            <Grid item xs={12} md={6} lg={3} className="login">
              <Selector onError={this.setError}/>
            </Grid>

          </Grid>
        </Grid>
        { toast }
      </Grid>
    )
  }
}

export default Sign;