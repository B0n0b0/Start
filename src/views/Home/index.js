import React, { Component } from 'react';
import API from '../../Components/api';
import Grid from '@material-ui/core/Grid';
import Slider from 'react-slick';
import Article from '../../Components/Article';

class Home extends Component{

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            limit: 5,
            news: []
        };

        this.loadNews();

        this.loadNews = this.loadNews.bind(this);
    }

    loadNews() {

        let self = this;
        API.put('/news', {
            page: this.state.page,
            limit: this.state.limit
        }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (res) {

                let posts = res.data.posts;

                let news = self.state.news;
                for (let i = 0; i < posts.docs.length; i++) {
                    news.push(posts.docs[i]);
                }

                self.setState({
                    news: news,
                    page: self.state.page + 1,
                    // hasMore: !(self.state.news.length >= posts.total)
                    // hasMore: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        let { news } = this.state;

        let list_news = [];
        if (news) {
            news.map((elem, i) => {
                list_news.push(
                    <div key={i}>
                        <Article article={elem} className="article-home"/>
                    </div>
                );
                return list_news;
            })
        }

        let settings = {
            // accessibility: true,
            slidesToShow: 2,
            infinite: false,
            centerPadding: '10px'
        };

        return (
            <Grid container>
                <Grid item xs={11} lg={10} className="slider-home">
                    <Slider {...settings}>
                        { list_news }
                    </Slider>
                </Grid>
            </Grid>
            
        )
    }
}

export default Home;