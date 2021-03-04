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

		var connection = getConnection();

		switch(cmdType) {
			case CMD_LOGIN: 
				console.log('this is a login command');
				checkUser(connection, data, response);
				break;
			case CMD_REGISTER:
				console.log('this is a register command');
				register(connection, data, response);
				break;
		}
	});
}).listen(8888);

// test strings
console.log('Server running at http://127.0.0.1:8888');
console.log('I am on dev');


// 构造用户名密码查询sql
function checkUserQuery(params) {
	var query = `select * from user where mobile='${params.mobile}' and password='${params.password}'; `;
	console.log('query is ' + query);
	return query;
}

// 构件数据库链接
function getConnection() {
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'welcome',
		database: 'itemlist'
	});
	
	connection.connect();
	return connection;
}

// 检查用户名密码是否在数据库中
function checkUser(connection, params, response) {
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
			connection.end();
		}
	});
	//connection.end();
}

// 注册用户
function register(connection, params, response) {
	var  addSql = 'INSERT INTO user(mobile, password) VALUES(?,?)';
	var  addSqlParams = [params.mobile, params.password];
	//增
	connection.query(addSql,addSqlParams,function (err, result) {
			if(err){
				console.log('[INSERT ERROR] - ',err.message);
				response.end('insert error');
				connection.end();
				return;
			}        
			 
			console.log('--------------------------INSERT----------------------------');
			//console.log('INSERT ID:',result.insertId);        
			console.log('INSERT ID:',result);        
			console.log('-----------------------------------------------------------------\n\n');  
			
			response.end('completed insert. ');
			connection.end();
	});
	 
	//connection.end();
}