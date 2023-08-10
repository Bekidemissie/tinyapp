const express = require("express");
const app = express();
const PORT = 8080; // default port 808
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser')
function generateRandomString()  {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}


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
const newLongURL = req.body.longURL;
 const id = generateRandomString();
 urlDatabase[id] = newLongURL;
 res.redirect(`/urls/${id}`);

});
app.get("/u/:id", (req, res) => {
 
  let userID = req.params.id;
  let longURL = urlDatabase[userID];
  console.log(longURL, "number 4");
  res.redirect(longURL);
});
 // deleteing URL
app.post("/urls/:id/delete", (req, res) => {
const id =   req.params.id;
delete urlDatabase[id];
res.redirect("/urls");
//res.json("the file succfully deleted");


  });


 app.post("/urls/:id/update", (req, res) => {
  const EditURL =   req.body.longURL;
  const id =   req.params.id;
  urlDatabase[id] = EditURL
 
  
  res.redirect("/urls");
 
  
  
    });
 // update the longUrl
 app.post("/url/:id/edit" , (req, res) => {
  const id =   req.params.id;
  longURL = urlDatabase[id]
  
  res.redirect(`/urls/${id}`);
});



