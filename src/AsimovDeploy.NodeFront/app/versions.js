/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

var config = require('./config.js');
var async = require('async');
var restify = require("restify");
var querystring = require("querystring");

module.exports = function(server) {

	server.get('/deploylog/file', function(req, res) {

		var agent =  config.getAgent({ name: req.query.agentName });
		var client = restify.createJsonClient({ url: agent.url, connectTimeout: 200 });
		var unitName = querystring.escape(req.query.unitName);

		res.redirect(agent.url + '/deploylog/file/' + unitName + "/" + req.query.position);

	});

};