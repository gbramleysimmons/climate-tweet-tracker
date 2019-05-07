const Twit = require("twit");
const Database = require('./database.js');
const fs = require('fs');

class TweetRetriever {

    constructor(conn) {
        // this.twit = new Twit(
        //     {consumer_key: "3WxkdRmYbcl5FaoWfGW5915sb",
        //     consumer_secret: "AolaaOgz66866fGk7xflPq0MPHyMM9rpPl9CTW77bEVxoan8ey",
        //     access_token: '14377535-3pnCcJZrrfxgohn36OjEfx8r0I5mZBTBnhclYHrYG',
        //     access_token_secret: 'uZUiOLmKToXNRbtyfQtuhCOu79cEfFgRd6YYpc4mwV6On',
        //     strictSSL: false    // optional - requires SSL certificates to be valid.
        //
        // });

        this.twit = new Twit({
            consumer_key:	"1avU8KT1N4kNqqcsNqwKSsRmh",
            consumer_secret: "nJzWdYmire6Bluueps9Hc02uRP4yna5JzN0iY0lWBzIJvnqSZm",
            access_token:         '1100161013431840770-LX3ZAed0JLhHPQzNjQBBvMoUifFV2a',
            access_token_secret:  'H2gDkFDJGeadTWlITmujq2pR0yy4MIfUdEq7ekZXCR9Dq',
            strictSSL:            false    // optional - requires SSL certificates to be valid.

        });
        this.database = new Database(conn);

        this.lastUpdated = Date.now();

        this.database.query("CREATE TABLE IF NOT EXISTS track(hashtag TEXT)");
        this.database.query("CREATE TABLE IF NOT EXISTS display(hashtag TEXT)");

        //binds this to expected behavior
        this.addTweetToDatabase = this.addTweetToDatabase.bind(this);
        this.requestTweetsFromDate = this.requestTweetsFromDate.bind(this);
        this.requestToDatabase = this.requestToDatabase.bind(this);
        TweetRetriever.tweetObjectToData = TweetRetriever.tweetObjectToData.bind(this);

        this.getCurrentlyTracked = this.getCurrentlyTracked.bind(this);
        this.addToCurrentlyTracked = this.addToCurrentlyTracked.bind(this);
        this.removeFromCurrentlyTracked = this.removeFromCurrentlyTracked.bind(this);
        this.setCurrentlyTracked = this.setCurrentlyTracked.bind(this);

        this.getCurrentlyDisplayed = this.getCurrentlyDisplayed.bind(this);
        this.addToCurrentlyDisplayed = this.addToCurrentlyDisplayed.bind(this);
        this.removeFromCurrentlyDisplayed = this.removeFromCurrentlyDisplayed.bind(this);
        this.setCurrentlyDisplayed = this.setCurrentlyDisplayed.bind(this);

        this.getTweetsToDisplay = this.getTweetsToDisplay.bind(this);
        this.getTweetsFromDatabase = this.getTweetsFromDatabase.bind(this);
        this.updateDatabase = this.updateDatabase.bind(this);

    }

    getCurrentlyTracked() {
        return new Promise((resolve, reject) => {
            this.database.query("SELECT * FROM track;")
                .then(data => {
                    resolve(data.map(ele => {
                        return ele.hashtag;
                    }));
                })
        })
    };

    addToCurrentlyTracked(hashtag) {
        return new Promise((resolve, reject) => {
            this.database.query("INSERT INTO track VALUES(?);", [hashtag])
                .then(resolve)
                .catch(error => reject(error));
        });
    };

    removeFromCurrentlyTracked(hashtag) {
        return new Promise((resolve, reject) => {
            this.database.query("DELETE FROM track WHERE hashtag=?;", [hashtag])
                .then(resolve)
                .catch(error => reject(error));
        });
    };

    setCurrentlyTracked(hashtags) {
        return new Promise((resolve, reject) => {
            if (hashtags.length === 0) {
                resolve();
            }
            this.database.query("DELETE FROM track;")
                .then(() => {
                    let query = "INSERT INTO track(hashtag) VALUES";
                    for (let i in hashtags) {
                        query += "(?),";
                    }
                    query = query.slice(0, query.length - 1);
                    query += ";";
                    this.database.query(query, hashtags)
                        .then(resolve)
                        .catch(error => reject(error))
                })
                .catch(error => reject(error));
        });
    };

    updateDatabase() {
        const currTime = this.lastUpdated;
        this.lastUpdated = Date.now();
        this.getCurrentlyTracked()
            .then(data => {
                for (let i in data) {
                    let time = new Date(currTime);
                    this.requestToDatabase(data[i], `${time.getFullYear()}-${time.getMonth()}-${time.getDay()}`, 1000);
                }
            })
    }

    getTweetsToDisplay() {
        return new Promise((resolve, reject) => {
            this.getCurrentlyDisplayed()
                .then(data => {
                    this.getTweetsFromDatabase(data)
                        .then((tweets) => {
                            resolve(tweets);
                        })
                        .catch(error => reject(error));
                })
                .catch(error => reject(error));

        })

    }

    getCurrentlyDisplayed() {
        return new Promise((resolve, reject) => {
            this.database.query("SELECT * FROM display;")
                .then(data => {
                    resolve(data.map(ele => {
                        return ele.hashtag;
                    }));
                })
                .catch(error => {
                    reject(error);
                })
        })
    };

    addToCurrentlyDisplayed(hashtag) {
        return new Promise((resolve, reject) => {
            this.database.query("INSERT INTO display VALUES(?);", [hashtag])
                .then(resolve)
                .catch(error => reject(error));
        });
    };

    removeFromCurrentlyDisplayed(hashtag) {
        return new Promise((resolve, reject) => {
            this.database.query("DELETE FROM display WHERE hashtag=?;", [hashtag])
                .then(resolve)
                .catch(error => reject(error));
        });
    };

    setCurrentlyDisplayed(hashtags) {
        return new Promise((resolve, reject) => {
            if (hashtags.length === 0) {
                resolve();
            }
            this.database.query("DELETE FROM display;")
                .then(() => {
                    let query = "INSERT INTO display(hashtag) VALUES";
                    for (let i in hashtags) {
                        query += "(?),";
                    }
                    query = query.slice(0, query.length - 1);
                    query += ";";
                    this.database.query(query, hashtags)
                        .then(resolve)
                        .catch(error => reject(error))
                })
                .catch(error => reject(error));
        });
    };

    addTweetToDatabase(tweet) {
        console.log("TWEEET.....");
        console.log(tweet);
        let values = [tweet.id, tweet.hashtag, tweet.contents, tweet.author, tweet.date, tweet.image];
        this.database.query('SELECT * FROM tweets WHERE id=?', tweet.id)
            .then(data => {
                if (data.length === 0) {
                    this.database.query('INSERT INTO tweets (id, hashtag, contents, author, date, picture) VALUES(?, ?, ?, ?, ?, ?)', values)
                        .catch(error => {
                            console.error(error);
                        });
                }
            });

    }

    writeFrequencyDataToCSV(file) {
        const stream = fs.createWriteStream(file);
        this.getCurrentlyTracked()

            .then(async (hashtags) => {
                hashtags.forEach(ele => {
                    this.database.query("SELECT COUNT(*) FROM tweets WHERE hashtag=?", ele)
                        .then(data => {
                            stream.write(`${ele}, ${data[0]['COUNT(*)']}, `);
                        })
                })
            })
    }

    writeToCSV(file) {
        return new Promise((resolve,reject) => {
            this.database.query("SELECT * FROM tweets")
                .then(data => {
                    let toWrite = "";
                    const stream = fs.createWriteStream(file);
                    data.forEach(ele => {
                       toWrite += `${ele.id}, ${ele.hashtag}, ${ele.date}, ${ele.contents},`;
                    });
                    stream.write(toWrite);
                }) .catch(error => {reject(error)});
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
        const tweetObjectToData = TweetRetriever.tweetObjectToData;
        return new Promise(function (resolve, reject) {
            const request = "#" + hashtag + " since:" + date;
            twit.get('search/tweets', {q: request, count: count})
                .then(data => {
                    data.data.statuses.map(ele => addToDatabase(tweetObjectToData(ele, hashtag)));
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        });

    }

    getTweetsFromDatabase(hashtags) {
        return new Promise((resolve, reject) => {

            let query = "SELECT * FROM tweets WHERE";

            for (let i in hashtags) {
                query += " hashtag=? OR"
            }

            query = query.slice(0, query.length-3);
            query += " LIMIT 500;";

            this.database.query(query, hashtags)
                .then((data) => {
                    const toReturn = [];
                    for (let i in data) {
                        //console.log(data[i].date);
                        //CHECK TWEETS ARE WITHIN 24 HOURS
                        toReturn.push(data[i]);
                    }
                    console.log(toReturn);
                    resolve(toReturn);
                });
        });

    }

    /**
     * Turns an object retrieved from the twitter api to a parseable objct
     * @param tweet
     * @param hashtag
     * @returns {{date: *, image: *, contents: *, author: *, id: *, hashtag: *}}
     */
    static tweetObjectToData(tweet, hashtag) {
        return {
            id: tweet.id,
            date: tweet.created_at,
            contents: tweet.text,
            hashtag: hashtag,
            image: tweet.user.profile_image_url
        }
    }
}

module.exports = TweetRetriever;