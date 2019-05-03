const Twit = require("twit");
const Database = require('./database.js');


class TweetRetriever {
    constructor(conn) {
        this.twit = new Twit({
            consumer_key:	"1avU8KT1N4kNqqcsNqwKSsRmh",
            consumer_secret: "nJzWdYmire6Bluueps9Hc02uRP4yna5JzN0iY0lWBzIJvnqSZm",
            access_token:         '1100161013431840770-LX3ZAed0JLhHPQzNjQBBvMoUifFV2a',
            access_token_secret:  'H2gDkFDJGeadTWlITmujq2pR0yy4MIfUdEq7ekZXCR9Dq',
            strictSSL:            false    // optional - requires SSL certificates to be valid.

        });
        this.database = new Database(conn);

        //binds this to expected behavior
        this.addTweetToDatabase = this.addTweetToDatabase.bind(this);
        this.requestTweetsFromDate = this.requestTweetsFromDate.bind(this);
        this.requestToDatabase = this.requestToDatabase.bind(this);
        this.tweetObjectToData = this.tweetObjectToData.bind(this);
    }

    addTweetToDatabase(tweet) {
        let values = [tweet.id, tweet.hashtag, tweet.contents, tweet.author, tweet.date, tweet.image];
        this.database.query('INSERT INTO tweets (id, hashtag, contents, author, date, picture) VALUES(?, ?, ?, ?, ?, ?)', values)
            .catch(error => {
                console.error(error);
            });
    }



    /**
     * Requests all
     * @param hashtag
     * @param date
     * @returns {Promise<any>}
     */
    requestTweetsFromDate(hashtag, date) {
        const twit = this.twit;
        return new Promise(function (resolve, reject) {
            const request = "#" + hashtag + " since:" + date;
            twit.get('search/tweets', {q: request, count: 10000})
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
            });
        }

        requestToDatabase(hashtag, date, count) {
            const twit = this.twit;
            const database = this.database;
            const addToDatabase = this.addTweetToDatabase;
            const tweetObjectToData = this.tweetObjectToData;
            return new Promise(function (resolve, reject) {
                const request = "#" + hashtag + " since:" + date;
                twit.get('search/tweets', {q: request, count: count})
                    .then(data => {
                        data.data.statuses.map(ele => addToDatabase(tweetObjectToData(ele)));
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });

        }

    /**
     * Turns an object retrieved from the twitter api to a parseable objct
     * @param tweet
     * @param hashtag
     * @returns {{date: *, image: *, contents: *, author: *, id: *, hashtag: *}}
     */
        tweetObjectToData(tweet, hashtag) {
            return {
                id: tweet.id,
                date: tweet.created_at,
                contents: tweet.text,
                hashtag: hashtag,
                author: tweet.user.name,
            }
        }
    }



    module.exports = TweetRetriever;