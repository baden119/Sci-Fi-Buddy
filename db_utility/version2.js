const { MongoClient } = require('mongodb');
const uri = require('./atlas_uri');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const GOOGLE_BOOKS_API_KEY = 'AIzaSyAyXyuX0kiRw7-2dZXNRBbTlmWuIQwahmY';
const results = [];
const award = 'Hugo';

// fs.createReadStream('./raw_data/Hugos_complete2023.csv')
fs.createReadStream('./raw_data/Hugo_v2Test.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    formatResults(results);
  });

// Format Results

const formatResults = (results) => {
  const formattedResults = [];
  for (let index = 0; index < results.length; index++) {
    let Winner;
    if (
      results[index].Author.charAt(results[index].Author.length - 1) === '*'
    ) {
      Winner = true;
      results[index].Author = results[index].Author.slice(0, -1);
    } else {
      Winner = false;
    }
    if (results[index].Novel && results[index].Author) {
      const formattedResult = {
        title: results[index].Novel.replace(/\[.*?\]/g, ''),
        author: results[index].Author.replace(/\[.*?\]/g, ''),
        year: results[index].Year,
        winner: Winner,
        award,
      };

      formattedResults.push(formattedResult);
    }
  }
  checkDBforNovel(formattedResults);
};

// Check DB for Novel

const checkDBforNovel = async (results) => {
  const client = new MongoClient(uri);
  const dbname = 'Buddy-Data';
  const collection_name = 'Novels';
  const novelsCollection = client.db(dbname).collection(collection_name);
  const awardItemsWithDB_ID = [];

  const connectToDatabase = async () => {
    try {
      await client.connect();
    } catch (err) {
      console.error(`Error connecting to the ${dbname} database`);
    }
  };
  for (let index = 0; index < results.length; index++) {
    try {
      await connectToDatabase();
      // findOne() method is used here to find a the first document that matches the filter
      let novelInDB = await novelsCollection.findOne({
        title: results[index].title,
      });
      if (novelInDB) console.log('Novel Found In DB! ' + results[index].title);
      if (!novelInDB) {
        novelInDB = await addNovelToDB(results[index]);
      }
      awardItemsWithDB_ID.push({
        award,
        year: results[index].year,
        winner: results[index].winner,
        novel: novelInDB._id,
      });
    } catch (err) {
      console.error(`Server Error checking registration info: ${err}`);
    } finally {
      await client.close();
    }
  }
  console.log('about to add awards to db!!');
  addAwardsToDB(awardItemsWithDB_ID);
};

const addAwardsToDB = async (items) => {
  const client = new MongoClient(uri);
  const dbname = 'Buddy-Data';
  const collection_name = 'Awards';

  const accountsCollection = client.db(dbname).collection(collection_name);

  const connectToDatabase = async () => {
    try {
      await client.connect();
    } catch (err) {
      console.error(`Error connecting to the ${dbname} database`);
    }
  };

  for (let index = 0; index < items.length; index++) {
    try {
      await connectToDatabase();
      const itemInDB = await accountsCollection.findOne({
        novel: items[index].novel,
        award: items[index].award,
        year: items[index].year,
      });

      if (!itemInDB) {
        let result = await accountsCollection.insertOne(items[index]);
        console.log('Award Record Added');
      } else {
        console.log('Award Duplicate Detected');
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    } finally {
      await client.close();
    }
  }
};

const addNovelToDB = async (result) => {
  console.log(
    'adding novel to DB via function ' + result.title + ' ' + result.author
  );
  let openLibraryKey = null;
  let openLibraryCoverId = null;
  let firstSentence = null;
  let firstPublishYear = null;

  let newNovel;

  try {
    const res = await axios.get('https://openlibrary.org/search.json', {
      params: {
        title: result.title,
        author: result.author,
        limit: 1,
      },
    });
    if (res.data.docs[0].key) {
      openLibraryKey = res.data.docs[0].key;
    }
    if (res.data.docs[0].cover_i) {
      openLibraryCoverId = res.data.docs[0].cover_i;
    }
    if (res.data.docs[0].first_sentence) {
      firstSentence = res.data.docs[0].first_sentence[0];
    }
    if (res.data.docs[0].first_publish_year) {
      firstPublishYear = res.data.docs[0].first_publish_year;
    }

    newNovel = {
      title: result.title,
      author: result.author,
      openLibraryKey,
      openLibraryCoverId,
      firstSentence,
      firstPublishYear,
    };
  } catch (error) {
    console.error(error);
  }

  //  Add New Novel Into Database
  const client = new MongoClient(uri);
  const dbname = 'Buddy-Data';
  const collection_name = 'Novels';
  const novelsCollection = client.db(dbname).collection(collection_name);
  let newNovel_ID;

  const connectToDatabase = async () => {
    try {
      await client.connect();
    } catch (err) {
      console.error(`Error connecting to the ${dbname} database`);
    }
  };

  try {
    await connectToDatabase();

    let result = await novelsCollection.insertOne(newNovel);
    console.log('Novel Added To DB' + newNovel.title);
    newNovel_ID = { _id: result.insertedId };
  } catch (err) {
    console.error(`Server Error checking registration info: ${err}`);
  } finally {
    await client.close();
  }

  return newNovel_ID;
};
