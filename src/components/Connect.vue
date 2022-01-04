<template>
  <el-col>
    <el-col v-if="!baddr" class="user">
      <el-button round @click="connect" class="connect">
        connect wallet
      </el-button>
    </el-col>
    <el-col v-else class="user">
      <el-tabs type="border-card">
        <p>
          <span>{{ baddr.substr(0, 6) + "..." + baddr.substr(-4, 4) }}</span>
        </p>
        <el-tab-pane label="Market"><SaleList /></el-tab-pane>
        <el-tab-pane label="My Bag"><MyBag /></el-tab-pane>
        <el-tab-pane label="My Sale"><MySale /></el-tab-pane>
      </el-tabs>
    </el-col>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import market from "../market";
import NFTinfo from "./NFTinfo";
import SaleList from "./SaleList.vue";
import MyBag from "./MyBag.vue";
import MySale from "./MySale.vue";

export default {
  components: {
    NFTinfo,
    SaleList,
    MyBag,
    MySale,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    userList: [],
    nftDialog: false,
    curNFT: {},
  }),
  data() {
    return {
      showInfo: false,
      sall: false,
    };
  },
  methods: {
    connect: async function () {
      await market.connect(this.$store.commit);
      const list = await market.getMyTokenList(this.baddr);
      this.$store.commit("setUserList", list);
      console.log("this user list = ", this.$store.state.userList);
      const slist = await market.getSaleList();
      this.$store.commit("setSaleList", slist);
      console.log("sale", slist);
      // const mSlist = await 
    },
    // 
  },
};
</script>
