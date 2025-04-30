import db from './db.js';

function createNote(note, callback) {
  db.insert(note, callback);
}

function getNotes(callback) {
  db.find({}, callback);
}

function updateNote(id, updatedNote, callback) {
  db.update({ _id: id }, { $set: updatedNote }, {}, callback);
}

function deleteNote(id, callback) {
  db.remove({ _id: id }, {}, callback);
}

export {
  createNote,
  getNotes,
  updateNote,
  deleteNote
};

