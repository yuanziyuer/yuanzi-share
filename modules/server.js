import http from 'http';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import fs from 'fs';
import { createPage, write, writeError, writeNotFound, redirect } from './utils/server-utils';
import routes from './routes/RootRoute';
const webpack = require('webpack');
const config = require('../webpack.config');
var express = require('express');

var app = express();
const compiler = webpack(config[1]);
function renderApp(props, res) {
  const markup = renderToString(<RoutingContext {...props}/>);
  const html = createPage(markup);
  write(html, 'text/html', res);
}

app.use(require('webpack-dev-middleware')(compiler, {
	publicPath: '__build__',
	stats: {
		colors: true
	}
}));

app.use(require('webpack-hot-middleware')(compiler));
// Do anything you like with the rest of your express application.

app.get('*', function(req, res) {
	if (req.url === '/favicon.ico') {
		write('haha', 'text/plain', res);
	}

	// serve JavaScript assets
	else if (/__build__/.test(req.url)) {
		fs.readFile(`.${req.url}`, (err, data) => {
			var ext = req.url.split('.').pop();
			var contentTypeMap = {
				'js': 'text/javascript',
				'css': 'text/css'
			};
			write(data, contentTypeMap[ext] || '', res);
		});
	}

	// handle all other urls with React Router
	else {
		match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
			if(error){
        writeError('ERROR!', res);
      }
			else if(redirectLocation){
        redirect(redirectLocation, res);
      }
			else if(renderProps){
        renderApp(renderProps, res);
      }
			else{
        writeNotFound(res);
      }
		});
	}
});

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function() {
  console.log('Listening on %j', server.address());
});


