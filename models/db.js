import Datastore from "nedb";

const db = new Datastore ({ filename: 'notes.db', autoload: true })

export default db;