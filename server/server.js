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
    console.log('- Server listening on port 8080'.grey);
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