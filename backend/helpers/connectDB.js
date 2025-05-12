const { MongoClient } = require("mongodb");

// Notice all the variables such as uri,dbName,db,client are all global(outside of getDatabase function) why? Because we don't want to create a new MongoClient or db each time getDatabase is imported and called from other files, so ı make these variables global

//To connect to database,this is the standard protocol mongodb:// and default path is localhost and port is 27017
const uri = "mongodb://localhost:27017";
// Database Name
const dbName = "medicalportal";
let db = null;
const client = new MongoClient(uri);

async function getDatabase() {
  try {
    // Connect to the MongoDB server,if something goes wrong, we catch the error in 'catch' block
    await client.connect();

    // Select the database and assign it to the global db variable, remember we only want one db instance, we don't want to create a new instance each time we connect to the DB
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = { getDatabase, client };
