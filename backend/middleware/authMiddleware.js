const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Auth');
  const collection = db.collection('Users');

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

      req.user = await findUserByID(decoded.id, collection);

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

const findUserByID = async (id, collection) => {
  try {
    let userData = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
    return userData;
  } catch (err) {
    console.error(`Server middleware error checking user info: ${err}`);
  }
};

module.exports = { protect };
