<template>
  <div>
    <img src="./assets/logo.png">
    <h1>Index</h1>
    <router-link to="/two">Page Two</router-link>
  </div>
</template>

<script>
export default {
  name: 'Index',
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
