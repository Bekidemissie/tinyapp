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
  
  module.exports = { generateRandomString , isAuthenticated};