const express = require('express'); // express framework을 갖고 오기
const bodyParser = require('body-parser');
const cors = require('cors'); // 

const app = express(); // Middleware사용을 위한 express Constructor로부터  app instance 생성

app.use(bodyParser.json()); // request.body를 json형식으로 변환해줌
app.use(cors()); // 클라이언트 요청과 서버의 도메인이 다를 때 이를 허용해주는 미들웨어

const posts = require('./routes/posts')
//~~~/api/posts가 해당 posts 모듈에서의 기본 시작 주소가 됨
app.use('/api/posts', posts); // 라우팅 

//Handle Production(성능을 향상시키기 위함)
if(process.env.NODE_ENV=== 'production'){
    //Static folder
    app.use(express.static(__dirname + '/public'));

    //Handle Single Page Application(Any Route at all)
    app.get(/.*/, (req, res)=> res.sendFile(__dirname + '/public/index/html'));
}

const port = process.env.PORT || 5000;


app.listen(port, ()=>{
    console.log(`Server started on port${port}`)
});