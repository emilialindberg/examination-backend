import express from "express";
import {createNote, getNotes, updateNote, deleteNote} from '../models/noteModel.js';

const router = express.Router();

router.get('/', (req, res) => {
  getNotes((err, notes) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(notes);
  });
});

router.post('/', (req, res) => {
    console.log(req.body)
  const { title, text } = req.body;
  if (!title || !text) return res.status(400).json({ error: 'Title and text are required' });

  const note = {
    title,
    text,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };

  createNote(note, (err, newNote) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.status(201).json(newNote);
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;
  const modifiedAt = new Date().toISOString();

  updateNote(id, { title, text, modifiedAt }, (err, numReplaced) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (numReplaced === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note updated' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  deleteNote(id, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (numRemoved === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  });
});

export default router;