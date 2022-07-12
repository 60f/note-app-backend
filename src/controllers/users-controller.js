const express = require('express');
const bcrypt = require('bcrypt');

const {database} = require('../services/database.js');

const router = express.Router();
exports.router = router;
