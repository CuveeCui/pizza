import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import router from '@/router/router';
import '@/App.scss';
import logo from '@/public/img/logo.f6560243.png';

export default class App extends React.Component {
  constructor() {
    super();
  }
  render() {

    return (
      <Router>
        <div>
          <div className='logo'>
            <img src={logo} alt=""/>
          </div>
          <ul className='route'>
            <li><Link to='/home'>Home</Link></li>
            <li><Link to='/link'>Link</Link></li>
            <li><Link to='/about'>About</Link></li>
          </ul>
          <Route exact path="/home" component={router.home.home}/>
          <Route exact path="/link" component={router.link.link}/>
          <Route exact path="/about" component={router.about.about}/>
        </div>
      </Router>
    );
  }
}
