<template>
  <el-col>
    <el-col v-if="!baddr" class="user">
      <el-button round @click="connect_wallet" class="connect">
        connect wallet
      </el-button>
    </el-col>
    <el-col v-else class="user">
      <el-button
        @click="load_lists"
        class="el-icon-refresh refresh"
        circle
      ></el-button>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"> Market </span>
          <SaleList />
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"> My Bag </span>
          <MyBag />
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"> My Sale </span>
          <MySale />
        </el-tab-pane>
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
    userList: "userList",
    curNFT: "curNFT",
    NFTlists: "NFTlists",
  }),
  watch: {
    NFTlists: function (newLists) {
      this.$store.commit("setNFTlists", newLists);
    },
  },
  data() {
    return {
      showInfo: false,
      sall: false,
      loading: false,
    };
  },
  methods: {
    get_lists: async function () {
      const list = await market.getMyTokenList(this.coin, this.baddr);
      const slist = await market.getSaleList(this.coin);
      let mSlist = [];
      for (let i = 0; i < slist.length; i++) {
        if (slist[i].seller == "-self") {
          mSlist.push(slist[i]);
        }
      }
      const lists = [];
      lists.push(list, slist, mSlist);
      this.$store.commit("setNFTlists", lists);
    },
    load_lists: async function () {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        await this.get_lists();
      } catch (e) {
        this.$message(e.message);
      }
      loading.close();
    },
    connect_wallet: async function () {
      const commit = this.$store.commit;
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        const addr = await market.connect();
        if (addr) {
          commit("setBaddr", addr);
          await this.get_lists();
          console.log("nftlists", this.NFTlists);
        }
      } catch (e) {
        this.$message(e.message);
      }
      loading.close();
    },
  },
};
</script>
