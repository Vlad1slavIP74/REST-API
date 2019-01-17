// Load the MySQL pool connection
const pool = require('../data/config');

// Route the app
const router = app => {
  // Display welcome message on the root
  app.get('/', (request, response) => {
    response.send({
      message: 'Welcome to the Node.js Express REST API!'
    });
  });

  // Display all users
  app.get('/theme', (request, response) => {
    pool.query('SELECT * FROM theme', (error, result) => {
      if (error) throw error;

      response.send(result);
    });
  });

  app.get('/theme/:id', (request, response) => {
    const id = request.params.id;

    pool.query('SELECT * FROM theme WHERE themeid = ?', id, (error, result) => {
      if (error) throw error;

      const votes = {
        yes: result[0].votes_yes,
        no: result[0].votes_no
      };

      delete result[0].themeid;
      delete result[0].votes_yes;
      delete result[0].votes_no;

      result[0].votes = votes;


      response.send(JSON.stringify(result[0]));
    });
  });


  app.post('/theme', (request, response) => {

    if (request.body.name.length > 1024) {
      const err =  JSON.stringify(
        '{ error: "Name length can not begreater then 1024" }');
      response.status(400).send(err);
    } else {
      const name = request.body.name;
     const strName = name.toString();
// INSERT INTO `theme` (name) SELECT * FROM (SELECT 'asd') AS tmp WHERE NOT EXISTS (SELECT (name) FROM `theme` WHERE (name) = asd) LIMIT 1
      pool.query('INSERT INTO `theme` (name) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS (SELECT (name) FROM `theme` WHERE (name) = ?) LIMIT 1', [strName,strName],
                    (error, result) => {
        if (error) throw error;

        const ok = {
          error: null,
          themeid: result.insertId
        };
        if (result.insertId != 0) {
          response.status(201).send(JSON.stringify(ok, "" , 4));
        }
        else {
          response.send(JSON.stringify("There is a same theme"))
        }

      });
    }
  });
  app.post('/theme/:id/yes', (request, response) => {
    const id = request.params.id;



    pool.query('UPDATE theme SET votes_yes = votes_yes+1 WHERE themeid = ?',
      id, (error, result) => {
        if (error) throw error;

        response.send(JSON.stringify("OK"));
      });

  });

  app.post('/theme/:id/no', (request, response) => {
    const id = request.params.id;


    pool.query('UPDATE theme SET votes_no = votes_no+1 WHERE themeid = ?',
      id, (error, result) => {
        if (error) throw error;

        response.send(JSON.stringify("OK"));
      });

  });

  app.use((err, req, res, next) => {
    //console.log('Error');
    res.status(500).send('Internal Server Error');
  });

};

// Export the router
module.exports = router;
