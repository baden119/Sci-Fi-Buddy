const asyncHandler = require('express-async-handler');

const abstractTest = asyncHandler(async (req, res) => {
  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Buddy-Data');
  const collection = db.collection('Novels');

  try {
    const novels = await collection.find({}).toArray();
    res.status(200).json({ novels });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = {
  abstractTest,
};
