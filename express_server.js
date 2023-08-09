const express = require("express");
const app = express();
const PORT = 8080; // default port 808
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser')


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello Bereket!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  let userID = req.params.id;
  const templateVars = { id: userID, longURL: urlDatabase[userID]};
  res.render("urls_show", templateVars);
})



app.post("/urls", (req, res) => {
  const longURL =req.body.longURL;
  console.log(longURL);   // Log the POST request body to the console
      
  res.send(longURL); // Respond with 'Ok' (we will replace this)
});
app.get("/u/:id", (req, res) => {
  // console.log(req.body , "number 1");
  // console.log(req.query , "number 2");
  // console.log(req.params.id , "number 3");
  let userID = req.params.id;
  let longURL = urlDatabase[userID];
  console.log(longURL, "number 4");
  res.redirect(longURL);
});
 // deleteing URL
app.get("/urls/:id/delete", (req, res) => {
const id =   req.params.id;
delete urlDatabase.id;
res.json("the file succfully deleted");

  });
