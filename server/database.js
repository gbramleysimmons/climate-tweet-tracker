
const db = require('mysql');
const url = 'mysql://olangley:cs132@bdognom.cs.brown.edu/olangley_db';
const conn = db.createConnection(url);


/**
 * Models a database with url url.
 */
class Database {
    constructor() {
        this.query = this.query.bind(this);
        this.close = this.close.bind(this);
    }

    query(statement, args) {
        return new Promise(function (resolve, reject) {
            conn.query(statement, args, function (error, data) {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        });
    }

    close() {
        return new Promise(function (resolve, reject) {
            conn.end(error => {
                if (error) {
                    return reject(error);
                } else {
                    resolve();
                }
            })
        });
    }
}


module.exports = {
    Database: Database
};