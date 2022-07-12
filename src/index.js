const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
// Need to import to initialize passport config.
require('./services/auth.js');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // One day.
    },
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./controllers/auth-controller.js').router);
app.use('/users', require('./controllers/users-controller.js').router);
app.use('/documents', require('./controllers/documents-controller.js').router);
app.use('/notes', require('./controllers/notes-controller.js').router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
