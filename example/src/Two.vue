<template>
  <div>
    <img src="./assets/logo.png">
    <h1>Page Two</h1>
    <router-link to="/">Index</router-link>
  </div>
</template>

<script>
export default {
  name: 'Two',
}
</script>

<style>
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
