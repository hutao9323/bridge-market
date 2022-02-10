<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row type="flex" justify="center" align="middle">
          <el-col> logo version:2/10 2.0 </el-col>
          <el-col v-if="baddr">
            <el-button>Home</el-button>
            <el-button>Bridge</el-button>
            <el-button>Market</el-button>
            <el-button>Doc</el-button>
          </el-col>
          <el-col>
            <a href="#">联系方式</a>
            <a href="#">discord</a>
            <a href="#">电报</a>
          </el-col>
          <el-col>
            <p v-if="baddr">
              {{ baddr.substr(0, 6) + "..." + baddr.substr(-4, 4) }}
            </p>
            <p v-else>未链接钱包</p>
          </el-col>
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
      <el-footer>
        <el-col>
          <p>Copyright©2021 Plot Network</p>
          <p>本网站与pancake交易所无关</p>
          <p>保留所有权利</p>
          <p>所有第三方商标是其各自所有者的财产。</p>
        </el-col>
      </el-footer>
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
