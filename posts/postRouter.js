// ? s6 refactor import express
const express = require('express');

// ? s7 import db
const PostDb = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
    PostDb
    .get()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log(error);
        res.status(500).json({error: "The post could not be retrieved"})
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    PostDb
    .getById(id)
    .then(post => {
        console.log('post', post)
        if(post) {
            res.status(200).json({success: post})
        } else {
            res.status(404).json({ message: `The post with the specified ID ${id} does not exit.`})
        }
    })
    .catch(err => {
        res.status(500).json({err: `The user information could not be retrieved.`})
    }) 
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    PostDb
    .remove(id)
    .then(() => res.status(204).end())
    .catch(err => {
        console.log(err)
        res.status(500).json({error: `The user with the specified ID ${id} does not exist.`})
    })
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    PostDb.update(id, changes)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post could not be found."})
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "error updating the hub."
        })
    })
});

// custom middleware

function validatePostId(req, res, next) {

};

module.exports = router;