{{#ie}}
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';
import 'core-js/es6/object';
import 'raf/polyfill';
{{/ie}}
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
{{#sentry}}
import * as Sentry from '@sentry/browser';
{{/sentry}}
{{#sensor}}
import sa from 'sa-sdk-javascript';
/*eslint camelcase: 'off'*/
sa.init({
  server_url: 'http://ebizdemo.datasink.sensorsdata.cn/sa?token=xxxx'
});
window.sa = sa;
{{/sensor}}

{{#sentry}}
if (NODE_ENV && NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://xxxx@sentry.io/xxx',
    release: 'xxxx'
  });
}
{{/sentry}}
ReactDom.render(
  <App />,
  document.getElementById('root')
);