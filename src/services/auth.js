const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const {database} = require('./database.js');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  'local-login',
  new LocalStrategy(
    {usernameField: 'username', passwordField: 'password'},
    (username, password, callback) => {
      database.query(
        'SELECT * FROM public.user WHERE username = $1',
        [username],
        (error, result) => {
          if (error) {
            return callback(error);
          }
          const user = result.rows[0];
          if (!user) {
            return callback(null, false, {
              message: 'Incorrect username or password.',
            });
          }

          if (!bcrypt.compareSync(password, user.hashed_password)) {
            return callback(null, false, {
              message: 'Incorrect username or password.',
            });
          }
          return callback(null, user);
        }
      );
    }
  )
);
