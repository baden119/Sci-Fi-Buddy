/*
This utility programme will populate a MongoDB Database with novel and award data taken from Wikipedia.
i.e https://en.wikipedia.org/wiki/Hugo_Award_for_Best_Novel
The table found at the page above is converted into a .csv file using standard spreadsheet software and kept in the /raw_data folder.

Two collections will be created in the database:
    'Novels' will contain info on a specific novel i.e:

        {"_id": 6509249f6b824c2858a23cf5,
        "title":"Dune",
        "author":"Frank Herbert",
        "openLibraryKey":"/works/OL893415W",
        "openLibraryCoverId": 11481354,
        }
    
    Note the Open Library (https://openlibrary.org/) Key and CoverId which are used by the app.

    'Awards' will contain records of nominees and winners of each years award i.e:

        {"_id": 650924ad6b824c2858a23cfd
        ,"award":"Hugo",
        "year":"1966",
        "winner":true,
        "novel": 6509249f6b824c2858a23cf5
        }


File selection and DB specifications are configured manually, and the programme will run as follows:

- Read raw novel and award data from .csv file and convert into an array of 'Award' objects.

- Format each 'Award' object to remove unwanted characters (i.e parenthesis) and include a "winner" field. 

- Iterate through the array and check if the novel in the object is already in 'Novels' Database collection. If it is then get its Database ID, and if its not then add it to the Database (This process requires querying the openlibrary.org API to pull Key and CoverId data). 

- Add these 'Award' objects to the 'Award' DB collection.

*/

// File selection and DB Specification configuration:
const { uri } = require('atlas_uri.js');

const rawDataFileName = './raw_data/BSFA_Award_for_Best_Novel_complete2023.csv';
const award = 'BSFA Award for Best Novel';

// Import 3rd party Packages
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

// Define Functions

const readRawData = (rawDataFileName) => {
  return new Promise((resolve, reject) => {
    const newData = [];
    fs.createReadStream(rawDataFileName)
      .pipe(csv())
      .on('data', (data) => newData.push(data))
      .on('end', () => {
        resolve(newData);
      });
  });
};

const formatData = (data) => {
  const formattedData = [];
  for (let index = 0; index < data.length; index++) {
    let Winner;
    if (data[index].Author.charAt(data[index].Author.length - 1) === '*') {
      Winner = true;
      data[index].Author = data[index].Author.slice(0, -1);
    } else {
      Winner = false;
    }
    if (data[index].Novel && data[index].Author) {
      const novelData = {
        title: data[index].Novel.replace(/\[.*?\]/g, ''),
        author: data[index].Author.replace(/\[.*?\]/g, ''),
        year: data[index].Year,
        winner: Winner,
        award,
      };

      formattedData.push(novelData);
    }
  }
  return formattedData;
};

const queryDBforNovels = async (novelsArray, client) => {
  const addNovelToDB = async (novel, collection) => {
    // Initilise vairables
    let openLibraryKey = null;
    let openLibraryCoverId = null;
    let newNovel;

    // Get novel Data from Open Library API
    try {
      const res = await axios.get('https://openlibrary.org/search.json', {
        params: {
          title: novel.title,
          author: novel.author,
          limit: 1,
        },
      });

      if (!res.data.docs[0]) {
        console.log(
          'Novel not found in OpenLibrary, skipping...' +
            novel.title +
            novel.author
        );
        return false;
      }

      if (res.data.docs[0].key) {
        openLibraryKey = res.data.docs[0].key;
      }
      if (res.data.docs[0].cover_i) {
        openLibraryCoverId = res.data.docs[0].cover_i;
      }

      newNovel = {
        title: novel.title,
        author: novel.author,
        openLibraryKey,
        openLibraryCoverId,
      };
    } catch (err) {
      `Error Querying OpenLibrary API: ${err}`;
    }

    //  Add New Novel Into Database
    let newNovel_ID;
    try {
      let result = await collection.insertOne(newNovel);
      console.log(
        `Novel Record Added: ${newNovel.title} by ${newNovel.author}`
      );
      newNovel_ID = { _id: result.insertedId };
    } catch (err) {
      console.error(`Error Adding Novel to DB: ${err}`);
    }
    return newNovel_ID;
  };

  const dbname = 'Buddy-Data';
  const collection_name = 'Novels';
  const awardItemsWithDB_ID = [];

  try {
    await client.connect();
    const collection = client.db(dbname).collection(collection_name);
    for (let index = 0; index < novelsArray.length; index++) {
      let novelInDB = await collection.findOne({
        title: novelsArray[index].title,
      });
      if (novelInDB)
        console.log(
          `Novel already in DB: ${novelsArray[index].title} by ${novelsArray[index].author}`
        );
      if (!novelInDB) {
        novelInDB = await addNovelToDB(novelsArray[index], collection);
      }
      if (novelInDB) {
        awardItemsWithDB_ID.push({
          award,
          year: novelsArray[index].year,
          winner: novelsArray[index].winner,
          novel: novelInDB._id,
        });
      }
    }
  } catch (err) {
    console.error(`Error Checking DB for Novel: ${err}`);
  } finally {
    await client.close();
  }
  return awardItemsWithDB_ID;
};

const addAwardsToDB = async (awardsArray, client) => {
  const dbname = 'Buddy-Data';
  const collection_name = 'Awards';

  try {
    await client.connect();
    const collection = client.db(dbname).collection(collection_name);
    for (let index = 0; index < awardsArray.length; index++) {
      const itemInDB = await collection.findOne({
        novel: awardsArray[index].novel,
        award: awardsArray[index].award,
        year: awardsArray[index].year,
      });

      if (!itemInDB) {
        await collection.insertOne(awardsArray[index]);
        console.log('Award Record Added');
      } else {
        console.log('Award Duplicate Detected');
      }
    }
  } catch (err) {
    console.error(`Error Adding Award to DB: ${err}`);
  } finally {
    await client.close();
  }
  console.log('Records Added Succesfully');
};

// Set up Async Functions
const runAsync = async (client) => {
  const data = await readRawData(rawDataFileName);
  const formattedData = formatData(data);
  const arrayWithNovelIDs = await queryDBforNovels(formattedData, client);
  await addAwardsToDB(arrayWithNovelIDs, client);
};

// Run Async Functions
runAsync(client);
