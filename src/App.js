import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import router from 'router';

export default class App extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>

          <hr/>

          <Route exact path="/" component={router.login.login}/>
        </div>
      </Router>
    )
  }
}
