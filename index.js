'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// Create server
const app = express()
app.use(bodyParser.json())

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
    .then(db => {
        // Routes
        // GET /posts
        app.get('/posts', (req, res) => {
            const post = db.get('posts')
                .value()

            res.send(post)
        })

        // GET /posts/:id
        app.get('/posts/:id', (req, res) => {
            const post = db.get('posts')
                .find({id: req.params.id})
                .value()

            res.send(post)
        })

        // POST /posts
        app.post('/posts', (req, res) => {
            db.get('posts')
                .push(req.body)
                .last()
                .assign({id: Date.now().toString()})
                .write()
                .then(post => res.send(post))
        })

        // Set db default values
        return db.defaults({posts: []}).write()
    })
    .then(() => {
        app.listen(3000, () => console.log('listening on port 3000'))
    })