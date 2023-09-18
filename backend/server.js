const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
// const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const version = 'dev01';

// connectDB();

const app = express();
app.use(
  cors({
    origin: 'https://sci-fi-buddy-app.onrender.com',
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.get('/api/version', (req, res) => {
  res.send('Server Version: ' + version);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
