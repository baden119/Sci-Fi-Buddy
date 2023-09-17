const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
const dbname = 'Auth';
const collection_name = 'Users';
const userCollection = client.db(dbname).collection(collection_name);

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // const { name, password } = req.body;

  // if (!name || !password) {
  //   res.status(400);
  //   throw new Error('Please add all fields');
  // }

  // const userExists = await getUserData(name);

  // if (userExists) {
  //   res.status(400);
  //   throw new Error('User Already Exists');
  // }

  // // Hash password
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // // Create user
  // const user = {
  //   name,
  //   password: hashedPassword,
  // };

  // try {
  //   await connectToDatabase();
  //   // insertOne method is used here to insert the sampleAccount document
  //   let result = await userCollection.insertOne(user);
  //   res.status(201).json({
  //     token: generateToken(result.insertedId),
  //   });
  // } catch (err) {
  //   console.error(`Error Registering New User: ${err}`);
  // } finally {
  //   await client.close();
  // }

  res.status(201).json({
    message: 'Request recieved on API Register route! :)',
  });
});

// @desc    Log In a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  // Check for user name
  const user = await getUserData(name);

  console.log('login Route');
  console.log(user);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
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

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
  } catch (err) {
    console.error(`Error connecting to the ${dbname} database`);
  }
};

// Check a user exists in the database
const getUserData = async (name) => {
  try {
    await connectToDatabase();
    // findOne() method is used here to find a the first document that matches the filter
    let userExists = await userCollection.findOne({ name });
    return userExists;
  } catch (err) {
    console.error(`Server Error checking registration info: ${err}`);
  } finally {
    await client.close();
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
