const express = require("express");
const { urlDatabase, users } = require("./localdatabase.js");
const { generateRandomString, isAuthenticated, verifyUser, registerUser } = require("./helper.js");
const app = express();
const PORT = 8080; // default port 808
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get("/", (req, res) => {
  const userId = req.cookies['user_id'];
  // Check if user is logged in
  if (users[userId]) {
    // User is logged in, redirect to /urls
    res.redirect("/urls");
  } else {
    // User is not logged in, redirect to /login
    res.redirect("/login");
  }
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls", (req, res) => {
  const userId = isAuthenticated(req, users);
  if (userId) {
    const templateVars = { urls: urlDatabase, user: users[userId] };
    res.render("urls_index", templateVars);
  }
  else {
    res.send("<html><body>Please login frist before access </b></body></html>\n");
  }
  1
});
app.get("/urls/new", (req, res) => {
  const userId = req.cookies['user_id'];
  const templateVars = {
    user: users[req.cookies.user_id]
  }
  if (users[userId]) {
    res.render("urls_new", templateVars);
  }
  else {
    res.redirect("/login");
  }
});
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  if (!urlDatabase[shortURL]) {
    // If the short URL doesn't exist in the database, return an error message
    return res.status(404).send("Short URL not found");
  }
  const userId = isAuthenticated(req, users);
  if (userId) {
    const templateVars = { id: urlID, longURL: urlDatabase[shortURL], user: users[userId] };
    res.render("urls_show", templateVars);
  }
  else {
    res.send("<html><body>Please login frist before access </b></body></html>\n");
  }
})
app.post("/urls", (req, res) => {
  const newLongURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = newLongURL;

  const user = users[req.cookies.user_id];
  res.redirect(`/urls/${id}`);

});
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;

  if (!urlDatabase[shortURL]) {
    // If the short URL doesn't exist in the database, return an error message
    return res.status(404).send("Short URL not found");
  }
  // If the short URL exists, perform the redirect
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});
// deleteing URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});
// update longURL
app.post("/urls/:id/update", (req, res) => {
  const EditURL = req.body.longURL;
  const id = req.params.id;
  urlDatabase[id] = EditURL
  res.redirect("/urls");

});
// Edit Long URL
app.post("/url/:id/edit", (req, res) => {
  const id = req.params.id;
  longURL = urlDatabase[id]

  res.redirect(`/urls/${id}`);
});
//registration
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("user_registration", templateVars);
});
//post registration 
app.post("/register", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  const { status, userId, msg } = registerUser(email, password, users);
  
  if (status === 200) {
    res.cookie('user_id', userId);
    res.redirect("/urls");
  } else {
    res.status(status).send(msg);
  }
});
// login
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  const userId = verifyUser(email, password, users);

  if (userId) {
    res.cookie('user_id', userId);
    res.redirect("/urls");
  } else {
    return res.status(401).send("Invalid login credentials");
  }
})
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});












