##nodejs+express+mongodb+vuejs Full Stack Todolist Application##
1. Setting
    코드 다운 후 Terminal의 해당 디렉토리에서 아래 명령어 실행
    $ npm install ###필요한 패키지 설치###
    $ cd client   ###클라이언트(프론트엔드) 폴더로 이동###
    $ npm run build 

2. 배포
    - Heroku 등 원격 배포로 사용할 경우
    그대로 해당 디렉토리를 git push heroku
    
    - 로컬호스트(내컴퓨터)에서 그대로 사용할 경우
    client/src/PostService.js 파일에서 const url = 'api/posts/'; url 주소를 http:localhost:5000/api/posts/로 변경 
    
3. DB 수정을 원할 경우 
    server/routes/posts.js 파일에서 line 50에서의 connect method 내 argument를 연결하고자 하는 DB 주소로 변경할 것 

   
