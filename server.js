var qs = require('qs');
var http = require('http');

const fsLibrary  = require('fs') 

const CMD_LOGIN = 1, CMD_REGISTER = 2;
var cmdType = CMD_LOGIN; // 1: login, 2: register

http.createServer(function(request, response) {
	response.writeHead(200, {'content-type': 'text/plain'});
	console.log(request.httpVersion);
	console.log(request.headers);
	console.log(request.method);
	console.log(request.url);
	// console.log(request);
	
	var data = [];
	request.on('data', chunk => {
		console.log(`Data chunk available: ${chunk}`);
		data.push(chunk); // chunk is byte stream, need to change to string and use json to parse
	}).on("end", () => {
		data = JSON.parse(Buffer.concat(data).toString());
		
		// check command type
		cmdType = data.cmdType;
		console.log('data: ' + data);
		console.log('data.cmdType: ' + data.cmdType);

		switch(cmdType) {
			case CMD_LOGIN: 
				console.log('this is a login command');
				checkUser(data, response)
		}
	});
}).listen(8888);

// test strings
console.log('Server running at http://127.0.0.1:8888');
console.log('I am on dev');

function checkUserQuery(params) {
	var query = `select * from user where username='${params.mobile}' and password='${params.password}'; `;
	console.log('query is ' + query);
	return query;
}

function checkUser(params, response) {
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'welcome',
		database: 'itemlist'
	});

	connection.connect();
	
	
	var returnResult = [];
	var query = connection.query(checkUserQuery(params));
	query.on('result', function(row) {
		connection.pause();
		returnResult.push(row);
		connection.resume();
	}).on('end', function() {
		console.log('completed db operation');
		if(returnResult.length > 0) {
			response.end(returnResult.toString());
		} else {
			response.end('wrong user');
		}
	});
}