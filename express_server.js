const express = require("express");
const bcrypt = require("bcryptjs");
const { urlDatabase, users } = require("./localdatabase.js");
const { generateRandomString } = require("./helper.js");
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
  const userId = req.cookies['user_id'];
  if (users[userId]) {
    const templateVars = { urls: urlDatabase, user: users[userId] };
    res.render("urls_index", templateVars);
  }
  else {
    res.send("<html><body>Please login frist before access </b></body></html>\n");
  }
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
  let urlID = req.params.id;

  const userId = req.cookies['user_id'];
  if (users[userId]) {
    const templateVars = { id: urlID, longURL: urlDatabase[urlID], user: users[userId] };
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
  //res.json("the file succfully deleted");


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

  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  }

  const userExists = Object.values(users).some(user => user.email === email);

  if (userExists) {
    return res.status(400).send("Email already exists. Registration failed.");
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUserID = generateRandomString();
  users[newUserID] = {
    id: newUserID,
    email,
    password: hashedPassword // Store the hash, not the plain-text password
  };
  res.redirect("/urls/new");
  // return res.status(200).send("succsfull reistration ")
  //res.cookie('user_id', newUserID);

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

  let foundUser;

  for (const userId in users) {
    if (users[userId].email === email) {
      foundUser = users[userId];
      break;
    }
  }

  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.status(401).send("Invalid login credentials");
  }

  // Login successful: Set cookie and redirect
  res.cookie('user_id', foundUser.id);
  res.redirect("/urls");
});



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












