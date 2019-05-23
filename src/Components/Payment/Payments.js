import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import API from '../api';
 
export default class Payments extends React.Component {
            
        constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            price : props.price,
            paymentID : 'AdsqHMOOvO7XIKrufbPLLX96oA6hSMOp113I8f9xCjfoxV6pA9_336pTEQ2mTMuD80MfHDuNytlAL6aY',
            currency : 'EUR',
            type : props.type,
            quantity : 1,
        };
        
}
            componentWillReceiveProps(props) {
        this.setState({
            id: (props.id)?props.id:'',
            price: (props.price)?props.price:0,
            type: (props.type)?props.type:0,
            quantity:(props.quantity)?props.quantity:1,
        });
    }
        
    render() {
        console.log("price ---", this.state.price  * this.state.quantity)
        const onSuccess = (payment) => {
            let self = this;
            const reqData = {
                payerID : payment.payerID,
                paymentID : payment.paymentID,
                price : this.state.price,
                quantity : 1,
                currency : 'EUR'
            }
            if(this.state.type === 1){          
                API.put('me/subscriptions/' + this.state.id, payment, {                  
                        headers: {
                            'authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then (function(res) {
                    alert('Abonnement OK')
                })
                console.log("The payment was succeeded!", payment);
            }
            else if (this.state.type === 2)
            {
                let self = this
                API.post('/me/events/'+ this.state.id + '/buy', payment , {                  
                    headers: {
                        'authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                    }).then (function(res) {
                        alert('Biller acheté')
                        API.put('/me/events/'+ self.state.id + '/join', '' , {                  
                            headers: {
                                'authorization': 'Bearer ' + localStorage.getItem('token')}
                            })
                    })
            }
            else if (this.state.type === 3)
            {
                API.put('/me/group_subscriptions/' + this.state.id, payment, {
                    headers: {
                        'authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then (function(res) {
                    alert('Abonnement OK')
                })
            }
        }		
        
        const onCancel = (data) => {
            	console.log('The payment was cancelled!', data);
        }	
        
        const onError = (err) => {
            console.log("Error!", err);
		
        }			
            
        let env = 'sandbox';
        let currency = 'EUR';
        let total = this.state.price;
        
        const client = {
            sandbox: this.state.paymentID,
            production: '',
        }  
        return (
            <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={onError} onSuccess={onSuccess} onCancel={onCancel} />
        );
    }
}