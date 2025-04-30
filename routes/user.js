import express from "express";

const router = express.Router();

// Dummy endpoints
router.post('signup', (req, res) => res.send('User signup'));
router.post('/login', (req, res) => res.send('User login'));

export default router;