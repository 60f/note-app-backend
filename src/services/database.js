const pg = require('pg');

const database = new pg.Client({
  user: 'ryqaxqoybdmbez',
  host: 'ec2-54-228-32-29.eu-west-1.compute.amazonaws.com',
  database: 'd4i7htb4q1ds02',
  password: '5e0581fce574e8e17bf9e39693950e56b97792909084ca3e7040ac322f79620d',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

exports.database = database;

database.connect((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Connected to database');
  }
});
