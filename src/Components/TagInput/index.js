import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

class TagInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tagName: ''
        }
    }

    handleChange = (event) => {
        this.setState({
            tagName: event.target.value
        })
    };

    addTag = async (event) => {
        if (event.key === 'Enter') {

            let { tagName } = await this.state;
            let { tags } = await this.props;

            if (tagName.length) {
                await tags.push(tagName);
                await this.props.updateTag(tags);

                this.setState({
                    tagName: ''
                });
            }
        }
    };

    deleteTag = async (position) => {
        let { tags } = this.props;

        tags.splice(position, 1);
        this.props.updateTag(tags);
    };

    render() {
        const { tagName } = this.state;
        const { tags } = this.props;

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
            <div className="div-article-tag">
                <FormControl fullWidth={true} required={false}>
                    <InputLabel htmlFor="tag">Ajouter un tag</InputLabel>
                    <Input
                        id="tag"
                        name="tagName"
                        type="text"
                        value={tagName}
                        onChange={this.handleChange}
                        onKeyUp={this.addTag}
                    />
                </FormControl>
                <div className="tag-field">
                    { items }
                </div>
            </div>
        )
    }

}

TagInput.propTypes = {
    updateTag: PropTypes.func.isRequired,
    tags: PropTypes.array.isRequired
};

export default TagInput;