const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

function createUser(user, callback) {
  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    const newUser = { username: user.username, password: hashedPassword };
    db.insert(newUser, callback);
  });
}

function findUser(username, callback) {
  db.findOne({ username }, callback);
}

function authenticateUser(username, password, callback) {
  findUser(username, (err, user) => {
    if (err || !user) return callback(null, false);

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return callback(null, false);

      const token = jwt.sign({ id: user._id }, '%GucHMArBT>^J9+h]kbMtchPXua9,j', { expiresIn: '1h' });
      callback(null, token);
    });
  });
}

module.exports = {
  createUser,
  authenticateUser
};