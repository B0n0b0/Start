import React, { Component } from 'react';
import API from '../../Components/api';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import PanoramaIcon from '@material-ui/icons/Panorama';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

class NewsForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            contentType: 0,
            contentUrl: '',
            tags: [],
            tag: '',
            showUrlField: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.addTag = this.addTag.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    changeType(type) {

        this.setState({
            showUrlField: true,
            contentType: type
        });
        // console.log(type);
    }

    disableEnter = (event) => {

        if (event.which === 13) {
            console.log('test');
            event.preventDefault();
        }
    };

    addTag(event) {

        if (event.key === 'Enter') {

            let tags = this.state.tags;
            tags.push(this.state.tag);
            this.setState({
                tags: tags,
                tag: ''
            });
        }
    }

    deleteTag(position) {

        let tags = this.state.tags;
        tags.splice(position, 1);

        this.setState({
            tags: tags
        });

    }

    handleSubmit(event) {
        event.preventDefault();

        let contentType = this.state.contentType;
        if (!this.state.contentUrl) {
            contentType = 0;
        }

        if (this.state.contentType === 1 && this.state.contentUrl && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(this.state.contentUrl)) {
            alert('L\'url que vous avez entré ne correspond pas a une vidéo Youtube');
            return;
        }

        if (!this.state.contentUrl) {
            this.setState({
                contentType: 0
            })
        }

        if (!this.state.content && !this.state.contentUrl) {
            alert('Aucun contenu dans l\'article');
            return;
        }

        let post = {
            title: this.state.title,
            content: this.state.content,
            tags: this.state.tags,
            content_url: this.state.contentUrl,
            content_type: contentType
        };


        let self = this;
        self.props.action(post);
        API.post('/me/posts', post, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(function (res) {
            self.props.action(post);
            self.setState({
                title: '',
                content: '',
                contentType: 0,
                contentUrl: '',
                tags: [],
                tag: '',
                showUrlField: false
            });
        }).catch(function (error) {
            console.log(error);
            alert("Une erreur est survenu veuillez réessayer dans quelques minutes.");
        });

        // console.log(this.state);
    }

    render() {

        const { tags } = this.state;

        let items = [];
        tags.map((tag, i) => {
            items.push(
                <Chip key={i} className="article-tag" label={tag} onDelete={this.deleteTag.bind(this, i)}/>
            );
            return items;
        });

        if (items.length === 0) {
            items = <div>Aucun tag</div>
        }

        return (
            <div className="article-item">
                <Card className="article">
                    <CardContent>
                        <form onSubmit={this.handleSubmit} onKeyPress={this.disableEnter}>
                            <FormControl fullWidth={true} required={true}>
                                <InputLabel htmlFor="title">Titre</InputLabel>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                            </FormControl>
                            <FormControl fullWidth={true} required={true}>
                                <TextField
                                    id="content"
                                    name="content"
                                    label="Contenu"
                                    multiline={true}
                                    rows={4}
                                    type="text"
                                    value={this.state.content}
                                    onChange={this.handleChange}
                                />
                            </FormControl>
                            <div className="div-article-tag">
                                <FormControl fullWidth={true} required={false}>
                                    <InputLabel htmlFor="tag">Ajouter un tag</InputLabel>
                                    <Input
                                        id="tag"
                                        name="tag"
                                        type="text"
                                        value={this.state.tag}
                                        onChange={this.handleChange}
                                        onKeyUp={this.addTag}
                                    />
                                </FormControl>
                                <div className="tag-field">
                                    { items }
                                </div>
                            </div>
                            <div className="button-field">
                                <Button className="image-btn" size="small" onClick={this.changeType.bind(this, 2)}><PanoramaIcon/>&nbsp;Image</Button>
                                <Button className="youtube-btn" size="small" onClick={this.changeType.bind(this, 1)}><PlayArrowIcon/>&nbsp;Youtube</Button>
                            </div>
                            {
                                this.state.showUrlField ?
                                <FormControl fullWidth={true} required={false}>
                                    <InputLabel htmlFor="contentUrl">Url</InputLabel>
                                    <Input
                                        id="contentUrl"
                                        name="contentUrl"
                                        type="url"
                                        value={this.state.contentUrl}
                                        onChange={this.handleChange}
                                    />
                                </FormControl> : null
                            }
                            <Input
                                type="submit"
                                value="PUBLIER"
                                className="btn-start-art btn-contained btn-article-form"
                            />
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default NewsForm;