<template>
  <div id="app">
    <Example/>
    <hr>
    <BaiduExample />
  </div>
</template>

<script>
import Example from './components/Example.vue'
import BaiduExample from "@/components/BaiduExample";

export default {
  name: 'App',
  components: {
    BaiduExample,
    Example
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
