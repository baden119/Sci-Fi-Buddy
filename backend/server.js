const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const port = process.env.PORT || 5000;
const version = 'dev02';

const uri = process.env.MONGO_URI;

// Connect to MongoDB and share connection client with local modules
MongoClient.connect(uri).then((client) => {
  app.locals.client = client;
});

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/browse', require('./routes/browseRoutes'));
app.use('/api/awards', require('./routes/awardRoutes'));
app.use('/api/records', require('./routes/recordsRoutes.js'));

app.get('/api/version', (req, res) => {
  res.send('Server Version: ' + version);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
