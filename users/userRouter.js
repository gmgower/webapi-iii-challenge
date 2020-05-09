// const express = 'express';
// ? s6 refactor
const express = require('express');
// ? s7 import db
const UsersDb = require('./userDb')
const PostDb = require('../posts/postDb')
// ? s8
const router = express.Router();

router.post('/', validateUser,(req, res) => {
    const userInfo = req.body;
    const {name} = req.body
    if(!name) {
        res.status(400).json({error: "Please provide name for the post"})
    } else {
    UsersDb.insert(userInfo)
    .then(user => {
        res.status(201).json({ success: user})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "There was an error while saving the post to the database"})
    })
}
});

router.post('/:id/posts', validateUserId, (req, res) => {
    const postInfo = {...req.body, user_id: req.params.id}
    console.log(postInfo);
    console.log(req.body)
    PostDb.insert(postInfo)
    .then(post => {
        res.status(210).json(post)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: "Error getting the post for the database"
        })
    })
});

// ? s10
router.get('/',  (req, res) => {
    UsersDb
    .get()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res
        .status(500)
        .json({error: 'The users information could not be retrieved.', err})
    });
});

// ? s11
router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id;

    UsersDb
    .getById(id)
    .then(user => {
        console.log('user', user)
        if(user) {
            res.status(200).json({success: user}) 
        } else {
            res
            .status(404)
            .json({
                success: false,
                message: `The user with the specified ID ${id} does not exist.`
            })
        }
    })
    .catch(err => {
        res
        .status(500)
        .json({err: `THE user information could not be retrieved.`, err})
    })
});

router.get('/:id/posts', validateUserId, validatePost, (req, res) => {
    const {id} = req.params;
    UsersDb.getUserPosts(id)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({error: `The user information could not be retrieved.`, err})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    const {id} = req.params;
    UsersDb
    .remove(id)
    .then(() => res.status(204).end())
    .catch(err => {
        console.log(err);
        res.status(500).json({error: `The user with the specified ID ${id} does not exist.`})
    })
});

router.put('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    UsersDb.update(id, changes)
    .then(user => {
        if (user) {
        res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'The user could not be found.'})
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error updating the hub.", 
        })
    })
 });

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    UsersDb.getById(id)
    .then(user => {
        console.log(user)        
        if(user) {
         req.user = user;
         next()
        } else {
          res.status(400).json({error: `User with ${id} does not exist.`})
        }
    })

};

function validateUser(req, res, next) {
    // if(!req.body) {
    //     res.status(400).json({message: "missing user data"})
    // }
    // if(!req.body.name) {
    //     res.status(400).json({message: "missing required name field."})
    // }

    const {name} = req.body;
    if(!name) {
        return res.status(400).json({error: "missing user data."})
    }
    if(typeof name !== 'string') {
        return res.status(400).json({error: "Missing required name field."})
    }
    req.body = {name};
    next();
};

function validatePost(req, res, next) {
    if(!req.body){
        res.status(400).json({ message: 'Missing post data'})
    }
    if(!req.body.text){
        res.status(400).json({ message: 'Missing required text field'})
    }
    next();
};

module.exports = router;
