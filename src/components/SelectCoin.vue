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
    coinchg: async function (new_coin) {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
 
      this.$store.commit("setCoin", new_coin);
      if (this.baddr) {
          await this.loadList(new_coin) 
      }
      loading.close();
    },
  },
  methods: {
    connect: async function () {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      const addr = await market.connect();
      if(addr){
          this.$store.commit('setBaddr', addr)
          console.log("coinPBX?", coin);
          await this.loadList(coin)
      }else{
        this.$message("connect faild");
      }
      loading.close();
    },
    loadList: async function (coin){
      try {
        const list = await market.getMyTokenList(coin);
        commit("setUserList", list);
        console.log("pbcoin", list);
        const slist = await market.getSaleList(coin);
        commit("setSaleList", slist);
        console.log("pbcoinMarket", slist);

        let mSlist = [];
        const sl = this.$store.state.saleList;
        for (let i = 0; i < sl.length; i++) {
          if (sl[i].seller == true) {
            mSlist.push(sl[i]);
          }
        }
        this.$store.commit("setMySaleList", mSlist);
      } catch (e) {
        this.$message(e.message);
      }
    }
  },
};
</script>
