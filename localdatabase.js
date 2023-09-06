const bcrypt = require("bcryptjs");
const hashedPassword1 = bcrypt.hashSync("purple-monkey-dinosaur", 10);
const hashedPassword2 = bcrypt.hashSync("dishwasher-funk", 10);
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

const users = {
    userRandomID: {
        id: "userRandomID",
        email: "user@example.com",
        password: hashedPassword1,
    },
    user2RandomID: {
        id: "user2RandomID",
        email: "user2@example.com",
        password: hashedPassword2,
    },
};

module.exports = { urlDatabase, users };