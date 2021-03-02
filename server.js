var qs = require('qs');
var http = require('http');

const fsLibrary  = require('fs') 

http.createServer(function(request, response) {
	response.writeHead(200, {'content-type': 'text/plain'});
	response.end('Hello World.');
	console.log(request.httpVersion);
	console.log(request.headers);
	console.log(request.method);
	console.log(request.url);
	// console.log(request);
	
	request.on('data', chunk => {
		console.log(`Data chunk available: ${chunk}`);
	});
}).listen(8888);

console.log('Server running at http://127.0.0.1:8888');
console.log('I am on dev');

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'welcome',
	database: 'itemlist'
});

connection.connect();
connection.query('select 1 + 1 as solution', function (error, results, fields
) {
	if (error) throw error;
	console.log('The solution is: ', results[0].solution);
})