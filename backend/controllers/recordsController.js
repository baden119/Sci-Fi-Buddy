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
    // This code didnt work for a good half hour, then started working...
    record._id = result.insertedId;
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
  // Pull connection client into module
  const client = req.app.locals.client;

  // Check record and user exist
  const record = await findRecord(client, req.params.id);
  const user = await findUser(client, req.user._id);

  if (!record) {
    res.status(400);
    throw new Error('Record not Found');
  }

  if (!user) {
    res.status(401);
    throw new Error('User not Found');
  }

  // // Make sure the logged in user matches the record user
  if (record.user_id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Specify Database and Collection for record update
  const db = client.db('Buddy-Data');
  const collection = db.collection('Records');

  // Set up update request paramaters
  const recordToUpdate = { _id: record._id };
  const update = {
    $set: {
      rating: req.body.rating,
      notes: req.body.notes,
    },
  };

  // Run update in DB
  try {
    let result = await collection.updateOne(recordToUpdate, update);
    res.status(200).json({ result: result.acknowledged });
  } catch (error) {
    console.error(`Error updating record: ${error}`);
  }
});

// @desc    Delete Record
// @route   DELETE /api/record/:id
// @access   Private
const deleteRecord = asyncHandler(async (req, res) => {
  // Pull connection client into module
  const client = req.app.locals.client;

  // Check record and user exist
  const record = await findRecord(client, req.params.id);
  const user = await findUser(client, req.user._id);

  if (!record) {
    res.status(400);
    throw new Error('Record not Found');
  }

  if (!user) {
    res.status(401);
    throw new Error('User not Found');
  }

  // // Make sure the logged in user matches the record user
  if (record.user_id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Specify Database and Collection for record to be deleted
  const db = client.db('Buddy-Data');
  const collection = db.collection('Records');
  const recordToDelete = { _id: record._id };

  // Delete from DB
  try {
    let result = await collection.deleteOne(recordToDelete);
    res.status(200).json({ result: result.acknowledged });
  } catch (error) {
    console.error(`Error updating record: ${error}`);
  }
});

const findUser = async (client, _id) => {
  // Specify Database and Collection for finding user
  const db = client.db('Auth');
  const collection = db.collection('Users');

  // Find and return user
  try {
    let user = await collection.findOne(
      { _id },
      { projection: { password: 0 } }
    );
    return user;
  } catch (error) {
    console.log('error in recordsController findUser function');
    console.log(error);
  }
};

const findRecord = async (client, id) => {
  // Specify Database and Collection for finding record
  const db = client.db('Buddy-Data');
  const collection = db.collection('Records');

  // Find and return record
  try {
    let record = await collection.findOne({ _id: new ObjectId(id) });
    return record;
  } catch (error) {
    console.log('error in recordsController findRecord function');
    console.log(error);
  }
};

module.exports = {
  readRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};
