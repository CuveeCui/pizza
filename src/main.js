import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
{{#sentry}}
import * as Sentry from '@sentry/browser';
{{/sentry}}
{{#sensor}}
import sa from 'sa-sdk-javascript';
sa.init({
  server_url: 'http://ebizdemo.datasink.sensorsdata.cn/sa?token=sadc8bd42d'
})
window.sa = sa;
{{/sensor}}

{{#sentry}}
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