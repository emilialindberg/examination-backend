import Datastore from "nedb";

// Initiate database

const db = new Datastore ({ filename: 'notes.db', autoload: true })

export default db;