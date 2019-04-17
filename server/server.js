const colors = require('colors');
const db = require('mysql');

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const request = require('request');

const path = require('path');
app.use(express.static('public'));

const url = 'mysql://olangley:cs132@bdognom.cs.brown.edu/olangley_db';
const conn = db.createConnection(url);

conn.connect();

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

function genRandomKey() {
	const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let id = "";
	for (let i = 0; i < 32; i++) {
		let key = Math.floor(Math.random()*64);
		id += validChars[key];
	}
	return id;
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

function addTweet(id, hashtag, contents, author, date) {
	let values = [];
	values.push(id);
	values.push(hashtag);
	values.push(contents);
	values.push(author);
	values.push(date);
	conn.query('INSERT INTO tweets (id, hashtag, contents, author, date) VALUES(?, ?, ?, ?, ?)', values, function(error, data) {
		if (error) throw error;
	});
}

function getTweets(hashtag, callback) {
	conn.query('SELECT * FROM tweets WHERE hashtag = ?', hashtag, function(error, data) {
        if (error) {
        	throw error;
        }
        else {
        	callback(data);
        }
    });
}