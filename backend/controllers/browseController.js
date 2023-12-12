const { ObjectId } = require('mongodb');
const asyncHandler = require('express-async-handler');

// @desc    Browse novels database by Author's Sirname Initial
// @route   POST /api/browse/author
// @access  Public

/* 
This endpoint recieves a single character input and returns an alphabetised array of all novels in the database by authors with that initial. 

Author names are stored as a single string so an aggregation pipeline with a few diffrent operators is required to accomodate this functionality.

Firstly the author name string is split into an array of individual words:
--"Frank Herbert" becomes ["Frank", "Herbert"].
Next the last name is sliced off the array, then the first character is sliced off the last name to get the initial.
--["Frank", "Herbert"] becomes ["Herbert"] then "H".
This initial is matched with the input character sent through from the frontend and then these relevent results are sorted in sirname alphabetical order and returned in an array.

*/
const author = asyncHandler(async (req, res) => {
  const client = req.app.locals.client;
  const db = client.db('Buddy-Data');
  const collection = db.collection('Novels');

  const char = req.body.char;

  const agg = [
    {
      $addFields: {
        authorArray: {
          $split: ['$author', ' '],
        },
      },
    },
    {
      $addFields: {
        sirName: {
          $slice: ['$authorArray', -1],
        },
      },
    },
    {
      $addFields: {
        firstCharSirName: {
          $substrCP: [
            {
              $first: '$sirName',
            },
            0,
            1,
          ],
        },
      },
    },
    {
      $match: {
        firstCharSirName: char,
      },
    },
    {
      $sort: {
        sirName: 1,
      },
    },
    // TODO only project back relavent fields, ignore authorArray, sirName, firstCharSirName.
  ];

  try {
    let results = await collection.aggregate(agg).toArray();
    res.status(200).json({ results });
  } catch (err) {
    console.error(`Error in Author Browse Route ${err}`);
  }
});

module.exports = {
  author,
};
