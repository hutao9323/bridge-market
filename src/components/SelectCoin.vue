<template>
  <el-col>
    <el-select v-model="coinchg">
      <el-option key="PBT" label="PlotBridge Truck" value="PBT"></el-option>
      <el-option key="PBX" label="PlotBridge Xin" value="PBX"></el-option>
    </el-select>
  </el-col>
</template>
<script>
import market from "../market";
import { mapState } from "vuex";
export default {
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    userList: [],
  }),
  data() {
    const curCoin = this.$store.state.coin;
    return {
      coinchg: curCoin,
    };
  },
  watch: {
    coinchg: function (new_coin) {
      this.$store.commit("setCoin", new_coin);
      if (this.baddr) {
        this.connect(new_coin);
      }
    },
  },
  methods: {
    connect: async function (coin) {
      //   const loading = this.loading({
      //     lock: true,
      //     spinner: "el-icon-loading",
      //     background: "rgba(200,230,200,0.6)",
      //   });
      const commit = this.$store.commit;

      const addr = await market.connect(coin, commit);
      console.log("addrrr", addr);
      if (!addr) {
        this.$message("connect faild");
      }
      console.log("coinPBX?", coin);
      //   try {
      const list = await market.getMyTokenList(this.baddr);
      commit("setUserList", list);
      console.log("pbcoin", list);
      const slist = await market.getSaleList();
      commit("setSaleList", slist);
      console.log("pbcoinMarket", slist);

      let mSlist = [];
      const sl = this.$store.state.saleList;
      for (let i = 0; i < sl.length; i++) {
        if (sl[i].seller == true) {
          mSlist.push(sl[i]);
          commit("setMySaleList", mSlist);
        }
      }
      //   } catch (e) {
      //     this.$message(e.message);
      //   }
      //   loading.close();
    },
  },
};
</script>