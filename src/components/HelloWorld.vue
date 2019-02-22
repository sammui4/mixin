<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>{{num}}</h2>
    <ul>
      <li>
        <router-link to="/int">int</router-link>
      </li>
      <li>
        <router-link to="/one">one</router-link>
      </li>
      <li>
        <router-link to="/wordPiece">wordPiece</router-link>
      </li>
      <input type="file" value="" accept="image/*" id="file"  v-on:change='onUpload($event)' capture multiple="multiple">

    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '老衲',
      marriage_list:[]
    }
  },
  method:{
    onUpload(e){
      let array = []
        for(let i=0;i<e.target.files.length;i++){
          let formData = new FormData();
          formData.append('file',e.target.files[i]);
          array.push(formData)
        }
        let pool = array.map(params =>{
          return this.uploadImg(params)
        })
        Promise.all(pool).then((data)=>{
          this[arr].push(...data);
        }).catch((e)=>{
          this.$vux.toast.text(e.message, 'top')
        }).finally(()=>{
          this.$vux.loading.hide()
        })
    },
    uploadImg(formData){
      return this.$http.post("/mgr/upload", formData).then(({ data }) => {
            return data
        })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
