import http from 'http'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RoutingContext } from 'react-router'
import fs from 'fs'
import { createPage, write, writeError, writeNotFound, redirect } from './utils/server-utils'
import routes from './routes/RootRoute'
var express = require('express');

var app = express();
const PORT = process.env.PORT || 5000

function renderApp(props, res) {
  const markup = renderToString(<RoutingContext {...props}/>)
  const html = createPage(markup)
  write(html, 'text/html', res)
}

(function() {

	// Step 1: Create & configure a webpack compiler
	var webpack = require('webpack');
	var webpackConfig = require('../webpack.config');
	var compiler = webpack(webpackConfig);

	// Step 2: Attach the dev middleware to the compiler & the server
	app.use(require("webpack-dev-middleware")(compiler, {
		noInfo: true, publicPath: webpackConfig.output.publicPath
	}));

	// Step 3: Attach the hot middleware to the compiler & the server
	app.use(require("webpack-hot-middleware")(compiler, {
		log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
	}));
})();

// Do anything you like with the rest of your express application.




app.get("*", function(req, res) {
	if (req.url === '/favicon.ico') {
		write('haha', 'text/plain', res)
	}

	// serve JavaScript assets
	else if (/__build__/.test(req.url)) {
		fs.readFile(`.${req.url}`, (err, data) => {
			write(data, 'text/javascript', res)
		})
	}

	// handle all other urls with React Router
	else {
		match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
			if (error)
				writeError('ERROR!', res)
			else if (redirectLocation)
				redirect(redirectLocation, res)
			else if (renderProps)
				renderApp(renderProps, res)
			else
				writeNotFound(res)
		})
	}
});

if (require.main === module) {
	var server = http.createServer(app);
	server.listen(process.env.PORT || 3000, function() {
		console.log("Listening on %j", server.address());
	});
}

console.log(`listening on port ${PORT}`)

