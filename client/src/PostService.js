import axios from 'axios';

const url = 'api/posts/';

class PostService{
    //Get Posts, static 붙이면 instance화 할 필요없이 다이렉트로 method 이용 가능 
    static getPosts(){
        return new Promise(async(resolve,reject)=>{
            try{
                const res = await axios.get(url);
                const data = res.data;
                resolve(
                    data.map(post=>({
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
    static insertPost(todo){
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

