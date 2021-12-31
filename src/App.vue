<template>
  <div id="app">
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="18">
        <Connect />
      </el-col>
    </el-row>
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
