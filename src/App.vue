<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row type="flex" justify="center" align="middle">
          <el-col> logo version:1/14 4.0 </el-col>
          <el-col :lg="10" :md="10" :sm="10" :xs="10"></el-col>
          <!-- <el-col><SelectCoin /></el-col> -->
          <el-col>
            <p v-if="baddr">
              {{ baddr.substr(0, 6) + "..." + baddr.substr(-4, 4) }}
            </p>
            <p v-else>未链接钱包</p>
          </el-col>
          <el-col>
            <a href="https://pbmarket.onrender.com" target="_blank"
              ><el-button>market</el-button></a
            ></el-col
          >
        </el-row>
      </el-header>
      <el-main>
        <el-row type="flex" justify="center" align="middle">
          <el-col :lg="18" :md="20" :sm="22" :xs="24">
            <Connect />
            目前网站不支持自动刷新,操作交易确认后请手动刷新
          </el-col>
        </el-row>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import Connect from "./components/Connect.vue";
import { mapState } from "vuex";
export default {
  name: "App",
  components: {
    Connect,
  },
  computed: mapState({
    baddr: "baddr",
  }),
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
