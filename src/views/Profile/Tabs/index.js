import React, { Component } from 'react';
import NewsProfile from './NewsProfile';
import Followings from './Followings';
import Subscribings from './Subscribings';
import Followers from './Followers';
import Subscribers from './Subscribers';
import EditProfile from "./EditProfile";
import Group from './Group';

class Tabs extends Component {

    constructor (props) {
        super(props);

        this.state = {
            isMe: false
        };


    }

    componentWillReceiveProps(props) {

        let isMe;
        if (props.user && props.user.id === JSON.parse(localStorage.getItem('user')).id) {
            isMe = true;
        }

        this.setState({
            id: props.user.id,
            isMe: isMe
        }) ;
    }

    render() {

        let page = null;
        switch (this.props.value) {
            case 1:
                page = (<Followings user={this.props.user}/>);
                break;
            case 2:
                page = (<Followers user={this.props.user}/>);
                break;
            case 3:
                page = (<Subscribings user={this.props.user}/>);
                break;
            case 4:
                page = (<Subscribers user={this.props.user}/>);
                break;
            case 5:
                page = (<Group isPrivate={this.props.isPrivate}/>);
                break;
            case 6:
                page = (<EditProfile user={this.props.user}/>);
                break;
            default:
                page = (<NewsProfile user={this.props.user} isMe={this.state.isMe}/>);
                break;
        }

        return (
            <div>
                { page }
            </div>
            // <Grid container className="" justify="center">
            //     <Grid item xs={12} className="">
            //         { page }
            //     </Grid>
            // </Grid>
        );
    }
}

export default Tabs;