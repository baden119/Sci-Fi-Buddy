const { MongoClient, ObjectId } = require('mongodb');
const asyncHandler = require('express-async-handler');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
const dbname = 'Buddy-Data';
const collection_name = 'Awards';
const awardsCollection = client.db(dbname).collection(collection_name);

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
  } catch (err) {
    console.error(`Error connecting to the ${dbname} database`);
  }
};

const getAwards = asyncHandler(async (req, res) => {
  const awardsToFind = { novel: new ObjectId(req.params.id) };

  try {
    await connectToDatabase();
    // find() method is used here to find documents that match the filter
    let awards = await awardsCollection.find(awardsToFind).toArray();
    res.status(200).json({ awards });
  } catch (err) {
    console.error(`Error finding document: ${err}`);
  } finally {
    await client.close();
  }
});

module.exports = {
  getAwards,
};
