const asyncHandler = require('express-async-handler');
const { ObjectId } = require('mongodb');

// @desc    Autocomplete search querys
// @route   POST /api/search/autocomplete
// @access  Public

/*
Novel and Author database search leverages MongoDB Atlas Search Autocomplete functionality.
https://www.mongodb.com/docs/atlas/atlas-search/autocomplete/
https://www.mongodb.com/docs/atlas/atlas-search/tutorial/autocomplete-tutorial/

- The 'author' and 'title' fields of the 'Novel' collection have been indexed for autocompletion.
- Search querys are recieved from the frontend and passed through the 'aggregation pipeline' which searches for matches in either field.
- 'Fuzzy' search is included to accomodate input errors.
*/
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
      $limit: 20,
    },
  ];

  try {
    let results = await collection.aggregate(agg).toArray();
    res.status(200).json({ results });
  } catch (err) {
    console.error(`Error in Autocorrect Route ${err}`);
  }
});

// @desc    Returns data on novels from an array of ID's.
// @route   POST /api/search/array
// @access  Public

// array api request sent directly from frontend MyList component rather than via Context API NovelState

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
