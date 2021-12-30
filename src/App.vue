<template>
  <div id="app">
    <Connect />
  </div>
</template>

<script>
import Connect from "./components/Connect.vue";

export default {
  name: "App",
  components: {
    Connect,
  },
};
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
