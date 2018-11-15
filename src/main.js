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
if (NODE_ENV === 'production') {
	sa.init({
		name: 'sa',
    web_url: 'xxxx',
    server_url: 'xxxx',
    source_channel:['c'],
    show_log: false,
    heatmap:{
      clickmap:'default',
      scroll_notice_map:'default',
      loadTimeout: 3000,
      scroll_delay_time: 4000
    }
	});
	window.sa = sa;
} else {
	sa.init({
		name: 'sa',
    web_url: 'xxxx',
    server_url: 'xxxx',
    source_channel:['c'],
    show_log: true,
    heatmap:{
      clickmap:'default',
      scroll_notice_map:'default',
      loadTimeout: 3000,
      scroll_delay_time: 4000
    }
	});
	window.sa = sa;
}
sa && sa.quick('autoTrack');
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