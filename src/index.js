import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Sign from './views/Sign';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
    <Router>
        <Switch>
            <Route path="/login" component={Sign}/>
            <Route path="/" component={App} />
        </Switch>
    </Router>
), document.getElementById('root'));
registerServiceWorker();
