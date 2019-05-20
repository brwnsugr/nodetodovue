const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

//Get posts
router.get('/', async (req,res)=>{
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray()); // return all the things from posts
});
//Add posts
router.post('/', async (req, res)=>{
    const posts = await loadPostsCollection();
    await posts.insertOne({
        title: req.body.title,
        content: req.body.content,
        priority: req.body.priority,
        deadline: req.body.deadline,
        completed: req.body.completed,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    res.status(201).send();
});
//Delete post
router.delete('/:id', async (req, res)=>{
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
    res.status(200).send();
});
//Update post
router.patch('/:id', async (req, res)=>{
    const posts = await loadPostsCollection();
    var title = req.body.title;
    var content = req.body.content;
    var priority = req.body.priority;
    var deadline = req.body.deadline;
    var ObjectId = require('mongodb').ObjectID;
    var doc ={
        "$set":{
            "title": title,
            "content": content,
            "priority": priority,
            "deadline": deadline
        }
    };
    posts.updateOne({"_id":ObjectId(req.params.id)},doc);
});
async function loadPostsCollection(){
    const client = await mongodb.MongoClient.connect(('mongodb+srv://test:test1234@todolee-nswhz.mongodb.net/test?retryWrites=true')
        , {useNewUrlParser: true});
    return client.db('vue_express').collection('posts');
} 
 
module.exports = router;