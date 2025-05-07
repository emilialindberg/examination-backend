import Datastore from "nedb";

// Initiate database

const db = new Datastore ({ filename: 'notes.db', autoload: true })
const dbUser = new Datastore ({ filename: 'users.db', autoload: true })

export {db, dbUser}