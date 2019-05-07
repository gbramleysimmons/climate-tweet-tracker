const expect = require('chai').expect;
const mocha = require('mocha');

const url = 'mysql://gbramley:cs132@bdognom.cs.brown.edu/gbramley_db';
const db = require("mysql");
const conn = db.createConnection(url);

const Database = require("../database.js");
const database = new Database(conn);
const Login = require("../login.js");
const TweetRetriever = require('../tweets.js');

//Tests for the database code
describe("Database.query()", function(done) {
    it("should make a database query", function () {
        database.query("CREATE TABLE IF NOT EXISTS test (testCol TEXT);")
            .then(() => {
                database.query("INSERT INTO test VALUES(?);", ["test"])
                    .then(() => {
                       database.query("SELECT * FROM test;")
                           .then(data => {
                               database.query("DROP TABLE test;");
                               expect(data).to.have.lengthOf(1);
                               expect(data[0]).to.have.property("testCol");
                               expect(data[0].testCol).to.equal("test");
                               done();
                           }).catch(error => {
                           expect(error).to.equal("");
                       });

                    }).catch(error => {
                    expect(error).to.equal("");
                });
            }).catch(error => {
            expect(error).to.equal("");

        });
    });
});



//Tests for the login code.
describe("Login.getSalt()", function() {
    const login = new Login(conn);

    it('should generate a random 16-character alphanumeric salt', function() {
      const salt1 = login.getSalt();
      const salt2 = login.getSalt();

      expect(salt1).to.have.lengthOf(16);
      expect(salt2).to.have.lengthOf(16);
      expect(salt1).to.not.equal(salt2);

    });
});

describe("Login.sha512()", function() {
    const login = new Login(conn);

    it('should hash a password with a salt to a 128 digit hexadecimal number', function() {
       const password = "";
       const salt = login.getSalt();
       const hashed = login.sha512(password, salt);

       expect(hashed).to.have.lengthOf(128);

       const hashed2 = login.sha512(password, salt);
       expect(hashed).to.equal(hashed2);

       const hashedDifferent = login.sha512(password, login.getSalt());
       expect(hashed).to.not.equal(hashedDifferent);
   });
});

describe("Login.addNewUser()", function() {
    const login = new Login(conn);
    it("should add a user and password to the database", function(done) {
           const name = "addnewuser";
           const password = "password";
           login.addNewUser(name, "")
               .then(() => {
                   database.query("SELECT * FROM login WHERE username=?", [name])
                       .then(data => {
                           login.removeUser(name);
                           expect(data).to.have.lengthOf(1);
                           expect(data[0]).to.have.property("pass");
                           expect(data[0]).to.have.property("username");
                           expect(data[0]).to.have.property("salt");
                           expect(data[0].pass).to.not.equal(password);
                           done();
                       });
               })
               .catch(error => {
                   expect(error).to.equal("");
                   done();
               })
        })
});

describe("Login.validateLogin()", function(done) {
    const login = new Login(conn);
    it("should check if a username and password combination is in the database", function(done) {
        const name = "validate";
        const password = "password";

        login.addNewUser(name, password)
            .then(data => {
                login.validateLogin(name, password)
                    .then(valid => {
                        expect(valid).to.equal(true);
                        login.removeUser(name);
                        done();
                    }) .catch (error => {
                    login.removeUser(name);
                    expect(error).to.equal("");
                    done();

                })
            }).catch(error =>  {
                expect(error).to.equal("");
            }
        )
    });

    login.validateLogin("invalid", "name")
        .then(valid => {
            expect(valid).to.equal(false);
            }
        ).catch(error =>  {
        expect(error).to.equal("");
    });

});


describe("Login.removeUser()", function() {
    const login = new Login(conn);

    it("should remove a user from the database", function(done) {
        const name = "removeUserTest";
        const password = "password";
        login.addNewUser(name, password)
            .then(() => {
                login.removeUser(name)
                    .then(() => {
                        database.query("SELECT * FROM login WHERE username=?", [name])
                            .then(data => {
                                expect(data).to.have.lengthOf(0);
                                done();
                            }).catch(error =>  {
                            expect(error).to.equal("");
                        });
                    }).catch(error =>  {
                    expect(error).to.equal("");
                });
            }) .catch(error =>  {
            expect(error).to.equal("");
        });
    });
});



describe("TweetRetriever.addToCurrentlyTracked()", function() {
    it ("should add a hashtag to the list of currently tracked hashtags", function(done) {
        const tr = new TweetRetriever(conn);
        const database = new Database(conn);
        tr.addToCurrentlyTracked("test676")
            .then(() => {
                database.query("SELECT * FROM track WHERE hashtag=\"test676\"")
                    .then(data => {
                        expect(data).to.have.lengthOf(1);
                        expect(data[0]).to.have.property("hashtag");
                        expect(data[0].hashtag).to.equal("test676");
                    }) .then(() => {
                        database.query(("DELETE FROM track;"))
                        .then(() => {
                            done();
                        })
                })

            })

    })


});

describe("TweetRetriever.removeFromCurrentlyTracked()", function () {
    it("should remove a hashtag from the list of currently tracked hashtags", function (done) {
        const tr = new TweetRetriever(conn);
        const database = new Database(conn);

        tr.addToCurrentlyTracked("test2")
            .then(() => {
                tr.removeFromCurrentlyTracked("test2")
                    .then(() => {
                        database.query("SELECT * FROM track WHERE hashtag=\"test2\"")
                            .then(data => {
                                console.log(data);
                                expect(data).to.have.lengthOf(0);
                                done();
                            })
                    })
            })

    })
});


describe("TweetRetriever.setCurrentlyTracked()", function() {
    it("should set the list of currently tracked hashtags to a specified list", function(done) {
        const tr = new TweetRetriever(conn);
        const database = new Database(conn);
        tr.setCurrentlyTracked(["cats", "dogs", "fish"])
            .then(() => {
                database.query("SELECT * FROM track;")
                    .then(data => {
                        expect(data).to.have.lengthOf(3);
                        expect(data[0]).to.have.property("hashtag");
                        expect(data[0].hashtag).to.equal("cats");
                        expect(data[1].hashtag).to.equal("dogs");
                        expect(data[2].hashtag).to.equal("fish");
                        done();
                    })
            })
    });
});


describe("TweetRetriever.setCurrentlyDisplayed()", function() {
    it("should set the list of currently tracked hashtags to a specified list", function(done) {
        const tr = new TweetRetriever(conn);
        const database = new Database(conn);
        tr.setCurrentlyDisplayed(["cats", "dogs", "fish"])
            .then(() => {

                database.query("SELECT * FROM display;")
                    .then(data => {
                        expect(data).to.have.lengthOf(3);
                        expect(data[0]).to.have.property("hashtag");
                        expect(data[0].hashtag).to.equal("cats");
                        expect(data[1].hashtag).to.equal("dogs");
                        expect(data[2].hashtag).to.equal("fish");
                        done();
                    })
            })
    });
});

describe("TweetRetriever.tweetObjectToData()", function() {
    it("should transform an object retrieved from the twitter API into a object useable by other methods", function(done) {
        const tr = new TweetRetriever(conn);
        tr.requestTweetsFromDate("test", "2019-4-30")
            .then(data => {
                const parsed = TweetRetriever.tweetObjectToData(data.data.statuses[0], "test");
                expect(parsed).to.have.property("id");
                expect(parsed).to.have.property("author");
                expect(parsed).to.have.property("image");
                expect(parsed).to.have.property("contents");
                expect(parsed).to.have.property("hashtag");
                done();




            })
    })
});


