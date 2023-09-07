const express = require("express");
const { urlDatabase, users } = require("./localdatabase.js");
const bcrypt = require("bcryptjs");
const { generateRandomString, verifyUser, findUserByEmail } = require("./helper.js");
const app = express();
const PORT = 8080; // default port 808
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.get("/", (req, res) => {
  const userId = req.cookies.user_id;
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
  const userId = req.cookies.user_id;
  if (userId) {
    const userURLs = {};
    for (const id in urlDatabase) {
      if (urlDatabase[id].userID === userId) {
        userURLs[id] = urlDatabase[id];
      }
    }

    const templateVars = { urls: userURLs, user: users[userId] };
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
  const urlID = req.params.id;
  const userId = req.cookies.user_id;
  // Check if user is logged in
  if (!userId) {
    return res.status(401).send("<html><body>Please login first before accessing this URL.</body></html>");
  }
  // Check if URL exists
  if (!urlDatabase[urlID]) {
    return res.status(404).send("<html><body>URL not found.</body></html>");
  }

  //Check if user owns the URL
  if (urlDatabase[urlID].userID !== userId) {
    return res.status(401).send("<html><body>You do not own this URL.</body></html>");
  }

  const templateVars = { id: urlID, longURL: urlDatabase[urlID].longURL, user: users[userId] };
  res.render("urls_show", templateVars);
});

//Update longURL
app.post("/urls/:id", (req, res) => {
  const LongURL = req.body.longURL;
  const urlID = req.params.id;
  const userId = req.cookies.user_id;

  // Check if user is logged in
  if (!userId) {
    return res.status(401).send("<html><body>You must be logged in to update a URL.</body></html>");
  }

  // Check if the URL exists
  if (!urlDatabase[urlID]) {
    return res.status(404).send("<html><body>URL not found.</body></html>");
  }

  // Check if the user owns the URL
  if (urlDatabase[urlID].userID !== userId) {
    return res.status(403).send("<html><body>You do not own this URL, hence cannot update it.</body></html>");
  }

  // Update the URL and redirect to /urls
  urlDatabase[urlID].longURL = LongURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString();
  const userID = req.cookies.user_id;
  urlDatabase[id] = { userID: userID, longURL: longURL };
  res.redirect(`/urls/${id}`);

});
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;

  if (!urlDatabase[shortURL]) {
    // If the short URL doesn't exist in the database, return an error message
    return res.status(404).send("Short URL not found");
  }
  // If the short URL exists, perform the redirect
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//deleteing URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// update longURL
app.post("/urls/:id/update", (req, res) => {
  const EditURL = req.body.longURL;
  const id = req.params.id;
  urlDatabase[id].longURL = EditURL
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


  if (findUserByEmail(email, users)) {
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

  // Set the user ID as an encrypted cookie
  req.session.user_id = newUserID;
  res.cookie('user_id', newUserID);
  res.redirect("/urls");

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
  res.redirect("/login");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});












