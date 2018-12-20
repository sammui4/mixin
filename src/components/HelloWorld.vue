<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

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
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '老衲',

    }
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
