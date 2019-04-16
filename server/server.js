const colors = require('colors');
const db = require('mysql');

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

const path = require('path');
app.use(express.static('public'));

const url = 'mysql://olangley:cs132@bdognom.cs.brown.edu/olangley_db';
const conn = db.createConnection(url);
conn.connect();

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