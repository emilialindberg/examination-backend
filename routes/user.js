import express from "express";
import { createUser, authenticateUser } from '../models/userModel.js';


const router = express.Router();

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Create new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User account created
 *       400:
 *         description: Invalid request. username or password missing
 *       500:
 *         description: Server error
 */

router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ error: 'Username and password are required'})
    }

    const user = { username, password };
    createUser(user, (err) => {
        if(err){
            return res.status(500).json({ error: 'Server error'});
        }
        res.status(201).json({ message: 'User created'});
    });
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Log in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login in succeeded, returns JWT-token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "JWT-TOKEN-HERE"
 *       401:
 *         description: Invalid username or password. 
 *       500:
 *         description: Server error
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    authenticateUser(username, password, (err, token) => {
        if (err || !token) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        res.json({ token });
    });
});


export default router;