const expect = require('chai').expect;
const mocha = require('mocha');
const Database = require("../database.js");
const database = new Database.Database();
const Login = require("../login.js");

//Tests for the database code
describe("Database.query()", function() {
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
    const login = new Login.Login();

    it('should generate a random 16-character alphanumeric salt', function() {
      const salt1 = login.getSalt();
      const salt2 = login.getSalt();

      expect(salt1).to.have.lengthOf(16);
      expect(salt2).to.have.lengthOf(16);
      expect(salt1).to.not.equal(salt2);


    });
});

describe("Login.sha512()", function() {
    const login = new Login.Login();

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
    const login = new Login.Login();

    it("should add a user and password to the database", function () {
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
                       });
               })
               .catch(error => {
                   expect(error).to.equal("");
               })


        })
});

describe("Login.validateLogin()", function() {
    const login = new Login.Login();
    it("should check if a username and password combination is in the database", function() {
        const name = "validate";
        const password = "password";

        login.addNewUser(name, password)
            .then(data => {
                login.validateLogin(name, password)
                    .then(valid => {
                        expect(valid).to.equal(true);
                        login.removeUser(name);
                    }) .catch (error => {
                    login.removeUser(name);
                    expect(error).to.equal("");

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
    const login = new Login.Login();

    it("should remove a user from the database", function() {
        const name = "removeUserTest";
        const password = "password";
        login.addNewUser(name, password)
            .then(() => {
                login.removeUser(name)
                    .then(() => {
                        database.query("SELECT * FROM login WHERE username=?", [name])
                            .then(data => {
                                expect(data).to.have.lengthOf(0);
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