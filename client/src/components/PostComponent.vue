<template>
<div class="container">
  <h3>To Do list (제목/내용/마감일 입력)</h3>
  <!---CREATE POST HERE--->
  <div class="create-post">
    <form v-on:submit.prevent="createPost">
    <label for="create-post">제목/내용/마감일(선택)</label>
    <input type="text" id="create-post" v-model="title" placeholder="Create a title">
    <input type="text" id="create-post" v-model="content" placeholder="Create a Contents">
    <input type="date" id="create-post" v-model="deadline" placeholder="Set Deadline">
    <br>
    <p>우선순위(선택)</p>
    <input type="radio" id="create-post" v-model="priority" value="우선순위: 보통" placeholder="우선순위">보통
    <input type="radio" id="create-post" v-model="priority" value="우선순위: 긴급" placeholder="우선순위">긴급
    <input type="radio" id="create-post" v-model="priority" value="우선순위: 낮음" placeholder="우선순위">낮음<br>
    <p>완료유무(선택))</p>
    <input type="radio" id="create-post" v-model="completed" value=1 placeholder="우선순위">완료
    <input type="radio" id="create-post" v-model="completed" value=-1 placeholder="우선순위">미완료 
    <button v-if="this.isEdit==-1" type="submit">제출</button>
    <button v-else type="button" v-on:click.prevent="updatePost()">수정</button>
    </form>
  </div>
  <hr>
  <p class="error" v-if="error">{{error}}</p>
  <div class="post-container">
    <div v-for="post in posts">
    <p class="text" v-if="getDay(post.deadline)<getToday()">{{post.title}} 마감일 초과!</p>
  </div>
    <div class="post"
      v-for="post in posts"
      v-bind:item="post"
      v-bind:key="post._id"
    > 
    {{`${post.createdAt.getDate()}/${post.createdAt.getMonth()}/
    ${post.createdAt.getFullYear()}`}}
      <p class="text">{{post.priority}}</p>
      <p class="text">{{post.title}}</p>
      <p class="text">{{post.content}}</p>
      <p v-if="post.completed==1">완료</p>
      <p v-else>미완료</p>
      <p class="text" v-if="post.deadline !== null">마감일/{{post.deadline}}</p>
      <button v-on:click="deletePost(post._id)">삭제</button>
      <button v-on:click="editTodo(post._id, post.title, post.content)">편집</button>
      <button v-show="post.isEdit===1" @click="post.isEdit*=(-1)">취소</button>
      <button v-on:click="post.completed*=(-1)">완료체크</button>
    </div>
  </div>
  
</div>
</template>

<script>
//import axios from 'axios';
import PostService from '../PostService';
//const url = 'http://localhost:5000/api/posts/';
export default {
  name: 'PostComponent',
  data(){
    return{
      posts:[],
      error: '',
      title: '',
      content: '',
      deadline: 100,
      priority:'보통',
      completed:-1,
      isEdit:-1,
    }
  },
  async created(){
    try{
      this.posts = await PostService.getPosts(); //PostService 클래스에서 method를 static으로 선언했기 때문에 바로 getPost()를 쓸 수 있음 
    } catch(err){
      this.error = err.message;
    }
  },
  methods:{
    async createPost(){
      await PostService.insertPost({title: this.title, content: this.content, priority: this.priority, deadline: this.deadline, completed: this.completed });//어차피 인자는 text 키값의 벨류
      this.posts = await PostService.getPosts();
    },

    async deletePost(id){
      await PostService.deletePost(id);  ''
      this.posts = await PostService.getPosts();
    },

    //update post(working on)
    async updatePost(){
      await PostService.updatePost(this.id,{title: this.title, content: this.content});
      this.posts = await PostService.getPosts();
      console.log([this.id, this.title, this.content, this])
    },

    editTodo(id, title, content){
      this.id=id
      this.title=title
      this.isEdit*=(-1)
      console.log([this.id, this.title, this.content, this])
    },

    getToday(){
      var now;
      var date = new Date();
      now = date.getTime()
      return now;
    },

    getDay(deadline){
        var elapsed;
        if(deadline!=100){
          elapsed = Date.parse(deadline)
          return elapsed
        }
        // if(deadline !== 100){
        //   day = deadline[9]*1 + deadline[8]*10
        // } 
        // return day
     }
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.container {
  max-width: 800px;
  margin: 0 auto;
}

p.error {
  border: 1px solid #ff5b5f;
  background-color: #ffc5c1;
  padding: 10px;
  margin-bottom: 15px;
}

div.post {
  position: relative;
  border: 1px solid #5bd658;
  background-color: #bcffb8;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

div.created-at {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px 15px 5px 15px;
  background-color: darkgreen;
  color: white;
  font-size: 13px;
}

p.text {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}
</style>
