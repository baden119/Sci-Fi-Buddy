const { ObjectId } = require('mongodb');
const asyncHandler = require('express-async-handler');

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
  ];

  try {
    let results = await collection.aggregate(agg).toArray();
    res.status(200).json({ results });
    // res.status(200).json({ msg: 'Browse Character recieved ' + char });
  } catch (err) {
    console.error(`Error in Author Browse Route ${err}`);
  }
});

module.exports = {
  author,
};
