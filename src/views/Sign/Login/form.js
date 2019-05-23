import React from 'react';
import { Field, reduxForm } from 'redux-form'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

const validate = values => {
    const errors = {};
    const requiredField = ['email', 'password'];
    requiredField.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Champs requis'
        }

        if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Adresse mail non valide'
        }
    });
};

const renderEmailField = ({
                              id,
                              input,
                              label,
                              meta: { touched, error },
                              ...custom
                          }) => (
    <FormControl fullWidth={true} required={true}>
        <InputLabel htmlFor={ id }>{ label }</InputLabel>
        <Input
            id={ id }
            // name="email"
            // type="email"
            // value={this.state.email}
            // onChange={this.handleChange}
            onChange={(event, index, value) => input.onChange(value)}
            errortext={touched && error}
            {...input}
            {...custom}
        />
    </FormControl>
);

const renderPasswordField = ({
                              id,
                              input,
                              label,
                              meta: { touched, error },
                              ...custom
                          }) => (
    <FormControl fullWidth={true} required={true}>
        <InputLabel htmlFor={ id }>{ label }</InputLabel>
        <Input
            onChange={(event, index, value) => input.onChange(value)}
            errortext={touched && error}
            {...input}
            {...custom}
        />
    </FormControl>
);

const renderTextField = ({
                             input,
                             // label,
                             meta: { touched, error },
                             ...custom
                         }) => (
    <TextField
        // hintText={label}
        // floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...custom}
    />
);

class LoginForm extends React.Component {

    render () {
        const { handleSubmit, pristine, reset, submitting } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <Field
                        name="email"
                        component={renderTextField}
                        label="Email"
                    />
                </div>
                <div>
                    <Field
                        name="password"
                        component={renderTextField}
                        label="Mot de passe"
                    />
                </div>
                <div className="form-div-button">
                    <Button
                        className={"btn-rounded btn-outlined"}
                        variant={"outlined"}
                        onClick={this.props.action}
                    >
                        INSCRIPTION
                    </Button>
                    <input
                        type="submit"
                        value="CONNEXION"
                        className="btn-start-art btn-rounded btn-contained"
                    />
                </div>
            </form>
        );
    }
};

export default reduxForm({
    form: 'LoginForm',
    validate,
    // asyncValidate
}) (LoginForm);