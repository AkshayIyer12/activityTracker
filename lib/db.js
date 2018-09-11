const { MongoClient, ObjectId } = require("mongodb")
const uri = process.env.MONGODB_URI || `mongodb://localhost:27017`;
const dbName = process.env.MONGODB_DB_NAME || "activity_tracker";
const collectionName = "trackerCount";
let client = MongoClient.connect(
  uri,
  { useNewUrlParser: true }
);
let dbObject = client
  .then(clientObj => {
    console.log("Connection to DB successful");
    return clientObj.db(dbName).collection(collectionName);
  })
  .catch(err => new Error("Connection to DB failed: ", err));

const createCounter = async (data) => {
  try {
    let db = await dbObject
    let key = Object.keys(data)[0]
    let value = data[key]
    let exists = await db.find({[key]: { $exists: 1 }}).toArray()
    if (exists.length > 0) {
      let id = exists[0]._id.toHexString()
      let val = exists[0][key]
      return ({ id, val })
    } else {
      let ins = await db
        .insertOne({ [key]: value })
      return ({id: ins.insertedId.toHexString(), value: value })
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

const updateCounter = async (string, id, key, value) => {
  try {
    let db = await dbObject
    let k = `${string}.${key}`
    let data = await db.updateOne({ _id: new ObjectId(id) }, { $set: { [k]: value }})
    return data.result
  } catch (err) {
    throw new Error(err.message)
  }
}

const getCounter = async key => {
  try {
    let db = await dbObject
    let data = await db.find({ [key]: { $exists: 1 } }).toArray()
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = {
  createCounter,
  updateCounter,
  getCounter
}