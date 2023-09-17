const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
const dbname = 'Auth';
const collection_name = 'Users';

const usersCollection = client.db(dbname).collection(collection_name);

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      // This will mean you can access req.user in any route thats protected.
      // We've sent the ID along in the generateToken function of the userController file.

      req.user = await findUserByID(decoded.id);

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const findUserByID = async (id) => {
  try {
    await connectToDatabase();
    // findOne() method is used here to find a the first document that matches the filter
    let userData = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
    return userData;
  } catch (err) {
    console.error(`Server middleware error checking user info: ${err}`);
  } finally {
    await client.close();
  }
};

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
  } catch (err) {
    console.error(`Error connecting to the ${dbname} database`);
  }
};

module.exports = { protect };
