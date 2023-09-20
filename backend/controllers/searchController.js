const { MongoClient } = require('mongodb');
const asyncHandler = require('express-async-handler');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
const dbname = 'Buddy-Data';
const collection_name = 'Novels';
const novelsCollection = client.db(dbname).collection(collection_name);

// @desc    Autocomplete search querys
// @route   POST /api/search/autocomplete
// @access  Public

const autocomplete = asyncHandler(async (req, res) => {
  const query = req.body.query;

  const agg = [
    {
      $search: {
        index: 'autocomplete',

        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: 'title',
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },

            {
              autocomplete: {
                query: query,
                path: 'author',
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
          ],

          minimumShouldMatch: 1,
        },
      },
    },

    {
      $limit: 7,
    },
  ];

  try {
    await client.connect();
    let results = await novelsCollection.aggregate(agg).toArray();
    res.status(200).json({ results });
  } catch (err) {
    console.log('is the error here??');
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
});

module.exports = {
  autocomplete,
};
