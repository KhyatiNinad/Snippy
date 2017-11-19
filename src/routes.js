// src/routes.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import App from './components/App';
import Snippy from './components/Snippy';
import NotFound from './components/NotFound';

const Routes = (props) => (
<Router>
      <Switch>
        <Route path="/" exact component={App}/>
        <Route path="/snippy" component={Snippy}/>
        <Route path="*" component={NotFound}/>
      </Switch>
  </Router>
);

export default Routes;