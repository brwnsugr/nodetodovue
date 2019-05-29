import axios from 'axios'; // 먼저 

const url = 'api/posts/';

class PostService{
    //Get Posts, static 붙이면 instance화 할 필요없이 다이렉트로 method 이용 가능 
    static getPosts(){
        return new Promise(async(resolve,reject)=>{
            try{
                const res = await axios.get(url); // axios 패키지를 통해 http통신을 할 수 있음, 서버에 요청 보낼 수 있음
                const data = res.data; // 서버로부터 얻은 res.data를 data변수에 넣음
                resolve(
                    data.map(post=>({ // 만약 성공했으면, .map method를 통해 post array 반환
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }))
                );
            } catch(err){
                reject(err);
            }
        })
    }
    //Create todo
    static insertPost(todo){ // Client단에서 받은 todo를 axios패키지를 통해 서버로 요청 보냄
        return axios.post(url, todo);
    }
    //Delete todo
    static deletePost(id){
        return axios.delete(`${url}${id}`)
    }
    //Update Todo
    static updatePost(id, todo){
        return axios.patch(`${url}${id}`, todo)
    }
}

export default PostService

