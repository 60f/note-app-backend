const pg = require('pg');

const database = new pg.Client({
  user: 'mvlosrzunwlpxc',
  host: 'ec2-52-208-164-5.eu-west-1.compute.amazonaws.com',
  database: 'd132g24aei5268',
  password: 'de923a5e98f505826d2c5290deaaaf821eeafe9c5c2f5ce4f0789cd0402eb95c',
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
