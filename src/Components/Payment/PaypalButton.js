import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import paypal from 'paypal-checkout';
import API from '../api';

let PayPalButton = paypal.Button.driver('react', { React, ReactDOM });

class PaypalButton extends Component {
    
            constructor() {
                super();
                this.state = {
                    env: 'sandbox',
                    client: {
                        sandbox:    'AWi18rxt26-hrueMoPZ0tpGEOJnNT4QkiMQst9pYgaQNAfS1FLFxkxQuiaqRBj1vV5PmgHX_jA_c1ncL',
                    },
                    commit: true
                };
                
            }

            payment() {
                
                
            const data = {
                price : 2,
                quantity : 1,
                currency : 'EUR',
                }
            const headers = {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }

                    
                const URL = 'https://start-art.eu/api/me/subscriptions/4'
            
                console.log('payment --- ')
                console.log('data --- ' + JSON.stringify(data))
                return paypal.request.post(URL , data, headers)
                    .then(function(res) {
                        console.log(res)
                        return res.data.paymentId;
                    });
            }
            onAuthorize(data, actions) {
                return actions.payment.execute().then(function(paymentData) {
                    // Show a success page to the buyer
                });
            }
            render() {
                return (
                    <PayPalButton
                        commit={ this.state.commit }
                        env={ this.state.env }
                        client={ this.state.client }
                        payment={(data, actions) => this.payment(data, actions) }
                        onAuthorize={ (data, actions) => this.onAuthorize(data, actions) }
                    />
                );
            }
        }

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);