import express from "express";
import {createNote, getNotes, updateNote, deleteNote} from '../models/noteModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// JWT middleware to verify authenticity
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token: ', token)
    
    if (!token) return res.sendStatus(401); // return 401. no token passed
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.error('403 forbidden err:', err.message);
        return res.sendStatus(403);
      }
      console.log('User login successful:', user);
      req.user = user;
      next();
    });
  };

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Fetches notes
 *     responses:
 *       200:
 *         description: a list of notes
 */

router.get('/', authenticateToken, (req, res) => {
    getNotes((err, notes) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(notes);
    });
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Creates a new note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My title"
 *               text:
 *                 type: string
 *                 example: "This is the text in my note"
 *     responses:
 *       201:
 *         description: Note created
 *       400:
 *         description: False request
 *       500:
 *         description: Server error
 */

router.post('/', authenticateToken, (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) return res.status(400).json({ error: 'Title and text are required' });

  const note = {
    title,
    text,
    createdAt: new Date().toISOString(), // YYYY-MM-DDTHH:mm:ss.sssZ
    modifiedAt: new Date().toISOString() // YYYY-MM-DDTHH:mm:ss.sssZ
  };

  createNote(note, (err, newNote) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.status(201).json(newNote);
  });
});

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update an existing note.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID on the note to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated.
 *       404:
 *         description: Note with indicated ID was not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;
  const modifiedAt = new Date().toISOString();

  updateNote(id, { title, text, modifiedAt }, (err, numReplaced) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (numReplaced === 0) return res.status(404).json({ error: 'Note not found. Invalid ID?' });
    res.json({ message: 'Note updated' });
  });
});


/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the note that will be deleted. 
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: Note deleted.
 *       404:
 *         description: Note with indicated ID was not found. 
 *       500:
 *         description: Server error
 */

router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  deleteNote(id, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (numRemoved === 0) return res.status(404).json({ error: 'Note not found. Invalid ID?' });
    res.json({ message: 'Note deleted' });
  });
});



export default router;