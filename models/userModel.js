import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js'; 

export const createUser = (user, callback) => {
    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        if (err) return callback(err);

        const newUser = { username: user.username, password: hashedPassword };
        db.insert(newUser, callback);
    });
};

export const authenticateUser = (username, password, callback) => {
    db.findOne({ username }, (err, user) => {
        if (err || !user) return callback(null, false);

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) return callback(null, false);

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            callback(null, token);
        });
    });
};