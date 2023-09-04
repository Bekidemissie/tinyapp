const express = require("express");

const app = express();
const PORT = 8080; // default port 808

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
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

// database for user 
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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
  const templateVars = {
    user: users[req.cookies.user_id] 
  }
    
  res.render("urls_new" , templateVars);
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
 
const user = users[req.cookies.user_id];
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

  // update longURL
 app.post("/urls/:id/update", (req, res) => {
  const EditURL =   req.body.longURL;
  const id =   req.params.id;
  urlDatabase[id] = EditURL
  res.redirect("/urls");

    });
 // Edit Long URL
 app.post("/url/:id/edit" , (req, res) => {
  const id =   req.params.id;
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

app.post( "/register", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  for (const userId in users) {
    if (users.hasOwnProperty(userId)) {

      if (users[userId].email === email) {
     return   res.status(400).send("Email already exists. Registration failed.");
     
      }
    }
  }
  // 
if(email === null || email === "  " || password === null || password === " "){

   return res.status(400).send("there is no input") 
  }
  // creating new user;
   let newuserID = generateRandomString();
   const  newuser ={
    id: newuserID,
    email: email,
    password: password,
}
users[newuserID] = newuser;

res.status(200).send("succfull registore ") 
  //   res.render("user_registration");
  
  // res.render("user_registration");
  
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

  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  }

  const user = Object.values(users).find(user => user.email === email);
  
  if (user && user.password === password) {
    res.cookie('user_id', user.id);
    return res.redirect("/urls");
  }
  
  return res.status(401).send("Invalid login credentials");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});













