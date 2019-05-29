const express = require('express');
const mongodb = require('mongodb'); // 라우팅 작업 및 DB 연동  

const router = express.Router(); // express.Router생성자를 이용하여 router instance 생성

//Get posts
router.get('/', async (req,res)=>{
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray()); // return all the things from posts
});
//Add posts
router.post('/', async (req, res)=>{
    const posts = await loadPostsCollection(); // 먼저 post를 불러온 후 
    await posts.insertOne({
        title: req.body.title,
        content: req.body.content,
        priority: req.body.priority,
        deadline: req.body.deadline,
        completed: req.body.completed,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    res.status(201).send(); // 해당 http get 요청에 대해 성공적으로 처리 
});
//Delete post
router.delete('/:id', async (req, res)=>{
    const posts = await loadPostsCollection(); // 먼저 포스트를 불러온 후,
    await posts.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
    res.status(200).send(); // 삭제 요청이 성공적으로 완료되었을 때 
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
        "$set":{ // 이렇게 $set을 해줘야, 다른 원소들은 그대로 유지하면서 변경내용만 수정할 수 있음 
            "title": title,
            "content": content,
            "priority": priority,
            "deadline": deadline
        }
    };
    posts.updateOne({"_id":ObjectId(req.params.id)},doc);
});
async function loadPostsCollection(){ // post갖고 오는 프로미스 함수 선언
    const client = await mongodb.MongoClient.connect(('mongodb+srv://test:test1234@todolee-nswhz.mongodb.net/test?retryWrites=true')
        , {useNewUrlParser: true}); // monogodb에 연결한 후, 이를 client 변수로 받아줌
    return client.db('vue_express').collection('posts'); // client변수의 db와 collection을 선언
} 
 
module.exports = router;