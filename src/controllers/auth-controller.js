const express = require('express');
const passport = require('passport');

const router = express.Router();
exports.router = router;

router.post(
  '/login',
  passport.authenticate('local-login', {
    failureMessage: true,
  }),
  (request, response) => {
    response.status(200).send();
  }
);

router.post('/logout', (request, response) => {
  request.logout({}, (error) => {
    if (error) {
      next('Could not log out');
    } else {
      response.status(200).send();
    }
  });
});

router.post('/signup', (request, response, next) => {
  if (
    typeof request.body !== 'object' ||
    !('username' in request.body) ||
    !('password' in request.body)
  ) {
    next('Invalid body');
    return;
  }

  const hashedPassword = bcrypt.hashSync(
    request.body.password,
    bcrypt.genSaltSync(8),
    null
  );
  database.query(
    'INSERT INTO public.user (username, hashed_password) VALUES ($1, $2)',
    [request.body.username, hashedPassword.toString()],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      response.status(200).send();
    }
  );
});
