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
const CryptoJS = require('crypto-js');


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
						login.addNewUser(username, CryptoJS.SHA256(password).toString())
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
						login.validateLogin(username, CryptoJS.SHA256(password).toString())
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
							const parsed = data.data.statuses.map(ele =>
							twitter.tweetObjectToData(ele, answer));
							console.log(parsed);
							repl();
						}) .catch(error => {
						console.log(error);
						repl();
					})
				});
				break;
			case "add-tracked":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				} else {
					rl.question("new hashtag: ", function(answer) {
						twitter.addToCurrentlyTracked(answer)
							.then(() => {
								console.log(answer + " has been added to the tracked set");
								repl();
							}) .catch(error => {console.err(error); repl();})
					});
				}
				break;
			case "remove-tracked":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				} else {
					rl.question("hashtag: to remove", function(answer) {
						twitter.removeFromCurrentlyTracked(answer)
							.then(() => {
								console.log(answer + " has been removed from the tracked set");
								repl();
							}) .catch(error => {console.err(error); repl();})
					});
				}
				break;
			case "get-tracked":
				twitter.getCurrentlyTracked(answer)
					.then(repl)
					.catch(error => {console.err(error); repl()});

				break;
			case "help":
				console.log("login: login with existing credentials \n " +
					"signup: signup with new credentials \n retrieve: retrieve tweets with specfied hashtags (must be authorized)" +
					"\n get-tracked: retrieve currently tracked tweets \n add-tracked: add tweet to be tracked \n remove-tracked: remove tweet from tracked list");
				break;
			default:
				console.log("Command not recognized");
				repl();
				break;
		}
	});
};


app.all("/authorize", function (request, response) {

});
//starts server

//defines socket listeners for this program.
io.sockets.on('connection', function(socket){
	socket.on('authorize', function(username, password, callback) {
		console.log(username);
		console.log(password);
		const toSend = {validated: false};
		login.validateLogin(username, password)
			.then(res => {
				if (res) {
					toSend.validated = true;
				} else {
					toSend.error = "Error: Invalid Credentials"
				}
				callback(JSON.stringify(toSend))

			}).catch(error => {
			toSend.error = error.toString();
			callback(JSON.stringify(toSend));

		})

	});

	socket.on('displayData', async function(){
		requestAllTweets(function(data) {
			socket.emit('tweetsForGraph', data);
		});
	});

	socket.on('updateFeed', async function(){
		let hashtags = ["cats", "climate"];
		requestByHashtag(hashtags, function(data){
			console.log(data);
			socket.emit('tweetsForFeed', data);
		});
	});

    socket.on('error', function(){
        console.log("error");
	});

});

//TO-DO: DECIDE ON LIMIT FOR DATABASE FUNCTIONS
async function requestByHashtag(hashtags, callback) {
	let where = "(";
	let array = [];
	for (let i = 0; i < hashtags.length; i++) {
		array.push("?");
	}
	where += array.join(",") + ")";
	let query = 'SELECT * FROM tweets WHERE hashtag IN ' + where + ' ORDER BY date LIMIT 50';
	database.query(query, hashtags)
		.then(data => {
			callback(data);
		})
		.catch(error => {
		    console.error(error);
		});
}

async function requestAllTweets(callback) {
	database.query('SELECT * FROM tweets ORDER BY date LIMIT 50')
		.then(data => {
			callback(data);
		})
		.catch(error => {
		    console.error(error);
		});
}

repl();

app.listen(4567);

server.listen(8080, function() {
	console.log('- Server listening on port 8080'.cyan);
});

io.listen(8000);