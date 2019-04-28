const colors = require('colors');
const Database = require("./database.js");
const Login = require("./login.js");
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const io = require('socket.io').listen(server);
app.use(express.static('public'));

const database = Database;
const login = new Login("hi");


server.listen(8080, function() {
    console.log('- Server listening on port 8080'.cyan);
});


io.sockets.on('connection', function(socket){
	socket.on('selectHashtag', function(hashtags, callback){
		//hashtags = list of selected hashtags
		//callback should update the graph
	    callback();
	});

	socket.on('changeTimeFrame', function(range, callback){
		//range = time range to display in graph
		//callback should update the graph
	    callback();
	});

    socket.on('error', function(){
        console.log("error");
    });

});

repl();

function addTweet(id, hashtag, contents, author, date) {
	let values = [id, hashtag, contents, author, date];
	database.query('INSERT INTO tweets (id, hashtag, contents, author, date) VALUES(?, ?, ?, ?, ?)', values)
		.catch(error => {
			console.error(error);
		});
}


async function getTweets(hashtag) {
	return database.query('SELECT * FROM tweets WHERE hashtag = ?', hashtag);
}

function repl () {
	rl.question('Command: ', function (answer) {
		if (answer === 'exit') {
			return rl.close();
		}
		else if (answer ==="login") {
			console.log(typeof login);
		}

		repl();
	});
};