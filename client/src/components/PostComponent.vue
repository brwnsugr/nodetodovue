<template>
<div class="container">
  <h1>To Do list!</h1>
  <!---CREATE POST HERE--->
  <div>
    <form v-on:submit.prevent="createPost">
    <label >입력: 제목/내용/마감일(선택)</label>
    <input type="text" v-model="title" placeholder="Create a title">
    <input type="text" v-model="content" placeholder="Create a Contents">
    <input type="date" v-model="deadline" placeholder="Set Deadline">
    <br>
    <p>우선순위(선택)</p>
    <input type="radio" v-model="priority" value="우선순위: 보통" placeholder="우선순위">보통
    <input type="radio" v-model="priority" value="우선순위: 긴급" placeholder="우선순위">긴급
    <input type="radio" v-model="priority" value="우선순위: 낮음" placeholder="우선순위">낮음<br>
    <p>완료유무(선택))</p>
    <input type="radio" v-model="completed" value=1 placeholder="우선순위">완료
    <input type="radio" v-model="completed" value=-1 placeholder="우선순위">미완료 
    <button v-if="this.isEdit==-1" type="submit">제출</button>
    <button v-else type="button" v-on:click.prevent="updatePost()">수정</button>
    </form>
  </div>
  <hr>
  <p class="error" v-if="error">{{error}}</p>
  <div class="post-container">
    <div v-for="post in posts">
    <p class="text3" v-if="getDay(post.deadline)<getToday()">{{post.title}} => 마감일 초과!</p>
  </div>
    <div class="post"
      v-for="post in posts"
      v-bind:item="post"
      v-bind:key="post._id"
    > 
      <p class="text">할 일: {{post.title}} ({{post.priority}})<i v-if="post.completed==1"> => 완료
      </i><b v-else> => 미완료</b></p>
      <p class="text2">내용: {{post.content}}</p>
      <p class="text2" v-if="post.deadline !== ''">마감일: {{post.deadline}}</p>
      <button v-on:click="deletePost(post._id)">삭제</button>
      <button v-on:click="editTodo(post._id, post.title, post.content, post.priroity, post.deadline)">편집</button>
      <button v-on:click="post.completed*=(-1)">완료체크</button>
    </div>
  </div>
  
</div>
</template>

<script>

import PostService from '../PostService';

export default {
  name: 'PostComponent',
  data(){
    return{
      posts:[],
      error: '',
      title: '',
      content: '',
      deadline: '',
      priority:'우선순위: 보통',
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
    //Post Request
    async createPost(){
      await PostService.insertPost({title: this.title, content: this.content, priority: this.priority, deadline: this.deadline, completed: this.completed });//어차피 인자는 text 키값의 벨류
      this.posts = await PostService.getPosts();
    },
    //Delete Request
    async deletePost(id){
      await PostService.deletePost(id);  ''
      this.posts = await PostService.getPosts();
    },

    //Update to request for patching some data at Backend-Side
    async updatePost(){
      await PostService.updatePost(this.id,{title: this.title, content: this.content, priority: this.priority, deadline: this.deadline});
      this.isEdit*=(-1)
      this.posts = await PostService.getPosts();
      console.log([this.id, this.title, this.content, this])
    },
    //when click the edit button for setting the new value 
    editTodo(id, title, content, priority, deadline){
      this.id=id
      this.title=title
      this.priority = priority
      this.deadline = deadline
      this.isEdit*=(-1)
      console.log([this.id, this.title, this.content, this])
    },
    //get Time today(now)
    getToday(){
      var now;
      var date = new Date();
      now = date.getTime()
      return now;
    },
    //Deadline string to time elapsed
    getDay(deadline){
      var elapsed;
      if(deadline!=100){
        elapsed = Date.parse(deadline)
        return elapsed
      }
     }
    
  }
};
</script>

<style scoped>
div.container {
  max-width: 1000px;
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
  padding: 1px 1px 10px 1px;
  margin-bottom: 10px;
}

p.text {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

p.text2 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 0;
}
p.text3{
  font-size: 17px;
  color: red;
}

div.inline{
  display: inline
}
</style>
