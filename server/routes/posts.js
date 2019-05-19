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
    console.log(req.body.title);
});
//Delete post
router.delete('/:id', async (req, res)=>{
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
    res.status(200).send();
    console.log(posts.deleteOne({_id: new mongodb.ObjectId(req.params.id)}))
});

//Update post
router.patch('/:id', async (req, res)=>{
    const posts = await loadPostsCollection();
    var title = req.body.title;
    var content = req.body.content;
    var doc ={
        "$set":{
            title: title,
            content: content
        }
    };
    posts.updateOne({"_id":req.params.id},doc);
    console.log(["updated"], doc);
});

async function loadPostsCollection(){
    const client = await mongodb.MongoClient.connect(('mongodb://localhost')
        , {useNewUrlParser: true});
    return client.db('vue_express').collection('posts');
} 
 
module.exports = router;