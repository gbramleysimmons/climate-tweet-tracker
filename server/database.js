


/**
 * Models a SQL database that connects with the specified open connection.
 */
class Database {
    constructor(connection) {
        this.conn = connection;

        this.query = this.query.bind(this);
        this.close = this.close.bind(this);
    }

    query(statement, args) {
        const conn = this.conn;
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
        const conn = this.conn;
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


module.exports = Database;