const bcrypt = require("bcryptjs");
const hashedPassword1 = bcrypt.hashSync("purple-monkey-dinosaur", 10);
const hashedPassword2 = bcrypt.hashSync("dishwasher-funk", 10);
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

const urlDatabase = {
    "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
    "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};

module.exports = { urlDatabase, users };