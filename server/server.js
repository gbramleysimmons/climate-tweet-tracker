
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
console.log(typeof login);

const twit = require("twit");


const T = new twit({
	consumer_key:	"1avU8KT1N4kNqqcsNqwKSsRmh",
	consumer_secret: "nJzWdYmire6Bluueps9Hc02uRP4yna5JzN0iY0lWBzIJvnqSZm",
	access_token:         '1100161013431840770-LX3ZAed0JLhHPQzNjQBBvMoUifFV2a',
	access_token_secret:  'H2gDkFDJGeadTWlITmujq2pR0yy4MIfUdEq7ekZXCR9Dq',
	timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
	strictSSL:            false    // optional - requires SSL certificates to be valid.

});


async function requestTweet(hashtag) {
	let tweets = [];
	await T.get("https://api.twitter.com/1.1/search/tweets.json?q=hi&src=typd&lang=en", function(error, data) {
		tweets = data;
	});
	return tweets;
}

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