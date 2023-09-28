const asyncHandler = require('express-async-handler');
const { ObjectId } = require('mongodb');

// @desc    Autocomplete search querys
// @route   POST /api/search/autocomplete
// @access  Public

const autocomplete = asyncHandler(async (req, res) => {
  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Buddy-Data');
  const collection = db.collection('Novels');

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
    let results = await collection.aggregate(agg).toArray();
    res.status(200).json({ results });
  } catch (err) {
    console.error(`Error in Autocorrect Route ${err}`);
  }
});

const array = asyncHandler(async (req, res) => {
  // Pull connection client into module and specify Database and Collection
  const client = req.app.locals.client;
  const db = client.db('Buddy-Data');
  const collection = db.collection('Novels');
  const novelData = [];
  const { novelIds } = req.body;

  if (!novelIds || !Array.isArray(novelIds)) {
    res.status(400);
    throw new Error('Error in search/array route, invalid data recieved.');
  }

  for (let index = 0; index < novelIds.length; index++) {
    const novelToFind = { _id: new ObjectId(novelIds[index]) };
    try {
      let novel = await collection.findOne(novelToFind);
      novelData.push(novel);
    } catch (err) {
      res.status(400);
      throw new Error(`Error in search/array route. : ${err}`);
    }
  }

  res.status(200).json({ novelData });
});

module.exports = {
  autocomplete,
  array,
};
