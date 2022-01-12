<template>
  <el-col class="user">
    <p>redeem-test</p>
    <p>balance:{{ balance }}</p>
    <el-input placeholder="input amount" v-model="rAmount"></el-input>
    <el-button @click="reAll">All</el-button>
    <el-button @click="redeem">Redeem</el-button>
  </el-col>
</template><script>
import market from "../market";
import { mapState } from "vuex";
export default {
  computed: mapState({
    balance: "balance",
  }),
  data() {
    return {
      rAmount: 0,
    };
  },
  methods: {
    reAll: function () {
      this.rAmount = this.balance;
    },
    redeem: async function () {
      console.log("balance", this.balance);
    },
  },
};
</script>