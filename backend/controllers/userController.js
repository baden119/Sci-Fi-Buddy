const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Auth');
  const collection = db.collection('Users');

  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await getUserData(collection, name);

  if (userExists) {
    res.status(400);
    throw new Error('User Already Exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = {
    name,
    password: hashedPassword,
  };

  try {
    // insertOne method is used here to insert the sampleAccount document
    let result = await collection.insertOne(user);
    res.status(201).json({
      name,
      token: generateToken(result.insertedId),
    });
  } catch (err) {
    console.error(`Error Registering New User: ${err}`);
  }
});

// @desc    Log In a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Auth');
  const collection = db.collection('Users');

  const { name, password } = req.body;

  // Check for user in DB
  const user = await getUserData(collection, name);

  // Check password, generate token
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Check a user exists in the database
const getUserData = async (collection, name) => {
  try {
    let userExists = await collection.findOne({ name });
    return userExists;
  } catch (err) {
    console.error(`Server Error checking registration info: ${err}`);
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
