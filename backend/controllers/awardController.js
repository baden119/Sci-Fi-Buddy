const { ObjectId } = require('mongodb');
const asyncHandler = require('express-async-handler');

const getAwards = asyncHandler(async (req, res) => {
  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Buddy-Data');
  const collection = db.collection('Awards');

  const awardsToFind = { novel: new ObjectId(req.params.id) };
  try {
    let awards = await collection.find(awardsToFind).toArray();
    res.status(200).json({ awards });
  } catch (err) {
    console.error(`Error finding document: ${err}`);
  }
});

module.exports = {
  getAwards,
};
