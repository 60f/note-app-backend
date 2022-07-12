const express = require('express');

const {database} = require('../services/database.js');

const router = express.Router();
exports.router = router;

router.get('/:id', (request, response, next) => {
  console.log('FIXME: Check auth');

  database.query(
    'SELECT * FROM note WHERE id = $1',
    [request.params.id],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      if (result.rows.length === 0) {
        response.status(404).send();
        return;
      }
      response.json(result.rows);
    }
  );
});

router.delete('/:id', (request, response, next) => {
  console.log('FIXME: Check auth');

  database.query(
    `UPDATE document
    SET last_modified_date = $2
    FROM note
    WHERE note.id = $1 AND document.id = note.document_id`,
    [request.params.id, moment().unix()],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
    }
  );

  database.query(
    'UPDATE note SET deleted = TRUE WHERE id = $1',
    [request.params.id],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      response.status(200).send();
    }
  );
});
