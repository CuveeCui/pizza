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
/* eslint camelcase: 'off' */
/* eslint key-spacing: 'off' */
/* global publicPath: true */
const baseUri = `${location.origin}${publicPath}`;
const sensorConfig = {
  name: 'sa',
  source_channel:['c'],
  is_single_page: true,
  sdk_url: `${baseUri}static/js/sensorsdata.min.js`,
  show_log: true,
  web_url: NODE_ENV === 'production'
    ? 'xxxx'
    : 'xxxx',
  server_url: NODE_ENV === 'production'
    ? 'xxxx'
    : 'xxxx'
};
sa.init(sensorConfig);
window.sa = sa;
sa && sa.quick('autoTrack');
{{/sensor}}

{{#sentry}}
if (NODE_ENV && NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://xxxx@sentry.io/xxx',
    release: releaseVersion,
    environment: NODE_ENV || 'development'
  });
}
{{/sentry}}
ReactDom.render(
  <App />,
  document.getElementById('root')
);