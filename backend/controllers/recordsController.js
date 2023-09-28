const asyncHandler = require('express-async-handler');
const { ObjectId } = require('mongodb');

// @desc    Create Record
// @route   POST /api/record
// @access   Private
const createRecord = asyncHandler(async (req, res) => {
  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Buddy-Data');
  const collection = db.collection('Records');

  if (!req.body.novel_id) {
    res.status(400);
    throw new Error('Novel ID Data Missing');
  }

  // TODO Check for existing record (userid + novelid)

  // Create Record In DB
  const { novel_id, list, rating, notes } = req.body;

  const record = {
    novel_id: new ObjectId(novel_id),
    user_id: req.user._id,
    list,
    rating,
    notes,
    dateAdded: new Date(),
  };

  try {
    let result = await collection.insertOne(record);
    record._id = result.insertedID;
    res.status(200).json({ record });
  } catch (err) {
    console.error(
      `Error Creating Record (recordsController/createRecord): ${err}`
    );
  }
});

// @desc    Read Record
// @route   GET /api/record
// @access   Private
const readRecord = asyncHandler(async (req, res) => {
  // Read Record from DB

  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Buddy-Data');
  const collection = db.collection('Records');

  // Document used as a filter for the find() method
  const records = { user_id: req.user._id };

  try {
    // find() method is used here to find documents that match the filter
    let results = await collection.find(records).toArray();
    res.status(200).json({ results });
  } catch (err) {
    console.error(`Error finding documents: ${err}`);
  }
});

// @desc    Update Record
// @route   PUT /api/record/:id
// @access   Private
const updateRecord = asyncHandler(async (req, res) => {
  // Find Record (req.params.id)
  // Find User (req.user.id)

  //   if (!record) {
  //     res.status(400);
  //     throw new Error('Record not Found');
  //   }

  //   if (!user) {
  //     res.status(401);
  //     throw new Error('User not Found');
  //   }

  // Make sure the logged in user matches the record user
  //   if (record.user.toString() !== req.user.id) {
  //     res.status(401);
  //     throw new Error('User not authorized');
  //   }

  // Update Record (findByIdAndUpdate(req.params.id, req.body)
  res.status(200).json({ message: 'Update Record Route' });
});

// @desc    Delete Record
// @route   DELETE /api/record/:id
// @access   Private
const deleteRecord = asyncHandler(async (req, res) => {
  // Find Record (req.params.id)
  // Find User (req.user.id)

  //   if (!record) {
  //     res.status(400);
  //     throw new Error('Record not Found');
  //   }

  //   if (!user) {
  //     res.status(401);
  //     throw new Error('User not Found');
  //   }

  // Make sure the logged in user matches the record user
  //   if (record.user.toString() !== req.user.id) {
  //     res.status(401);
  //     throw new Error('User not authorized');
  //   }

  // Delete Record (deleteOne();)
  res.status(200).json({ message: 'Update Delete Route' });
});

module.exports = {
  readRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};
