
const Database = require("./database.js");
let database =  new Database.Database();
const Login = require("./login.js");
let login = new Login.Login();

const salt = login.getSalt();
const hash = login.sha512("test", salt);

login.validateLogin("test34", "test1")
    .then(data => {
        console.log(data);
});




