// npm install
// yarn add express

// libraries
const express = require('express');

// other files
const db = require('./data/hubs-model.js');

// global objects
const server = express();

// middleware <= this is needed when you want to use `post`
server.use(express.json());

// request handler GET -- takes 2 arguments -- route and callback
server.get('/', (req, res) => {
    // what is the datatype? -- automatically detect (like <h1></h1> or JS)
    // what is my status code? -- automatically assume 200 if you don't define
    // what am I sending back?
    res.send('<h2>Hello World</h2>');
})

// GET - date -- Date is a global object
server.get('/now', (req, res) => {
    const now = new Date().toISOString();
    res.send(now);
})

// `npm run server` -- nodemon will refresh the server (don't have to `node index.js` everyday you change anything)

// GET /hubs -- will work with asyn
server.get('/hubs', (req, res) => {
    db.find()
        .then(hubs => {
            // console.log('hubs: ', hubs);
            res.json(hubs);
        })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: 'failed to get hubs'
            });
        });
});

// POST /hubs
server.post('/hubs', (req, res) => {
    // req.body is not automatically defined so we need a middleware
    const newHub = req.body;
    // validate the hub
    db.add(newHub)
        .then(hub => {
            res.status(201).json(hub);
        })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: 'failed to create new hub'
            });
        });
});

// DESTORY /hubs/:id
server.delete('/hubs/:id', (req, res) => {
    const { id } = req.params;
    // deconstructing : const id = req.params.id;
    db.remove(id)
        .then(deletedHub => {
            if (deletedHub) {
                res.json(deletedHub)
            } else {
                res.status(404).json({
                    message: 'invalid hub id'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: 'failed to destroy hub'
            });
        });
});

// PUT /hubs/:id
server.put('/hubs/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db.update(id, changes)
        .then(updated => {
            if (updated) {
                res.json(updated)
            } else res.status(404).json({
                message: 'invalid hub id'
            })
        })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: 'failed to update hub'
        });
    });
})

// specific id
server.get('/hubs/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(hub => {
            if (hub) {
                res.json(hub);
            } else {
                res.status(404).json({
                    message: 'failed to get hub'
                })
            }
        })
        .catch(err =>{
            res.status(500).json({
                err: err,
                message: 'failed to update hub'
        });
    });
})

// should be the last step
server.listen(4000, () => {
    console.log('Server is running on port 4000...');
});