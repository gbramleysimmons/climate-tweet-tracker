const crypto = require('crypto');
const Database = require('./database.js');


/**
 * Class intended to handle administrator login. Stores passwords securely using salted hashing.
 */
class Login {

    /**
     * Creates a new login object.
     */
    constructor() {
        this.database = new Database.Database();
        this.database.query("CREATE TABLE IF NOT EXISTS login (\n" +
            "  username TEXT," +
            "  pass VARCHAR(512)," +
            "  salt VARCHAR(16)" +
            ");");
        this.addNewUser = this.addNewUser.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.sha512 = this.sha512.bind(this);
        this.getSalt = this.getSalt.bind(this);
    }

    /**
     * Adds a new user to the database.
     * @param username username to add.
     * @param password password to add.
     */
     addNewUser(username, password) {
        return new Promise(function (resolve, reject) {
            this.database.query("SELECT * FROM login WHERE username = ?;", [username])
                .then((data) => {
                        if (data.length !== 0) {
                            reject("Username has been taken");

                        } else {
                            const salt = this.getSalt();
                            const hashedPass = this.sha512(password, salt);
                            this.database.query("INSERT INTO login VALUES (?, ?, ?)", [username, hashedPass, salt])
                                .then(data => {
                                    resolve();
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        }
                    }
                );
        })


    };


    /**
     * Validates a login based on username and password. Returns a Promise.
     * @param username
     * @param password
     */
     validateLogin (username, password) {
       return new Promise (function(resolve, reject) {
           this.database.query("SELECT * FROM login WHERE username = ?", [username])
               .then((data) => {
                   if (this.sha512(password, data[0].salt) === data[0].pass) {
                       resolve(true);
                   } else {
                      resolve(false);
                   }
               })
               .catch(error => {
                   reject(error);
               });
       });

    };

    /**
     * Hashes a password with the input salt using the sha512 system.
     * @param password Password to hash.
     * @param salt Salt associated with this password.
     * @returns {string} String
     */
    sha512(password, salt) {

        const hashFunction = crypto.createHmac('sha512', salt);
        hashFunction.update(password);
        return hashFunction.digest('hex');

    };


    /**
     * Generates a 16-character alphanumeric string to use as a salt.
     * @returns {string}
     */
    getSalt() {
        const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let salt = "";
        for (let i = 0; i < 16; i++) {
            let key = Math.floor(Math.random()*63);
            salt += validChars[key];
        }
        return salt;
    };

}

module.exports = {
    Login: Login
};