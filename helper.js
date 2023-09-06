const bcrypt = require("bcryptjs");
// generating random id
function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
  const isAuthenticated = (req, users) => {
    const userId = req.cookies['user_id'];
    return users[userId] ? userId : null;
  };
  const findUserByEmail = (email, users) => {
    for (const userId in users) {
      if (users[userId].email === email) {
        return users[userId];
      }
    }
    return null;
  };
  const verifyUser = (email, password, users) => {
    const user = findUserByEmail(email, users);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user.id;
    }
    return null;
  };
  // creating new user
  const registerUser = (email, password, users) => {
    if (!email || !password) {
      return { status: 400, msg: "Missing email or password" };
    }
  
    if (findUserByEmail(email, users)) {
      return { status: 400, msg: "Email already exists. Registration failed." };
    }
  
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUserID = generateRandomString();
    
    users[newUserID] = {
      id: newUserID,
      email,
      password: hashedPassword
    };
    
    return { status: 200, userId: newUserID };
  };
  module.exports = { generateRandomString , isAuthenticated ,  verifyUser ,registerUser};