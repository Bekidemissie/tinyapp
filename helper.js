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
  
  
  module.exports = { generateRandomString ,  verifyUser , findUserByEmail};