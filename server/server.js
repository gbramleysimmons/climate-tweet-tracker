//local files
const Database = require("./database.js");
const Login = require("./login.js");
const TweetRetriever = require('./tweets.js');

//foreign dependencies
const colors = require('colors');
const Twit = require("twit");
const db = require('mysql');
const http = require('http');
const express = require('express');
const readline = require('readline');

//project objects
const app = express();
const server = http.createServer(app);

const url = 'mysql://olangley:cs132@bdognom.cs.brown.edu/olangley_db';
const conn = db.createConnection(url);
const database = new Database(conn);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const twitter = new TweetRetriever(conn);
const io = require('socket.io').listen(server);
app.use(express.static('public'));

const login = new Login(conn);

const authorized = {
	"repl": false,
};


//defines a REPL (read, evaluate, print loop) for this program;
function repl() {
	rl.question('> ', function (answer) {
		switch(answer) {
			case 'exit':
				return rl.close();

			case "signup":
				rl.question("username: ", function(username) {
					rl.question("password: ", function (password) {
						login.addNewUser(username, password)
							.then(res => {
								repl();
							}) .catch(error => {
							console.error(error);
							repl();
						})
					})
				});
				break;

			case "login":
				rl.question("username: ", function(username) {
					rl.question("password: ", function (password) {
						login.validateLogin(username, password)
							.then(valid => {
								if (valid) {
									authorized["repl"] = true;
									console.log("you have been logged in");
								} else {
									console.log("invalid credentials");
								}
								repl();
							})
							.catch(error => {
								console.error(error);
								repl();
							})
					})
				});
				break;
			case "retrieve":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				}
				rl.question("hashtag: ", function(answer) {
					twitter.requestTweetsFromDate(answer, "2019-4-30")
						.then(data => {
							console.log("here");
							console.log(data.data.statuses);
							repl();
						}) .catch(error => {
						console.log(error);
						repl();
					})
				});
				break;
			default:
				console.log("Command not recognized");
				repl();
				break;
		}
	});
};

//starts server

//defines socket listeners for this program.
io.sockets.on('connection', function(socket){
	socket.on('selectHashtag', async function(hashtags, callback){
		//hashtags = list of selected hashtags
		//callback should update the graph
	    callback();
	});

	socket.on('changeTimeFrame', function(range, callback){
		//range = time range to display in graph
		//callback should update the graph
	    callback();
	});

	//TEMPORARY//
	socket.on('displayData', async function(){
		/*let tweetData = twitter.requestTweetsFromDate("test", "2019-05-01");
		socket.emit('data', tweetData);
		console.log(tweetData);*/
		
		/*requestTweets("test", "date", function(data) {
			socket.emit('data', data);
			console.log(data);
		});*/
		requestAllTweets(function(data) {
			socket.emit('data', data);
			console.log(data);
		});
	});

    socket.on('error', function(){
        console.log("error");
	});

});

async function requestTweets(hashtag, date, callback) {
	let values = [hashtag, date];
	database.query('SELECT * FROM tweets WHERE hashtag = ? AND date = ?', values)
		.then(data => {
			callback(data);
		})
		.catch(error => {
		    console.error(error);
		});
}

//TO-DO: LIMIT SIZE OF DATA RETURNED BY THIS FUNCTION
async function requestAllTweets(callback) {
	database.query('SELECT * FROM tweets LIMIT 50')
		.then(data => {
			callback(data);
		})
		.catch(error => {
		    console.error(error);
		});
}

repl();

server.listen(8080, function() {
	console.log('- Server listening on port 8080'.cyan);
});

io.listen(8000);