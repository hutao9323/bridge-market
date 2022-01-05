<template>
  <el-col>
    <el-select v-model="coinchg" placeholder="Select Coin">
      <el-option key="PBT" label="PBT" value="PBT"></el-option>
      <el-option key="PBX" label="PBX" value="PBX"></el-option>
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
    const curCoin = this.coin;
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
      const loading = this.loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      await market.connect(coin, this.$store.commit);

      try {
        const list = await market.getMyTokenList(this.baddr);
        this.$store.commit("setUserList", list);
        const slist = await market.getSaleList();
        this.$store.commit("setSaleList", slist);
        let mSlist = [];
        const sl = this.$store.state.saleList;
        for (let i = 0; i < sl.length; i++) {
          if (sl[i].seller == true) {
            mSlist.push(sl[i]);
            this.$store.commit("setMySaleList", mSlist);
          }
        }
      } catch (e) {
        this.$message(e.message);
      }
      loading.close();
    },
  },
};
</script>