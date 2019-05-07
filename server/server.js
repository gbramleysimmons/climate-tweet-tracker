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
let tracked;

twitter.getCurrentlyTracked()
	.then(data => {tracked = data})
	.catch(error => {console.error(error)});

let displayed;
twitter.getCurrentlyDisplayed()
	.then(data => {displayed = data})
	.catch(error => {console.error(error)});


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
			case "data-csv":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				} else {
					rl.question("filename: ", (answer1) => {
						twitter.writeToCSV(answer1)
							.catch(error => {console.error(error)});
					} )
				}
				break;
			case "csv":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				} else {
					rl.question("filename: ", (answer1) => {
						twitter.writeFrequencyDataToCSV(answer1);
						repl();
					} )
				}
				break;
			case "retrieve":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				}
				rl.question("hashtag: ", function(answer) {
					 twitter.requestTweetsFromDate(answer, "2019-4-30")
						.then(data => {
							const parsed = data.data.statuses.map(ele =>
							TweetRetriever.tweetObjectToData(ele, answer));
							console.log(parsed);
							repl();
						}) .catch(error => {
						console.log(error);
						repl();
					})
				});
				break;
			case "get-tweets":
				twitter.getTweetsToDisplay()
					.then(data => console.log(data));
				break;
			case "add-tracked":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				} else {
					rl.question("new hashtag: ", function(answer) {
						twitter.addToCurrentlyTracked(answer)
							.then(() => {
								console.log("#" + answer + " has been added to the tracked set");
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
					rl.question("hashtag to remove: ", function(answer) {
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
					.then(data => {
						data.forEach(ele => console.log(ele));
						repl();
						}
					)
					.catch(error => {console.err(error); repl()});

				break;

			case "add-displayed":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				} else {
					rl.question("new hashtag: ", function(answer) {
						twitter.addToCurrentlyDisplayed(answer)
							.then(() => {
								console.log("#" + answer + " has been added to the displayed set");
								repl();
							}) .catch(error => {console.err(error); repl();})
					});
				}
				break;
			case "remove-displayed":
				if (!authorized["repl"]) {
					console.log("operation not permitted");
					repl();
				} else {
					rl.question("hashtag to remove: ", function(answer) {
						twitter.removeFromCurrentlyDisplayed(answer)
							.then(() => {
								console.log(answer + " has been removed from the displayed set");
								repl();
							}) .catch(error => {console.err(error); repl();})
					});
				}
				break;

			case "get-displayed":
				twitter.getCurrentlyDisplayed(answer)
					.then(data => {
							data.forEach(ele => console.log(ele));
							repl();
						}
					)
					.catch(error => {console.err(error); repl()});

				break;
			case "help":
				console.log(" login: login with existing credentials \n " +
					"signup: signup with new credentials \n retrieve: retrieve tweets with specfied hashtags (must be authorized)" +
					"\n get-tracked: retrieve currently trackaed hashtags \n add-tracked: add hashtag to be tracked " +
					"\n remove-tracked: remove tweet from tracked list \n get-displayed: retrieve currently displayable hashtags" +
					"\n add-displayed: add hashtag to be displayable \n remove-displayed: remove hashtag from display list");
				repl();
				break;
			default:
				console.log("Command not recognized");
				repl();
				break;
		}
	});
};


//defines socket listeners for this program.
io.sockets.on('connection', function(socket){
		twitter.getCurrentlyDisplayed()
			.then(data => {
				twitter.getCurrentlyTracked()
					.then(tracked => {
						const toSend = {
							displayed: data,
							tracked: tracked,
						};
						socket.emit("updateHashtags", JSON.stringify(toSend));
					});

			});

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

	socket.on("setDisplayed", function(hashtags) {
		console.log(hashtags);
		twitter.setCurrentlyDisplayed(hashtags);
		displayed = hashtags;
		io.emit("updateHashtags",JSON.stringify({displayed: displayed, tracked: tracked}));
	});

	socket.on("setTracked", function(hashtags) {
		console.log(hashtags);
		twitter.setCurrentlyTracked(hashtags);
		tracked = hashtags;
		io.emit("updateHashtags", JSON.stringify({displayed: displayed, tracked: tracked}));
	});


	socket.on('displayData', function(hashtags){
		twitter.getTweetsToDisplay()
			.then(data => {
				socket.emit('tweetsForGraph', data);

			})
	});


	socket.on('updateFeed', function(hashtags){
		twitter.getTweetsToDisplay()
			.then(data => {
				socket.emit('tweetsForFeed', data);
			})
	});

    socket.on('error', function(){
        console.log("error");
	});



});


//TO-DO: DECIDE ON LIMIT FOR DATABASE FUNCTIONS
// async function requestByHashtag(hashtags, callback) {
// 	let where = "(";
// 	let array = [];
// 	for (let i = 0; i < hashtags.length; i++) {
// 		array.push("?");
// 	}
// 	where += array.join(",") + ")";
// 	let query = 'SELECT * FROM tweets WHERE hashtag IN ' + where + ' ORDER BY date LIMIT 200';
// 	database.query(query, hashtags)
// 		.then(data => {
// 			callback(data);
// 		})
// 		.catch(error => {
// 		    console.error(error);
// 		});
// }


twitter.updateDatabase();
const interval = setInterval(twitter.updateDatabase, 500000);


server.listen(8080, function() {
	console.log('- Server listening on port 8080'.cyan);
});

repl();

io.listen(8000);