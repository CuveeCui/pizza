import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
{{#sentry}}
import * as Sentry from '@sentry/browser';

if (NODE_ENV && NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://c62d897154f741a1b2fd5eb6ad2d83c8@sentry.io/1299733',
    release: 'xigua_users'
  })
}
{{/sentry}}
ReactDom.render(
  <App />,
  document.getElementById('root')
);