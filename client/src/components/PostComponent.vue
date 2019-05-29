<template>
<div class="container">
  <h1>To Do list!</h1>
  <!---CREATE POST HERE--->
  <div>
    <form v-on:submit.prevent="createPost"> <!----v-on을 사용하여 Vue Instance에 'createPost'Method를 호출하는 이벤트 리스너 첨부 --->
    <label >입력: 제목/내용/마감일(선택)</label>
    <input type="text" v-model="title" placeholder="Create a title">
    <input type="text" v-model="content" placeholder="Create a Contents">
    <input type="date" v-model="deadline" placeholder="Set Deadline">
    <br>
    <p>우선순위(선택)</p><!---v-model은 양식에 대한 입력과 앱 상태를 양방향으로 바인딩함-->
    <input type="radio" v-model="priority" value="우선순위: 보통" placeholder="우선순위">보통
    <input type="radio" v-model="priority" value="우선순위: 긴급" placeholder="우선순위">긴급
    <input type="radio" v-model="priority" value="우선순위: 낮음" placeholder="우선순위">낮음<br>
    <p>완료유무(선택))</p>
    <input type="radio" v-model="completed" value=1 placeholder="우선순위">완료
    <input type="radio" v-model="completed" value=-1 placeholder="우선순위">미완료 
    <button v-if="this.isEdit==-1" type="submit">제출</button>
    <button v-else type="button" v-on:click.prevent="updatePost()">수정(변경 사항 위 폼에 입력 후 클릭 후 새로고침하면 적용!)</button>
    </form>
  </div>
  <hr>
  <p class="error" v-if="error">{{error}}</p>
  <div class="post-container"> <!---v-bind: 이 요소의 item을 Vue instance의 post속성으로 최신 상태를 유지, v-for에는 v-bind가 필수 --->
    <div 
    v-for="post in posts"
    v-bind:item="post"
    v-bind:key="post._id"
    >
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
      <button v-on:click="editTodo(post._id, post.title, post.content, post.priroity, post.deadline)">편집모드</button>
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
    try{ //PostService 클래스에서 method를 static으로 선언했기 때문에 바로 getPost()를 쓸 수 있음 
      this.posts = await PostService.getPosts(); //getPosts 매쏘드를 실행 후 return 값을 posts에 넣어줌 
    } catch(err){
      this.error = err.message;
    }
  },
  methods:{
    //Post Request
    async createPost(){ //여기서의 this는 Vue Component를 뜻함, 즉 input값에 바로 입력한 value들이 되겠다.
      await PostService.insertPost({title: this.title, content: this.content, priority: this.priority, deadline: this.deadline, completed: this.completed });//어차피 인자는 text 키값의 벨류
      this.posts = await PostService.getPosts(); // insertPost 가 성공하면, Vue Component의 posts 배열에 getPosts()한 값의 리턴 값을 돌려줌
    },
    //Delete Request
    async deletePost(id){
      await PostService.deletePost(id);  
      this.posts = await PostService.getPosts();
    },

    //Update to request for patching some data at Backend-Side
    async updatePost(){
      await PostService.updatePost(this.id,{title: this.title, content: this.content, priority: this.priority, deadline: this.deadline});
      this.isEdit*=(-1)
      this.posts = await PostService.getPosts();
    },
    //when click the edit button for setting the new value 
    editTodo(id, title, content, priority, deadline){
      this.id=id
      this.title=title
      this.priority = priority
      this.deadline = deadline
      this.isEdit*=(-1)
    },
    //get Time today(now)
    getToday(){
      var now;
      var date = new Date(); //date라는 instance생성
      now = date.getTime()
      return now;
    },
    //Deadline string to time elapsed
    getDay(deadline){
      var elapsed;
      if(deadline!=100){
        elapsed = Date.parse(deadline) // deadline을 parsing해서 시간화 시킴 
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
