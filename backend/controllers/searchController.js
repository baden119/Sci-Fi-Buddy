const asyncHandler = require('express-async-handler');

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

module.exports = {
  autocomplete,
};
