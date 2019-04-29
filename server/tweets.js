const Twit = require("twit");
const Database = require('./database.js');

const database = new Database.Database();


const twit = new Twit({
    consumer_key:	"1avU8KT1N4kNqqcsNqwKSsRmh",
    consumer_secret: "nJzWdYmire6Bluueps9Hc02uRP4yna5JzN0iY0lWBzIJvnqSZm",
    access_token:         '1100161013431840770-LX3ZAed0JLhHPQzNjQBBvMoUifFV2a',
    access_token_secret:  'H2gDkFDJGeadTWlITmujq2pR0yy4MIfUdEq7ekZXCR9Dq',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            false    // optional - requires SSL certificates to be valid.

});
function addTweet(id, hashtag, contents, author, date, image) {
    let values = [id, hashtag, contents, author, date, image];
    database.query('INSERT INTO tweets (id, hashtag, contents, author, date, picture) VALUES(?, ?, ?, ?, ?, ?)', values)
        .catch(error => {
            console.error(error);
        });
}

function requestTweet(hashtag) {

    twit.get("https://api.twitter.com/1.1/search/tweets.json?q=%23" + hashtag + "&src=typd&lang=en", function(error, data) {
        console.log(data.statuses[0]);
        data.statuses.forEach(ele => {
            console.log(ele.id);

        addTweet(ele.id, hashtag, ele.text, ele.user.screen_name, ele.created_at, ele.user.profile_image_url);

    });
});
}




requestTweet("pizza");
