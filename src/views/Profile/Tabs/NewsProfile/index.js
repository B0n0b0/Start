import React, { Component } from 'react';
import UserNews, { type } from '../../../../Components/News/index'

class NewsProfile extends Component{

    render() {

        return (
            <UserNews type={type.USER} page={1} limit={10} user={true} isMe={this.props.isMe} isEmpty={'Fil d\'actualité vide.'}/>
        )
    }
}


export default NewsProfile;