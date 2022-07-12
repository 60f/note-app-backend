const express = require('express');

const {database} = require('../services/database.js');

const router = express.Router();
exports.router = router;

router.get('/', (request, response, next) => {
  console.log('FIXME: Check auth');

  database.query(
    'SELECT * FROM document ORDER BY last_modified_date DESC',
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      response.json(result.rows);
    }
  );
});

router.get('/:id', (request, response, next) => {
  console.log('request.user:', request.user);
  if (!request.user) {
    response.status(401).send();
    return;
  }

  database.query(
    'SELECT * FROM document WHERE id = $1',
    [request.params.id],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      const document = result.rows[0];
      delete document.note_ids; // Internal implementation detail.
      response.json(document);
    }
  );
});

router.post('/', (request, response, next) => {
  console.log('FIXME: Check auth');

  if (typeof request.body !== 'object' || !('name' in request.body)) {
    next('Invalid body');
    return;
  }
  database.query(
    'INSERT INTO document (name, last_modified_date) VALUES ($1, $2)',
    [request.body.name, moment().unix()],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
      response.status(200).send();
    }
  );
});

router.get('/:documentId/notes', (request, response, next) => {
  console.log('FIXME: Check auth');

  database.query(
    'SELECT * FROM note WHERE document_id = $1',
    [request.params.documentId],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }

      const notes = result.rows;

      database.query(
        'SELECT * FROM document WHERE id = $1',
        [request.params.documentId],
        (error, result) => {
          if (error) {
            next(error);
            return;
          }
          if (result.rows.length === 0) {
            response.status(404).send();
            return;
          }

          const noteIds = result.rows[0].note_ids;

          response.json(
            noteIds.map((id) => {
              return notes.find((note) => {
                return note.id === id;
              });
            })
          );
        }
      );
    }
  );
});

router.post('/:documentId/notes', (request, response, next) => {
  console.log('FIXME: Check auth');

  if (
    typeof request.body !== 'object' ||
    !('index' in request.body) ||
    !('text' in request.body)
  ) {
    next('Invalid body');
    return;
  }

  database.query(
    'UPDATE document SET last_modified_date = $2 WHERE id = $1',
    [request.params.documentId, moment().unix()],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }
    }
  );

  database.query(
    'INSERT INTO note (document_id, text) VALUES ($1, $2) RETURNING id',
    [request.params.documentId, request.body.text],
    (error, result) => {
      if (error) {
        next(error);
        return;
      }

      const noteId = result.rows[0].id;

      database.query(
        'SELECT id, note_ids FROM document WHERE id = $1',
        [request.params.documentId],
        (error, result) => {
          if (error) {
            // FIXME: Remove note if this fails.
            next(error);
            return;
          }
          if (result.rows.length === 0) {
            response.status(404).send();
            return;
          }

          const noteIds = result.rows[0].note_ids;
          const newNoteIds = [
            ...noteIds.slice(0, request.body.index),
            noteId,
            ...noteIds.slice(request.body.index),
          ];

          database.query(
            'UPDATE document SET note_ids = $2 WHERE id = $1',
            [request.params.documentId, newNoteIds],
            (error, result) => {
              if (error) {
                next(error);
                return;
              }
              response.status(200).send();
            }
          );
        }
      );
    }
  );
});
